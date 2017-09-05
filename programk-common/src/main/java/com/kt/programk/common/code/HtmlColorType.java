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
 *  Seo Jong Hwa 16. 8. 22 오후 5:01
 *
 *
 */

package com.kt.programk.common.code;

/**
 * HTML 칼러 코드
 */
public enum HtmlColorType {
	/**
	 * html color type.
	 */
	COLOR1("Aqua","#00FFFF"),
	/**
	 * Color 2 html color type.
	 */
	COLOR2("Black","#000000"),
	/**
	 * Color 3 html color type.
	 */
	COLOR3("Blue","#0000FF"),
	/**
	 * Color 4 html color type.
	 */
	COLOR4("Fuchsia","#FF00FF"),
	/**
	 * Color 5 html color type.
	 */
	COLOR5("Green","#008000"),
	/**
	 * Color 6 html color type.
	 */
	COLOR6("Gray","#808080"),
	/**
	 * Color 7 html color type.
	 */
	COLOR7("Lime","#00FF00"),
	/**
	 * Color 8 html color type.
	 */
	COLOR8("Maroon","#800000"),
	/**
	 * Color 9 html color type.
	 */
	COLOR9("Navy","#000080"),
	/**
	 * Color 10 html color type.
	 */
	COLOR10("Olive","#808000"),
	/**
	 * Color 11 html color type.
	 */
	COLOR11("Purple","#800080"),
	/**
	 * Color 12 html color type.
	 */
	COLOR12("Red","#FF0000"),
	/**
	 * Color 13 html color type.
	 */
	COLOR13("Silver","#C0C0C0"),
	/**
	 * Color 14 html color type.
	 */
	COLOR14("Teal","#008080"),
	/**
	 * Color 15 html color type.
	 */
	COLOR15("White","#FFFFFF"),
	/**
	 * Color 16 html color type.
	 */
	COLOR16("yellow","#FFFF00");

	/**
	 * The Value.
	 */
	private String value;
	/**
	 * The Color.
	 */
	private String color;

	/**
	 * Instantiates a new Enabled type.
	 *
	 * @param value the value
	 * @param color the color
	 */
	HtmlColorType(String value, String color) {
        this.value = value;
        this.color = color;
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
	 * Gets color.
	 *
	 * @return the color
	 */
	public String getColor() {
        return color;
    }
}
