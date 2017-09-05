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
 * Seo Jong Hwa        2016 . 6 . 30
 */

package com.kt.programk.deploy.process;

import com.kt.programk.common.domain.deploy.DeployHistory;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.service.BotDeployService;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.ServerInfo;
import com.kt.programk.deploy.cache.ChildrenCache;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import org.apache.camel.PropertyInject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.*;
import java.net.UnknownHostException;
import java.util.Map;

/**
 * 템플릿 생성
 */
public class AbstractTemplateProcess {
    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(AbstractTemplateProcess.class);

    /**
     * The Config.
     */
    @PropertyInject("deploy.programk.path")
    protected String dir;

    /**
     * The Config.
     */
    protected ConfigProperties config;

    /**
     * The Children cache.
     */
    protected ChildrenCache childrenCache;

    /**
     * 파일 배포 로직
     */
    @Autowired
    protected BotDeployService botDeployService;

    /**
     * Gets local ip.
     *
     * @return the local ip
     * @throws UnknownHostException the unknown host exception
     */
    protected String getLocalIp() throws UnknownHostException {
        return ServerInfo.getLocalIp();
    }

    /**
     * Write file string.
     *
     * @param data     the data
     * @param pathname the pathname
     * @param fltName  the flt name
     * @return the string
     */
    protected String writeFile(Map<String, Object> data, String pathname, String fltName) {
        Configuration cfg = new Configuration();
        cfg.setClassForTemplateLoading(this.getClass(), "/templates/");

        try {
            //Load template from source folder
            Template template = cfg.getTemplate(fltName);

            Writer out = new OutputStreamWriter(System.out);
            template.process(data, out);
            out.flush();

            // File output
            //Writer file = new FileWriter(new File(pathname));
            OutputStreamWriter file = new OutputStreamWriter(new FileOutputStream(pathname), "UTF-8");
            template.process(data, file);
            file.flush();
            file.close();

        } catch (IOException e) {
            LOGGER.error(e.getMessage());
        } catch (TemplateException e1) {
            LOGGER.error(e1.getMessage());
        }

        return pathname;
    }

    /**
     * 히스토리 테이블에 입력
     *
     * @param data        the data
     * @param pathname    the pathname
     * @param fltName     the flt name
     * @param schedulerId the scheduler id
     * @param fileType    the file type
     * @param userId      the user id
     * @param cpId        the cp id
     * @param subLabel    the sub label
     * @return string
     * @throws ApplicationException the application exception
     */
    protected String writeHistory(Map<String, Object> data, String pathname, String fltName, int schedulerId, String fileType, String userId, int cpId, String subLabel) {
        Configuration cfg = new Configuration();
        cfg.setClassForTemplateLoading(this.getClass(), "/templates/");

        StringWriter stringWriter = new StringWriter();

        try {
            //Load template from source folder
            Template template = cfg.getTemplate(fltName);
            template.process(data, stringWriter);
            String str = stringWriter.toString();

            DeployHistory deployHistory = new DeployHistory();
            deployHistory.setSchedulerId(schedulerId);
            deployHistory.setFileName(pathname);
            deployHistory.setFileType(fileType);
            deployHistory.setFileBody(str);
            botDeployService.createHistory(deployHistory);

        } catch (Exception e) {
            LOGGER.error(e.getMessage());
        }

        return pathname;
    }

    /**
     * 디렉토리가 있는지 확인 후 없으면 생성한다.
     *
     * @param dir the dir
     * @return boolean
     */
    protected boolean isValidDirectory(String dir) {
        File d = new File(dir);
        if (d.isDirectory()) {
            LOGGER.debug("해당 디렉토리가 존재합니다.");
            return true;
        } else {
            LOGGER.debug("해당 디렉토리가 없으므로 생성합니다.");
            d.mkdir();
            return true;
        }
    }


    /**
     * Sets config.
     *
     * @param config the config
     */
    public void setConfig(ConfigProperties config) {
        this.config = config;
    }

    /**
     * Sets children cache.
     *
     * @param childrenCache the children cache
     */
    public void setChildrenCache(ChildrenCache childrenCache) {
        this.childrenCache = childrenCache;
    }

    /**
     * Sets bot deploy service.
     *
     * @param botDeployService the bot deploy service
     */
    public void setBotDeployService(BotDeployService botDeployService) {
        this.botDeployService = botDeployService;
    }
}
