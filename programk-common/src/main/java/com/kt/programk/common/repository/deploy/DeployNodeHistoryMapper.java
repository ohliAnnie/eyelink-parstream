/*
 * Copyright (c) 2016 KT, Inc.
 * All right reserved.
 * This software is the confidential and proprietary information of KT
 * , Inc. You shall not disclose such Confidential Information and
 * shall use it only in accordance with the terms of the license agreement
 * you entered into with KT.
 *
 * Revision History
 * Author              Date                  Description
 * ------------------   --------------       ------------------
 * Seo Jong Hwa        2016 . 6 . 21
 */

package com.kt.programk.common.repository.deploy;

import com.kt.programk.common.domain.deploy.DeployNodeHistory;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository(value = "deployNodeHistoryMapper")
public interface DeployNodeHistoryMapper {

    /**
     * 배포 성공 개수 조회
     * @param schedulerId
     * @return
     */
    public int successDeployCount(Integer schedulerId);

    /**
     * 조회
     *
     * @param example
     * @return
     */
    public DeployNodeHistory selectByPrimaryKey(DeployNodeHistory example);

    /**
     * 목록 조회
     *
     * @param example
     * @return
     */
    public List<DeployNodeHistory> selectList(DeployNodeHistory example);

    /**
     * 추가
     *
     * @param example
     * @return
     */
    public int insert(DeployNodeHistory example);

    /**
     * 삭제
     *
     * @param example
     * @return
     */
    public int deleteByPrimaryKey(DeployNodeHistory example);

    /**
     * 수정
     *
     * @param example
     * @return
     */
    public int updateByPrimaryKeySelective(DeployNodeHistory example);

    /**
     * programk-core가 파일 로드 완료한 후에 수정 한다.
     * @param deployNodeHistory
     * @return
     */
    public int updateByFileName(DeployNodeHistory deployNodeHistory);

}
