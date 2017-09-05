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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

/**
 * HTML Code Injection 방지 클래스 
 */
public class RequestWrapper extends HttpServletRequestWrapper {

	public RequestWrapper(HttpServletRequest servletRequest) {         
        super(servletRequest);     
    }   
	
	public String[] getParameterValues(String parameter) {       
        String[] values = super.getParameterValues(parameter);       
        if (values==null)  {                   
            return null;            
            }       
        int count = values.length;       
        String[] encodedValues = new String[count];       
        for (int i = 0; i < count; i++) {                  
            encodedValues[i] = cleanXSS(values[i]);        
            }       return encodedValues;     
    }     
    
    public String getParameter(String parameter) {           
        String value = super.getParameter(parameter);           
        if (value == null) {                  
            return null;                   
            }           
        return cleanXSS(value);     
    }   
    public String getHeader(String name) {         
        String value = super.getHeader(name);         
        if (value == null) {            
            return null;     
        }
        return cleanXSS(value);     
    }     
    
    private String cleanXSS(String value) {  
    	String str = value.replaceAll("(?i)alert", "")
    				.replaceAll("(?i)marquee", "")
    				.replaceAll("(?i)onmouseover", "")
    				.replaceAll("onmouseover", "")
    				.replaceAll("mouseover", "")    				
    				.replaceAll("%22", "")    				
    				.replaceAll("iframe", "")
    				.replaceAll("--", "");
    	return str;
    }
}
