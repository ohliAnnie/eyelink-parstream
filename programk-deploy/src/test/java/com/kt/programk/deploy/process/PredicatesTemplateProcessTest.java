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

package com.kt.programk.deploy.process;

import com.kt.programk.common.code.AimlFileType;
import com.kt.programk.common.domain.deploy.DeployScheduler;
import com.kt.programk.common.service.BotDeployService;
import org.apache.camel.CamelContext;
import org.apache.camel.Exchange;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.impl.DefaultExchange;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.Assert.*;

/**
 * Created by Administrator on 2016-06-30.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context-root.xml"})
public class PredicatesTemplateProcessTest {
    /**
     * 봇 서비스
     */
    @Autowired
    private BotDeployService botDeployService;

    /**
     * The Process.
     */
    private PredicatesTemplateProcess process;

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        process = new PredicatesTemplateProcess();
        ReflectionTestUtils.setField(process, "botDeployService", botDeployService);
    }

    /**
     * Test execute.
     *
     * @throws Exception the exception
     */
    @Test
    public void testExecute() throws Exception {
        CamelContext ctx = new DefaultCamelContext();
        Exchange exchange = new DefaultExchange(ctx);

        //SUBS 파일 생성 테스트
        DeployScheduler scheduler = new DeployScheduler();
        scheduler.setId(1);
        scheduler.setCpId(1);

        exchange.getIn().setBody(scheduler);
        process.execute(exchange);
    }

}