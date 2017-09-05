/*
 * �뵆�윭�뒪 寃��깋 version 1.0
 * Copyright �뱬 2016 kt corp. All rights reserved.
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
 *  Seo Jong Hwa 16. 8. 26 �삤�썑 2:20
 */

package com.kt.programk.scheduler.process;

import com.kt.programk.common.domain.stat.ChatLog;
import com.kt.programk.common.repository.stat.ChatLogMapper;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.dataformat.bindy.csv.BindyCsvDataFormat;
import org.apache.camel.spi.DataFormat;
import org.apache.camel.test.junit4.CamelTestSupport;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.List;

/**
 * Created by Administrator on 2016-08-26.
 */
public class FileBackupTest extends CamelTestSupport {
    @Autowired
    private ChatLogMapper chatLogMapper;

    @Override
    protected RouteBuilder createRouteBuilder() {
        final DataFormat bindy = new BindyCsvDataFormat(ChatLog.class);

        return new RouteBuilder() {
            public void configure() {
                from("direct:start")
                        .process(new Processor() {
                            @Override
                            public void process(Exchange exchange) throws Exception {
                                int count = chatLogMapper.countAll(null);
                                System.out.println(count);

                                ChatLog chatLog = new ChatLog();
                                List<ChatLog> chatLogs = chatLogMapper.selectList(chatLog);

                                exchange.getIn().setBody(chatLogs);
                                exchange.getIn().setHeader("CamelFileName", "abc.txt");
                            }
                        })
                        .marshal(bindy)
                        .to("file:/data/dir/")
//                        .to("mock:result");
                		;

                from("file:/data/dir/")
                        .marshal()
                        .zipFile()
                        .to("file:/data/zip/");
            }
        };
    }

    @Test
    public void testRoute() throws InterruptedException {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        chatLogMapper = (ChatLogMapper) ctx.getBean("chatLogMapper");

        Assert.assertNotNull(template);
        template.sendBody("direct:start", "");
        Thread.sleep(1000);
    }

}
