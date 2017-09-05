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
public abstract class AbstractBizException extends Exception {
    /**
     * The Code.
     */
    private String code;
    /**
     * The Message.
     */
    private String message;

    /**
     * Instantiates a new Abstract programk exception.
     *
     * @param message the message
     */
    private AbstractBizException(String message) {
        super(message);
        this.message = message;
    }

    /**
     * Instantiates a new Abstract programk exception.
     *
     * @param code    the code
     * @param message the message
     */
    protected AbstractBizException(String code, String message) {
        this(message);
        this.code = code;
    }

    /**
     * Instantiates a new Abstract programk exception.
     *
     * @param message the message
     * @param err     the err
     */
    private AbstractBizException(String message, Throwable err) {
        super(message, err);
        this.message = message;
    }

    /**
     * Instantiates a new Abstract programk exception.
     *
     * @param code    the code
     * @param message the message
     * @param err     the err
     */
    protected AbstractBizException(String code, String message, Throwable err) {
        this(message, err);
        this.code = code;
    }

    /**
     * Instantiates a new Abstract programk exception.
     *
     * @param errCodable the err codable
     * @param args       the args
     */
    protected AbstractBizException(ErrCodable errCodable, String...args) {
        this(errCodable.getErrCode(), errCodable.getMessage(args));
    }

    /**
     * Gets code.
     *
     * @return the code
     */
    public String getCode() {
        return code;
    }

    /**
     * Gets message.
     *
     * @return the message
     */
    public String getMessage() {
        return message;
    }
}
