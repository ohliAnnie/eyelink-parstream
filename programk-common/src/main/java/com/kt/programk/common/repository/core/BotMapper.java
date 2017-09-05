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

import com.kt.programk.common.domain.core.AimlBots;
import com.kt.programk.common.domain.core.Bot;
import com.kt.programk.common.db.domain.BotDTO;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

/**
 * Created by S.J.H on 2016-05-24.
 */
@Repository(value = "botMapper")
public interface BotMapper {
    /**
     * 조회
     *
     * @param example the example
     * @return bot
     */
    public Bot selectByPrimaryKey(Bot example);

    /**
     * 목록 조회
     *
     * @param example the example
     * @return list
     */
    public List<Bot> selectList(Bot example);

    /**
     * 봇 파일 경로를 조회 한다.
     * @return
     */
    public List<AimlBots> selectListPath();


    /**
     * 인증 토큰으로 목록 조회
     *
     * @param token the token
     * @return list
     */
    public List<BotDTO> selectListByToken(String token);

    /**
     * Select list by token and label list.
     *
     * @param maps the maps
     * @return the list
     */
    public List<BotDTO> selectListByTokenAndLabel(HashMap<String, Object> maps);

    /**
     * 추가
     *
     * @param example the example
     * @return int
     */
    public int insert(Bot example);

    /**
     * 삭제
     *
     * @param example the example
     * @return int
     */
    public int deleteByPrimaryKey(Bot example);

    /**
     * 수정
     *
     * @param example the example
     * @return int
     */
    public int updateByPrimaryKeySelective(Bot example);

}
