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
 * Seo Jong Hwa        2016 . 6 . 23
 */

package com.kt.programk.common.repository.core;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.kt.programk.common.domain.core.AimlTest;

/**
 * The interface Aiml test mapper.
 */
@Repository(value = "aimlTestMapper")
public interface AimlTestMapper {
    /**
     * Count all int.
     *
     * @param example the example
     * @return the int
     */
    public int countAll(AimlTest example);

    /**
     * 조회
     *
     * @param example the example
     * @return aiml test
     */
    public AimlTest selectByPrimaryKey(AimlTest example);

    /**
     * 목록 조회
     *
     * @param example the example
     * @return list
     */
    public List<AimlTest> selectList(AimlTest example);

    /**
     * Select list by cp id list.
     *
     * @param cpId the cp id
     * @return the list
     */
    public List<AimlTest> selectListByCpId(int cpId);

    /**
     * 추가
     *
     * @param example the example
     * @return int
     */
    public int insert(AimlTest example);

    /**
     * 삭제
     *
     * @param example the example
     * @return int
     */
    public int deleteByPrimaryKey(AimlTest example);

    /**
     * 수정
     *
     * @param example the example
     * @return int
     */
    public int updateByPrimaryKeySelective(AimlTest example);

}
