/*
 * Copyright (c) 2016 KT, Inc.
 * All right reserved.
 * This software is the confidential and proprietary information of KT
 * , Inc. You shall not disclose such Confidential Information and
 * shall use it only in accordance with the terms of the license agreement
 * you entered into with KT.
 *
 * Revision History
 * Author Date Description
 *  ------------------ -------------- ------------------
 * Seo Jong Hwa 16. 8. 30 오전 12:42
 */

package com.kt.programk.deploy.process;

import com.kt.programk.common.domain.core.AimlBots;
import com.kt.programk.common.exception.ApplicationException;
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
 * Created by redpunk on 2016-08-30.
 */
public class AimlBotsTemplateProcess extends AbstractTemplateProcess {

    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(AimlBotsTemplateProcess.class);

    /**
     * Execute.
     *
     * @param exchange the exchange
     * @throws ApplicationException the application exception
     */
    public void execute(Exchange exchange) throws ApplicationException, IOException {
        CLogger.functionStart("AimlBotsTemplate.execute");

        String botsPath = config.getString("deploy.programk.bots");

        List<AimlBots> botsList = botDeployService.findBotsPath();
        //해시맵을 만들자
        Map<String, Map<String, String>> root = new HashMap<>();

        for(AimlBots aimlBots : botsList){
            if(root.containsKey(aimlBots.getSubLabel())){
                Map<String, String> leap = root.get(aimlBots.getSubLabel());
                if(!leap.containsKey(aimlBots.getFileType())){
                    leap.put(aimlBots.getFileType(), aimlBots.getFileName());
                }
            }else{
                root.put(aimlBots.getSubLabel(), new HashMap<String, String>());
                root.get(aimlBots.getSubLabel()).put(aimlBots.getFileType(), aimlBots.getFileName());
            }

            boolean exists = new File(aimlBots.getFileName()).exists();
            isValidDirectory(config.getString("deploy.programk.path") + aimlBots.getSubLabel().replace("-01","").replace("-02",""));

            if(!exists){
                if("aiml".equals(aimlBots.getFileType())){
                    InputStream stream = new ClassPathResource("testing/AIML.aiml").getInputStream();
                    FileUtils.copyInputStreamToFile(stream, new File(aimlBots.getFileName()));
                    stream.close();
                }else if("subs".equals(aimlBots.getFileType())){
                    InputStream stream = new ClassPathResource("conf/substitutions.xml").getInputStream();
                    FileUtils.copyInputStreamToFile(stream, new File(aimlBots.getFileName()));
                    stream.close();
                }else if("prop".equals(aimlBots.getFileType())){
                    InputStream stream = new ClassPathResource("conf/properties.xml").getInputStream();
                    FileUtils.copyInputStreamToFile(stream, new File(aimlBots.getFileName()));
                    stream.close();
                }else if("pred".equals(aimlBots.getFileType())){
                    InputStream stream = new ClassPathResource("conf/predicates.xml").getInputStream();
                    FileUtils.copyInputStreamToFile(stream, new File(aimlBots.getFileName()));
                    stream.close();
                }
            }
        }

        CLogger.debugForJson(root);

        Map<String, Object> data = new HashMap<>();
        data.put("LIST", root);

        writeFile(data, botsPath, "bots.ftl");

        CLogger.functionEnd();
    }
}
