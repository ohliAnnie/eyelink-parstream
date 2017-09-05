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
 *  Seo Jong Hwa 16. 8. 23 오후 2:30
 */

package com.kt.programk.scheduler.process;

import com.kt.programk.common.logs.CLogger;
import com.kt.programk.common.repository.stat.ClickStatMapper;
import com.kt.programk.common.utils.JodaDateUtil;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;

import java.util.HashMap;

/**
 * 시간대별 통계
 */
public class TimeStatProcess implements Processor {
    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(TimeStatProcess.class);

    /**
     * 통계용 매퍼
     */
    private ClickStatMapper clickStatMapper;

    /**
     * 생성자
     *
     * @param clickStatMapper the click stat mapper
     */
    public TimeStatProcess(ClickStatMapper clickStatMapper) {
        this.clickStatMapper = clickStatMapper;
    }

    /**
     * Process.
     *
     * @param exchange the exchange
     */
    @Override
    public void process(Exchange exchange){
        CLogger.functionStart("TimeStatProcess Start");
        HashMap<String, Object> map = new HashMap<>();
        map.put("startTime", JodaDateUtil.getMinusHours(1, "yyyy-MM-dd HH") + ":00:00");
        map.put("endTime", JodaDateUtil.getMinusHours(1, "yyyy-MM-dd HH") + ":59:59");
        map.put("searchStart", JodaDateUtil.getMinusHours(1, "yyyy-MM-dd HH") + ":00:00");
        map.put("searchEnd", JodaDateUtil.getMinusHours(1, "yyyy-MM-dd HH") + ":59:59");
        CLogger.debugForJson(map);
        try {
            clickStatMapper.insertTimeStat(map);
        }catch (DataAccessException ex){
            //throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
            CLogger.error("시간대별 통계 실패", ex);
        }
        CLogger.function();
    }
}
