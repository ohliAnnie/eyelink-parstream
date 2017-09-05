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
 * Seo Jong Hwa        2016 . 6 . 30
 */

package com.kt.programk.cms;

import au.com.bytecode.opencsv.CSVReader;
import com.kt.programk.common.code.CategoryTopicType;
import com.kt.programk.common.code.CategoryType;
import com.kt.programk.common.code.EnabledType;
import com.kt.programk.common.domain.category.AimlCategory;
import com.kt.programk.common.domain.core.*;
import com.kt.programk.common.repository.category.AimlCategoryMapper;
import com.kt.programk.common.repository.core.*;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

/**
 * Substitutions CSV 파일 업로드
 */
//@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration({"classpath:/spring/context-root.xml"})
public class SubstitutionsUploadTest {

    /**
     * Test.
     *
     * @throws IOException the io exception
     */
    @Test
    public void test() throws IOException {
        CSVReader reader = new CSVReader(new FileReader("C:\\download\\csv\\test.csv"));
        List<String[]> myEntries = reader.readAll();

        System.out.println(myEntries.size());

//        int cpId = 58;
//
//        HashMap<AimlMain, String> aimlMains = new HashMap<>();
//
//        int count = 0;
//        for (String arr[] : myEntries) {
//            count++;
//            //헤더
//            if(count == 1) continue;
//            System.out.println("find = " + arr[0] + " ,replace = " + arr[1]);
//        }
    }
}

