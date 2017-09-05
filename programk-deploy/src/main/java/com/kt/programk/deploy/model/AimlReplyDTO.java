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

package com.kt.programk.deploy.model;

/**
 * Created by redpunk on 2016-06-27.
 */
public class AimlReplyDTO {

    /**
     * 테스트 질문
     */
    private String replyInput;

    /**
     * Gets reply input.
     *
     * @return the reply input
     */
    public String getReplyInput() {
        return replyInput;
    }

    /**
     * Sets reply input.
     *
     * @param replyInput the reply input
     */
    public void setReplyInput(String replyInput) {
        this.replyInput = replyInput;
    }
}
