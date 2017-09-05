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

import com.kt.programk.common.domain.core.BotFile;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by S.J.H on 2016-05-24.
 */
@Repository(value = "botFileMapper")
public interface BotFileMapper {
    /**
     * 조회
     *
     * @param example the example
     * @return bot file
     */
    public BotFile selectByPrimaryKey(BotFile example);

    /**
     * Select by cp id bot file.
     *
     * @param example the example
     * @return the bot file
     */
    public BotFile selectByCpId(BotFile example);

    /**
     * 목록 조회
     *
     * @param example the example
     * @return list
     */
    public List<BotFile> selectList(BotFile example);

    /**
     * 추가
     *
     * @param example the example
     * @return int
     */
    public int insert(BotFile example);

    /**
     * 삭제
     *
     * @param example the example
     * @return int
     */
    public int deleteByPrimaryKey(BotFile example);

    /**
     * 수정
     *
     * @param example the example
     * @return int
     */
    public int updateByPrimaryKeySelective(BotFile example);

    /**
     * 파일 이름으로 last_loaded를 업데이트 한다.
     *
     * @param example the example
     * @return int
     */
    public int updateByFileName(BotFile example);

}
