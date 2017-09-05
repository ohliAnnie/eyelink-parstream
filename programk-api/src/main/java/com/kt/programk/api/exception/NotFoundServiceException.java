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
 * 해당 토큰의 서비스를 찾지 못하였습니다.
 */
public class NotFoundServiceException extends RuntimeException {

    /**
     * Instantiates a new Not found service exception.
     *
     * @param msg the msg
     */
    public NotFoundServiceException(String msg) {
        super(msg);
    }
}
