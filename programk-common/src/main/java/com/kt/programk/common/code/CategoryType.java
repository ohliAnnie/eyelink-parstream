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
 * 카테고리 접근 제한
 */
public enum CategoryType {
    /**
     * Enable enabled type.
     */
    ALL("all", "공용"),
    /**
     * Disable enabled type.
     */
    USER("owner", "CP전용");

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
    CategoryType(String value, String label) {
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
