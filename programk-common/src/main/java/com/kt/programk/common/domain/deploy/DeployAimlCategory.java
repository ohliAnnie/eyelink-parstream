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
 *  Seo Jong Hwa 16. 8. 22 오후 5:09
 *
 *
 */

package com.kt.programk.common.domain.deploy;

/**
 * 대화 배포 카테고리
 */
public class DeployAimlCategory {
    /**
     * 검색 서비스 고유 번호
     */
    private int cpId;
    /**
     * 대화 카테고리 고유 번호
     */
    private int cateId;

    /**
     * Gets cp id.
     *
     * @return the cp id
     */
    public int getCpId() {
        return cpId;
    }

    /**
     * Sets cp id.
     *
     * @param cpId the cp id
     */
    public void setCpId(int cpId) {
        this.cpId = cpId;
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
}
