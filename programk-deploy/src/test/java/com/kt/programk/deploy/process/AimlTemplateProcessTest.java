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
 * Seo Jong Hwa        2016 . 6 . 28
 */

package com.kt.programk.deploy.process;

import com.kt.programk.common.code.AimlFileType;
import com.kt.programk.common.domain.deploy.DeployScheduler;
import com.kt.programk.common.repository.category.AimlCategoryMapper;
import com.kt.programk.common.repository.core.*;
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
 * Created by Administrator on 2016-06-28.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context-root.xml"})
public class AimlTemplateProcessTest {
    /**
     * 봇 서비스
     */
    @Autowired
    private BotDeployService botDeployService;

    /**
     * AIML 파일 생성 프로세스
     */
    private AimlTemplateProcess  aimlTemplateProcess;


    /**
     * @throws Exception
     */
    @Before
    public void setUp() throws Exception {
        aimlTemplateProcess = new AimlTemplateProcess();
        ReflectionTestUtils.setField(aimlTemplateProcess, "botDeployService", botDeployService);
    }

    /**
     * @throws Exception
     */
    @Test
    public void execute() throws Exception {
        CamelContext ctx = new DefaultCamelContext();
        Exchange exchange = new DefaultExchange(ctx);

        //AIML 파일 생성 테스트
        DeployScheduler scheduler = new DeployScheduler();
        scheduler.setId(1);
        scheduler.setCpId(60);
        scheduler.setUserId("redpunk");
        scheduler.setSubLabel("AutoBot-02");

        exchange.getIn().setBody(scheduler);
        aimlTemplateProcess.execute(exchange);
    }

}