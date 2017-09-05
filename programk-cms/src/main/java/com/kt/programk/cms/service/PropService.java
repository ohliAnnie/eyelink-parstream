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

import com.kt.programk.common.domain.core.AimlProp;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;

/**
 * Properties 설정
 */
public interface PropService {
	/**
     * 전체 개수
     *
     * @return the int
     */
    public int countAll(AimlProp aimlProp) throws ApplicationException;
    
	/**
     * 이름 개수
     *
     * @return the int
     */
    public int countByName(AimlProp aimlProp) throws ApplicationException;
    
    /**
     * 전체 목록
     *
     * @return the list
     */
    public List<AimlProp> findListAll(AimlProp aimlProp, int currentPageNo, int recordCountPerPage) throws ApplicationException;
    
    /**
     * 상세 조회
     *
     * @param id the id
     * @return the aimlProp
     */
    public AimlProp findByCateId(AimlProp aimlProp) throws ApplicationException, BizCheckedException;
    
    /**
     * 신규 생성
     *
     * @param aimlProp the aimlProp
     * @return the int
     */
    public int create(AimlProp aimlProp) throws ApplicationException, BizCheckedException;

    /**
     * 수정
     *
     * @param aimlProp the aimlProp
     * @return the int
     */
    public int modify(AimlProp aimlProp) throws ApplicationException, BizCheckedException;

    /**
     * 삭제.
     *
     * @param id the id
     * @return the int
     */
    public int remove(AimlProp aimlProp) throws ApplicationException, BizCheckedException;
}
