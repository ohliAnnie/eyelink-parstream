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
 * Seo Jong Hwa        2016 . 7 . 7
 */

package org.aitools.programd;

import junit.framework.Assert;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.FileNotFoundException;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:servlet-context.xml"})
public class CoreTest2 {

    @Autowired
    private Core core;

    @Before
    public void setUp() throws FileNotFoundException {
//        String config = "C:\\home\\jboss\\programk\\core.xml";
//        URL baseURL = URLTools.createValidURL(System.getProperty("user.dir"));
//        this.core = new Core(baseURL, URLTools.createValidURL(config));
    }

    @Test
    public void testThat() throws Exception {
        Assert.assertNotNull(core);
        System.out.println(this.core.getResponse("WHAT ABOUT MOVIES", "12345", "AutoBot-01"));
        System.out.println(this.core.getResponse("WHAT ABOUT MOVIES", "333333", "AutoBot-01"));
        System.out.println(this.core.getResponse("YES", "12345", "AutoBot-01"));
        System.out.println(this.core.getResponse("NO", "333333", "AutoBot-01"));
//        core.getPredicateMaster().saveAll();
//        core.shutdown();
    }

    @Test
    public void testStar() throws Exception {
        Assert.assertNotNull(core);
        System.out.println(this.core.getResponse("I like mango", "12345", "SampleBot"));
        System.out.println(this.core.getResponse("A mango is a fruit", "12345", "SampleBot"));
        core.shutdown();
    }
}