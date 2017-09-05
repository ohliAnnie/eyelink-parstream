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

package com.kt.programk.api.exception;

/**
 * 인증 토큰이 없을 경우
 */
public class NotFoundTokenException extends RuntimeException {

    /**
     * Instantiates a new Not found token exception.
     *
     * @param msg the msg
     */
    public NotFoundTokenException(String msg) {
        super(msg);
    }
}
