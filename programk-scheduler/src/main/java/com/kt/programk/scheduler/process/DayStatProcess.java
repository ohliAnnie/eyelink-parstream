/*
 *  Copyright (c) 2016 KT, Inc.
 *  All right reserved.
 *  This software is the confidential and proprietary information of KT
 *  , Inc. You shall not disclose such Confidential Information and
 *  shall use it only in accordance with the terms of the license agreement
 *  you entered into with KT.
 *
 *  Revision History
 *  Author Date Description
 *  ------------------ -------------- ------------------
 *  Seo Jong Hwa 16. 8. 19 오후 5:04
 *
 *
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
 * 일별 통계
 */
public class DayStatProcess implements Processor {
    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(DayStatProcess.class);

    /**
     * 통계용 매퍼
     */
    private ClickStatMapper clickStatMapper;

    /**
     * 생성자
     *
     * @param clickStatMapper the click stat mapper
     */
    public DayStatProcess(ClickStatMapper clickStatMapper) {
        this.clickStatMapper = clickStatMapper;
    }

    /**
     * Process.
     *
     * @param exchange the exchange
     */
    @Override
    public void process(Exchange exchange) {
        CLogger.functionStart("DayStatProcess Start");
        HashMap<String, Object> map = new HashMap<>();
        map.put("startTime", JodaDateUtil.getMinusDays(1, "yyyy-MM-dd" + " 00:00:00"));
        map.put("endTime", JodaDateUtil.getMinusDays(1, "yyyy-MM-dd" + " 23:59:59"));
        map.put("searchStart", JodaDateUtil.getMinusDays(1, "yyyy-MM-dd") + " 00:00:00");
        map.put("searchEnd", JodaDateUtil.getMinusDays(1, "yyyy-MM-dd") + " 23:59:59");
        CLogger.debugForJson(map);
        try {
            clickStatMapper.insertDayStat(map);
        }catch (DataAccessException ex){
            //throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
            CLogger.error("일별 통계 실패", ex);
        }
        CLogger.function();
    }
}