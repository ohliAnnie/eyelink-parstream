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

import com.kt.programk.common.domain.core.AimlPredicate;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by S.J.H on 2016-05-24.
 */
@Repository(value = "aimlPredicateMapper")
public interface AimlPredicateMapper {
    /**
     * 조회
     * @param predicate
     * @return
     */
    public AimlPredicate selectByPrimaryKey(AimlPredicate predicate);

    /**
     * 목록 조회
     * @param predicate
     * @return
     */
    public List<AimlPredicate> selectList(AimlPredicate predicate);

    /**
     * 추가
     * @param predicate
     * @return
     */
    public int insert(AimlPredicate predicate);

    /**
     * 삭제
     * @param predicate
     * @return
     */
    public int deleteByPrimaryKey(AimlPredicate predicate);

    /**
     * 수정
     *
     * @param example
     * @return
     */
    public int updateByPrimaryKeySelective(AimlPredicate example);

}
