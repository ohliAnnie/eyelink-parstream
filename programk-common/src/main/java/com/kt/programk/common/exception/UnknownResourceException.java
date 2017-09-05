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
 * 요청 URI에 해당하는 리소스가 없을 때 사용
 */
public class UnknownResourceException extends RuntimeException {

    /**
     * Instantiates a new Unknown resource exception.
     *
     * @param msg the msg
     */
    public UnknownResourceException(String msg) {
        super(msg);
    }
}
