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
 * Seo Jong Hwa        2016 . 7 . 15
 */

package com.kt.programk.api.exception;

/**
 * chat 파라메터가 유효 하지 않을 경우
 */
public class NotFoundChatException extends RuntimeException {

    /**
     * Instantiates a new Not found chat exception.
     *
     * @param msg the msg
     */
    public NotFoundChatException(String msg) {
        super(msg);
    }
}
