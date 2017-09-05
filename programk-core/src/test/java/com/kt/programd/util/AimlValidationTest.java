package com.kt.programd.util;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by Administrator on 2016-08-17.
 */
public class AimlValidationTest {
    @Test
    public void isValid() throws Exception {
        String category = "\t\t<category>\n" +
                "\t\t\t<pattern>올레닷컴 진행중 이벤트 더 보기</pattern>\n" +
                "\t\t\t<template>\n" +
                "\t\t\t{{\"image\":{\"url\":\"https://m.olleh.com/images/2015main/logoMain.png\"},\"urls\":[{\"title\":\"진행중이벤트 더보기\",\"url\":\"http://m.search.olleh.com/?c=MOL000000&amp;k=<input index=\"1\"/>\",\"comment\":\"\"}],\"mpatterns\":[{}],\"recommends\":[{}],\"options\":[{\"val\":\"\",\"seq\":1},{\"val\":\"\",\"seq\":2},{\"val\":\"\",\"seq\":3},{\"val\":\"\",\"seq\":4},{\"val\":\"\",\"seq\":5}]}}진행중이벤트 더보기|1000000000\n" +
                "\t\t\t</template>\n" +
                "\t\t</category>";

        AimlValidation validation = new AimlValidation();

        System.out.println(validation.isValid(category));

    }

}