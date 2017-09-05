/*
 * 플러스 검색 version 1.0
 * Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 *
 *  Revision History
 *  Author Date Description
 *  ------------------ -------------- ------------------
 *  Seo Jong Hwa 16. 8. 25 오후 5:40
 */

package com.kt.programk.api.web;

import org.junit.Test;

/**
 * Created by Administrator on 2016-08-25.
 */
public class ReplaceTest {

    @Test
    public void test(){
        String str = "http://m.search.olleh.com/?c\\u003dMOL000000\\u0026k\\u003d\\u0026quot;";

        str = str.replaceAll("&quot;", "\"");
        str = str.replaceAll("\\u0026quot;", "\"");

        System.out.println(str);
    }
}
