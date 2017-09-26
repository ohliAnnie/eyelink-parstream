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
 *  Seo Jong Hwa 16. 8. 19 오후 4:46
 *
 *
 */

package com.kt.programk.common.code;

/**
 * Aiml Tag Type
 */
public enum AimlTagType {
    /**
     * aiml tag type.
     */
    TAG1("get", "&#60;get name=&#34;&#34;/&#62;"),
    /**
     * Tag 2 aiml tag type.
     */
    TAG2("random", "&#60;random&#62;&#60;li&#62;&#60;/li&#62;&#60;li&#62;&#60;/li&#62;&#60;/random&#62;"),
    /**
     * The Tag 3.
     */
    TAG3("set", "&#60;set name =&#34;&#34;&#62;&#60;/set&#62;"),
    /**
     * Tag 4 aiml tag type.
     */
    TAG4("srai", "&#60;srai&#62;&#60;/srai&#62;"),
    /**
     * The Tag 5.
     */
    TAG5("star", "&#60;star index=1/&#62;"),
    /**
     * Tag 6 aiml tag type.
     */
    TAG6("think", "&#60;think&#62;&#60;/think&#62;");
    /**
     * The Tag 7.
     */
    // Commented out for Kakao (2017.09.14)
//    TAG7("Input", "&#60;Input index=1/&#62;"),
    /**
     * Tag 8 aiml tag type.
     */
    // Commented out for Kakao (2017.09.14)
//    TAG8("javascript", "&#60;javascript&#62;&#60;![CDATA[  ]]&#62;&#60;/javascript&#62;");

    /**
     * The Value.
     */
    private String value;
    /**
     * The Tag.
     */
    private String tag;

    /**
     * Instantiates a new Enabled type.
     *
     * @param value the value
     * @param tag   the tag
     */
    AimlTagType(String value, String tag) {
        this.value = value;
        this.tag = tag;
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
     * Gets tag.
     *
     * @return the tag
     */
    public String getTag() {
        return tag;
    }
}
