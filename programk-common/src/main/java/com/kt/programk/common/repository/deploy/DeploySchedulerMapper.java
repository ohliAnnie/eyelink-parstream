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

import com.kt.programk.common.domain.deploy.DeployScheduler;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository(value = "deploySchedulerMapper")
public interface DeploySchedulerMapper {
    /**
     * 조회
     *
     * @param example
     * @return
     */
    public DeployScheduler selectByPrimaryKey(DeployScheduler example);

    /**
     * 정리 조회
     *
     * @param example
     * @return
     */
    public int cleanLastBotDeploy(DeployScheduler example);
    
    /**
     * 목록 조회
     *
     * @param example
     * @return
     */
    public List<DeployScheduler> selectList(DeployScheduler example);

    /**
     * 추가
     *
     * @param example
     * @return
     */
    public int insert(DeployScheduler example);

    /**
     * 삭제
     *
     * @param example
     * @return
     */
    public int deleteByPrimaryKey(DeployScheduler example);

    /**
     * 수정
     *
     * @param example
     * @return
     */
    public int updateByPrimaryKeySelective(DeployScheduler example);
    
    /**
     * 수정
     *
     * @param example
     * @return
     */
    public int updateBySubLabelSelective(DeployScheduler example);
    
}
