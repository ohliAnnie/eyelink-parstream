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
 * Seo Jong Hwa        2016 . 7 . 14
 */

package com.kt.programd.util;

import org.junit.Test;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Administrator on 2016-07-14.
 */
public class AimlParsingUtilTest {
    private AimlValidation aimlParsingUtil = new AimlValidation();

    @Test
    public void checkAimlCategory() throws Exception {
        String input = "\t\t\t<pattern>입력예시</pattern>\n" +
                "\t\t\t<template>\n" +
                "\t\t\t{{\"image\":{},\"urls\":[{\"id\":\"\",\"comment\":\"\"}],\"mpattterns\":[{}],\"recommends\":[{}]}}<html:b>● 입력예시</html:b>\n" +
                "\t\t\t</template>";

        aimlParsingUtil.isValid(input);
    }

    @Test
    public void removeURl() throws MalformedURLException {
        String str = "file:/C:/home/jboss/programk/AutoBot/AutoBot-01-bot.aiml";

        URL url = new URL(str);
        System.out.println(url.getPath());

        System.out.println("result = " + removeUrl(str));
    }

    private String removeUrl(String commentstr)
    {
        // rid of ? and & in urls since replaceAll can't deal with them
        String commentstr1 = commentstr.replaceAll("\\?", "").replaceAll("\\&", "");

        String urlPattern = "((https?|ftp|gopher|telnet|file|Unsure|http):((//)|(\\\\))+[\\w\\d:#@%/;$()~_?\\+-=\\\\\\.&]*)";
        Pattern p = Pattern.compile(urlPattern,Pattern.CASE_INSENSITIVE);
        Matcher m = p.matcher(commentstr);
        int i = 0;
        while (m.find()) {
            commentstr = commentstr1.replaceAll(m.group(i).replaceAll("\\?", "").replaceAll("\\&", ""),"").trim();
            i++;
        }
        return commentstr;
    }
}