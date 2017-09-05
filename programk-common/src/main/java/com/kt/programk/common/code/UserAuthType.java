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
 *  Seo Jong Hwa 16. 8. 22 오후 5:02
 *
 *
 */

package com.kt.programk.common.code;

/**
 * CMS 사용자 권한
 */
public enum UserAuthType {
    /**
     * auth type.
     */
    SUPPER("SAA","슈퍼관리자"),
    /**
     * Cp user auth type.
     */
    CP("CPA","CP관리자");

    /**
     * The Value.
     */
    private String value;
    /**
     * The Label.
     */
    private String label;

    /**
     * Instantiates a new Enabled type.
     *
     * @param value the value
     * @param label the label
     */
    UserAuthType(String value, String label) {
        this.value = value;
        this.label = label;
    }

    /**
     * Gets value.
     *
     * @return the value
     */
    public String getValue() {
        return value;
    }

    /**
     * Gets label.
     *
     * @return the label
     */
    public String getLabel() {
        return label;
    }
}
