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

import java.util.List;

/**
 * 사용자 CMS 접근 IP 권리
 */
public interface UserAccessMaangementService {
    /**
     * 아이디별 개수
     *
     * @param userId the user id
     * @return the int
     */
    public int countByUserId(String userId);

    /**
     * 아이디별 접근 IP 출력
     *
     * @param userId the user id
     * @return the list
     */
    public List<AccessIp> findByUserId(String userId,int currentPageNo, int recordCountPerPage);

    /**
     * 접근 IP 신규 등록.
     *
     * @param accessIp the access ip
     * @return the int
     */
    public int create(AccessIp accessIp);

    /**
     * 고유번호로 상세 정보 출력
     *
     * @param id the id
     * @return the access ip
     */
    public AccessIp findById(int id);

    /**
     * 수정
     *
     * @param accessIp the access ip
     * @return the int
     */
    public int modifyById(AccessIp accessIp);

    /**
     * 삭제.
     *
     * @param id the id
     * @return the int
     */
    public int remove(int id);
}
