/*
 * Copyright (c) 2016 KT, Inc.
 * All right reserved.
 * This software is the confidential and proprietary information of KT
 * , Inc. You shall not disclose such Confidential Information and
 * shall use it only in accordance with the terms of the license agreement
 * you entered into with KT.
 *
 * Revision History
 * Author              Date                  Description
 * ------------------   --------------       ------------------
 * Seo Jong Hwa        2016 . 6 . 21
 */

package com.kt.programk.common.exception;

import java.io.PrintStream;
import java.io.PrintWriter;
import java.util.Map;
import java.util.TreeMap;

/**
 * Exception 핸들러
 */
public class SystemException extends RuntimeException {

    /**
     * The constant serialVersionUID.
     */
    private static final long serialVersionUID = 0xA3BFD7681L;
    /**
     * The Properties.
     */
    private final Map<String, Object> properties = new TreeMap<String, Object>();
    /**
     * The Error code.
     */
    private ErrorCode errorCode;

    /**
     * Instantiates a new System exception.
     *
     * @param errorCode the error code
     */
    public SystemException(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }

    /**
     * Instantiates a new System exception.
     *
     * @param message   the message
     * @param errorCode the error code
     */
    public SystemException(String message, ErrorCode errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    /**
     * Instantiates a new System exception.
     *
     * @param cause     the cause
     * @param errorCode the error code
     */
    public SystemException(Throwable cause, ErrorCode errorCode) {
        super(Thread.currentThread().getStackTrace()[3].getClassName() + "." + Thread.currentThread().getStackTrace()[3].getMethodName(), cause);
        this.errorCode = errorCode;
    }

    /**
     * Instantiates a new System exception.
     *
     * @param message   the message
     * @param cause     the cause
     * @param errorCode the error code
     */
    public SystemException(String message, Throwable cause, ErrorCode errorCode) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    /**
     * Wrap system exception.
     *
     * @param exception the exception
     * @param errorCode the error code
     * @return the system exception
     */
    public static SystemException wrap(Throwable exception, ErrorCode errorCode) {
        if (exception instanceof SystemException) {
            SystemException se = (SystemException) exception;
            if (errorCode != null && errorCode != se.getErrorCode()) {
                return new SystemException(exception.getMessage(), exception, errorCode);
            }
            return se;
        } else {
            return new SystemException(exception.getMessage(), exception, errorCode);
        }
    }

    /**
     * Wrap system exception.
     *
     * @param exception the exception
     * @return the system exception
     */
    public static SystemException wrap(Throwable exception) {
        return wrap(exception, null);
    }

    public static String printHeader() {
        return Thread.currentThread().getStackTrace()[3].getClassName() + "." + Thread.currentThread().getStackTrace()[3].getMethodName();
    }

    /**
     * Gets error code.
     *
     * @return the error code
     */
    public ErrorCode getErrorCode() {
        return errorCode;
    }

    /**
     * Sets error code.
     *
     * @param errorCode the error code
     * @return the error code
     */
    public SystemException setErrorCode(ErrorCode errorCode) {
        this.errorCode = errorCode;
        return this;
    }

    /**
     * Gets properties.
     *
     * @return the properties
     */
    public Map<String, Object> getProperties() {
        return properties;
    }

    /**
     * Get t.
     *
     * @param <T>  the type parameter
     * @param name the name
     * @return the t
     */
    @SuppressWarnings("unchecked")
    public <T> T get(String name) {
        return (T) properties.get(name);
    }

    /**
     * Set system exception.
     *
     * @param name  the name
     * @param value the value
     * @return the system exception
     */
    public SystemException set(String name, Object value) {
        properties.put(name, value);
        return this;
    }

    public void printStackTrace(PrintStream s) {
        synchronized (s) {
            printStackTrace(new PrintWriter(s));
        }
    }

    public void printStackTrace(PrintWriter s) {
        synchronized (s) {
            s.println(this);
            s.println("\t-------------------------------");
            if (errorCode != null) {
                s.println("\t" + errorCode + ":" + errorCode.getClass().getName());
            }
            for (String key : properties.keySet()) {
                s.println("\t" + key + "=[" + properties.get(key) + "]");
            }
            s.println("\t-------------------------------");
            StackTraceElement[] trace = getStackTrace();
            for (int i = 0; i < trace.length; i++) {
                s.println("\tat " + trace[i]);
            }

            Throwable ourCause = getCause();
            if (ourCause != null) {
                ourCause.printStackTrace(s);
            }
            s.flush();
        }
    }
}
