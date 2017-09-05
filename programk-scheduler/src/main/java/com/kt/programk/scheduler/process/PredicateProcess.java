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
 *  Seo Jong Hwa 16. 8. 30 오후 2:04
 */

package com.kt.programk.scheduler.process;

import com.kt.programk.common.domain.core.AimlPredicate;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.ApplicationRuntimeException;
import com.kt.programk.common.logs.CLogger;
import com.kt.programk.common.repository.stat.ClickStatMapper;
import com.kt.programk.common.utils.ConfigProperties;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.ProducerTemplate;
import org.postgresql.util.PGInterval;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

/**
 * 특정 시간이 지난 aiml_predicate  테이블을 백업한 후 삭제한다.
 */
public class PredicateProcess implements Processor {
    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(PredicateProcess.class);

    /**
     * 환경 변수
     */
    private ConfigProperties config;

    /**
     * 통계용 쿼리
     */
    private ClickStatMapper clickStatMapper;

    /**
     * The Producer template.
     */
    @Autowired
    private ProducerTemplate producerTemplate;


    /**
     * Instantiates a new Predicate process.
     *
     * @param config          the config
     * @param clickStatMapper the click stat mapper
     */
    public PredicateProcess(ConfigProperties config, ClickStatMapper clickStatMapper) {
        this.config = config;
        this.clickStatMapper = clickStatMapper;
    }

    /**
     * Process.
     *
     * @param exchange the exchange
     * @throws SQLException the sql exception
     */
    @Override
    public void process(Exchange exchange) throws SQLException {
        CLogger.functionStart("ChatLogProcess.start");

        //로그 보관 주기
        String interval = config.getString("scheduler.predicate.interval");
        int pagingSize = config.getInteger("scheduler.predicate.paging");

        PGInterval pginterval = new PGInterval(interval + " days");

        int count = 0;
        try {
            count = clickStatMapper.countAimlPredicate(pginterval);
        } catch (DataAccessException ex) {
            CLogger.error("aiml_predicate 삭제 실패", ex);
        }

        CLogger.info("총 데이터 삭제 건수 : " + count);

        int start = 0;
        int end = 0;
        int total = 0;
        if (count > 0) {
            int pagingCnt = getPagingCnt(count, pagingSize);
            CLogger.info("총 페이징 개수 : " + pagingCnt);

            for (int i = 0; i < pagingCnt; i++) {
                end = pagingSize;
                if (i == 0) {
                    start = 0;
                } else {
                    start = i * pagingSize;
                }

                total += (start - end);
                try {
                    List<AimlPredicate> aimlPredicates = clickStatMapper.selectListAimlPredicate(pginterval, start, end);
                    producerTemplate.sendBody("direct:writeFile", aimlPredicates);
                }catch (DataAccessException ex){
                    CLogger.error("aiml_predicate 조회 실패", ex);
                    throw new ApplicationRuntimeException("aiml_predicate 조회 실패");
                }
            }

            try {
                int deleted = clickStatMapper.deleteAimlPredicate(pginterval);
                CLogger.info("총 삭제 건수 : " + deleted);
            } catch (DataAccessException ex) {
                CLogger.error("aiml_predicate 삭제 실패", ex);
            }
        }

        CLogger.functionEnd();
    }

    /**
     * Gets paging cnt.
     *
     * @param total    the total
     * @param pageSize the page size
     * @return the paging cnt
     */
    private int getPagingCnt(int total, int pageSize) {
        int loopCnt = total / pageSize;
        int pageCnt;

        if (loopCnt == 0) {
            pageCnt = 1;
        } else {
            if (total % pageSize == 0) {
                pageCnt = loopCnt;
            } else {
                pageCnt = loopCnt + 1;
            }
        }

        return pageCnt;
    }

    /**
     * Sets config.
     *
     * @param config the config
     */
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
