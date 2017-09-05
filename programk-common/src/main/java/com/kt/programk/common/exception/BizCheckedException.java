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
 * Created by redpunk on 2016-06-27.
 */
public class BizCheckedException extends AbstractBizException {
    /**
     * Instantiates a new Programk checked exception.
     *
     * @param code    the code
     * @param message the message
     */
    public BizCheckedException(String code, String message) {
        super(code, message);
    }

    /**
     * Instantiates a new Programk checked exception.
     *
     * @param code    the code
     * @param message the message
     * @param err     the err
     */
    public BizCheckedException(String code, String message, Throwable err) {
        super(code, message, err);
    }

    /**
     * Instantiates a new Programk checked exception.
     *
     * @param errCodable the err codable
     * @param args       the args
     */
    public BizCheckedException(ErrCodable errCodable, String... args) {
        super(errCodable, args);
    }
}
