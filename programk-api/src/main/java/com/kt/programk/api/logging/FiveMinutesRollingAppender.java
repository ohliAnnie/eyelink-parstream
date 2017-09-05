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
 * Seo Jong Hwa        2016 . 7 . 18
 */

package com.kt.programk.api.logging;


import ch.qos.logback.core.rolling.RollingFileAppender;

/**
 * 5분 단위로 롤링 파일을 생성한다.
 *
 * @param <E> the type parameter
 */
public class FiveMinutesRollingAppender<E> extends RollingFileAppender<E> {
    /**
     * The constant start.
     */
    private static long start = System.currentTimeMillis(); // minutes
    /**
     * The Roll over time in minutes.
     */
    private final int rollOverTimeInMinutes = 5;

    /**
     * Rollover.
     */
    @Override
    public void rollover()
    {
        long currentTime = System.currentTimeMillis();
        int maxIntervalSinceLastLoggingInMillis = rollOverTimeInMinutes * 60 * 1000;

        if ((currentTime - start) >= maxIntervalSinceLastLoggingInMillis)
        {
            super.rollover();
            start = System.currentTimeMillis();
        }
    }
}
