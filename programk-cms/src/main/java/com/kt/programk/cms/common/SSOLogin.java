/*
 *  Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
package com.kt.programk.cms.common;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import JKTFCrypto.JKTFCrypto;
import com.kt.programk.cms.common.SafeDB;

/**
 * 로그인 복호화
 */
public class SSOLogin {
	private final static Logger logger = LoggerFactory.getLogger(SSOLogin.class);
	
	int ErrCode = 0;
	static JKTFCrypto crypto = null;
	Hashtable<String, String> htCookies = null;
	HttpServletRequest request = null;
	HttpServletResponse response = null;
	HttpSession session = null;
	private String msg = "";
	String PSSO_UserID = "";
	String USER_AUTH = "";
	String PSSO_UserName = "";
	/*신규 암호화 파라미터*/
	String PSSO_NEW_UserID = "";
	String PSSO_NEW_UserName = "";
	private boolean useNewPSSO = true;
	
	private static String[] encrypted_keys = {"PSSO_UserID", "PSSO_UserName"};
	
	public SSOLogin(HttpServletRequest request, HttpServletResponse response){
		this.request = request;
		this.response = response;
	}
	
	public void setUserNewPSSO(boolean use){
		useNewPSSO = use;
	}
	
	public static JKTFCrypto getCrypto(){
		if (crypto == null) {
			crypto = new JKTFCrypto();
		}
		
		return crypto;
	}
	
	public String URLDecoded(String str) throws RuntimeException{
		String decodeStr = "";
		try {
			decodeStr =  java.net.URLDecoder.decode(str,"UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return decodeStr;
	}
	
	public String getMsg() {
		if (ErrCode == -1) { // ID 없음
			msg = "아이디가 존재하지 않습니다.";
		} else if (ErrCode == -2) { // Password 틀림
			msg = "비밀번호가 일치하지 않습니다.";
		} else if (ErrCode == -3) { 
			msg = "다시 시도하시기 바랍니다.";
		} else if (ErrCode == -11) { 
			msg = "PSSO담당자에게 문의 하시기 바랍니다.";
		} else if (ErrCode != 0){
			msg = "관리자에게 문의 하시기 바랍니다.";
		}
		
		return msg;
	}
	
	public String getErrCode(){
		String rValue = "";
		try{
			rValue = String.valueOf(ErrCode);
		}catch(Exception e){
			e.printStackTrace();
		}
		return rValue;
	}
	
	public Map<String, Object> getLoginInfo(){
		Map<String, Object> pssoUserInfo = new HashMap<String, Object>();
		if( PSSO_NEW_UserID.length() > 0 )
			pssoUserInfo.put("userId", PSSO_NEW_UserID);
		else
			pssoUserInfo.put("userId", PSSO_UserID);

		if( PSSO_NEW_UserName.length() > 0 )
			pssoUserInfo.put("userName", PSSO_NEW_UserName);
		else 
			pssoUserInfo.put("userName", PSSO_UserName);
		return pssoUserInfo;
	}
	
	public String getParameter(String f_skey) {
		String sValue = request.getParameter(f_skey);
		
		if (sValue == null || sValue.equals("null")) {
			logger.info("[sValue is null : " +sValue + "]");
			sValue = "";
		}
		return sValue.trim();
	}
	
	private boolean isUserString(String str)
	{
		if(!str.matches("[0-9|a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힝]*")) return false;
		else return true;
	}
	
	public boolean setCrypto() {
		htCookies = (Hashtable<String, String>) request.getAttribute("COOKIES");
		Cookie[] cookies = request.getCookies();
		logger.info("[cookies  :" + cookies + "]");
		
		try {
			if (cookies == null) {
				logger.info("[cookies is null :" + cookies + "]");
				return false;
			}
			
			int nSize = cookies.length;
			
			htCookies = new Hashtable<String, String>();
			boolean isPass = false;
			for (int i = 0; i < nSize; i++) {
				if (!URLDecoded(cookies[i].getValue()).trim().equals("")) {
					htCookies.put(URLDecoded(cookies[i].getName()),	URLDecoded(cookies[i].getValue()));
					isPass = true;
				}
			}

			if (!isPass) {
				logger.info("[isPass is false ]");
				return false;
			}
			
			//new sso 암호화
			if(useNewPSSO) {
				try {
					PSSO_NEW_UserID = SafeDB.decrypt(htCookies.get("PSSO_NEW_UserID"));
					PSSO_NEW_UserName = SafeDB.decrypt(htCookies.get("PSSO_NEW_UserName"));
					
					if( isUserString(PSSO_NEW_UserID) && isUserString(PSSO_NEW_UserName) ) {
						htCookies.put("PSSO_NEW_UserID", PSSO_NEW_UserID);
						htCookies.put("PSSO_NEW_UserName", PSSO_NEW_UserName);
						logger.info("[NEW SSO Decrypt ok : "+ PSSO_NEW_UserID + " : " + PSSO_NEW_UserName + "]" );
					}
					else {
						PSSO_NEW_UserID = "";
						PSSO_NEW_UserName = "";
						logger.info("[NEW SSO Decrypt fail]" );
					}
				}
				catch(Exception e) {
					PSSO_NEW_UserID = "";
					PSSO_NEW_UserName = "";
					logger.info("[error :" + e.getMessage() + "]");
				}				
			}
			
			// 기존 sso 암호화
			JKTFCrypto cpt = getCrypto();
			
			if(cpt == null){
				logger.info("[cpt is null ]");
				if(PSSO_NEW_UserID.length() > 0 && PSSO_NEW_UserName.length() > 0) return true;
				return false;
			}
			
			cpt.setKeyId((String) htCookies.get("PSSO_keyid"));
			cpt.DecryptSessionKey((String) htCookies.get("PSSO_enckey"));
			
			String sValue = null;
			
			for(int i=0; i<encrypted_keys.length; i++){
				sValue = (String) htCookies.get(encrypted_keys[i]);
				
				if (sValue != null && !sValue.equals("")) {
					byte[] bt = cpt.DecryptData(sValue);					
					if (bt != null) {
						logger.info("[Decrypt  ok  :" + bt + " / " + new String(bt, "EUC-KR") +"]");
						htCookies.put(encrypted_keys[i], new String(bt, "EUC-KR"));
					}else{
						logger.info("[Decrypt  fail]");
						logger.info(cpt.getErrorCode()+"");
						if(PSSO_NEW_UserID.length() > 0 && PSSO_NEW_UserName.length() > 0) return true;
						return false;
					}
					
				}else{
					logger.info("[htCookies is null]");
					ErrCode = cpt.getErrorCode();
					if(PSSO_NEW_UserID.length() > 0 && PSSO_NEW_UserName.length() > 0) return true;
					return false;
				}
			}
			
			logger.info("[ErrMsg:" + cpt.getErrorCode() + "]");
			htCookies.put("ErrMsg", "" + cpt.getErrorCode());	
			
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("[isSsoCheck error:" + e.getMessage() + "]");
		}
		
		return true;
	}
	
	public boolean isSsoCheck() {
		boolean ssocheck = false;
		try {
			
			String resultCode = getParameter("SSO");
			String sErrorCode = getParameter("ErrCode");
			int ErrorCode = 0;
			
			if(sErrorCode != null && !sErrorCode.isEmpty()){
				ErrorCode = Integer.parseInt(sErrorCode);
			}
			
			logger.info("[isSsoCheck sErrorCode:" + sErrorCode + "]");
			
			if (resultCode.equals("f")) {
				if(ErrorCode != 0)	ErrCode = ErrorCode;
				else				ErrCode = 0;
				ssocheck = false;
			} else {
				ssocheck = true;
			}
			logger.info("[isSsoCheck resultCode:" + resultCode + "]");
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("[isSsoCheck error:" + e.getMessage() + "]");
		}
		return ssocheck;
	}
	
	public void getSsoLogin() {
		// PSSO 쿠키 체크.
		if (!isSsoCheck()) {
			PSSO_UserID =  null;
			PSSO_UserName = null;
			return;
		}
		
		// 쿠키 정보 복호화
		if (!setCrypto()) {
			PSSO_UserID =  null;
			PSSO_UserName = null;
			return;
		}
	    
		if(PSSO_NEW_UserID.length() != 0 && PSSO_NEW_UserName.length() != 0){
			PSSO_UserID = PSSO_NEW_UserID;
			PSSO_UserName = PSSO_NEW_UserName;
			ErrCode = 0;
		}
		else if(htCookies.get("PSSO_UserID") != null || htCookies.get("PSSO_UserName") != null){
			PSSO_UserID = htCookies.get("PSSO_UserID").toString();
			PSSO_UserName = htCookies.get("PSSO_UserName").toString();
			ErrCode = 0;
		}else{
			PSSO_UserID =  null;
			PSSO_UserName = null;
			ErrCode = 0;
			
			logger.info("[PSSO_UserID And PSSO_UserName are null" + PSSO_UserID +", "+ PSSO_UserName + "]");
		}
	}
	
}
