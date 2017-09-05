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
 * 사용자 아이디가 없을 경우
 */
public class NotFoundUserException extends RuntimeException {

    /**
     * Instantiates a new Not found user exception.
     *
     * @param msg the msg
     */
    public NotFoundUserException(String msg) {
        super(msg);
    }
}
