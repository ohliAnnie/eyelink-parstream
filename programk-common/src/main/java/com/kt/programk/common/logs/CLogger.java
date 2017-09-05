/*
 *  Copyright (c) 2016 KT, Inc.
 *  All right reserved.
 *  This software is the confidential and proprietary information of KT
 *  , Inc. You shall not disclose such Confidential Information and
 *  shall use it only in accordance with the terms of the license agreement
 *  you entered into with KT.
 *
 *  Revision History
 *  Author Date Description
 *  ------------------ -------------- ------------------
 *  Seo Jong Hwa 16. 8. 19 오후 4:38
 *
 *
 */

package com.kt.programk.common.logs;

import com.kt.programk.common.utils.JsonUtil;
import com.kt.programk.common.utils.LoggerHelper;
import org.slf4j.LoggerFactory;


public class CLogger {

    // - [ constant fields ] ----------------------------------------
    /**
     * The constant LOGGER.
     */
    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(CLogger.class);

    // - [ interface methods ] ------------------------------------
    // - [ protected methods ] --------------------------------------
    // - [ public methods ] -----------------------------------------
    // - [ private methods ] ----------------------------------------

    /**
     * getlogHeader
     *
     * @return String log message header [classname.membername, line:number]
     */
    private static String getlogHeader(int statcknum) {

        String fullClassName = Thread.currentThread().getStackTrace()[statcknum]
                .getClassName();
        String className = fullClassName.substring(fullClassName
                .lastIndexOf(".") + 1);
        String methodName = Thread.currentThread().getStackTrace()[statcknum]
                .getMethodName();
        int lineNumber = Thread.currentThread().getStackTrace()[statcknum]
                .getLineNumber();

        return ("[" + lineNumber + "L] [" + className + "." + methodName + "] ");
    }

    // - [ static methods ] -----------------------------------------

    /**
     * 메인 타이틀 라벨 로그 mainTitle
     *
     * @return void 결과값 없음
     */
    public static void mainTitle(String message) {
        String header = getlogHeader(3);

        LOGGER.info(header + LoggerHelper.makeMainTitle(message));
    }

    /**
     * 서브 메인 타이틀 라벨 로그 subTitle
     *
     * @return void 결과값 없음
     */
    public static void subTitle(String message) {
        String header = getlogHeader(3);

        LOGGER.info(header + LoggerHelper.makeSubTitle(message));
    }

    /**
     * Info key value.
     *
     * @param key   the key
     * @param value the value
     */
    public static void infoKeyValue(String key, Object value) {
        String header = getlogHeader(3);

        LOGGER.debug(header + LoggerHelper.makeKeyValue(key, value.toString()));
    }

    /**
     * function Log(DEBUG) void. function 호출 여부 만을 로그로 남김 (Start ... End) 동시
     * 발생하는 경우만 사용
     *
     * @param args function 변수들
     * @return void 결과값 없음 LOG 출력 형태 (예) [LogTest.LogFunction, line:42]
     * [input=Input Value, 0] START ==================================
     */
    public static void function(Object... args) {
        if (LOGGER.isDebugEnabled()) {
            String header = getlogHeader(3);
            StringBuffer message = new StringBuffer();

            for (Object arg : args) {
//                message += ((message.isEmpty()) ? " |" : ", ") + arg;
                if(message.length() == 0){
                    message.append("| ");
                }else{
                    message.append(", ");
                }
                message.append(arg);
            }
            LOGGER.info(header + "input="
                    + ((message.length() == 0) ? "none" : message.toString()) + " |"
                    + " called. ==================================");
        }
    }

    /**
     * functionStart Log(DEBUG) void.
     *
     * @param args function 변수들
     * @return void 결과값 없음 LOG 출력 형태 (예) [LogTest.LogFunction, line:42]
     * [input=Input Value, 0] START ==================================
     */
    public static void functionStart(Object... args) {
        if (LOGGER.isDebugEnabled()) {
            String header = getlogHeader(3);
            StringBuffer message = new StringBuffer();

            for (Object arg : args) {
//                message += ((message.isEmpty()) ? " |" : ", ") + arg;
                if(message.length() == 0){
                    message.append("| ");
                }else{
                    message.append(", ");
                }
                message.append(arg);
            }
            LOGGER.info(header + "( input=" + message.toString() + " )"
                    + " START ...");
        }
    }

    /**
     * functionEnd Log(DEBUG) void.
     *
     * @return void 결과값 없음 LOG 출력 형태 (예) [LogTest] main(1111, 2) START
     * =================================="
     */
    public static void functionEnd(Object... args) {
        if (LOGGER.isDebugEnabled()) {
            String header = getlogHeader(3);
            StringBuffer message = new StringBuffer();

            for (Object arg : args) {
                //message += ((message.isEmpty()) ? " |" : ", ") + arg;
                if(message.length() == 0){
                    message.append("| ");
                }else{
                    message.append(", ");
                }
                message.append(arg);
            }
            LOGGER.info(header + "( result=" + message.toString() + " )"
                    + " END ...");
        }
    }

    /**
     * Log debug (DEBUG) void.
     *
     * @param args message 출력 값들
     * @return void 결과값 없음
     */
    public static void debug(Object... args) {
        if (LOGGER.isDebugEnabled()) {
            String header = getlogHeader(3);
            StringBuffer message = new StringBuffer();

            for (Object arg : args) {
                //message += ((message.isEmpty()) ? "| " : ", ") + arg;
                if(message.length() == 0){
                    message.append("| ");
                }else{
                    message.append(", ");
                }
                message.append(arg);
            }
            LOGGER.debug(header + message.toString());
        }
    }

    /**
     * Log debug (DEBUG) void.-debugForJson을 호출한 함수의 이름 얻기 위해 Thread Stack 4 필요
     *
     * @param args message 출력 값들
     * @return void 결과값 없음
     */
    public static void debug0(Object... args) {
        if (LOGGER.isDebugEnabled()) {
            String header = getlogHeader(4);
            StringBuffer message = new StringBuffer();

            for (Object arg : args) {
//                message += ((message.isEmpty()) ? "| " : ", ") + arg;
                if(message.length() == 0){
                    message.append("| ");
                }else{
                    message.append(", ");
                }
                message.append(arg);
            }
            LOGGER.debug(header + message);
        }
    }

    /**
     * * trace를 위한 로거 level debug, 출력은 json 형태로 한다.
     *
     * @param object the object
     */
    public static void debugForJson(Object object) {
        try {
            if (LOGGER.isDebugEnabled()) {
                debug0(JsonUtil.marshallingJsonWithPretty(object) + "\n");
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    /**
     * * trace를 위한 로거 level debug, 출력은 json 형태로 한다.
     *
     * @param msg    header msg
     * @param object the object
     */
    public static void debugForJson(String msg, Object object) {
        try {
            if (LOGGER.isDebugEnabled()) {
                debug0(msg, JsonUtil.marshallingJsonWithPretty(object) + "\n");
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }


    /**
     * Log info (INFO) void.
     *
     * @param args message 출력 값들
     * @return void 결과값 없음
     */
    public static void info(Object... args) {
        if (LOGGER.isInfoEnabled()) {
            String header = getlogHeader(3);
            StringBuffer message = new StringBuffer();

            for (Object arg : args) {
//                message += ((message.isEmpty()) ? "| " : ", ") + arg;
                if(message.length() == 0){
                    message.append("| ");
                }else{
                    message.append(", ");
                }
                message.append(arg);
            }
            LOGGER.info(header + message.toString());
        }
    }

    /**
     * Log info (INFO) void.-infoForJson을 호출한 함수의 이름 얻기 위해 Thread Stack 4 필요
     *
     * @param args message 출력 값들
     * @return void 결과값 없음
     */
    public static void info0(Object... args) {
        if (LOGGER.isInfoEnabled()) {
            String header = getlogHeader(4);
            StringBuffer message = new StringBuffer();

            for (Object arg : args) {
//                message += ((message.isEmpty()) ? "| " : ", ") + arg;
                if(message.length() == 0){
                    message.append("| ");
                }else{
                    message.append(", ");
                }
                message.append(arg);
            }
            LOGGER.info(header + message.toString());
        }
    }

    /**
     * * trace를 위한 로거 level info, 출력은 json 형태로 한다.
     *
     * @param object the object
     */
    public static void infoForJson(Object object) {
        try {
            if (LOGGER.isInfoEnabled()) {
                info0(JsonUtil.marshallingJsonWithPretty(object) + "\n");
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    /**
     * * trace를 위한 로거 level info, 출력은 json 형태로 한다.
     *
     * @param msg    header msg
     * @param object the object
     */
    public static void infoForJson(String msg, Object object) {
        try {
            if (LOGGER.isInfoEnabled()) {
                info0(msg, JsonUtil.marshallingJsonWithPretty(object) + "\n");
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    /**
     * Log warning (WARN) void.
     *
     * @param args message 출력 값들
     * @return void 결과값 없음
     */
    public static void warn(Object... args) {
        if (LOGGER.isWarnEnabled()) {
            String header = getlogHeader(3);
            StringBuffer message = new StringBuffer();

            for (Object arg : args) {
//                message += ((message.isEmpty()) ? "| " : ", ") + arg;
                if(message.length() == 0){
                    message.append("| ");
                }else{
                    message.append(", ");
                }
                message.append(arg);
            }
            LOGGER.warn(header + message.toString());
        }
    }

    /**
     * Log warning (WARN) void.-warnForJson을 호출한 함수의 이름 얻기 위해 Thread Stack 4 필요
     *
     * @param args message 출력 값들
     * @return void 결과값 없음
     */
    public static void warn0(Object... args) {
        if (LOGGER.isWarnEnabled()) {
            String header = getlogHeader(4);
            StringBuffer message = new StringBuffer();

            for (Object arg : args) {
//                message += ((message.isEmpty()) ? "| " : ", ") + arg;
                if(message.length() == 0){
                    message.append("| ");
                }else{
                    message.append(", ");
                }
                message.append(arg);
            }
            LOGGER.warn(header + message.toString());
        }
    }

    /**
     * * trace를 위한 로거 level warn, 출력은 json 형태로 한다.
     *
     * @param object the object
     */
    public static void warnForJson(Object object) {
        try {
            if (LOGGER.isWarnEnabled()) {
                warn0(JsonUtil.marshallingJsonWithPretty(object) + "\n");
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    /**
     * * trace를 위한 로거 level warn, 출력은 json 형태로 한다.
     *
     * @param msg    header msg
     * @param object the object
     */
    public static void warnForJson(String msg, Object object) {
        try {
            if (LOGGER.isWarnEnabled()) {
                warn0(msg, JsonUtil.marshallingJsonWithPretty(object) + "\n");
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    /**
     * Log error (ERROR) void.
     *
     * @param args message 출력 값들
     * @return void 결과값 없음
     */
    public static void error(Object... args) {
        if (LOGGER.isErrorEnabled()) {
            String header = getlogHeader(3);
            StringBuffer message = new StringBuffer();

            for (Object arg : args) {
//                message += ((message.isEmpty()) ? "| " : ", ") + arg;
                if(message.length() == 0){
                    message.append("| ");
                }else{
                    message.append(", ");
                }
                message.append(arg);
            }
            LOGGER.error(header + message);
        }
    }

    /**
     * Log error (ERROR) void.-errorForJson을 호출한 함수의 이름 얻기 위해 Thread Stack 4 필요
     *
     * @param args message 출력 값들
     * @return void 결과값 없음
     */
    public static void error0(Object... args) {
        if (LOGGER.isErrorEnabled()) {
            String header = getlogHeader(4);
            StringBuffer message = new StringBuffer();

            for (Object arg : args) {
//                message += ((message.isEmpty()) ? "| " : ", ") + arg;
                if(message.length() == 0){
                    message.append("| ");
                }else{
                    message.append(", ");
                }
                message.append(arg);
            }
            LOGGER.error(header + message.toString());
        }
    }

    /**
     * * trace를 위한 로거 level error, 출력은 json 형태로 한다.
     *
     * @param object the object
     */
    public static void errorForJson(Object object) {
        try {
            if (LOGGER.isWarnEnabled()) {
                error0(JsonUtil.marshallingJsonWithPretty(object) + "\n");
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    /**
     * * trace를 위한 로거 level error, 출력은 json 형태로 한다.
     *
     * @param msg    header msg
     * @param object the object
     */
    public static void errorForJson(String msg, Object object) {
        try {
            if (LOGGER.isWarnEnabled()) {
                error0(msg, JsonUtil.marshallingJsonWithPretty(object) + "\n");
            }
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    // - [ getter/setter methods ] ----------------------------------
    // - [ main methods ] ------------------------------------------
}
