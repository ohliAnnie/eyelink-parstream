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
 *  Seo Jong Hwa 16. 8. 30 오후 2:06
 */

package com.kt.programk.scheduler.process;

import com.kt.programk.common.repository.stat.ClickStatMapper;
import com.kt.programk.common.utils.ConfigProperties;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;

/**
 * Created by Administrator on 2016-08-30.
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context-root.xml"})
public class PredicateProcessTest {
    /**
     * The Config properties.
     */
    @Autowired
    private ConfigProperties configProperties;

    /**
     * The Click stat mapper.
     */
    @Autowired
    private ClickStatMapper clickStatMapper;

    /**
     * The Chat log process.
     */
    private PredicateProcess predicateProcess;


    @Before
    public void setUp() throws Exception {
        predicateProcess = new PredicateProcess(configProperties, clickStatMapper);
        predicateProcess.setConfig(configProperties);
        predicateProcess.setClickStatMapper(clickStatMapper);
    }

    @Test
    public void process() throws Exception {
        predicateProcess.process(null);
    }

}