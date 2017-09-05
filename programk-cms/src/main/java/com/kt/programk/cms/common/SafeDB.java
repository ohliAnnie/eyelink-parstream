package com.kt.programk.cms.common;

import java.io.UnsupportedEncodingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.initech.safedb.SimpleSafeDB;

/**
 * 신규 암호화 모듈
 */
public class SafeDB {

	private final static Logger logger = LoggerFactory.getLogger(SafeDB.class);
	
	/** SafeDB 정보 */
	public static String userName = "SAFEDB";
	public static String tableName = "SAFEDB.POLICY";
	public static String columnName = "KT_IDENTITY_NO";
	
	   public static String encrypt(String message){
	    	
	    	String str = "";
	    	byte[] plainData;
			try {
				plainData = message.getBytes("EUC-KR");
			} catch (UnsupportedEncodingException e1) {
				plainData = message.getBytes();
			}
	    	
	    	SimpleSafeDB safedb = SimpleSafeDB.getInstance();
	    	
			boolean loginResult = false;
			if(!safedb.login()){
				loginResult = safedb.getSafeDBConfigMgr().isLoginCheck();
			}
	    	
	        try {
	        	logger.info("PlainData : " + new String(plainData));	
				
				byte[] encryptedBytes  = safedb.encrypt(userName, tableName, columnName, plainData);
				
				if(encryptedBytes != null){
					str = new String(encryptedBytes);
					logger.info("Encrypt Data : " + new String(encryptedBytes));
				}
			} catch (Exception e) {
				logger.info("[encrypt error :" + e.getMessage() + "]");
			}
	        
	        return str;
	    }
	   
	    public static String decrypt(String message) {

	    	String str = "";
	    	byte[] plainData = message.getBytes();
	    	
	    	SimpleSafeDB safedb = SimpleSafeDB.getInstance();
	    	
			boolean loginResult = false;
			if(!safedb.login()){
				loginResult = safedb.getSafeDBConfigMgr().isLoginCheck();
			}
	        
	        try {
	        	logger.info("PlainData : " + new String(plainData));		
				
				byte[] decryptedBytes  = safedb.decrypt(userName,tableName, columnName, plainData);
				
				if(decryptedBytes != null){
					str = new String(decryptedBytes, "EUC-KR");
					logger.info("Decrypt Data : " + new String(decryptedBytes, "EUC-KR") );		
				}
			} catch (Exception e) {
				logger.info("[decrypt error :" + e.getMessage() + "]");
			}
	        
	        return str;
	    }
}
