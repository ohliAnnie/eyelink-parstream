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
 * Seo Jong Hwa        2016 . 6 . 29
 */

package com.kt.programk.common.repository.deploy;

import com.kt.programk.common.domain.category.AimlCategory;
import com.kt.programk.common.domain.core.*;
import com.kt.programk.common.domain.deploy.*;
import org.springframework.stereotype.Repository;
import org.springframework.validation.ObjectError;

import java.util.HashMap;
import java.util.List;

/**
 * AIML 파일 배포에 사용하는 쿼리 모음
 */
@Repository(value = "deployProcessMapper")
public interface DeployProcessMapper {
    /**
     * 해당 CP의 봇 파일 경로을 가져온다.
     *
     * @param hashMap
     * @return
     */
    public BotFile selectFromBotFileByCp(HashMap<String, Object> hashMap);

    /**
     * 카테고리에 속해 있는 AIML을 조회한다.
     *
     * @param aimlMain
     * @return
     */
    public List<DeployAiml> selectListFromAimlMain(AimlMain aimlMain);

    /**
     * CP에 속해 있는 카테고리를 조회한다.
     *
     * @param aimlCategory
     * @return
     */
    public List<AimlCategory> selectListFromAimlCategoryByCpId(AimlCategory aimlCategory);

    /**
     * CP에 속해 있는 substitutions을 조회한다.
     *
     * @param cpId
     * @return
     */
    public List<AimlSubs> selectListFromAimlSubs(int cpId);

    /**
     * CP에 속해 있는 properties을 조회한다.
     *
     * @param cpId
     * @return
     */
    public List<AimlProp> selectListFromAimlProp(int cpId);

    /**
     * CP에 속해 있는 predicates를 조회한다.
     *
     * @param cpId
     * @return
     */
    public List<AimlPred> selectListFromAimlPred(int cpId);

    /**
     * 배포할 predicates 카테고리 목록
     * @param cpId
     * @return
     */
    public List<DeployPredCategory> selectPredListByCpId(int cpId);

    /**
     * 배포할 properties 카테고리 목록
     * @param cpId
     * @return
     */
    public List<DeployPropCategory> selectPropListByCpId(int cpId);

    /**
     * 배포하 substitutions 카테고리 목록
     * @param cpId
     * @return
     */
    public List<DeploySubsCategory> selectSubsListByCpId(int cpId);

    /**
     * 배포할 aiml 카테고리 목록
     * @param cpId
     * @return
     */
    public List<DeployAimlCategory> selectAimlListByCpId(int cpId);

    /**
     * 배포할 스케줄러 목록 조회
     * @param example
     * @return
     */
    public List<DeployScheduler> selectListFromScheduler(DeployScheduler example);

    /**
     * 스케줄러가 해당 노드에서 작업 완료했는지 조회
     * @param hashMap
     * @return
     */
    public int countDeployNodeHistory(HashMap<String, Object> hashMap);

    /**
     * 모든 스케줄러가 배포가 완료되었는지 확인
     * @param schedulerId
     * @return
     */
    public int countDeployAllNodeHistory(Integer schedulerId);
}
