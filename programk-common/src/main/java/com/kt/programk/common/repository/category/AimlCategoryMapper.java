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

import com.kt.programk.common.domain.category.AimlCategory;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * The interface Aiml category mapper.
 */
@Repository(value = "aimlCategoryMapper")
public interface AimlCategoryMapper {

    /**
     * Count all int.
     *
     * @param example the example
     * @return the int
     */
    public int countAll(AimlCategory example);

    /**
     * Count by cp id int.
     *
     * @param example the example
     * @return the int
     */
    public int countByCpId(AimlCategory example);

    /**
     * 조회
     *
     * @param example the example
     * @return aiml category
     */
    public AimlCategory selectByPrimaryKey(AimlCategory example);

    /**
     * Select by stat aiml category.
     *
     * @param mainId the main id
     * @return the aiml category
     */
    public AimlCategory selectByStat(Integer mainId);

    /**
     * 목록 조회
     *
     * @param example the example
     * @return list list
     */
    public List<AimlCategory> selectListAll(AimlCategory example);

    /**
     * Select list by cp id list.
     *
     * @param example the example
     * @return the list
     */
    public List<AimlCategory> selectListByCpId(AimlCategory example);

    /**
     * Select list by name list.
     *
     * @param example the example
     * @return the list
     */
    public List<AimlCategory> selectListByName(AimlCategory example);

    /**
     * 추가
     *
     * @param example the example
     * @return int int
     */
    public int insert(AimlCategory example);

    /**
     * 삭제
     *
     * @param example the example
     * @return int int
     */
    public int deleteByPrimaryKey(AimlCategory example);

    /**
     * 수정
     *
     * @param example the example
     * @return int int
     */
    public int updateByPrimaryKeySelective(AimlCategory example);

    /**
     * Count by name int.
     *
     * @param aimlCategory the aiml category
     * @return the int
     */
    public int countByName(AimlCategory aimlCategory);
    
    /**
     * 엑셀 업로드 전 삭제
     *
     * @param example the example
     * @return int int
     */
    public int deleteAllNoLock(AimlCategory aimlCategory);

}
