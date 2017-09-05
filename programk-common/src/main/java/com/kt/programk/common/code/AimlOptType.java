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
 * Seo Jong Hwa        2016 . 6 . 21
 */

package com.kt.programk.common.code;

/**
 * 활성화 상태
 */
public enum AimlOptType {
    /**
     * Enable enabled type.
     */
    IMAGE("img"),
    /**
     * Disable enabled type.
     */
    LINK("link");

    /**
     * The Value.
     */
    private String value;

    /**
     * Instantiates a new Enabled type.
     *
     * @param value the value
     */
    AimlOptType(String value) {
        this.value = value;
    }

    /**
     * Gets value.
     *
     * @return the value
     */
    public String getValue() {
        return value;
    }
}
