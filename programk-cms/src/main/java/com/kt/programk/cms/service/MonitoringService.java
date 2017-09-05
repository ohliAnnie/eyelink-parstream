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

import com.kt.programk.common.domain.core.Bot;
import com.kt.programk.common.domain.core.BotFile;
import com.kt.programk.common.exception.ApplicationException;

import java.util.List;
import java.util.Map;

/**
 * 모니터링 관리
 */
public interface MonitoringService {
    /**
     * 전체 개수 조회
     *
     * @return the int
     */
    public int countAll();

    /**
     * 전체 bot file 명 조회.
     *
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     */
    public List<Bot> findListAll(Bot bot) throws ApplicationException;

    /**
     * bot file 상태 수정
     *
     * @param botFile the bot file
     * @return the int
     */
    public int modifyById(BotFile botFile);
    
    /**
     * 모니터링 check 
     *
     * @param botFile the bot file
     * @return the int
     */
    public String check(Map<String, Object> map) throws ApplicationException;
}
