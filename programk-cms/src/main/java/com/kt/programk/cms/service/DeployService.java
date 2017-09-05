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

import com.kt.programk.common.domain.core.Bot;
import com.kt.programk.common.domain.deploy.DeployHistory;
import com.kt.programk.common.domain.deploy.DeployScheduler;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;

/**
 * 배포 관리
 */
public interface DeployService {
    /**
     * 히스토리 목록 - cp별 수
     *
     * @param DeployHistory the deployHistory
     * @return the int
     */
	public int countByHistory(DeployHistory deployHistory) throws ApplicationException;

	
    /**
     * 마지막에 정리가 수행되었는지 확인 ( 1 / 0 )
     *
     * @param DeployScheduler the deployScheduler
     * @return the int
     */
	public int cleanLastBotDeploy(DeployScheduler deployScheduler) throws ApplicationException;
	
	/**
     * 히스토리 목록 - cp별 
     *
     * @param DeployHistory the deployHistory
     * @return the list
     */
    public List<DeployHistory> findListByHistory(DeployHistory deployHistory, int currentPageNo, int recordCountPerPage) throws ApplicationException;
    
    /**
     * 히스토리  상세 조회
     *
     * @param id the id
     * @return cp cp
     */
    public DeployHistory findById(DeployHistory deployHistory) throws ApplicationException;
    
    /**
     * 배포 설정 - bot별 
     *
     * @param Bot the bot
     * @return the list
     */
    public List<Bot> findListByBot(Bot bot) throws ApplicationException;
    
    /**
     * 스케쥴러 등록
     *
     * @param DeployHistory the deployHistory
     * @return the int
     */
    public int create(DeployScheduler deployScheduler) throws ApplicationException, BizCheckedException;
    
    /**
     * 스케쥴러 수정 - 취소
     *
     * @param DeployHistory the deployHistory
     * @return the int
     */
    public int modify(DeployScheduler deployScheduler) throws ApplicationException, BizCheckedException;
    
    /**
     * 배포 상태 수정
     *
     * @param Bot the bot
     * @return the int
     */
    public int modifyByBot(Bot bot) throws ApplicationException, BizCheckedException;
}
