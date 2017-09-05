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
 *  Seo Jong Hwa 16. 8. 30 오후 4:12
 */

package com.kt.programk.scheduler.route;

import org.apache.camel.test.spring.CamelSpringTestSupport;
import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * camel-scheduler-route.xml 라우팅 테스트
 */
public class PredicateRouteTest  extends CamelSpringTestSupport {

    /**
     * Create application context abstract application context.
     *
     * @return the abstract application context
     */
    @Override
    protected AbstractApplicationContext createApplicationContext() {
        return new ClassPathXmlApplicationContext("camel-scheduler-route.xml");
    }

    /**
     * Run.
     *
     * @throws InterruptedException the interrupted exception
     */
    @Test
    public void run() throws InterruptedException {
        Thread.sleep(300000);
    }
}