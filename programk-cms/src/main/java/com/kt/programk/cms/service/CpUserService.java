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

import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;

import java.util.List;

/**
 * 사용자 관리
 */
public interface CpUserService {
    /**
     * 전체 사용자 수 조회
     *
     * @param cpUser the cp user
     * @return the int
     */
	public int countByCpId(CpUser cpUser) throws BizCheckedException, ApplicationException;

    /**
     * 신규 사용자 등록
     *
     * @param cpUser the cp user
     * @return int int
     * @throws ApplicationException the application exception
     */
    public int create(CpUser cpUser) throws ApplicationException, BizCheckedException;

    /**
     * 사용자 정보 수정
     *
     * @param cpUser the cp user
     * @return int int
     * @throws ApplicationException the application exception
     */
    public int modifyById(CpUser cpUser) throws ApplicationException, BizCheckedException;

    /**
     * 상세 조회
     *
     * @param userId the id
     * @return cp cp
     */
    public CpUser findByUserId(String userId) throws ApplicationException;
    
    /**
     * 상세 조회
     *
     * @param userId the id
     * @return cp cp
     */
    public CpUser findById(CpUser cpUser) throws ApplicationException;

    /**
     * 이름으로 사용자 검색
     * @param name the name

     * @return the cp
     * @throws ApplicationException the application exception
     */
    public CpUser findByName(String name) throws ApplicationException, BizCheckedException;


    /**
     * 전체 사용자 목록 출력
     *
     * @param cpUser             the cp user
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     */
    public List<CpUser> findListAll(CpUser cpUser, int currentPageNo, int recordCountPerPage) throws ApplicationException;

    /**
     * 사용자 정보 삭제
     *
     * @param cpUser the cp user
     * @return the int
     * @throws ApplicationException the application exception
     */
    public int remove(CpUser cpUser) throws ApplicationException, BizCheckedException;
}
