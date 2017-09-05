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
 * 검색 서비스별 관리 파일
 */
public enum AimlFileType {
    /**
     * Enable enabled type.
     */
    AIML("aiml"),
    /**
     * Disable enabled type.
     */
    SUBSTITUTIONS("subs"),
    /**
     * Properties aiml file type.
     */
    PROPERTIES("prop"),
    /**
     * Predicates aiml file type.
     */
    PREDICATES("pred"),
    /**
     * Bot aiml file type.
     */
    BOT("bot");
    /**
     * The Value.
     */
    private String value;

    /**
     * Instantiates a new Enabled type.
     *
     * @param value the value
     */
    AimlFileType(String value) {
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
