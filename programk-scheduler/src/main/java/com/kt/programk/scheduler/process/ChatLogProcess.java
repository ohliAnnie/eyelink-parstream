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
 *  Seo Jong Hwa 16. 8. 29 오전 10:57
 */

package com.kt.programk.scheduler.process;

import com.kt.programk.common.logs.CLogger;
import com.kt.programk.common.repository.stat.ClickStatMapper;
import com.kt.programk.common.utils.ConfigProperties;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.postgresql.util.PGInterval;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;

import java.sql.SQLException;

/**
 * 특정 시간이 지난 chat_log 테이블을 삭제한다.
 */
public class ChatLogProcess implements Processor {
    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(ChatLogProcess.class);

    /**
     * 환경 변수
     */
    private ConfigProperties config;

    /**
     * 통계용 쿼리
     */
    private ClickStatMapper clickStatMapper;


    /**
     * Instantiates a new Chat log process.
     *
     * @param config          the config
     * @param clickStatMapper the click stat mapper
     */
    public ChatLogProcess(ConfigProperties config, ClickStatMapper clickStatMapper) {
        this.config = config;
        this.clickStatMapper = clickStatMapper;
    }

    /**
     * Process.
     *
     * @param exchange the exchange
     */
    @Override
    public void process(Exchange exchange) throws SQLException {
        CLogger.functionStart("ChatLogProcess.start");

        //로그 보관 주기
        String interval = config.getString("scheduler.chatlog.interval");

        PGInterval pginterval = new PGInterval(interval + " days");

        int count = 0;
        try {
            count = clickStatMapper.deleteChatLog(pginterval);
        } catch (DataAccessException ex) {
            CLogger.error("chat_log 삭제 실패", ex);
        }

        CLogger.info("총 데이터 삭제 건수 : " + count);
        CLogger.functionEnd();
    }

    public void setConfig(ConfigProperties config) {
        this.config = config;
    }

    /**
     * Sets click stat mapper.
     *
     * @param clickStatMapper the click stat mapper
     */
    public void setClickStatMapper(ClickStatMapper clickStatMapper) {
        this.clickStatMapper = clickStatMapper;
    }
}
