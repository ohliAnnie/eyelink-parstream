/*
 *  Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
package com.kt.programk.cms.service;

import com.kt.programk.common.domain.core.AimlBots;
import com.kt.programk.common.domain.deploy.DeployScheduler;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.service.BotDeployService;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.deploy.cache.ChildrenCache;
import com.kt.programk.deploy.model.AimlError;
import com.kt.programk.deploy.process.*;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import org.apache.camel.CamelContext;
import org.apache.camel.Exchange;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.impl.DefaultExchange;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 검증용 배포 서비스
 */
@Service
public class VerifyDeployService {

    /**
     * LOGGER
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(VerifyDeployService.class);

    /**
     * 환경 설정 파일
     */
    @Autowired
    private ConfigProperties config;

    /**
     * 검증용 매퍼 모음
     */
    @Autowired
    private BotDeployService deployService;

    /**
     * Dummy용 컨텍스트
     */
    private CamelContext context = new DefaultCamelContext();


    /**
     * AIML 파일을 생성한다. 에러가 발생하면 AimlError 파일 사이즈가 0이상이고 파일이 생성되지 않는다.
     *
     * @param subLabel
     * @param cpId
     * @param userId
     * @return
     */
    public List<AimlError> delpoyAiml(String subLabel, int cpId, String userId) {
    	
        AimlTemplateProcess templateProcess = new AimlTemplateProcess();
        templateProcess.setChildrenCache(new ChildrenCache());
        templateProcess.setConfig(config);
        templateProcess.setBotDeployService(deployService);

        Exchange exchange = new DefaultExchange(context);

        DeployScheduler scheduler = new DeployScheduler();
        scheduler.setId(9999);
        scheduler.setCpId(cpId);
        scheduler.setUserId(userId);
        scheduler.setSubLabel(subLabel);

        exchange.getIn().setBody(scheduler);

        try {
            templateProcess.execute(exchange);
            return new ArrayList<>();
        } catch (Exception e) {
            LOGGER.info("aiml 파일 생성 실패 " + e.getMessage());
            List<AimlError> aimlErrors = (List<AimlError>) exchange.getIn().getHeader("error");
            return aimlErrors;
        }
    }

    /**
     * predicate 파일을 생성한다.
     * 에러가 발생하면 예외가 발생한다.
     *
     * @param subLabel
     * @param cpId
     * @param userId
     */
    public void deployPred(String subLabel, int cpId, String userId) throws ApplicationException {
        PredicatesTemplateProcess templateProcess = new PredicatesTemplateProcess();
        templateProcess.setBotDeployService(deployService);
        templateProcess.setConfig(config);
        templateProcess.setChildrenCache(new ChildrenCache());

        Exchange exchange = new DefaultExchange(context);

        DeployScheduler scheduler = new DeployScheduler();
        scheduler.setId(9999);
        scheduler.setCpId(cpId);
        scheduler.setUserId(userId);
        scheduler.setSubLabel(subLabel);
        exchange.getIn().setBody(scheduler);

        try {
            templateProcess.execute(exchange);
        } catch (Exception e) {
            LOGGER.info("pred 파일 생성 실패 " + e.getMessage());
            throw new ApplicationException("오류 : " + e.getMessage());
        }
    }

    /**
     * predicate 파일을 생성한다.
     * 에러가 발생하면 예외가 발생한다.
     *
     * @param subLabel
     * @param cpId
     * @param userId
     */
    public void deployProp(String subLabel, int cpId, String userId) throws ApplicationException {
        PropertiesTemplateProcess templateProcess = new PropertiesTemplateProcess();
        templateProcess.setBotDeployService(deployService);
        templateProcess.setConfig(config);
        templateProcess.setChildrenCache(new ChildrenCache());

        Exchange exchange = new DefaultExchange(context);

        DeployScheduler scheduler = new DeployScheduler();
        scheduler.setId(9999);
        scheduler.setCpId(cpId);
        scheduler.setUserId(userId);
        scheduler.setSubLabel(subLabel);
        exchange.getIn().setBody(scheduler);

        try {
            templateProcess.execute(exchange);
        } catch (Exception e) {
            LOGGER.info("prop 파일 생성 실패 " + e.getMessage());
            throw new ApplicationException("오류 : " + e.getMessage());
        }

    }

    /**
     * substitutions 파일을 생성한다.
     * 에러가 발생하면 예외가 발생한다.
     *
     * @param subLabel
     * @param cpId
     * @param userId
     */
    public void deploySubs(String subLabel, int cpId, String userId) throws ApplicationException {
        SubstitutionsTemplateProcess templateProcess = new SubstitutionsTemplateProcess();
        templateProcess.setBotDeployService(deployService);
        templateProcess.setConfig(config);
        templateProcess.setChildrenCache(new ChildrenCache());

        Exchange exchange = new DefaultExchange(context);

        DeployScheduler scheduler = new DeployScheduler();
        scheduler.setId(9999);
        scheduler.setCpId(cpId);
        scheduler.setUserId(userId);
        scheduler.setSubLabel(subLabel);
        exchange.getIn().setBody(scheduler);

        try {
            templateProcess.execute(exchange);
        } catch (Exception e) {
            LOGGER.info("subs 파일 생성 실패 " + e.getMessage());
            throw new ApplicationException("오류 : " + e.getMessage());
        }

    }

    public List<AimlError> delpoyAll(String subLabel, int cpId, String userId) throws ApplicationException {
        List<AimlError> aimlErrors = delpoyAiml(subLabel, cpId, userId);
        deployPred(subLabel, cpId, userId);
        deployProp(subLabel, cpId, userId);
        deploySubs(subLabel, cpId, userId);

        return aimlErrors;
    }

    /**
     * /home/jboss/programk/bots.xml 파일을 생성한다.
     * 파일과 폴더가 없으면 생성한다.
     *
     * @throws ApplicationException the application exception
     */
    public void deployBot() throws ApplicationException {
        AimlBotsTemplateProcess aimlBotsTemplateProcess = new AimlBotsTemplateProcess();
        aimlBotsTemplateProcess.setBotDeployService(deployService);
        aimlBotsTemplateProcess.setConfig(config);
        aimlBotsTemplateProcess.setChildrenCache(new ChildrenCache());
        Exchange exchange = new DefaultExchange(context);

        try {
            aimlBotsTemplateProcess.execute(exchange);
        } catch (ApplicationException e) {
            LOGGER.info("bots 파일 생성 실패 " + e.getMessage());
            throw new ApplicationException("오류 : " + e.getMessage());
        } catch (IOException e) {
            LOGGER.info("bots 파일 생성 실패 " + e.getMessage());
            throw new ApplicationException("오류 : " + e.getMessage());
        }
    }

    /**
     * /home/jboss/programk/bots.xml 파일의 내용을 리턴한다.
     *
     * @return the string
     * @throws ApplicationException the application exception
     */
    public String downLoadBots() throws ApplicationException {
        List<AimlBots> botsList = null;

        try {
            botsList = deployService.findBotsPath();
        } catch (ApplicationException e) {
            LOGGER.info("bots 데이터 베이스 조회 실패 " + e.getMessage());
            throw new ApplicationException("오류 : " + e.getMessage());
        }
        //해시맵을 만들자
        Map<String, Map<String, String>> root = new HashMap<>();

        for (AimlBots aimlBots : botsList) {
            if (root.containsKey(aimlBots.getSubLabel())) {
                Map<String, String> leap = root.get(aimlBots.getSubLabel());
                if (!leap.containsKey(aimlBots.getFileType())) {
                    leap.put(aimlBots.getFileType(), aimlBots.getFileName());
                }
            } else {
                root.put(aimlBots.getSubLabel(), new HashMap<String, String>());
                root.get(aimlBots.getSubLabel()).put(aimlBots.getFileType(), aimlBots.getFileName());
            }
        }

        Map<String, Object> data = new HashMap<>();
        data.put("LIST", root);

        Configuration cfg = new Configuration();
        cfg.setClassForTemplateLoading(this.getClass(), "/templates/");

        StringWriter stringWriter = new StringWriter();

        try {
            //Load template from source folder
            Template template = cfg.getTemplate("bots.ftl");
            template.process(data, stringWriter);
            return stringWriter.toString();
        } catch (IOException e) {
            LOGGER.info("bots 파일 생성 실패 " + e.getMessage());
            throw new ApplicationException("오류 : " + e.getMessage());
        } catch (TemplateException ex) {
            LOGGER.info("bots 파일 생성 실패 " + ex.getMessage());
            throw new ApplicationException("오류 : " + ex.getMessage());
        }
    }
}
