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

package com.kt.programk.common.repository.core;

import com.kt.programk.common.domain.core.AimlLink;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository(value = "aimlLinkMapper")
public interface AimlLinkMapper {
    /**
     * 조회
     *
     * @param example
     * @return
     */
    public AimlLink selectByPrimaryKey(AimlLink example);

    /**
     * 목록 조회
     *
     * @param example
     * @return
     */
    public List<AimlLink> selectList(AimlLink example);

    /**
     * 추가
     *
     * @param example
     * @return
     */
    public int insert(AimlLink example);

    /**
     * 삭제
     *
     * @param example
     * @return
     */
    public int deleteByPrimaryKey(AimlLink example);

    /**
     * 수정
     *
     * @param example
     * @return
     */
    public int updateByPrimaryKeySelective(AimlLink example);

}
