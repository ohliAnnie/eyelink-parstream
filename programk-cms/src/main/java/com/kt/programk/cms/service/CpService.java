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

import javax.servlet.http.HttpSession;

import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;

/**
 * CP 관리
 */
public interface CpService {
    /**
     * 전체 개수 조회
     *
     * @return the int
     */
    public int countAll(Cp cp) throws ApplicationException;
    
    /**
     * cp명 개수 조회
     *
     * @return the int
     */
    public int countByLabel(Cp cp) throws ApplicationException;

    /**
     * 신규 등록
     *
     * @param cp the cp
     * @return int int
     * @throws ApplicationException the application exception
     */
    public int create(Cp cp) throws ApplicationException, BizCheckedException;

    /**
     * 수정
     *
     * @param cp the cp
     * @return int int
     * @throws ApplicationException the application exception
     */
    public int modifyById(Cp cp) throws ApplicationException, BizCheckedException;
    
    /**
     * 수정
     *
     * @param cp the cp
     * @return int int
     * @throws ApplicationException the application exception
     */
    public int modifyByEnabled(Cp cp) throws ApplicationException, BizCheckedException;

    /**
     * 상세 조회
     *
     * @param id the id
     * @return cp cp
     */
    public Cp findById(int id) throws ApplicationException;

    /**
     * 라벨 이름으로 검색
     *
     * @param label the label
     * @return the cp
     * @throws ApplicationException the application exception
     */
    public Cp findByLabel(String label) throws ApplicationException, BizCheckedException;


    /**
     * 목록 출력
     *
     * @param cp                 the cp
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     */
    public List<Cp> findListAll(Cp cp, int currentPageNo, int recordCountPerPage) throws ApplicationException;

	/**
	 * 전체 목록 출력 
	 * 
     * @return the list
	 */
    public List<Cp> listAll(HttpSession session) throws ApplicationException;
	
    /**
     * 삭제
     *
     * @param cp the cp
     * @return the int
     */
    public int remove(Cp cp) throws ApplicationException, BizCheckedException;
}
