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
 * Seo Jong Hwa        2016 . 6 . 27
 */

package com.kt.programk.common.exception;

/**
 * The interface Err codable.
 */
public interface ErrCodable {
    /**
     * Gets err code.
     *
     * @return the err code
     */
    String getErrCode();

    /**
     * Gets message.
     *
     * @param args the args
     * @return the message
     */
    String getMessage(String... args);
}
