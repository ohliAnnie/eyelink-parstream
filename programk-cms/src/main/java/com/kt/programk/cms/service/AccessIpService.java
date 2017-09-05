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

import com.kt.programk.common.domain.admin.AccessIp;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;

import java.util.List;

/**
 * CP 사용자 접근 IP 관리
 */
public interface AccessIpService {
    /**
     * 개수 조회
     *
     * @param accessIp the access ip
     * @return the int
     */
    public int count(AccessIp accessIp);

    /**
     * 등록
     *
     * @param accessIp the access ip
     * @return int int
     * @throws ApplicationException the application exception
     */
    public int create(AccessIp accessIp) throws ApplicationException, BizCheckedException;

    /**
     * 수정
     *
     * @param accessIp the access ip
     * @return int int
     * @throws ApplicationException the application exception
     */
    public int modifyById(AccessIp accessIp) throws ApplicationException, BizCheckedException;

    /**
     * 상세 조회
     *
     * @param id the id
     * @return cp cp
     */
    public AccessIp findById(int id) throws ApplicationException, BizCheckedException;

    /**
     * Find all list.
     *
     * @param accessIp           the access ip
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     */
    public List<AccessIp> findListAll(AccessIp accessIp, int currentPageNo, int recordCountPerPage) throws ApplicationException;

    /**
     * Remove int.
     *
     * @param accessIp the access ip
     * @return the int
     * @throws ApplicationException the application exception
     */
    public int remove(AccessIp accessIp) throws ApplicationException, BizCheckedException;
}
