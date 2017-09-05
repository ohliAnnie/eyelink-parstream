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

import com.kt.programk.common.domain.deploy.DeploySubsCategory;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository(value = "deploySubsCategoryMapper")
public interface DeploySubsCategoryMapper {
    /**
     * 조회
     *
     * @param example
     * @return
     */
    public DeploySubsCategory selectByPrimaryKey(DeploySubsCategory example);

    /**
     * 목록 조회
     *
     * @param example
     * @return
     */
    public List<DeploySubsCategory> selectList(DeploySubsCategory example);

    /**
     * 추가
     *
     * @param example
     * @return
     */
    public int insert(DeploySubsCategory example);

    /**
     * 삭제
     *
     * @param example
     * @return
     */
    public int deleteByPrimaryKey(DeploySubsCategory example);

    /**
     * 수정
     *
     * @param example
     * @return
     */
    public int updateByPrimaryKeySelective(DeploySubsCategory example);

}
