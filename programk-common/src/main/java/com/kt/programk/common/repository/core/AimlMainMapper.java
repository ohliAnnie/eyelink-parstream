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

import com.kt.programk.common.domain.core.AimlMain;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

/**
 * The interface Aiml main mapper.
 */
@Repository(value = "aimlMainMapper")
public interface AimlMainMapper {
    /**
     * 개수 조회
     *
     * @param example the example
     * @return the int
     */
    public int countAll(AimlMain example);

    /**
     * Count by cp id int.
     *
     * @param cpId the cp id
     * @return the int
     */
    public int countByCpId(int cpId);

    /**
     * Count by cate name int.
     *
     * @param name the name
     * @return the int
     */
    public int countByCateName(String name);

    /**
     * Count by input int.
     *
     * @param example the example
     * @return the int
     */
    public int countByInput(AimlMain example);

    /**
     * Count by reply int.
     *
     * @param reply the reply
     * @return the int
     */
    public int countByReply(String reply);

    /**
     * 조회
     *
     * @param example the example
     * @return aiml main
     */
    public AimlMain selectByPrimaryKey(AimlMain example);

    /**
     * 목록 조회
     *
     * @param example the example
     * @return list
     */
    public List<AimlMain> selectListAll(AimlMain example);
    
    /**
     * 다운로드 목록 조회
     *
     * @param example the example
     * @return list
     */
    public List<AimlMain> selectDownloadListAll(AimlMain example);

    /**
     * Select list by cp id list.
     *
     * @param map the map
     * @return the list
     */
    public List<AimlMain> selectListByCpId(HashMap<String, Object> map);

    /**
     * Select list by cate name list.
     *
     * @param map the map
     * @return the list
     */
    public List<AimlMain> selectListByCateName(HashMap<String, Object> map);

    /**
     * Select list by input list.
     *
     * @param map the map
     * @return the list
     */
    public List<AimlMain> selectListByInput(HashMap<String, Object> map);

    /**
     * Select list by reply list.
     *
     * @param map the map
     * @return the list
     */
    public List<AimlMain> selectListByReply(HashMap<String, Object> map);

    /**
     * Select list by cate id list.
     *
     * @param example the example
     * @return the list
     */
    public List<AimlMain> selectListByCateId(AimlMain example);

    /**
     * 추가
     *
     * @param example the example
     * @return int
     */
    public int insert(AimlMain example);

    /**
     * 삭제
     *
     * @param example the example
     * @return int
     */
    public int deleteByPrimaryKey(AimlMain example);

    /**
     * 수정
     *
     * @param example the example
     * @return int
     */
    public int updateByPrimaryKeySelective(AimlMain example);

}
