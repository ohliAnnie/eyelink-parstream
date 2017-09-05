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
 * Seo Jong Hwa        2016 . 7 . 14
 */

package com.kt.programk.deploy.model;

/**
 * AIML 파싱 에러가 발생할 경우 에러 카테고리 번호와 메세지를 저장한다.
 */
public class AimlError {
    /**
     * 카테고리
     */
    private String category;

    /**
     * 에러가 발생한 aiml id
     */
    private int mainId;

    /**
     * 오류 메세지
     */
    private String errMsg;

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
     * Gets category.
     *
     * @return the category
     */
    public String getCategory() {
        return category;
    }

    /**
     * Sets category.
     *
     * @param category the category
     */
    public void setCategory(String category) {
        this.category = category;
    }

    /**
     * Gets err msg.
     *
     * @return the err msg
     */
    public String getErrMsg() {
        return errMsg;
    }

    /**
     * Sets err msg.
     *
     * @param errMsg the err msg
     */
    public void setErrMsg(String errMsg) {
        this.errMsg = errMsg;
    }
}
