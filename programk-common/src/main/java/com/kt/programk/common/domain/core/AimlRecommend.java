/*
 *  Copyright (c) 2016 KT, Inc.
 *  All right reserved.
 *  This software is the confidential and proprietary information of KT
 *  , Inc. You shall not disclose such Confidential Information and
 *  shall use it only in accordance with the terms of the license agreement
 *  you entered into with KT.
 *
 *  Revision History
 *  Author Date Description
 *  ------------------ -------------- ------------------
 *  Seo Jong Hwa 16. 8. 22 오후 5:06
 *
 *
 */

package com.kt.programk.common.domain.core;

import com.kt.programk.common.domain.PagingExample;

/**
 * 다음 추천 질문
 */
public class AimlRecommend extends PagingExample{
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
     * 다음 추천 질문
     */
    private String recommendInput;

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
     * Gets recommend input.
     *
     * @return the recommend input
     */
    public String getRecommendInput() {
        return recommendInput;
    }

    /**
     * Sets recommend input.
     *
     * @param recommendInput the recommend input
     */
    public void setRecommendInput(String recommendInput) {
        this.recommendInput = recommendInput;
    }
}
