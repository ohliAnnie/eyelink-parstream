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
 * Seo Jong Hwa        2016 . 7 . 14
 */

package com.kt.programk.deploy.route;

import com.google.gson.Gson;
import com.kt.programk.common.code.DeploySchedulerCompletedType;
import com.kt.programk.common.domain.deploy.DeployHistory;
import com.kt.programk.common.domain.deploy.DeployNodeHistory;
import com.kt.programk.common.domain.deploy.DeployScheduler;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.logs.CLogger;
import com.kt.programk.common.service.BotDeployService;
import com.kt.programk.deploy.cache.ChildrenCache;
import com.kt.programk.deploy.model.AimlError;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.UnknownHostException;
import java.util.List;
import java.util.TreeMap;

/**
 * 파일 배포 실패가 발생 했을 경우,
 * DeployNodeHistory 에 실패 이력을 기록한다.
 * DeployHistory 에 실패 이력을 기록한다.
 * DeployScheduler 에 실패 처리를 업데이트 한다.
 */
public class FailDeploy implements Processor {
    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(FailDeploy.class);

    /**
     * 파일 이름 최대 길이
     */
    public static final int FILE_NAME_LENGTH = 512;

    /**
     * The Bot deploy service.
     */
    private BotDeployService botDeployService;

    /**
     * The Children cache.
     */
    private ChildrenCache childrenCache;

    /**
     * The Gson.
     */
    private Gson gson = new Gson();


    /**
     * Process.
     *
     * @param exchange the exchange
     * @throws UnknownHostException the unknown host exception
     * @throws ApplicationException the application exception
     */
    @Override
    public void process(Exchange exchange) throws UnknownHostException, ApplicationException {
        CLogger.functionStart("FailDeploy.process");
        DeployScheduler deployScheduler = exchange.getIn().getBody(DeployScheduler.class);
        Exception cause = exchange.getProperty(Exchange.EXCEPTION_CAUGHT, Exception.class);
        LOGGER.error(cause.getMessage());

        List<AimlError> aimlErrors  = (List<AimlError>) exchange.getIn().getHeader("error");

        DeployNodeHistory deployNodeHistory = new DeployNodeHistory();
        deployNodeHistory.setSchedulerId(deployScheduler.getId());
        deployNodeHistory.setHostIp(SearchDeploy.getLocalIp());
        deployNodeHistory.setWriteSuccess(DeploySchedulerCompletedType.NONCOMPLETED.getValue());
        deployNodeHistory.setReadSuccess(DeploySchedulerCompletedType.NONCOMPLETED.getValue());

        TreeMap<String, String> fileMap = deployScheduler.getFileMap();

        String[] filenames = new String[fileMap.size()];
        int fileCnt = 0;
        StringBuffer strBuf = new StringBuffer();

        for (String key : fileMap.keySet()) {
            filenames[fileCnt++] = fileMap.get(key);
            strBuf.append(fileMap.get(key));
            strBuf.append(";");
        }

        //배포한 파일 까지의 이력을 남기자
        String fileName = strBuf.toString();
        if(fileName.length() > FILE_NAME_LENGTH){
            fileName = fileName.substring(0, FILE_NAME_LENGTH - 1);
        }
        deployNodeHistory.setFileName(fileName);

        String str = null;
        if(aimlErrors != null){
            str = gson.toJson(aimlErrors);
            deployNodeHistory.setErrMsg(str);
        }

        //배포가 실패할 경우 1개의 데이터만 입력한다.
        botDeployService.createFailWriteNodeHistory(deployNodeHistory);

        /**
         * 2016-08-17 S.J.H
         * 배포 이력에도 추가 한다.
         */
        DeployHistory deployHistory = new DeployHistory();
        deployHistory.setFileName("");
        deployHistory.setSchedulerId(deployScheduler.getId());
        deployHistory.setDescription(str);
        botDeployService.createHistory(deployHistory);

        if(childrenCache != null) {
            childrenCache.remove(deployScheduler.getId());
        }

        CLogger.functionEnd();
    }

    /**
     * Sets bot deploy service.
     *
     * @param botDeployService the bot deploy service
     */
    public void setBotDeployService(BotDeployService botDeployService) {
        this.botDeployService = botDeployService;
    }

    /**
     * Sets children cache.
     *
     * @param childrenCache the children cache
     */
    public void setChildrenCache(ChildrenCache childrenCache) {
        this.childrenCache = childrenCache;
    }
}
