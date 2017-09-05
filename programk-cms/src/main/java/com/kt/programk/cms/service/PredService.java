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

import com.kt.programk.common.domain.core.AimlPred;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;

/**
 * Predicates 설정
 */
public interface PredService {
	/**
     * 전체 개수
     *
     * @param aimlPred the aimlPred
     * @return the int
     */
    public int countAll(AimlPred aimlPred) throws ApplicationException;
    
	/**
     * 이름 개수
     *
     * @param aimlPred the aimlPred
     * @return the int
     */
    public int countByName(AimlPred aimlPred) throws ApplicationException;
    
    /**
     * 전체 목록
     *
     * @param aimlPred the aimlPred
     * @return the list
     */
    public List<AimlPred> findListAll(AimlPred aimlPred, int currentPageNo, int recordCountPerPage) throws ApplicationException;
    
    /**
     * 상세 조회
     * 
     * @param aimlPred the aimlPred
     * @return aimlPred the aimlPred
     */
    public AimlPred findByCateId(AimlPred aimlPred) throws ApplicationException, BizCheckedException;
    
    /**
     * 신규 생성
     *
     * @param aimlPred the aimlPred
     * @return the int
     */
    public int create(AimlPred aimlPred) throws ApplicationException, BizCheckedException;

    /**
     * 수정
     *
     * @param aimlSubs the aimlSubs
     * @return the int
     */
    public int modify(AimlPred aimlPred) throws ApplicationException, BizCheckedException;

    /**
     * 삭제.
     *
     * @param aimlPred the aimlPred
     * @return the int
     */
    public int remove(AimlPred aimlPred) throws ApplicationException, BizCheckedException;    
}
