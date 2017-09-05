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

import com.kt.programk.common.domain.category.PropCategory;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository(value = "propCategoryMapper")
public interface PropCategoryMapper {
	/**
     * Count all int.
     *
     * @return the int
     */
    public int countAll(PropCategory example);
    
    /**
     * Count by name int.
     *
     * @param example the example
     * @return the int
     */
	public int countByName(PropCategory example);
	
    /**
     * 조회
     *
     * @param example
     * @return
     */
    public PropCategory selectByPrimaryKey(PropCategory example);

    /**
     * 목록 조회
     *
     * @param example
     * @return
     */
    public List<PropCategory> selectList(PropCategory example);

    /**
     * 추가
     *
     * @param example
     * @return
     */
    public int insert(PropCategory example);

    /**
     * 삭제
     *
     * @param example
     * @return
     */
    public int deleteByPrimaryKey(PropCategory example);

    /**
     * 수정
     *
     * @param example
     * @return
     */
    public int updateByPrimaryKeySelective(PropCategory example);

    /**
     * 카테고리 명으로 조회
     * @param propCategory
     */
    public List<PropCategory>  selectListByName(PropCategory propCategory);
}
