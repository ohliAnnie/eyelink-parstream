/*
 * 플러스 검색 version 1.0
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
 *  Seo Jong Hwa 16. 8. 30 �삤�썑 3:37
 */

package com.kt.programk.scheduler.route;

import com.kt.programk.common.domain.core.AimlPredicate;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.JodaDateUtil;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.dataformat.bindy.csv.BindyCsvDataFormat;
import org.apache.camel.processor.aggregate.zipfile.ZipAggregationStrategy;
import org.apache.camel.spi.DataFormat;

import java.util.List;
import java.util.UUID;

/**
 * 일정 시간이 지난 aiml_predicate 파일을 백업한다.
 */
public class PredicateRoute extends RouteBuilder {
    /**
     * The Config.
     */
    private ConfigProperties config;

    /**
     * Configure.
     */
    @Override
    public void configure() {
        final DataFormat bindy = new BindyCsvDataFormat(AimlPredicate.class);

        from("direct:writeFile")
                .process(new Processor() {
                    @Override
                    public void process(Exchange exchange) {
                        List<AimlPredicate> aimlPredicates = (List<AimlPredicate>) exchange.getIn().getBody();
                        exchange.getIn().setBody(aimlPredicates);

                        //�뙆�씪 �씠由� �꽭�똿
                        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
                        String day = JodaDateUtil.getCurrentDay("yyyyMMddHHmmss");
                        exchange.getIn().setHeader("CamelFileName", day + "_" + uuid + ".csv");
                    }
                })
                .marshal(bindy)
                .to("file:" + config.getString("scheduler.predicate.temp"))
//                .to("mock:result");
        		;

//        from("file:" + config.getString("scheduler.predicate.temp") + "?delete=true&delay=" + config.getString("scheduler.predicate.delay"))
//                .marshal()
//                .zipFile()
//                .to("file:" + config.getString("scheduler.predicate.zip"));
        from("file:" + config.getString("scheduler.predicate.temp") + "?delete=true&delay=" + config.getString("scheduler.predicate.delay"))
                .aggregate(new ZipAggregationStrategy())
                .constant(true)
                .completionFromBatchConsumer()
                .eagerCheckCompletion()
                .process(new Processor() {
                    @Override
                    public void process(Exchange exchange) {
                        String day = JodaDateUtil.getCurrentDay("yyyyMMddHHmmss");
                        exchange.getIn().setHeader("CamelFileName", day + ".zip");
                    }
                })
                .to("file:" + config.getString("scheduler.predicate.zip"));
    }

    public void setConfig(ConfigProperties config) {
        this.config = config;
    }
}
