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
 * 배포 완료 코드
 */
public enum DeploySchedulerCompletedType {
    /**
     * Enable enabled type.
     */
    COMPLTED("Y","처리완료"),
    /**
     * Disable enabled type.
     */
    NONCOMPLETED("N","처리중"),
    /**
     * 배포가 실패했을 경우
     */
    FAIL("F","처리실패"),
    /**
     * 배포가 실패했을 경우
     */
    CANCEL("C","처리취소");

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
     */
    DeploySchedulerCompletedType(String value, String label) {
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
