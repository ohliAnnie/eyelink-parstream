

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
 * Seo Jong Hwa        2016 . 6 . 21
 */

package com.kt.programk.deploy.process;

import com.kt.programk.common.code.AimlFileType;
import com.kt.programk.common.domain.core.AimlSubs;
import com.kt.programk.common.code.BotFileActiveType;
import com.kt.programk.common.domain.core.BotFile;
import com.kt.programk.common.domain.deploy.DeployScheduler;
import com.kt.programk.common.repository.core.AimlSubsMapper;
import com.kt.programk.common.repository.core.BotFileMapper;
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

import java.util.*;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * The type Xml template process test.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context-root.xml"})
public class SubstitutionsTemplateProcessTest {

    /**
     * 봇 서비스
     */
    @Autowired
    private BotDeployService botDeployService;

    /**
     * The Process.
     */
    private SubstitutionsTemplateProcess process;

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        process = new SubstitutionsTemplateProcess();
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
        scheduler.setCpId(60);
        scheduler.setUserId("redpunk");
        scheduler.setSubLabel("AutoBot-01");


        exchange.getIn().setBody(scheduler);
        process.execute(exchange);
    }


    /**
     * 내림 차순 정렬 테스트
     */
    @Test
    public void testListSort() {
        List<AimlSubs> aimlSubses = new ArrayList<>();

        AimlSubs one = new AimlSubs();
        one.setFind("A");

        AimlSubs two = new AimlSubs();
        two.setFind("AAA");

        AimlSubs three = new AimlSubs();
        three.setFind("AA");

        aimlSubses.add(one);
        aimlSubses.add(two);
        aimlSubses.add(three);

        Collections.sort(aimlSubses, new Comparator<AimlSubs>() {
            public int compare(AimlSubs obj1, AimlSubs obj2) {
                // TODO Auto-generated method stub
                return (obj1.getFind().length() > obj2.getFind().length()) ? -1 : (obj1.getFind().length() > obj2.getFind().length()) ? 1 : 0;
            }

        });

        for (AimlSubs obj : aimlSubses) {
            System.out.println(obj.getFind());
        }
    }


}