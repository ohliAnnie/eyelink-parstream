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

package com.kt.programk.common.repository.category;

import com.kt.programk.common.domain.category.SubsCategory;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository(value = "subsCategoryMapper")
public interface SubsCategoryMapper {
	/**
     * Count all int.
     *
     * @return the int
     */
    public int countAll(SubsCategory example);
    
    /**
     * Count by name int.
     *
     * @param example the example
     * @return the int
     */
	public int countByName(SubsCategory example);
    
    /**
     * 조회
     *
     * @param example
     * @return
     */
    public SubsCategory selectByPrimaryKey(SubsCategory example);

    /**
     * 목록 조회
     *
     * @param example
     * @return
     */
    public List<SubsCategory> selectList(SubsCategory example);

    /**
     * 추가
     *
     * @param example
     * @return
     */
    public int insert(SubsCategory example);

    /**
     * 삭제
     *
     * @param example
     * @return
     */
    public int deleteByPrimaryKey(SubsCategory example);

    /**
     * 삭제
     *
     * @param example
     * @return
     */
    public int deleteAll(SubsCategory example);
    
    /**
     * 수정
     *
     * @param example
     * @return
     */
    public int updateByPrimaryKeySelective(SubsCategory example);

    /**
     * 카테고리명, cpID로 조회
     * @param subsCategory
     */
    public List<SubsCategory> selectListByName(SubsCategory subsCategory);
}
