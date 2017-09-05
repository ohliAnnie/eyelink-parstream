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

package com.kt.programk.common.service;

import com.kt.programk.common.code.DeploySchedulerCompletedType;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.category.AimlCategory;
import com.kt.programk.common.domain.core.*;
import com.kt.programk.common.domain.deploy.*;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.repository.admin.CpMapper;
import com.kt.programk.common.repository.core.BotMapper;
import com.kt.programk.common.repository.deploy.DeployHistoryMapper;
import com.kt.programk.common.repository.deploy.DeployNodeHistoryMapper;
import com.kt.programk.common.repository.deploy.DeployProcessMapper;
import com.kt.programk.common.repository.deploy.DeploySchedulerMapper;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.DbExceptionUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.TreeMap;

/**
 * Created by Administrator on 2016-06-29.
 */
@Service
public class BotDeployService {
    /**
     * 로그 파일
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(BotDeployService.class);

    /**
     * 매퍼 클래스
     */
    @Autowired
    private DeployProcessMapper deployProcessMapper;

    /**
     * 배포 이력
     */
    @Autowired
    private DeployHistoryMapper deployHistoryMapper;

    /**
     * 서버별 배포 이력을 남긴다.
     */
    @Autowired
    private DeployNodeHistoryMapper deployNodeHistoryMapper;

    /**
     * 배포 실패했을 경우.. F로 업데이트 하자.
     */
    @Autowired
    private DeploySchedulerMapper deploySchedulerMapper;

    /**
     * Active, StandBy
     */
    @Autowired
    private BotMapper botMapper;

    /**
     * 토큰을 구함
     */
    @Autowired
    private CpMapper cpMapper;

    /**
     * 환경 변수
     */
    @Autowired
    private ConfigProperties config;

    /**
     * 해당 CP의 카테고리 목록을 조회한다.
     *
     * @param aimlCategory
     * @return
     * @throws BizCheckedException
     * @throws ApplicationException
     */
    public List<AimlCategory> findListCategory(AimlCategory aimlCategory) throws BizCheckedException, ApplicationException {
        if (aimlCategory == null) {
            throw new BizCheckedException(BizErrCode.ERR_0001, "aimlCategory");
        }

        if (aimlCategory.getCpId() == 0) {
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlCategory.cpId");
        }

        if (aimlCategory.getEnabled() == null) {
            throw new BizCheckedException(BizErrCode.ERR_0002, "aimlCategory.enabled");
        }

        try {
            return deployProcessMapper.selectListFromAimlCategoryByCpId(aimlCategory);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * 배포해야할 파일 경로를 조회한다.
     * @param cpId
     * @param fileType
     * @param subLabel
     * @return
     * @throws BizCheckedException
     * @throws ApplicationException
     */
    public BotFile findBotFile(int cpId, String fileType, String subLabel) throws BizCheckedException, ApplicationException {
        if (cpId == 0) {
            throw new BizCheckedException(BizErrCode.ERR_0002, "cpId");
        }

        if (fileType == null || "".equals(fileType)) {
            throw new BizCheckedException(BizErrCode.ERR_0002, "fileType");
        }

        HashMap<String, Object> hashMap = new HashMap<>();
        hashMap.put("cpId", cpId);
        hashMap.put("fileType", fileType);
        hashMap.put("subLabel", subLabel);
        try {
            return deployProcessMapper.selectFromBotFileByCp(hashMap);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * aiml_main, aiml_image, aiml_link, aiml_recommend, aiml_reply 테이블 조회
     *
     * @param cateId
     * @return
     * @throws ApplicationException
     */
    public List<DeployAiml> findListAimlMain(int cateId) throws ApplicationException {
        AimlMain aimlMain = new AimlMain();
        aimlMain.setCateId(cateId);

        try {
            return deployProcessMapper.selectListFromAimlMain(aimlMain);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * aiml_subs 데이터 조회
     *
     * @param cpId
     * @return
     * @throws ApplicationException
     */
    public List<AimlSubs> findListAimlSubs(int cpId) throws ApplicationException {
        try {
            return deployProcessMapper.selectListFromAimlSubs(cpId);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * aiml_prop 데이터 조회
     *
     * @param cpId
     * @return
     * @throws ApplicationException
     */
    public List<AimlProp> findListAimlProp(int cpId) throws ApplicationException {
        try {
            return deployProcessMapper.selectListFromAimlProp(cpId);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * aiml_pred 조회
     *
     * @param cpId
     * @return
     * @throws ApplicationException
     */
    public List<AimlPred> findListAimlPred(int cpId) throws ApplicationException {
        try {
            return deployProcessMapper.selectListFromAimlPred(cpId);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * 파일 배포 이력을 남긴다.
     *
     * @param deployHistory
     */
    public void createHistory(DeployHistory deployHistory) throws ApplicationException {
        try {
            //deployHistoryMapper.insertNotExist(deployHistory);
            deployHistoryMapper.insert(deployHistory);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * 배포가 실패할 경우 노드 별로 배포 이력을 남기고 실패로 처리한다.
     * @param deployNodeHistory
     * @throws ApplicationException
     */
    @Transactional
    public void createFailWriteNodeHistory(DeployNodeHistory deployNodeHistory) throws ApplicationException {
        try{
            deployNodeHistoryMapper.insert(deployNodeHistory);
            DeployScheduler deployScheduler = new DeployScheduler();
            deployScheduler.setId(deployNodeHistory.getSchedulerId());
            deployScheduler.setCompleted(DeploySchedulerCompletedType.FAIL.getValue());

            //스케줄러 실패 처리
            deploySchedulerMapper.updateByPrimaryKeySelective(deployScheduler);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * 배포가 성공했을 경우 업데이트
     * @param schedulerId
     * @throws ApplicationException
     */
    @Transactional
    public void updateSuccessScheduler(int schedulerId) throws ApplicationException {
        try{
            DeployScheduler deployScheduler = new DeployScheduler();
            deployScheduler.setId(schedulerId);
            deployScheduler.setCompleted(DeploySchedulerCompletedType.COMPLTED.getValue());
            deploySchedulerMapper.updateByPrimaryKeySelective(deployScheduler);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * 배포가 실패 했을 경우
     * @param schedulerId
     * @throws ApplicationException
     */
    @Transactional
    public void updateFailScheduler(int schedulerId, String description) throws ApplicationException {
        try{
            DeployScheduler deployScheduler = new DeployScheduler();
            deployScheduler.setId(schedulerId);
            deployScheduler.setCompleted(DeploySchedulerCompletedType.FAIL.getValue());
            deployScheduler.setDescription(description);
            deploySchedulerMapper.updateByPrimaryKeySelective(deployScheduler);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * 배포할 작업 목록을 조회한다.
     * @return
     * @throws ApplicationException
     */
    public List<DeployScheduler> findListScheduler(DeployScheduler deployScheduler) throws ApplicationException {
        try{
            return deployProcessMapper.selectListFromScheduler(deployScheduler);
        } catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * 이미 배포한 작업인지 조회
     * @param schedulerId
     * @param hostIp
     * @return
     * @throws ApplicationException
     */
    public int countDeployNode(int schedulerId, String hostIp) throws ApplicationException {
        HashMap<String, Object> map = new HashMap<>();
        map.put("schedulerId", schedulerId);
        map.put("hostIp", hostIp);

        try{
            return deployProcessMapper.countDeployNodeHistory(map);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * 노드별로 파일 write가 완료 되었을 경우 호출한다.
     * @param id
     * @param localIp
     * @param fileMap
     */
    public void createSuccessWriteNodeHistory(int id, String localIp, TreeMap<String, String> fileMap) {

        for (String key : fileMap.keySet()) {
            DeployNodeHistory deployNodeHistory = new DeployNodeHistory();
            deployNodeHistory.setSchedulerId(id);
            deployNodeHistory.setHostIp(localIp);
            deployNodeHistory.setFileName(fileMap.get(key));
            deployNodeHistory.setWriteSuccess(DeploySchedulerCompletedType.COMPLTED.getValue());
            deployNodeHistory.setReadSuccess(DeploySchedulerCompletedType.NONCOMPLETED.getValue());
            deployNodeHistoryMapper.insert(deployNodeHistory);
        }
    }

    /**
     * 해당 CP의 bot id를 조회한다.
     * @param cpId
     * @return
     * @throws ApplicationException
     */
    public List<Bot> findListBotByCpId(int cpId) throws ApplicationException {
        Bot bot = new Bot();
        bot.setCpId(cpId);
        try{
            return botMapper.selectList(bot);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * bot 서비스 상태를 변경한다.
     * @param bot
     * @return
     * @throws ApplicationException
     */
    public int editBot(Bot bot) throws ApplicationException {
        try{
            return botMapper.updateByPrimaryKeySelective(bot);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * 해당 봇의 토킅을 구한다.
     * @param cpId
     * @return
     * @throws ApplicationException
     */
    public Cp findTokenByCpId(int cpId) throws ApplicationException {
        Cp cp = new Cp();
        cp.setId(cpId);

        try{
            return cpMapper.selectByPrimaryKey(cp);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * 모든 노드에 배포가 정상적으로 되었는지 확인
     * @param schedulerId
     * @return
     */
    public boolean checkDeploySuccess(int schedulerId){
        try {
            int count = deployNodeHistoryMapper.successDeployCount(schedulerId);
            int condition = config.getInteger("deploy.node.count") * config.getInteger("deploy.file.count");

            if (count == condition) {
                return true;
            } else {
                return false;
            }
        }catch (Exception ex){
            LOGGER.error("데이터 베이스 또는 환경 변수 조회 실패", ex);
            return false;
        }
    }

    /**
     * 모든 노드가 배포가 완료 되었는지 확인
     * @param schedulerId
     * @return
     * @throws ApplicationException
     */
    public boolean countDeployAllNodeHistory(int schedulerId) throws ApplicationException {
        try{
            int count = deployProcessMapper.countDeployAllNodeHistory(schedulerId);
            int condition = config.getInteger("deploy.node.count");

            if (count == condition) {
                return true;
            } else {
                return false;
            }
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * bots 파일을 배포하기 위한 파일 경로 조회
     * @return
     * @throws ApplicationException
     */
    public List<AimlBots> findBotsPath() throws ApplicationException {
        try{
            return botMapper.selectListPath();
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }
}
