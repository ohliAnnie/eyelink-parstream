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

package com.kt.programk.common.exception;

/**
 * 데이터베이스 오류
 */
public class DatabaseRuntimeException extends RuntimeException {

    /**
     * Instantiates a new Application exception.
     *
     * @param e the e
     */
    public DatabaseRuntimeException(Exception e) {
        super(e);
    }

    /**
     * Instantiates a new Application exception.
     *
     * @param message the message
     */
    public DatabaseRuntimeException(String message) {
        super(message);
    }

    /**
     * Constructs a new runtime exception with the specified detail message and
     * cause.  <p>Note that the detail message associated with
     * {@code cause} is <i>not</i> automatically incorporated in
     * this runtime exception's detail message.
     *
     * @param message the detail message (which is saved for later retrieval
     *                by the {@link #getMessage()} method).
     * @param cause   the cause (which is saved for later retrieval by the
     *                {@link #getCause()} method).  (A <tt>null</tt> value is
     *                permitted, and indicates that the cause is nonexistent or
     *                unknown.)
     * @since 1.4
     */
    public DatabaseRuntimeException(String message, Throwable cause) {
        super(message, cause);
    }
}
