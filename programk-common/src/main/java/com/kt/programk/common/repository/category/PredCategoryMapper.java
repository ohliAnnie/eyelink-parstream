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

package com.kt.programk.common.repository.category;

import com.kt.programk.common.domain.category.PredCategory;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository(value = "predCategoryMapper")
public interface PredCategoryMapper {
	/**
     * Count all int.
     *
     * @return the int
     */
    public int countAll(PredCategory example);
    
    /**
     * Count by name int.
     *
     * @param example the example
     * @return the int
     */
	public int countByName(PredCategory example);
    
    /**
     * 조회
     *
     * @param example
     * @return
     */
    public PredCategory selectByPrimaryKey(PredCategory example);

    /**
     * 목록 조회
     *
     * @param example
     * @return
     */
    public List<PredCategory> selectList(PredCategory example);

    /**
     * 목록 조회
     *
     * @param example
     * @return
     */
    public List<PredCategory> selectListByName(PredCategory example);


    /**
     * 추가
     *
     * @param example
     * @return
     */
    public int insert(PredCategory example);

    /**
     * 삭제
     *
     * @param example
     * @return
     */
    public int deleteByPrimaryKey(PredCategory example);

    /**
     * 수정
     *
     * @param example
     * @return
     */
    public int updateByPrimaryKeySelective(PredCategory example);

}
