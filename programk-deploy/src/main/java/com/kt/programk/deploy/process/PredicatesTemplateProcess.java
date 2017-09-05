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

import com.kt.programk.common.code.AimlFileType;
import com.kt.programk.common.domain.core.AimlPred;
import com.kt.programk.common.domain.core.BotFile;
import com.kt.programk.common.domain.deploy.DeployHistory;
import com.kt.programk.common.domain.deploy.DeployScheduler;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.logs.CLogger;
import org.apache.camel.Exchange;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Predicates XML 파일 생성
 */
public class PredicatesTemplateProcess extends AbstractTemplateProcess {
    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(PredicatesTemplateProcess.class);


    /**
     * Execute.
     *
     * @param exchange the exchange
     * @throws ApplicationException the application exception
     * @throws BizCheckedException  the biz checked exception
     */
    public void execute(Exchange exchange) throws ApplicationException, BizCheckedException {
        DeployScheduler body = exchange.getIn().getBody(DeployScheduler.class);
        CLogger.functionStart("PredicatesTemplateProcess.execute");

        //01. 해당 서비스의 StandBy 파일 명을 조회한다.
        BotFile deploy = botDeployService.findBotFile(body.getCpId(), AimlFileType.PREDICATES.getValue(), body.getSubLabel());

        if (deploy == null) {
            CLogger.error("해당 서비스의 StandBy bot 파일이 없습니다.", body.getCpId());
            throw new BizCheckedException(BizErrCode.ERR_0001, "BotFile");
        }

        CLogger.info("path = " + deploy.getPath());

        List<AimlPred> listAimlPred = botDeployService.findListAimlPred(body.getCpId());

        Map<String, Object> data = new HashMap<>();
        data.put("LIST", listAimlPred);

        isValidDirectory(deploy.getPath());
        writeFile(data, deploy.getPath() + "/" + deploy.getFileName(), "predicates.ftl");
        if (body.getId() != 9999) {
            writeHistory(data,
                    deploy.getPath() + "/" + deploy.getFileName(),
                    "predicates.ftl",
                    body.getId(),
                    AimlFileType.PREDICATES.getValue(),
                    body.getUserId(),
                    body.getCpId(),
                    body.getSubLabel());
        }
        body.getFileMap().put("pred", deploy.getPath() + "/" + deploy.getFileName());
        CLogger.infoForJson(body);
        CLogger.functionEnd(deploy.getPath() + "/" + deploy.getFileName());
    }
    
    /**
     * Clean.
     *
     * @param exchange the exchange
     * @throws ApplicationException the application exception
     * @throws BizCheckedException  the biz checked exception
     */
    public void clean(Exchange exchange) throws ApplicationException, BizCheckedException, IOException {
        DeployScheduler body = exchange.getIn().getBody(DeployScheduler.class);
        CLogger.functionStart("PredicatesTemplateProcess.clean");

        //01. 해당 서비스의 StandBy 파일 명을 조회한다.
        BotFile deploy = botDeployService.findBotFile(body.getCpId(), AimlFileType.PREDICATES.getValue(), body.getSubLabel());

        if (deploy == null) {
            CLogger.error("해당 서비스의 StandBy bot 파일이 없습니다.", body.getCpId());
            throw new BizCheckedException(BizErrCode.ERR_0001, "BotFile");
        }

        CLogger.info("path = " + deploy.getPath());

        /*******************************************************************
         * 02.빈 파일 복사
         ******************************************************************/
        InputStream stream = new ClassPathResource("conf/predicates.xml").getInputStream();
        FileUtils.copyInputStreamToFile(stream, new File(deploy.getPath() + "/" + deploy.getFileName()));
        stream.close();
        
        /*******************************************************************
         * 03.완료 처리
         ******************************************************************/
        try {
            DeployHistory deployHistory = new DeployHistory();
            deployHistory.setSchedulerId(body.getId());
            deployHistory.setFileName(deploy.getPath() + "/" + deploy.getFileName());
            deployHistory.setFileType(AimlFileType.PREDICATES.getValue());
            deployHistory.setFileBody("");
            botDeployService.createHistory(deployHistory);

        } catch (Exception e) {
            LOGGER.error(e.getMessage());
        }
        body.getFileMap().put("pred", deploy.getPath() + "/" + deploy.getFileName());
        
        CLogger.functionEnd(deploy.getPath() + "/" + deploy.getFileName());
    }
}
