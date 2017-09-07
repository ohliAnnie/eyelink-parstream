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
 *  Seo Jong Hwa 16. 8. 23 오후 1:59
 *
 *
 */

package com.kt.programk.collector.strategy;

import org.apache.camel.Exchange;
import org.apache.camel.processor.aggregate.AggregationStrategy;

/**
 * 분리된 라인을 취합하는 전략
 */
public class StringAggregationStrategy implements AggregationStrategy {

    /**
     * Aggregate exchange.
     *
     * @param oldExchange the old exchange
     * @param newExchange the new exchange
     * @return the exchange
     */
    public Exchange aggregate(Exchange oldExchange, Exchange newExchange) {
        if (oldExchange == null) {
            return newExchange;
        }

        String oldBody = oldExchange.getIn().getBody(String.class);
        String newBody = newExchange.getIn().getBody(String.class);
        oldExchange.getIn().setBody(oldBody + "\n" + newBody);
        return oldExchange;
    }
}