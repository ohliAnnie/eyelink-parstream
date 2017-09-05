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
 * Seo Jong Hwa        2016 . 6 . 22
 */

package com.kt.programk.common.repository.deploy;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.kt.programk.common.domain.deploy.DeployHistory;

@Repository(value = "deployHistoryMapper")
public interface DeployHistoryMapper {
    /**
     * 개수 조회
     */
    public int countAll(DeployHistory example);
    
    /**
     * 조회
     *
     * @param example
     * @return
     */
    public DeployHistory selectByPrimaryKey(DeployHistory example);

    /**
     * 카운트 조회
     * @param example
     * @return
     */
    public Integer countByFileName(DeployHistory example);

    /**
     * 목록 조회
     *
     * @param example
     * @return
     */
    public List<DeployHistory> selectList(DeployHistory example);

    /**
     * 추가
     *
     * @param example
     * @return
     */
    public int insert(DeployHistory example);

    /**
     * 중복되지 행이 없을 때만 입력한다.
     * @param example
     * @return
     */
    public int insertNotExist(DeployHistory example);

    /**
     * 삭제
     *
     * @param example
     * @return
     */
    public int deleteByPrimaryKey(DeployHistory example);

    /**
     * 수정
     *
     * @param example
     * @return
     */
    public int updateByPrimaryKeySelective(DeployHistory example);

}
