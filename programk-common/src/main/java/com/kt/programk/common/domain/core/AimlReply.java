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
 * Seo Jong Hwa        2016 . 6 . 23
 */

package com.kt.programk.common.domain.core;

import com.kt.programk.common.domain.PagingExample;

/**
 * 2개 이상의 답변을 보낼 때 추가할 질문 내역
 */
public class AimlReply extends PagingExample {
    /**
     * 고유 번호
     */
    private int id;
    /**
     * 대화 카테고리 고유번호
     */
    private int cateId;
    /**
     * 대화 고유 번호
     */
    private int mainId;
    /**
     * 테스트 질문
     */
    private String replyInput;

    /**
     * Gets id.
     *
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * Sets id.
     *
     * @param id the id
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Gets cate id.
     *
     * @return the cate id
     */
    public int getCateId() {
        return cateId;
    }

    /**
     * Sets cate id.
     *
     * @param cateId the cate id
     */
    public void setCateId(int cateId) {
        this.cateId = cateId;
    }

    /**
     * Gets main id.
     *
     * @return the main id
     */
    public int getMainId() {
        return mainId;
    }

    /**
     * Sets main id.
     *
     * @param mainId the main id
     */
    public void setMainId(int mainId) {
        this.mainId = mainId;
    }

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
