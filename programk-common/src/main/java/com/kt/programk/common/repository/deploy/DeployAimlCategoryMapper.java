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

import com.kt.programk.common.domain.deploy.DeployAimlCategory;
import com.kt.programk.common.domain.deploy.DeployNodeHistory;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository(value = "deployAimlCategoryMapper")
public interface DeployAimlCategoryMapper {
    /**
     * 조회
     *
     * @param example
     * @return
     */
    public DeployAimlCategory selectByPrimaryKey(DeployAimlCategory example);

    /**
     * 파일명으로 검색
     * @param example
     * @return
     */
    public DeployAimlCategory selectByFileName(DeployAimlCategory example);

    /**
     * 목록 조회
     *
     * @param example
     * @return
     */
    public List<DeployAimlCategory> selectList(DeployAimlCategory example);

    /**
     * 추가
     *
     * @param example
     * @return
     */
    public int insert(DeployAimlCategory example);

    /**
     * 삭제
     *
     * @param example
     * @return
     */
    public int deleteByPrimaryKey(DeployAimlCategory example);

    /**
     * 수정
     *
     * @param example
     * @return
     */
    public int updateByPrimaryKeySelective(DeployAimlCategory example);

}
