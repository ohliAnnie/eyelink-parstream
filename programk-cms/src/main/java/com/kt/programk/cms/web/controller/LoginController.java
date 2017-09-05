/*
 *  Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
package com.kt.programk.cms.web.controller;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.kt.programk.cms.common.LoginManager;
import com.kt.programk.cms.service.CpUserService;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.utils.ConfigProperties;

/**
 * 로그인/로그아웃 컨트롤러
 *
 */
@Controller
public class LoginController {
	/**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(LoginController.class);
    
    /** The cpUser service. */
    @Autowired
    private CpUserService cpUserService;
    
    /**
     * The Config.
     */
    @Autowired
    private ConfigProperties config;
    
    /**
	 * 로그인 폼.
	 * @param code
	 * @param ModelMap the map
	 */
    @RequestMapping(value = "/", method = RequestMethod.GET)
	private String loginForm(@RequestParam(value = "code", defaultValue = "0", required = true) String code, ModelMap map, HttpServletRequest request, HttpSession session) {
    	LOG.debug("/loginForm" );
    	
    	// 로그인되어있는 상태인지 확인하여 listMonitoring으로 보내기
    	LoginManager loginManager = LoginManager.getInstance();
    	if ( loginManager.isLogin(session.getId()) ) {
    		return "redirect:/listMonitoring";
    	}
    	
		/** PSSO 연동을 위한 정보를 담은 Map 객체  **/
//		HashMap<String, String> pssoInfo = new HashMap<String, String>();
//		pssoInfo.put("pssoKey", "HKig2Ydq9y"); // PssoClientKey
//		
//    	if( "false".equals(config.getString("cms.login.password")) ) {
//    		pssoInfo.put("pssoLoginURL", "http://dialogcms.kt.com:8080/cms/login"); // KtSSO 로그인 URL
//    		pssoInfo.put("pssoLogoutURL", "http://dialogcms.kt.com:8080/cms/logout"); // KtSSO 로그아웃 URL
//    	}
//    	else {
//    		pssoInfo.put("pssoLoginURL", "https://psso.olleh.com/logon/logon.asp"); // KtSSO 로그인 URL
//    		pssoInfo.put("pssoLogoutURL", "http://psso.olleh.com/logon/logoff.asp"); // KtSSO 로그아웃 URL
//    	}
//		pssoInfo.put("pssoJoinURL", "https://psso.olleh.com/Join_Olleh/Realname.asp"); // KtSSO 회원가입 URL
//		pssoInfo.put("pssoFindLoginInfoURL", "https://psso.olleh.com/idsearch/mem_idpw_search.asp"); // KtSSO 아이디/비번 찾기 URL
//		pssoInfo.put("site", "http://dialogcms.kt.com:8080"); // RETURN_LOGIN_URL
//		pssoInfo.put("returnURL", "http://dialogcms.kt.com:8080/cms/login"); // RETURN_LOGIN_URL
//
//		map.addAttribute("pssoInfo", pssoInfo);
		map.addAttribute("errCode", code);
		
    	return "/login";
	}
    
    /**
	 * 로그인 처리.
	 * @param HttpSession the session
	 * @param HttpServletRequest the request
	 * @param HttpServletResponse the response
     * @throws ApplicationException 
	 */
    @RequestMapping(value = "/login") //, method = RequestMethod.GET
    private String login(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws ApplicationException {
    	LOG.debug("/login" );

    	if( "true".equals(config.getString("cms.login.password")) ) {
    		
    		String userId = request.getParameter("id");
    		String userPwd = request.getParameter("password");
    		request.setAttribute("password", "");
    		
    		if ( userId == null ) {
    			return "redirect:/?code=99";
    		}
    		CpUser cpUser = new CpUser();
    		cpUser.setUserId(userId);
    		CpUser result = cpUserService.findById(cpUser);
    		CpUser userInfo = new CpUser();
    		
    		LOG.debug("userId : {}, userPwd : {}", userId, userPwd);
    		LOG.debug("result : {}", result);
    		
    		if ( result == null ) {
    			return "redirect:/?code=99"; //가입된 회원이 아닌 경우 메인 페이지로 이동	
    		} else if ( !result.getUserPwd().equals(userPwd) ) {
    			return "redirect:/?code=-2";
    		}else {
    			LoginManager loginManager = LoginManager.getInstance();
    			session = request.getSession(true);
    			
    			if(!loginManager.isUsing(result.getUserId())){
    				// 동일한 아이디로 로그인 되어있지 않으면
    				loginManager.setSession(session, result.getUserId());
    			}else{
    				// 동일한 아이디로 이미 로그인 되어 있다면
    				String sessionId = loginManager.getUsingSessionId(result.getUserId());
    				loginManager.removeUserId(sessionId);
    				loginManager.setSession(session, result.getUserId());
    			}
    			
    			//회원의 정보를 session에 저장
    			userInfo.setCpId(result.getCpId());
    			userInfo.setUserId(result.getUserId());
    			userInfo.setName(result.getName());
    			userInfo.setAuth(result.getAuth());
				userInfo.setCpGroup(result.getCpGroup());
    			session.setAttribute("userInfo", userInfo); 					
    			session.setAttribute("menuCode", "B000"); 
    			
    			Date lastLogin = result.getLastLogin();
    			if(lastLogin == null){
    				cpUser.setLastLogin(new Date());
    				
    				try {
    					cpUserService.modifyById(cpUser);
    				} catch (Exception e) {
    					throw new ApplicationException("사용자 마지막 로그시간 업데이트 오류");
    				}				
    			}else{
    				session.setAttribute("lastLogin", lastLogin); 
    			}
    			//세션의 만료 시간 지정(1시간 유지)
    			session.setMaxInactiveInterval(3600); 
    			
    			return "redirect:/listMonitoring";
    		}
    	}else {
    		
        	String userId = "admin";
    		CpUser cpUser = new CpUser();
    		cpUser.setUserId(userId);
    		CpUser result = cpUserService.findById(cpUser);
    		CpUser userInfo = new CpUser();
    		
    		LOG.debug("{}", result);
    		
    		if (result != null) {
    			LoginManager loginManager = LoginManager.getInstance();
    			session = request.getSession(true);
    			
    			if(!loginManager.isUsing(result.getUserId())){
    				// 동일한 아이디로 로그인 되어있지 않으면
    				loginManager.setSession(session, result.getUserId());
    			}else{
    				// 동일한 아이디로 이미 로그인 되어 있다면
    				String sessionId = loginManager.getUsingSessionId(result.getUserId());
    				loginManager.removeUserId(sessionId);
    				loginManager.setSession(session, result.getUserId());
    			}
    			
    			//회원의 정보를 session에 저장
    			userInfo.setCpId(result.getCpId());
    			userInfo.setUserId(result.getUserId());
    			userInfo.setName(result.getName());
    			userInfo.setAuth(result.getAuth());
				userInfo.setCpGroup(result.getCpGroup());
    			session.setAttribute("userInfo", userInfo); 					
    			session.setAttribute("menuCode", "B000"); 
    			
    			Date lastLogin = result.getLastLogin();
    			if(lastLogin == null){
    				cpUser.setLastLogin(new Date());
    				
    				try {
    					cpUserService.modifyById(cpUser);
    				} catch (Exception e) {
    					throw new ApplicationException("사용자 마지막 로그시간 업데이트 오류");
    				}				
    			}else{
    				session.setAttribute("lastLogin", lastLogin); 
    			}
    			//세션의 만료 시간 지정(1시간 유지)
    			session.setMaxInactiveInterval(3600); 
    			
    			return "redirect:/listMonitoring";
    		}else{
    			return "redirect:/?code=99"; //가입된 회원이 아닌 경우 메인 페이지로 이동		
    		}
    	}
    	
    }
//    @RequestMapping(value = "/login") //, method = RequestMethod.GET
//    private String login(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws ApplicationException {
//    	LOG.debug("/login" );
//
//    	if( "false".equals(config.getString("cms.login.password")) ) {
//    		
//        	String userId = request.getParameter("id");
//    		CpUser cpUser = new CpUser();
//    		cpUser.setUserId(userId);
//    		CpUser result = cpUserService.findById(cpUser);
//    		CpUser userInfo = new CpUser();
//    		
//    		LOG.debug("{}", result);
//    		
//    		if (result != null) {
//    			LoginManager loginManager = LoginManager.getInstance();
//    			session = request.getSession(true);
//    			
//    			if(!loginManager.isUsing(result.getUserId())){
//    				// 동일한 아이디로 로그인 되어있지 않으면
//    				loginManager.setSession(session, result.getUserId());
//    			}else{
//    				// 동일한 아이디로 이미 로그인 되어 있다면
//    				String sessionId = loginManager.getUsingSessionId(result.getUserId());
//    				loginManager.removeUserId(sessionId);
//    				loginManager.setSession(session, result.getUserId());
//    			}
//    			
//    			//회원의 정보를 session에 저장
//    			userInfo.setCpId(result.getCpId());
//    			userInfo.setUserId(result.getUserId());
//    			userInfo.setName(result.getName());
//    			userInfo.setAuth(result.getAuth());
//				userInfo.setCpGroup(result.getCpGroup());
//    			session.setAttribute("userInfo", userInfo); 					
//    			session.setAttribute("menuCode", "B000"); 
//    			
//    			Date lastLogin = result.getLastLogin();
//    			if(lastLogin == null){
//    				cpUser.setLastLogin(new Date());
//    				
//    				try {
//    					cpUserService.modifyById(cpUser);
//    				} catch (Exception e) {
//    					throw new ApplicationException("사용자 마지막 로그시간 업데이트 오류");
//    				}				
//    			}else{
//    				session.setAttribute("lastLogin", lastLogin); 
//    			}
//    			
//    			//세션의 만료 시간 지정(1시간 유지)
//    			session.setMaxInactiveInterval(3600); 
//    			
//    			return "redirect:/listMonitoring";
//    		}else{
//    			return "redirect:/?code=99"; //가입된 회원이 아닌 경우 메인 페이지로 이동		
//    		}
//    	}
//    	else {
//    		
//        	/** PSSO 연동 쿠키 복호화  **/		
//    		SSOLogin sso = new SSOLogin(request, response);
//    		sso.getSsoLogin();
//    		/** PSSO 연동 쿠키 복호화  **/		
//    		
//    		if(!"0".equals(sso.getErrCode())){ //비정상일 경우
//    			return "redirect:/?code="+ sso.getErrCode();	
//    		}else{ //정상일 경우
//    			Map<String, Object> ssoInfo = sso.getLoginInfo();			
//    			CpUser result = cpUserService.findByUserId((String) ssoInfo.get("userId"));
//    			CpUser userInfo = new CpUser();
//    			
//    			if (result != null) {
//    				if("N".equals(result.getEnabled())){
//    					return "redirect:/?code=99"; //사용중이 회원인 경우 메인 페이지로 이동	
//    				}
//    				
//    				LoginManager loginManager = LoginManager.getInstance();
//    				session = request.getSession(true);
//    				
//    				if(!loginManager.isUsing(result.getUserId())){
//    					// 동일한 아이디로 로그인 되어있지 않으면
//    					loginManager.setSession(session, result.getUserId());
//    				}else{
//    					// 동일한 아이디로 이미 로그인 되어 있다면
//    					String sessionId = loginManager.getUsingSessionId(result.getUserId());
//    					loginManager.removeUserId(sessionId);
//    					loginManager.setSession(session, result.getUserId());
//    				}
//    				
//    				//회원의 정보를 session에 저장
//    				userInfo.setCpId(result.getCpId());
//    				userInfo.setUserId(result.getUserId());
//    				userInfo.setName(result.getName());
//    				userInfo.setAuth(result.getAuth());
//    				userInfo.setCpGroup(result.getCpGroup());
//    				session.setAttribute("userInfo", userInfo); 					
//    				session.setAttribute("menuCode", "B000"); 
//    				
//    				Date lastLogin = result.getLastLogin();
//    				if(lastLogin == null){
//    					CpUser cpUser = new CpUser();
//    					cpUser.setUserId(result.getUserId());
//    					cpUser.setLastLogin(new Date());
//    					
//    					try {
//    						cpUserService.modifyById(cpUser);
//    					} catch (Exception e) {
//    						LOG.debug("마지막 접속일 업데이트시 오류가 발생하였습니다.");
//    					}				
//    				}else{
//    					session.setAttribute("lastLogin", lastLogin); 
//    				}
//    				
//    				//세션의 만료 시간 지정(1시간 유지)
//    				session.setMaxInactiveInterval(3600); 
//    				
//    				return "redirect:/listMonitoring";
//    			}else{
//    				return "redirect:/?code=99"; //가입된 회원이 아닌 경우 메인 페이지로 이동		
//    			}
//    		}
//    	}
//    }
    
    /**
	 * 로그아웃 처리.
	 * @param HttpSession the session
	 */
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    private String logout(HttpSession session) {
    	LOG.debug("/logout" );
    	
    	LoginManager loginManager = LoginManager.getInstance();
    	loginManager.removeUserId(session.getId());
    	session.setAttribute("userInfo", null);
    	
		return "redirect:/";
    }
//    @RequestMapping(value = "/logout", method = RequestMethod.GET)
//    private String logout(HttpSession session) {
//    	LOG.debug("/logout" );
//    	
//    	session.setAttribute("userInfo", null);
//    	
//		return "redirect:/";
//    }
}
