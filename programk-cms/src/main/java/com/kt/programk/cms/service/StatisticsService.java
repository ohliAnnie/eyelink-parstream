/*
 *  Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
package com.kt.programk.cms.service;

import java.util.List;

import com.kt.programk.common.domain.stat.ClickStat;
import com.kt.programk.common.exception.ApplicationException;

/**
 * 통계
 */
public interface StatisticsService {
    /**
     * 기간별통계(월별) 목록  조회.
     *
     * @return the list
     */
    public List<ClickStat> findListPeriodMonth(ClickStat clickStat) throws ApplicationException;
    
    /**
     * 기간별통계(일별) 목록  조회.
     *
     * @return the list
     */
    public List<ClickStat> findListPeriodDay(ClickStat clickStat) throws ApplicationException;
    
    /**
     * 시간대별 통계  목록  조회.
     *
     * @return the list
     */
    public List<ClickStat> findListPeriodTime(ClickStat clickStat) throws ApplicationException;
    
    /**
     * 사용자별 통계 개수
     *
     * @return the int
     */
	public int countPeriodUser(ClickStat clickStat) throws ApplicationException;	
	
    /**
     * 사용자별 통계  목록  조회.
     *
     * @return the list
     */
    public List<ClickStat> findListPeriodUser(ClickStat clickStat, int currentPageNo, int recordCountPerPage) throws ApplicationException;
    
    /**
     * 카테고리 통계  목록  조회.
     *
     * @return the list
     */
    public List<ClickStat> findListOrderCategory(ClickStat clickStat) throws ApplicationException;
    
    /**
     * 대화 통계  목록  조회.
     *
     * @return the list
     */
    public List<ClickStat> findListOrderInput(ClickStat clickStat) throws ApplicationException;
    
    /**
     * 질문 통계  목록  조회.
     *
     * @return the list
     */
    public List<ClickStat> findListOrderUserInput(ClickStat clickStat) throws ApplicationException;
}
