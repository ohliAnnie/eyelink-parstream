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
 * preludio            2017 . 04 . 10
 */

package com.kt.programk.common.repository.core;

import com.kt.programk.common.domain.core.AimlRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * The interface repository mapper
 */
@Repository(value = "aimlRepositoryMapper")
public interface AimlRepositoryMapper {

    /**
     * 목록 조회
     *
     * @param AimlRepository the repository
     * @return AimlRepository
     */
    public List<AimlRepository> selectListByAll(AimlRepository repo);

    /**
     * 목록 조회
     *
     * @param AimlRepository the repository
     * @return list
     */
    public List<AimlRepository> selectListByObjectKey(AimlRepository repo);

    /**
     * 목록 조회
     *
     * @param AimlRepository the repository
     * @return list
     */
    public List<AimlRepository> selectListByKey(AimlRepository repo);

    /**
     * 추가
     *
     * @param AimlRepository the repository
     * @return int
     */
    public int insert(AimlRepository repo);
    
    /**
     * 변경
     *
     * @param AimlRepository the repository
     * @return int
     */
    public int update(AimlRepository repo);
    
    /**
     * 삭제
     *
     * @param AimlRepository the repository
     * @return int
     */
    public int deleteByAll(AimlRepository repo);
    
    /**
     * 삭제
     *
     * @param AimlRepository the repository
     * @return int
     */
    public int deleteByObjectKey(AimlRepository repo);
    
    /**
     * 삭제
     *
     * @param AimlRepository the repository
     * @return int
     */
    public int deleteByKey(AimlRepository repo);
}
