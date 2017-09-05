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

import com.kt.programk.common.domain.core.AimlProp;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository(value = "aimlPropMapper")
public interface AimlPropMapper {
	/**
     * Count all int.
     *
     * @return the int
     */
    public int countAll(AimlProp example);
    
	/**
     * Count name int.
     *
     * @return the int
     */
    public int countByName(AimlProp example);
    
    /**
     * 조회
     *
     * @param example
     * @return
     */
    public AimlProp selectByPrimaryKey(AimlProp example);

    /**
     * 목록 조회
     *
     * @param example
     * @return
     */
    public List<AimlProp> selectList(AimlProp example);

    /**
     * 추가
     *
     * @param example
     * @return
     */
    public int insert(AimlProp example);

    /**
     * 삭제
     *
     * @param example
     * @return
     */
    public int deleteByPrimaryKey(AimlProp example);

    /**
     * 수정
     *
     * @param example
     * @return
     */
    public int updateByPrimaryKeySelective(AimlProp example);

}
