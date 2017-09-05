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

package com.kt.programk.deploy.process;

import com.kt.programk.common.code.AimlFileType;
import com.kt.programk.common.domain.core.AimlSubs;
import com.kt.programk.common.domain.core.BotFile;
import com.kt.programk.common.domain.deploy.DeployHistory;
import com.kt.programk.common.domain.deploy.DeployScheduler;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.ApplicationRuntimeException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.logs.CLogger;
import com.kt.programk.deploy.model.AimlError;
import org.apache.camel.Exchange;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.UnknownHostException;
import java.util.*;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

/**
 * 전처리 XML 파일 생성
 */
public class SubstitutionsTemplateProcess extends AbstractTemplateProcess {
    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(SubstitutionsTemplateProcess.class);


    /**
     * Execute.
     *
     * @param exchange the exchange
     * @throws ApplicationException the application exception
     * @throws BizCheckedException  the biz checked exception
     */
    public void execute(Exchange exchange) throws ApplicationException, BizCheckedException {
        DeployScheduler body = exchange.getIn().getBody(DeployScheduler.class);
        CLogger.functionStart("SubstitutionsTemplateProcess.execute");
        //01. 해당 서비스의 StandBy 파일 명을 조회한다.
        BotFile deploy = botDeployService.findBotFile(body.getCpId(), AimlFileType.SUBSTITUTIONS.getValue(), body.getSubLabel());

        if (deploy == null) {
            CLogger.error("해당 서비스의 StandBy bot 파일이 없습니다.", body.getCpId());
            throw new BizCheckedException(BizErrCode.ERR_0001, "BotFile");
        }

        CLogger.info("path = " + deploy.getPath());

        List<AimlSubs> aimlSubses = botDeployService.findListAimlSubs(body.getCpId());

        List<AimlError> aimlErrors = new ArrayList<>();

        //단어 앞뒤 공백 추가
        for(AimlSubs aimlsubs : aimlSubses){
            if(aimlsubs.getReplace() != null){
                aimlsubs.setReplace(" " + aimlsubs.getReplace());
            }

            //검증 추가
            if(aimlsubs.getFind() != null){
                try {
                    Pattern.compile(aimlsubs.getFind(), Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
                }catch (PatternSyntaxException e){
                    CLogger.error("Invalid substitution pattern \"" + aimlsubs.getFind() + "\"." + e.getMessage());
                    AimlError aimlError= new AimlError();
                    aimlError.setErrMsg(e.getMessage());
                    aimlErrors.add(aimlError);
                }
            }
        }

        if (!aimlErrors.isEmpty()) {
            exchange.getIn().setHeader("error", aimlErrors);
            throw new ApplicationRuntimeException("some substitution invalid");
        }


        Map<String, Object> data = new HashMap<>();
        data.put("LIST", aimlSubses);

        isValidDirectory(deploy.getPath());
        writeFile(data, deploy.getPath() + "/" + deploy.getFileName(), "substitutions.ftl");
        if (body.getId() != 9999) {
            writeHistory(data,
                    deploy.getPath() + "/" + deploy.getFileName(),
                    "substitutions.ftl",
                    body.getId(),
                    AimlFileType.SUBSTITUTIONS.getValue(),
                    body.getUserId(),
                    body.getCpId(),
                    body.getSubLabel());
        }
        body.getFileMap().put("subs", deploy.getPath() + "/" + deploy.getFileName());
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
        CLogger.functionStart("SubstitutionsTemplateProcess.execute");
        //01. 해당 서비스의 StandBy 파일 명을 조회한다.
        BotFile deploy = botDeployService.findBotFile(body.getCpId(), AimlFileType.SUBSTITUTIONS.getValue(), body.getSubLabel());

        if (deploy == null) {
            CLogger.error("해당 서비스의 StandBy bot 파일이 없습니다.", body.getCpId());
            throw new BizCheckedException(BizErrCode.ERR_0001, "BotFile");
        }

        CLogger.info("path = " + deploy.getPath());

        /*******************************************************************
         * 02.빈 파일 복사
         ******************************************************************/
        InputStream stream = new ClassPathResource("conf/substitutions.xml").getInputStream();
        FileUtils.copyInputStreamToFile(stream, new File(deploy.getPath() + "/" + deploy.getFileName()));
        stream.close();
        
        /*******************************************************************
         * 03.완료 처리
         ******************************************************************/
        try {
            DeployHistory deployHistory = new DeployHistory();
            deployHistory.setSchedulerId(body.getId());
            deployHistory.setFileName(deploy.getPath() + "/" + deploy.getFileName());
            deployHistory.setFileType(AimlFileType.SUBSTITUTIONS.getValue());
            deployHistory.setFileBody("");
            botDeployService.createHistory(deployHistory);

        } catch (Exception e) {
            LOGGER.error(e.getMessage());
        }
        body.getFileMap().put("subs", deploy.getPath() + "/" + deploy.getFileName());
        
        CLogger.functionEnd(deploy.getPath() + "/" + deploy.getFileName());
    }
    
    /**
     * 길이가 큰 순서로 정렬
     *
     * @param aimlSubses the aiml subses
     */
    private void sortDESC(List<AimlSubs> aimlSubses) {
        Collections.sort(aimlSubses, new Comparator<AimlSubs>() {
            public int compare(AimlSubs obj1, AimlSubs obj2) {
                // TODO Auto-generated method stub
                return (obj1.getFind().length() > obj2.getFind().length()) ? -1 : (obj1.getFind().length() > obj2.getFind().length()) ? 1 : 0;
            }

        });
    }

    /**
     * 길이가 작은 순으로 정렬
     *
     * @param aimlSubses the aiml subses
     */
    private void sortASC(List<AimlSubs> aimlSubses) {
        Collections.sort(aimlSubses, new Comparator<AimlSubs>() {
            public int compare(AimlSubs obj1, AimlSubs obj2) {
                return (obj1.getFind().length() < obj2.getFind().length()) ? -1 : (obj1.getFind().length() < obj2.getFind().length()) ? 1 : 0;
            }

        });
    }
}
