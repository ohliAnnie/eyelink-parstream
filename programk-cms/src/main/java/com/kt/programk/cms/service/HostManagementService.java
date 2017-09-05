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

import com.kt.programk.common.domain.admin.AllowIp;

import java.util.List;

/**
 * CP 호스트 IP 관리
 */
public interface HostManagementService {

    /**
     * CP ID 기준으로 전체 개수 조회
     *
     * @param cpId the cp id
     * @return the int
     */
    public int countByCpId(int cpId);

    /**
     * CP별 전체 목록 출력
     *
     * @param cpId               the cp id
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     */
    public List<AllowIp> findListByCpId(int cpId, int currentPageNo, int recordCountPerPage);

    /**
     * 신규 호스트 정보 추가
     *
     * @param allowIp the allow ip
     * @return the int
     */
    public int create(AllowIp allowIp);

    /**
     * 호스트 고유 번호로 삭제
     *
     * @param id the id
     * @return the int
     */
    public int remove(int id);

    /**
     * CP 고유번호, Host IP 로 삭제
     *
     * @param cpId   the cp id
     * @param hostIp the host ip
     * @return the int
     */
    public int remove(int cpId, String hostIp);
}
