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

package com.kt.programk.deploy.route;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Date;
import java.util.List;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.ProducerTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.kt.programk.common.code.DeploySchedulerCompletedType;
import com.kt.programk.common.domain.deploy.DeployScheduler;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.logs.CLogger;
import com.kt.programk.common.service.BotDeployService;
import com.kt.programk.deploy.cache.ChildrenCache;

/**
 * 레파지토리에 배포할 작업이 있는지 조회한다.
 */
public class SearchDeploy implements Processor {
    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(SearchDeploy.class);

    /**
     * 매퍼 조회
     */
    private BotDeployService botDeployService;


    /**
     * The Children cache.
     */
    private ChildrenCache childrenCache;

    /**
     * The Producer template.
     */
    @Autowired
    private ProducerTemplate producerTemplate;

    /**
     * Process.
     *
     * @param exchange the exchange
     * @throws ApplicationException the application exception
     * @throws UnknownHostException the unknown host exception
     */
    @Override
    public void process(Exchange exchange) throws ApplicationException, UnknownHostException {
        CLogger.functionStart("SearchDeploy Start===============================================");

        DeployScheduler deployScheduler = new DeployScheduler();
        //완료 처리 되지 않은 항목만 조회한다.
        deployScheduler.setGubun("배포");
        deployScheduler.setCompleted(DeploySchedulerCompletedType.NONCOMPLETED.getValue());

        List<DeployScheduler> deploySchedulers = botDeployService.findListScheduler(deployScheduler);

        //현재 시간
        Date now = new Date();

        for (DeployScheduler deploy : deploySchedulers) {
            Date start = deploy.getDeployDate();
            if (null == start) {
                continue;
            }

            int compare = start.compareTo(now);
            if (compare <= 0) {
                //배포 작업이 시작이 안되었다면
                if (childrenCache.isNotExist(deploy.getId()) && isNotCompletedNode(deploy.getId())) {
                    childrenCache.add(deploy.getId(), new Date());
                    producerTemplate.requestBody("direct:all", deploy);
                } else {
                    //모든 노드에 작업이 완료 되었는지 확인한다.
                    if (botDeployService.countDeployAllNodeHistory(deploy.getId())) {
                        CLogger.info("모든 노드에 배포가 완료되었기 때문에 성공 처리 == " + deploy.getId());
                        botDeployService.updateSuccessScheduler(deploy.getId());
                    }
                }
            } else {
                CLogger.info("배포 시간이 아직 안되었다.");
                continue;
            }
        }
        
        // 메모리 정리 작업 검색
        DeployScheduler cleanScheduler = new DeployScheduler();
        //완료 처리 되지 않은 항목만 조회한다.
        cleanScheduler.setGubun("정리");
        cleanScheduler.setCompleted(DeploySchedulerCompletedType.NONCOMPLETED.getValue());

        List<DeployScheduler> cleanSchedulers = botDeployService.findListScheduler(cleanScheduler);
        for (DeployScheduler clean : cleanSchedulers) {
            Date start = clean.getDeployDate();
            if (null == start) {
                continue;
            }

            int compare = start.compareTo(now);
            if (compare <= 0) {
                //정리 작업이 시작이 안되었다면
                if (childrenCache.isNotExist(clean.getId()) && isNotCompletedNode(clean.getId())) {
                    childrenCache.add(clean.getId(), new Date());
                    producerTemplate.requestBody("direct:clean", clean);
                } else {
                    //모든 노드에 정리이 완료 되었는지 확인한다.
                    if (botDeployService.countDeployAllNodeHistory(clean.getId())) {
                        CLogger.info("모든 노드에 정리가 완료되었기 때문에 성공 처리 == " + clean.getId());
                        botDeployService.updateSuccessScheduler(clean.getId());
                    }
                }
            } else {
                continue;
            }
        }
        

        CLogger.functionEnd();
    }

    /**
     * 각 노드에서 파일 생성이 완료 되었는지 체크
     *
     * @param id the id
     * @return boolean
     * @throws UnknownHostException the unknown host exception
     * @throws ApplicationException the application exception
     */
    private boolean isNotCompletedNode(int id) throws UnknownHostException, ApplicationException {
        int count = botDeployService.countDeployNode(id, getLocalIp());

        if (count == 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 해당 노드의 IP 정보를 조회한다.
     *
     * @return local ip
     * @throws UnknownHostException the unknown host exception
     */
    public static String getLocalIp() throws UnknownHostException {
        InetAddress IP = InetAddress.getLocalHost();
        return IP.getHostAddress();
    }

    /**
     * 스케줄러 조회
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
