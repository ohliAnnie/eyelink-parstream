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
 *  Seo Jong Hwa 16. 8. 19 오후 5:07
 *
 *
 */

package com.kt.programk.scheduler.process;

import com.kt.programk.common.logs.CLogger;
import com.kt.programk.common.repository.stat.ClickStatMapper;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.joda.time.DateTime;
import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;

import java.util.HashMap;

/**
 * 월별 통계
 */
public class MonthStatProcess implements Processor {
    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(MonthStatProcess.class);

    /**
     * 통계용 매퍼
     */
    private ClickStatMapper clickStatMapper;

    /**
     * 생성자
     *
     * @param clickStatMapper the click stat mapper
     */
    public MonthStatProcess(ClickStatMapper clickStatMapper) {
        this.clickStatMapper = clickStatMapper;
    }

    /**
     * Process.
     *
     * @param exchange the exchange
     */
    @Override
    public void process(Exchange exchange) {
        //전 월의 시작일과 종료일을 구하자
        DateTimeFormatter formatterFecha = DateTimeFormat.forPattern("yyyy-MM-dd");

        DateTime primerDiaDelMes = new DateTime().minusMonths(1).dayOfMonth().withMinimumValue();
        String startDay = new LocalDate(primerDiaDelMes).toString(formatterFecha);

        DateTime ultimoDiaDelMes = new DateTime().minusMonths(1).dayOfMonth().withMaximumValue();
        String endDay = new LocalDate(ultimoDiaDelMes).toString(formatterFecha);

        CLogger.functionStart("MonthStatProcess Start");
        HashMap<String, Object> map = new HashMap<>();
        map.put("startTime", startDay + " 00:00:00");
        map.put("endTime", endDay + " 23:59:59");
        map.put("searchStart", startDay + " 00:00:00");
        map.put("searchEnd", endDay + " 23:59:59");
        CLogger.debugForJson(map);
        try {
            clickStatMapper.insertMonthStat(map);
        } catch (DataAccessException ex) {
//            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
            CLogger.error("월별 통계 실패", ex);
        }
        CLogger.function();
    }
}
