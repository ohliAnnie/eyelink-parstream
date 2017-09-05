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

import com.kt.programk.common.domain.deploy.DeployPropCategory;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository(value = "deployPropCategoryMapper")
public interface DeployPropCategoryMapper {
    /**
     * 조회
     *
     * @param example
     * @return
     */
    public DeployPropCategory selectByPrimaryKey(DeployPropCategory example);

    /**
     * 목록 조회
     *
     * @param example
     * @return
     */
    public List<DeployPropCategory> selectList(DeployPropCategory example);

    /**
     * 추가
     *
     * @param example
     * @return
     */
    public int insert(DeployPropCategory example);

    /**
     * 삭제
     *
     * @param example
     * @return
     */
    public int deleteByPrimaryKey(DeployPropCategory example);

    /**
     * 수정
     *
     * @param example
     * @return
     */
    public int updateByPrimaryKeySelective(DeployPropCategory example);

}
