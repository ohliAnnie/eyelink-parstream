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

import com.kt.programk.common.domain.category.AimlCategory;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;

import java.util.List;

/**
 * 대화 카테고리 관리
 */
public interface ChatCategoryService {
    /**
     * 전체 개수
     *
     * @return the int
     */
	public int countAll(AimlCategory aimlCategory) throws ApplicationException;	

    /**
     * CP별 전체 개수
     *
     * @param cpId the cp id
     * @return the int
     */
    public int countByCpId(int cpId) throws ApplicationException, BizCheckedException;
    
    /**
     * 카테고리  조회 개수
     *
     * @param name the name
     * @return the aiml category
     */
    public int countByName(AimlCategory aimlCategory) throws ApplicationException, BizCheckedException;

    /**
     * 전체 목록
     *
     * @return the list
     */
    public List<AimlCategory> findListAll(AimlCategory aimlCategory, int currentPageNo, int recordCountPerPage) throws ApplicationException;

    /**
     * CP 별 전체 목록
     *
     * @param cpId the cp id
     * @return the list
     */
    public List<AimlCategory> findListByCpId(int cpId, int currentPageNo, int recordCountPerPage) throws ApplicationException, BizCheckedException;

    /**
     * 상세 조회
     *
     * @param id the id
     * @return the aiml category
     */
    public AimlCategory findById(AimlCategory aimlCategory) throws ApplicationException, BizCheckedException;

    /**
     * 신규 생성
     *
     * @param aimlCategory the aiml category
     * @return the int
     */
    public int create(AimlCategory aimlCategory) throws ApplicationException, BizCheckedException;

    /**
     * 수정
     *
     * @param aimlCategory the aiml category
     * @return the int
     */
    public int modify(AimlCategory aimlCategory) throws ApplicationException, BizCheckedException;

    /**
     * 삭제.
     *
     * @param id the id
     * @return the int
     */
    public int remove(AimlCategory aimlCategory) throws ApplicationException, BizCheckedException;
  
    /**
     * 배포
     *
     * @param aimlCategory the aiml category
     * @return the int
     */
    public void createDeploy(AimlCategory aimlCategory) throws ApplicationException, BizCheckedException;
}
