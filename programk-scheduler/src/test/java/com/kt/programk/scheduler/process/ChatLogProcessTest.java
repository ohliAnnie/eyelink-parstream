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
 *  Seo Jong Hwa 16. 8. 29 오전 11:07
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

import java.sql.SQLException;

import static org.junit.Assert.*;

/**
 * Created by Administrator on 2016-08-29.
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context-root.xml"})
public class ChatLogProcessTest {
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
    private ChatLogProcess chatLogProcess;

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        chatLogProcess = new ChatLogProcess(configProperties, clickStatMapper);
        chatLogProcess.setConfig(configProperties);
        chatLogProcess.setClickStatMapper(clickStatMapper);
    }

    /**
     * Test execute.
     */
    @Test
    public void testExecute() throws SQLException {
        chatLogProcess.process(null);
    }
}