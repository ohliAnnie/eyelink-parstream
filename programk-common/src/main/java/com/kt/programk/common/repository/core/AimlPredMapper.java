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

package com.kt.programk.common.repository.core;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.kt.programk.common.domain.core.AimlPred;

@Repository(value = "aimlPredMapper")
public interface AimlPredMapper {
	/**
     * Count all int.
     *
     * @return the int
     */
    public int countAll(AimlPred example);
    
	/**
     * Count name int.
     *
     * @return the int
     */
    public int countByName(AimlPred example);
    
    /**
     * 조회
     *
     * @param example
     * @return
     */
    public AimlPred selectByPrimaryKey(AimlPred example);

    /**
     * 목록 조회
     *
     * @param example
     * @return
     */
    public List<AimlPred> selectList(AimlPred example);

    /**
     * 추가
     *
     * @param example
     * @return
     */
    public int insert(AimlPred example);

    /**
     * 삭제
     *
     * @param example
     * @return
     */
    public int deleteByPrimaryKey(AimlPred example);

    /**
     * 수정
     *
     * @param example
     * @return
     */
    public int updateByPrimaryKeySelective(AimlPred example);

}
