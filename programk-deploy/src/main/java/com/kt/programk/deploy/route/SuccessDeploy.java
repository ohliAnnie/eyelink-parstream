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
 * Seo Jong Hwa        2016 . 7 . 13
 */
package com.kt.programk.deploy.route;

import com.kt.programk.common.domain.deploy.DeployScheduler;
import com.kt.programk.common.logs.CLogger;
import com.kt.programk.common.service.BotDeployService;
import com.kt.programk.common.utils.ServerInfo;
import com.kt.programk.deploy.cache.ChildrenCache;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.TreeMap;

/**
 * 배포 쓰기 작업이 완료 하였을 경우,
 * DeployNodeHistory에 파일 성공 처리를 추가 한다.
 */
public class SuccessDeploy implements Processor {
    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(SuccessDeploy.class);

    /**
     * The Bot deploy service.
     */
    private BotDeployService botDeployService;

    /**
     * The Children cache.
     */
    private ChildrenCache childrenCache;

    /**
     * Process.
     *
     * @param exchange the exchange
     */
    @Override
    public void process(Exchange exchange) {
        CLogger.functionStart("SuccessDeploy.process");
        DeployScheduler deployScheduler = exchange.getIn().getBody(DeployScheduler.class);

        TreeMap<String, String> fileMap = deployScheduler.getFileMap();

        botDeployService.createSuccessWriteNodeHistory(deployScheduler.getId(), ServerInfo.getLocalIp(), fileMap);

        if (childrenCache != null) {
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
