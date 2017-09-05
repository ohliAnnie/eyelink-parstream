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

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.kt.programk.cms.common.CrossScriptingFilter;
import com.kt.programk.cms.common.RequestWrapper;

/**
 * HTML Code Injection 방지 클래스 
 */
public class CrossScriptingFilter implements Filter {
	
    static public Logger debugLog    = LoggerFactory.getLogger(CrossScriptingFilter.class);
    
    FilterConfig filterConfig = null;
    
    public void init(FilterConfig filterConfig) throws ServletException {  
    	this.filterConfig = filterConfig;
    }

	public void destroy() {
		this.filterConfig = null;     
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		chain.doFilter(new RequestWrapper((HttpServletRequest) request), response);     
		debugLog.debug("[CrossScriptingFilter]_debugGlobalPropertyName.getGlobalServerName [" +request.getServerName() + "]");
	}
}
