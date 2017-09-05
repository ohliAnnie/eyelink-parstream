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

/**
 * 어플리케이션 에러
 */
public class ApplicationException extends Exception {

    /**
     * Instantiates a new Application exception.
     *
     * @param e the e
     */
    public ApplicationException(Exception e) {
        super(e);
    }

    /**
     * Instantiates a new Application exception.
     *
     * @param message the message
     */
    public ApplicationException(String message) {
        super(message);
    }

    /**
     * Instantiates a new Application exception.
     *
     * @param message the message
     * @param cause   the cause
     */
    public ApplicationException(String message, Throwable cause) {
        super(message, cause);
    }


}
