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

import com.kt.programk.common.domain.core.AimlReply;
import com.kt.programk.common.domain.core.AimlTest;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository(value = "aimlReplyMapper")
public interface AimlReplyMapper {
    /**
     * 조회
     *
     * @param example
     * @return
     */
    public AimlReply selectByPrimaryKey(AimlReply example);

    /**
     * 목록 조회
     *
     * @param example
     * @return
     */
    public List<AimlReply> selectList(AimlReply example);

    /**
     * 추가
     *
     * @param example
     * @return
     */
    public int insert(AimlReply example);

    /**
     * 삭제
     *
     * @param example
     * @return
     */
    public int deleteByPrimaryKey(AimlReply example);

    /**
     * 수정
     *
     * @param example
     * @return
     */
    public int updateByPrimaryKeySelective(AimlReply example);

}
