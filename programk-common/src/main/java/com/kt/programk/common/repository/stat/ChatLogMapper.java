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
 * Seo Jong Hwa        2016 . 7 . 12
 */

package com.kt.programk.common.repository.stat;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.kt.programk.common.domain.stat.ChatLog;

/**
 * The interface Chat log mapper.
 */
@Repository(value = "chatLogMapper")
public interface ChatLogMapper {
    /**
     * Count all int.
     *
     * @param example the example
     * @return the int
     */
    public int countAll(ChatLog example);

    /**
     * 조회
     *
     * @param example the example
     * @return chat log
     */
    public ChatLog selectByPrimaryKey(ChatLog example);

    /**
     * 목록 조회
     *
     * @param example the example
     * @return list
     */
    public List<ChatLog> selectList(ChatLog example);

    /**
     * 추가
     *
     * @param example the example
     * @return int
     */
    public int insert(ChatLog example);

    /**
     * Insert batch int.
     *
     * @param example the example
     * @return the int
     */
    public int insertBatch(HashMap<String, Object> example);

    /**
     * 삭제
     *
     * @param example the example
     * @return int
     */
    public int deleteByPrimaryKey(ChatLog example);

    /**
     * 수정
     *
     * @param example the example
     * @return int
     */
    public int updateByPrimaryKeySelective(ChatLog example);
}
