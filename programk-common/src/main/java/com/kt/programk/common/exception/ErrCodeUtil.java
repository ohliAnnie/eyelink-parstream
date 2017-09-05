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
public class ErrCodeUtil {
    /**
     * Parse message string.
     *
     * @param message the message
     * @param args    the args
     * @return the string
     */
    public static String parseMessage(String message, String... args) {
        String temp = message;

        if (message == null || message.trim().length() <= 0) {
            return message;
        }

        if (args == null || args.length <= 0){
            return message;
        }

        String[] splitMsgs = message.split("%");

        if (splitMsgs == null || splitMsgs.length <= 1) {
            return message;
        }

        for (int i = 0; i < args.length; i++) {
            String replaceChar = "%" + (i + 1);
            temp = temp.replaceFirst(replaceChar, args[i]);
        }

        return temp;
    }
}
