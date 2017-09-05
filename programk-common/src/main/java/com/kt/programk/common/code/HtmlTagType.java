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
 * HTML 태그 코드
 */
public enum HtmlTagType {
    /**
     * html tag type.
     */
    TAG1("&#60;a&#62;","&#60;html:a&#62;&#60;/a&#62;"),
    /**
     * Tag 2 html tag type.
     */
    TAG2("&#60;b&#62;","&#60;html:b&#62;&#60;/b&#62;"),
    /**
     * Tag 3 html tag type.
     */
    TAG3("&#60;big&#62;","&#60;html:big&#62;&#60;/big&#62;"),
    /**
     * Tag 4 html tag type.
     */
    TAG4("&#60;blockquote&#62;","&#60;html:blockquote&#62;&#60;/blockquote&#62;"),
    /**
     * Tag 5 html tag type.
     */
    TAG5("&#60;br&#62;","&#60;html:br/&#62;"),
    /**
     * Tag 6 html tag type.
     */
    TAG6("&#60;cite&#62;","&#60;html:cite&#62;&#60;/cite&#62;"),
    /**
     * Tag 7 html tag type.
     */
    TAG7("&#60;dfn&#62;","&#60;html:dfn&#62;&#60;/dfn&#62;"),
    /**
     * Tag 8 html tag type.
     */
    TAG8("&#60;div&#62;","&#60;html:div&#62;&#60;/div&#62;"),
    /**
     * Tag 9 html tag type.
     */
    TAG9("&#60;em&#62;","&#60;html:em&#62;&#60;/em&#62;"),
    /**
     * Tag 10 html tag type.
     */
    TAG10("&#60;font&#62;","&#60;html:font&#62;&#60;/font&#62;"),
    /**
     * Tag 11 html tag type.
     */
    TAG11("&#60;i&#62;","&#60;html:i&#62;&#60;/i&#62;"),
    /**
     * Tag 12 html tag type.
     */
    TAG12("&#60;img&#62;","&#60;html:img&#62;&#60;/img&#62;"),
    /**
     * Tag 13 html tag type.
     */
    TAG13("&#60;p&#62;","&#60;html:p&#62;&#60;/p&#62;"),
    /**
     * Tag 14 html tag type.
     */
    TAG14("&#60;small&#62;","&#60;html:small&#62;&#60;/small&#62;"),
    /**
     * Tag 15 html tag type.
     */
    TAG15("&#60;strong&#62;","&#60;html:strong&#62;&#60;/strong&#62;"),
    /**
     * Tag 16 html tag type.
     */
    TAG16("&#60;sub&#62;","&#60;html:sub&#62;&#60;/sub&#62;"),
    /**
     * Tag 17 html tag type.
     */
    TAG17("&#60;sup&#62;","&#60;html:sup&#62;&#60;/sup&#62;"),
    /**
     * Tag 18 html tag type.
     */
    TAG18("&#60;tt&#62;","&#60;html:tt&#62;&#60;/tt&#62;"),
    /**
     * Tag 19 html tag type.
     */
    TAG19("&#60;u&#62;","&#60;html:u&#62;&#60;/u&#62;");

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
    HtmlTagType(String value, String tag) {
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
