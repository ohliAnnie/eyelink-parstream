/*
 *  Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
package com.kt.programk.cms.Interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.kt.programk.cms.common.LoginManager;
import com.kt.programk.common.domain.admin.CpUser;

/**
 * 모든 경로를 interceptor 하여 preHandle 메소드를 통해 사용자의 session을 체크하고,
 * session이 null인 요청에 대해서는 login 페이지로 이동  
 */
public class LoginCheckInterceptor extends HandlerInterceptorAdapter {
	private static final Logger logger = LoggerFactory.getLogger(LoginCheckInterceptor.class);
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
		boolean result = false;
		String retrunPath = request.getContextPath() + "/";
		String rootPath = request.getRequestURI();
		logger.debug("[loginCeckInterceptor] Enter Interceptor, rootPath[" + rootPath + "]");
		
		// 로그인 페이지로 이동하는 uri는 체크하지 않음
		if (rootPath.equals(retrunPath)) {
			return true;
		}
		
		// resource(Jquery, css 등..) 관련 또는 로그인 관련 uri는 체크하지 않음
		if (rootPath.split("/")[2].equals("css") || rootPath.split("/")[2].equals("js")  || rootPath.split("/")[2].equals("images") || rootPath.split("/")[2].equals("login")) {
			return true;
		}
		
		try {
			logger.debug("[loginCeckInterceptor] Enter Interceptor");
			
			HttpSession session = request.getSession(false);
			
			if (session == null) {
				response.sendRedirect(retrunPath);
				return false;
			}else{
				CpUser userInfo = (CpUser) session.getAttribute("userInfo");

				if (userInfo != null && userInfo.getUserId() != null) {
					logger.debug("[loginCeckInterceptor] Session Exist");
					
					// session exist
					LoginManager loginManager = LoginManager.getInstance();
					String sessionId = session.getId();
					
					if(!sessionId.equals(loginManager.getUsingSessionId(userInfo.getUserId()))){
						session.invalidate();
						response.sendRedirect(retrunPath + "?code=999");
						return false;
					}
				}else{
					logger.debug("[loginCeckInterceptor] Session Not Exist");
					response.sendRedirect(retrunPath);
					return false;
				}
			}
			
			result = true;
		} catch (Exception e) {	
			logger.debug(e.getMessage());
			return false;
		}
		
		return result;
	}
}
