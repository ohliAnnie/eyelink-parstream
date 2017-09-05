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

import com.kt.programk.common.domain.category.PredCategory;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;

/**
 * Predicates 카테고리 설정
 */
public interface PredCategoryService {
	/**
     * 전체 개수
     *
     * @return the int
     */
	public int countAll(PredCategory predCategory) throws ApplicationException;
	
	
	/**
     * 카테고리 전체 개수
     *
     * @param cpId the cp id
     * @return the int
     */
    public int countByName(PredCategory predCategory) throws ApplicationException, BizCheckedException;
    
    /**
     * 전체 목록
     *
     * @return the list
     */
    public List<PredCategory> findListAll(PredCategory predCategory, int currentPageNo, int recordCountPerPage) throws ApplicationException;

    /**
     * 상세 조회
     *
     * @param id the id
     * @return the aiml category
     */
    public PredCategory findById(PredCategory predCategory) throws ApplicationException, BizCheckedException;

    /**
     * 신규 생성
     *
     * @param aimlCategory the aiml category
     * @return the int
     */
    public int create(PredCategory predCategory) throws ApplicationException, BizCheckedException;

    /**
     * 수정
     *
     * @param aimlCategory the aiml category
     * @return the int
     */
    public int modify(PredCategory predCategory) throws ApplicationException, BizCheckedException;

    /**
     * 삭제.
     *
     * @param id the id
     * @return the int
     */
    public int remove(PredCategory predCategory) throws ApplicationException, BizCheckedException;
    
    /**
     * 배포
     *
     * @param predCategory the pred category
     * @return the void
     */
    public void createDeploy(PredCategory predCategory) throws ApplicationException, BizCheckedException;
}
