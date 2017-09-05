/*
 *  Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
package com.kt.programk.cms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import com.kt.programk.cms.service.StatisticsService;
import com.kt.programk.common.domain.stat.ClickStat;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.repository.stat.ClickStatMapper;
import com.kt.programk.common.utils.DbExceptionUtil;

/**
 * Created by Administrator on 2016-06-21.
 */
@Service
public class StatisticsServiceImpl implements StatisticsService {
    /**
     * The clickStat mapper.
     */
    @Autowired
    private ClickStatMapper clickStatMapper;
    
    /**
     * 기간별통계(월별) 목록  조회.
     *
     * @return the list
     */
	@Override
	public List<ClickStat> findListPeriodMonth(ClickStat clickStat) throws ApplicationException {
		try {
            return clickStatMapper.selectListByPeriodMonth(clickStat);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}

    /**
     * 기간별통계(일별) 목록  조회.
     *
     * @return the list
     */
	@Override
	public List<ClickStat> findListPeriodDay(ClickStat clickStat) throws ApplicationException {
		try {
            return clickStatMapper.selectListByPeriodDay(clickStat);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}

    /**
     * 시간대별 통계  목록  조회.
     *
     * @return the list
     */
	@Override
	public List<ClickStat> findListPeriodTime(ClickStat clickStat) throws ApplicationException {
		try {
            return clickStatMapper.selectListByPeriodTime(clickStat);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}
	
    /**
     * 사용자별 통계 개수
     *
     * @return the int
     */
    @Override
    public int countPeriodUser(ClickStat clickStat) throws ApplicationException {
        try {
            return clickStatMapper.countByPeriodUser(clickStat);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * 사용자별 통계  목록  조회.
     *
     * @return the list
     */
	@Override
	public List<ClickStat> findListPeriodUser(ClickStat clickStat,
			int currentPageNo, int recordCountPerPage)
			throws ApplicationException {
		clickStat.setRecordCountPerPage(recordCountPerPage);
		clickStat.setFirstRecordIndex((currentPageNo - 1) * recordCountPerPage);
		
		try {
            return clickStatMapper.selectListByPeriodUser(clickStat);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}

    /**
     * 카테고리 통계  목록  조회.
     *
     * @return the list
     */
	@Override
	public List<ClickStat> findListOrderCategory(ClickStat clickStat) throws ApplicationException {
		try {
            return clickStatMapper.selectListByOrderCategory(clickStat);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}

    /**
     * 대화 통계  목록  조회.
     *
     * @return the list
     */
	@Override
	public List<ClickStat> findListOrderInput(ClickStat clickStat) throws ApplicationException {
		try {
            return clickStatMapper.selectListByOrderInput(clickStat);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}

    /**
     * 질문 통계  목록  조회.
     *
     * @return the list
     */
	@Override
	public List<ClickStat> findListOrderUserInput(ClickStat clickStat) throws ApplicationException {
		try {
            return clickStatMapper.selectListByOrderUserInput(clickStat);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}

}
