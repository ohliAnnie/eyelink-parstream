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

import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.codehaus.plexus.util.Base64;
import org.springframework.util.StringUtils;

/**
 * 유틸리티
 */
public class StringUtil {
	public static String setReplaceCsv(String str) {
		String result = "";
//		String val = "";
//		
//		try {
//			result = str;
//		} catch (Exception e) {
//			result = "";
//		}
//		
//		if(result != null && result != ""){
//			result = str.replaceAll("\"", "\"\"");
//		}
//		
//		val = "\"" + result + " \"";
//		
//		return val;
		if (StringUtils.isEmpty(str))
			return "";

		result = "\"" + str.replaceAll("\"", "\"\"").replaceAll("\\\\", "\\\\\\\\") + "\"";

		return result;
	}
	
	public static String setReplaceSubs(String str){
		String result = "";
		
		try {
			result = str;
		} catch (Exception e) {
			result = "";
		}
		
		if(result.length() == 1){		
			result = result.replace("+", "\\+")
            .replace(".","\\.")
            .replace("|","\\|")
            .replace("*", "\\*")
            .replace("?","\\?")
            .replace("^","\\^")
            .replace("$","\\$")	                                
            .replace("/", "\\/");
		}
		
		return result;
	}
	
	public static int getDiffDay(String startDate, String endDate) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date sDate;
		Date eDate;

		try {
			sDate = sdf.parse(startDate);
			eDate = sdf.parse(endDate);
			return (int) ((eDate.getTime() - sDate.getTime()) / 1000 / 60 / 60 / 24);
		} catch (Exception e) {
			return 0;
		}
	}
	
	public static boolean isMatches(String str) {
		if (str.matches(".*[<>\"\']+.*")) {
			return true;
		} else {
			return false;
		}
	}
	
	public static String maskingConvert(String str) {
		StringBuilder theBuilder = new StringBuilder();

		if (str.length() <= 2) {
			theBuilder.append(str);
			theBuilder.append("**");
		} else if (str.length() > 2) {
			theBuilder.append(str.substring(0, str.length() - 2));
			theBuilder.append("**");
		}

		return theBuilder.toString();
	}

	public static String base64Decode(String str) {
		String result = "";

		if (str != null && str != "") {
			try {
				result = new String(Base64.decodeBase64(str.getBytes()), "UTF-8");
				result = URLDecode(result);
			} catch (Exception e) {
				result = "";
			}
		}

		return result;
	}
    
	@SuppressWarnings("deprecation")
	public static String URLDecode(String str) {
		String result = "";

		if (str != null && str != "") {
			try {
				result = URLDecoder.decode(str);
			} catch (Exception e) {
				result = "";
			}
		}

		return result;
	}
}
