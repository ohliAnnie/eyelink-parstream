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

package com.kt.programk.redis.listener;

import com.kt.programk.redis.CamelMain;
import org.apache.camel.ProducerTemplate;
import org.slf4j.LoggerFactory;
import redis.clients.jedis.JedisPubSub;

/**
 * Expire 메세지를 수신하는 리스터
 */
public class KeyExpiredListener extends JedisPubSub {
    /**
     * 로거
     */
    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(CamelMain.class);

    /**
     * 카멜 라우터 호출
     */
    private ProducerTemplate producerTemplate;

    /**
     * 생성자
     *
     * @param producerTemplate
     */
    public KeyExpiredListener(ProducerTemplate producerTemplate) {
        this.producerTemplate = producerTemplate;
    }

    @Override
    public void onPSubscribe(String pattern, int subscribedChannels) {
        LOGGER.info("onPSubscribe " + pattern + " " + subscribedChannels);
    }

    /**
     * Expire 메세지를 수신 받는다.
     *
     * @param pattern
     * @param channel
     * @param message
     */
    @Override
    public void onPMessage(String pattern, String channel, String message) {
        LOGGER.info("onPMessage pattern " + pattern + " " + channel + " " + message);
        //"PREDICATE_AutoBot-01_USERNAME"
        LOGGER.info(message);

        //비동기 호출
        producerTemplate.asyncRequestBody("seda:backup", message);
    }

}