/*
 *  Copyright (c) 2013 UNUS, Inc.
 *  * All right reserved.
 *  * http://www.unus.com
 *  * This software is the confidential and proprietary information of UNUS
 *  * , Inc. You shall not disclose such Confidential Information and
 *  * shall use it only in accordance with the terms of the license agreement
 *  * you entered into with UNUS.
 *  *
 *  * Revision History
 *  * Author              Date                  Description
 *  * ===============    ================       ======================================
 *  *  beyondj2ee         2013.
 *
 */

package com.kt.programk.common.utils;

import com.kt.programk.common.logs.CLogger;
import org.apache.commons.lang.StringUtils;

import java.net.InetAddress;


/**
 * 다양한게 로그를 출력 할수 있도록 지원하는 헬퍼 클래스.
 * User: beyondj2ee
 * Date: 13. 11. 5
 * Time: 오전 10:48
 */
public class LoggerHelper {
    //- [ constant fields ] ----------------------------------------
    private static InetAddress addr;

    // - [ variable fields ] ----------------------------------------
    // - [ interface  methods ] ------------------------------------
    // - [ protected methods ] --------------------------------------
    // - [ public methods ] -----------------------------------------

    /**
     * 메인 타이틀 라벨.
     *
     * @param message the message
     * @return the string
     */
    public static String makeMainTitle(String message) {

        StringBuffer sb = new StringBuffer();
        sb.append("\n#################################################################\n")
                .append("# " + message + " (" + JodaDateUtil.getCurrentTime() + ") \n")
                .append("#################################################################");

        return sb.toString();
    }

    /**
     * Make sub title.
     *
     * @param message the message
     * @return the string
     */
    public static String makeSubTitle(String message) {

        StringBuffer sb = new StringBuffer();
        sb.append("\n-----------------------------------------------------------------\n")
                .append("- " + message + " (" + JodaDateUtil.getCurrentTime() + ") \n")
                .append("-----------------------------------------------------------------");

        return sb.toString();
    }

    /**
     * Key Value 형태로 출력.
     *
     * @param key   the key
     * @param value the value
     * @return the string
     */
    public static String makeKeyValue(String key, String value) {
        StringBuffer sb = new StringBuffer();
        sb.append("\n {\"" + key + "\":\"" + value + "\"}\n");
        return sb.toString();
    }


    /**
     * Json 형태로 출력.
     *
     * @param object the object
     * @return the string
     */
    public static String makeMap(Object object) {
        StringBuffer sb = new StringBuffer();
        sb.append("\n " + JsonUtil.marshallingJsonWithPretty(object) + "\n");
        return sb.toString();
    }

    /**
     * Make process title.
     *
     * @param message the message
     * @param begin   the begin
     * @return the string
     */
    public static String makeProcessTitle(String message, boolean begin) {

        StringBuffer sb = new StringBuffer();

        if (begin) {
            sb.append("\n# [begin] " + message + "###############");
        } else {
            sb.append("\n# [end] " + message + "###############");
        }
        return sb.toString();
    }

    /**
     * Gets the local information.
     *
     * @return the local information
     */
    public static String getLocalInformation() {

        StringBuffer message = new StringBuffer();
        String pseq = StringUtils.defaultIfEmpty(System.getProperty("pseq"), "1");

        try {
            if (addr == null) {
                addr = InetAddress.getLocalHost();
            }
        } catch (Exception e) {
            CLogger.error(e.getMessage(), e.getCause());
        }
        message.append("[");
        message.append(addr.getHostAddress());
        message.append("]-");
        message.append("[");
        message.append(pseq);
        message.append("] ");

        return message.toString();
    }
    // - [ private methods ] ----------------------------------------
    // - [ static methods ] -----------------------------------------
    // - [ getter/setter methods ] ----------------------------------
    // - [ main methods ] -------------------------------------------
}
