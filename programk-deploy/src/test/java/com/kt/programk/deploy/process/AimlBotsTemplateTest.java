/*
 * Copyright (c) 2016 KT, Inc.
 * All right reserved.
 * This software is the confidential and proprietary information of KT
 * , Inc. You shall not disclose such Confidential Information and
 * shall use it only in accordance with the terms of the license agreement
 * you entered into with KT.
 *
 * Revision History
 * Author Date Description
 *  ------------------ -------------- ------------------
 * Seo Jong Hwa 16. 8. 30 오전 1:16
 */

package com.kt.programk.deploy.process;

import com.kt.programk.common.service.BotDeployService;
import com.kt.programk.common.utils.ConfigProperties;
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

/**
 * Created by redpunk on 2016-08-30.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context-root.xml"})
public class AimlBotsTemplateTest {
    /**
     * 봇 서비스
     */
    @Autowired
    private BotDeployService botDeployService;

    @Autowired
    private ConfigProperties configProperties;

    private AimlBotsTemplateProcess aimlTemplateProcess;


    @Before
    public void setUp() throws Exception {
        aimlTemplateProcess = new AimlBotsTemplateProcess();
        ReflectionTestUtils.setField(aimlTemplateProcess, "botDeployService", botDeployService);
        ReflectionTestUtils.setField(aimlTemplateProcess, "config", configProperties);
    }

    @Test
    public void execute() throws Exception {
        CamelContext ctx = new DefaultCamelContext();
        Exchange exchange = new DefaultExchange(ctx);

        aimlTemplateProcess.execute(exchange);
    }

}