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
 * 테스트 질문
 */
public class AimlTest extends PagingExample {
    /**
     * The constant MAX_LENGTH_INPUT.
     */
    public final static int MAX_LENGTH_INPUT = 255;

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
    private String testInput;
    /**
     * 질문
     */
    private String input;

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
     * Gets test input.
     *
     * @return the test input
     */
    public String getTestInput() {
        return testInput;
    }

    /**
     * Sets test input.
     *
     * @param testInput the test input
     */
    public void setTestInput(String testInput) {
        this.testInput = testInput;
    }

    /**
     * Gets input.
     *
     * @return the input
     */
    public String getInput() {
        return input;
    }

    /**
     * Sets input.
     *
     * @param input the input
     */
    public void setInput(String input) {
        this.input = input;
    }
}
