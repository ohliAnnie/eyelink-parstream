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

import com.kt.programk.common.domain.core.AimlSubs;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;

/**
 * 전처리 설정
 */
public interface SubsService {
    /**
     * 전체 개수
     *
     * @return the int
     */
    public int countAll(AimlSubs aimlSubs) throws ApplicationException;
    
    /**
     * 대상키워드 개수
     *
     * @return the int
     */
    public int countByFind(AimlSubs aimlSubs) throws ApplicationException;
    
    /**
     * 전체 목록
     *
     * @return the list
     */
    public List<AimlSubs> findListAll(AimlSubs aimlSubs, int currentPageNo, int recordCountPerPage) throws ApplicationException;
    
    /**
     * 상세 조회
     *
     * @param id the id
     * @return the aimlSubs category
     */
    public AimlSubs findByCateId(AimlSubs aimlSubs) throws ApplicationException, BizCheckedException;
    
    /**
     * 신규 생성
     *
     * @param aimlSubs the aimlSubs
     * @return the int
     */
    public int create(AimlSubs aimlSubs) throws ApplicationException, BizCheckedException;

    /**
     * 수정
     *
     * @param aimlSubs the aimlSubs
     * @return the int
     */
    public int modify(AimlSubs aimlSubs) throws ApplicationException, BizCheckedException;

    /**
     * 삭제.
     *
     * @param id the id
     * @return the int
     */
    public int remove(AimlSubs aimlSubs) throws ApplicationException, BizCheckedException;
    
    /**
     * 전체 삭제.
     *
     * @param id the id
     * @return the int
     */
    public int removeAll(AimlSubs aimlSubs) throws ApplicationException, BizCheckedException;

}
