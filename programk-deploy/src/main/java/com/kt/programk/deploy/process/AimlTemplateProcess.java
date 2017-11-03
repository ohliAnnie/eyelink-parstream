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

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.SortedSet;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.camel.Exchange;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.kt.programd.util.AimlValidation;
import com.kt.programk.common.code.AimlFileType;
import com.kt.programk.common.code.CategoryTopicType;
import com.kt.programk.common.code.EnabledType;
import com.kt.programk.common.domain.category.AimlCategory;
import com.kt.programk.common.domain.core.AimlMain;
import com.kt.programk.common.domain.core.BotFile;
import com.kt.programk.common.domain.deploy.DeployAiml;
import com.kt.programk.common.domain.deploy.DeployHistory;
import com.kt.programk.common.domain.deploy.DeployScheduler;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.ApplicationRuntimeException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.logs.CLogger;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.deploy.cache.ChildrenCache;
import com.kt.programk.deploy.model.AimlError;
import com.kt.programk.deploy.model.AimlImagesDTO;
import com.kt.programk.deploy.model.AimlLinkDTO;
import com.kt.programk.deploy.model.AimlOptionDTO;
import com.kt.programk.deploy.model.AimlRecommendDTO;
import com.kt.programk.deploy.model.AimlReplyDTO;
import com.kt.programk.deploy.model.AimlTemplate;

/**
 * aiml 파일 생성
 */
public class AimlTemplateProcess extends AbstractTemplateProcess {
    /**
     * 카테고리 구분자
     */
    public static final String CATEGORY_GUBUN = "|";
    /**
     * 옵션 개수는 5개 까지만
     */
    public static final int OPTION_SIZE = 5;
    /**
     * topic 들여쓰기
     */
    public static final String TOPIC_TAB = "\t";
    /**
     * category 들여쓰기
     */
    public static final String CATEGORY_TAB = "\t\t";
    /**
     * pattern 들여 쓰기
     */
    public static final String PATTERN_TAB = "\t\t\t";
    /**
     * template 들여쓰기
     */
    public static final String TEMPLATE_TAB = "\t\t\t";
    /**
     * that 들여쓰기
     */
    public static final String THAT_TAB = "\t\t\t";
    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(AimlTemplateProcess.class);
    /**
     * Object To JSON
     */
    private final Gson gson = new GsonBuilder().disableHtmlEscaping().create();
    /**
     * Aiml 스키마 유효성 검증
     */
    private final AimlValidation validation = new AimlValidation();

    /**
     * Execute.
     *
     * @param exchange the exchange
     * @throws ApplicationException the application exception
     * @throws BizCheckedException  the biz checked exception
     */
    public void execute(Exchange exchange) throws ApplicationException, BizCheckedException {
        DeployScheduler body = exchange.getIn().getBody(DeployScheduler.class);
        CLogger.mainTitle("deploy_scheduler id is " + body.getId() + " Start");
        CLogger.functionStart("AimlTemplateProcess.execute");

        /*******************************************************************
         * 01.해당 서비스의 StandBy 파일 명을 조회한다.
         ******************************************************************/
        BotFile deploy = botDeployService.findBotFile(body.getCpId(), AimlFileType.AIML.getValue(), body.getSubLabel());

        if (deploy == null) {
            CLogger.error("해당 서비스의 StandBy bot 파일이 없습니다.", body.getCpId());
            throw new BizCheckedException(BizErrCode.ERR_0001, "BotFile");
        }

        CLogger.info("path = " + deploy.getPath());

        /*******************************************************************
         * 02.CP의 AIML 카테고리 목록을 조회한다.
         ******************************************************************/
        AimlCategory aimlCategory = new AimlCategory();
        aimlCategory.setCpId(body.getCpId());
        aimlCategory.setEnabled(EnabledType.ENABLE.getValue());
        List<AimlCategory> aimlCategories = botDeployService.findListCategory(aimlCategory);

        CLogger.info("category count  = " + aimlCategories.size());

        StringBuffer buffer = new StringBuffer();

        /*******************************************************************
         * 03.카테고리에 속한 Chat 파일을 조회한다.
         ******************************************************************/
        List<AimlError> aimlErrors = new ArrayList<>();

        for (AimlCategory category : aimlCategories) {
            List<DeployAiml> deployAimls = botDeployService.findListAimlMain(category.getId());

            //out join으로 인해 중복된 데이터가 있으니 사전을 만든다.
            ChatDictionary chatDictionary = new ChatDictionary(deployAimls).invoke();
            Map<Integer, AimlMain> aimlMain = chatDictionary.getAimlMain();

            if (aimlMain.size() > 0) {
                startTopic(buffer, category.getTopic(), TOPIC_TAB + "<topic name=\"" + category.getTopicName() + "\">\n");
            }

            for (Integer key : aimlMain.keySet()) {
                String temp = makeCategory(chatDictionary, key);
                try {
                    validation.isValid(temp);
                    buffer.append(temp);
                } catch (Exception e) {
                    CLogger.error(temp);
                    AimlError error = new AimlError();
                    error.setCategory(temp);
                    error.setMainId(key);
                    if (e.getMessage().length() > 128) {
                        error.setErrMsg(e.getMessage().substring(0, 128));
                    } else {
                        error.setErrMsg(e.getMessage());
                    }

                    aimlErrors.add(error);
                }
            }

            if (aimlMain.size() > 0) {
                endTopic(buffer, category.getTopic(), TOPIC_TAB + "</topic>\n");
            }
        }

        body.getFileMap().put("aiml", deploy.getPath() + "/" + deploy.getFileName());

        printError(aimlErrors);

        if (!aimlErrors.isEmpty()) {
            exchange.getIn().setHeader("error", aimlErrors);
            throw new ApplicationRuntimeException("some aiml category invalid");
        }

        Map<String, Object> data = new HashMap<>();
        data.put("data", buffer.toString());

        isValidDirectory(deploy.getPath());
        writeFile(data, deploy.getPath() + "/" + deploy.getFileName(), "aiml.ftl");

        if (body.getId() != 9999) {
            writeHistory(data, deploy.getPath() + "/" + deploy.getFileName(),
                    "aiml.ftl", body.getId(),
                    AimlFileType.AIML.getValue(),
                    body.getUserId(),
                    body.getCpId(),
                    body.getSubLabel());
        }
        CLogger.infoForJson(body);
        CLogger.functionEnd(deploy.getPath() + "/" + deploy.getFileName());
    }

    /**
     * Clean bot data.
     *
     * @param exchange the exchange
     * @throws ApplicationException the application exception
     * @throws BizCheckedException  the biz checked exception
     */
    public void clean(Exchange exchange) throws ApplicationException, BizCheckedException, IOException {
        DeployScheduler body = exchange.getIn().getBody(DeployScheduler.class);
        CLogger.mainTitle("deploy_scheduler id is " + body.getId() + " Start");
        CLogger.functionStart("AimlTemplateProcess.clean");

        /*******************************************************************
         * 01.해당 서비스의 StandBy 파일 명을 조회한다.
         ******************************************************************/
        BotFile deploy = botDeployService.findBotFile(body.getCpId(), AimlFileType.AIML.getValue(), body.getSubLabel());

        if (deploy == null) {
            CLogger.error("해당 서비스의 StandBy bot 파일이 없습니다.", body.getCpId());
            throw new BizCheckedException(BizErrCode.ERR_0001, "BotFile");
        }

        CLogger.info("path = " + deploy.getPath());

        /*******************************************************************
         * 02.빈 파일 복사
         ******************************************************************/
        InputStream stream = new ClassPathResource("testing/AIML.aiml").getInputStream();
        FileUtils.copyInputStreamToFile(stream, new File(deploy.getPath() + "/" + deploy.getFileName()));
        stream.close();
        
        /*******************************************************************
         * 03.완료 처리
         ******************************************************************/
        try {
            DeployHistory deployHistory = new DeployHistory();
            deployHistory.setSchedulerId(body.getId());
            deployHistory.setFileName(deploy.getPath() + "/" + deploy.getFileName());
            deployHistory.setFileType(AimlFileType.AIML.getValue());
            deployHistory.setFileBody("");
            botDeployService.createHistory(deployHistory);

        } catch (Exception e) {
            LOGGER.error(e.getMessage());
        }
        body.getFileMap().put("aiml", deploy.getPath() + "/" + deploy.getFileName());

        CLogger.functionEnd(deploy.getPath() + "/" + deploy.getFileName());
    }
    
    /**
     * 에러 로그 출력
     *
     * @param aimlErrors the aiml errors
     */
    private void printError(List<AimlError> aimlErrors) {
        for (int i = 0; i < aimlErrors.size(); i++) {
            CLogger.info("ERROR AIML ---------------------------------------------------------------------------");
            CLogger.info(aimlErrors.get(i).getMainId());
            CLogger.info(aimlErrors.get(i).getErrMsg());
        }
    }

    /**
     * 카테고리를 생성한다.
     *
     * @param chatDictionary the chat dictionary
     * @param key            the key
     * @return the string
     */
    private String makeCategory(ChatDictionary chatDictionary, Integer key) {
        AimlMain main = chatDictionary.getAimlMain().get(key);
        AimlTemplate template = new AimlTemplate();

        //이이지 추가
        addImage(chatDictionary.getAimlImages(), main, template);
        //다음 추천 질문 추가
        addRecommend(chatDictionary.getAimlRecommend(), main, template);
        //추가답변 추가
        addReply(chatDictionary.getAimlAppendReply(), main, template);
        //링크 추가
        addLink(chatDictionary.getAimlLink(), main, template);
        //옵션 추가
        addOption(chatDictionary.getAimlOption(), main, template);

        /**
         * 2016.08.23
         * input, that, srai 처리
         */
        replaceDoubleQuotes(template);

        StringBuffer buffer = new StringBuffer();
        buffer.append(CATEGORY_TAB + "<category>\n");
        buffer.append(PATTERN_TAB + "<pattern>" + main.getInput() + "</pattern>\n");
        if (main.getThatId() != 0) {
            buffer.append(THAT_TAB + "<that>" + main.getThatId() + "</that>\n");
        }

        buffer.append(TEMPLATE_TAB + "<template>\n");
        
        String json = gson.toJson(template);
        json = replaceBotProperty(json);
        
        buffer.append(TEMPLATE_TAB + "{" + json + "}" + main.getReply() + CATEGORY_GUBUN + main.getId() + "\n");
        buffer.append(TEMPLATE_TAB + "</template>\n");
        buffer.append(CATEGORY_TAB + "</category>\n");

        return buffer.toString();
    }

    /**
     * JSON 포맷에 위배 되는 쌍따옴표를 제거 하자
     * @param template
     */
    private void replaceDoubleQuotes(AimlTemplate template) {
        template.getImage().setUrl(replaceInput(template.getImage().getUrl()));
        template.getImage().setUrl(replaceThat(template.getImage().getUrl()));
        template.getImage().setUrl(replaceSrai(template.getImage().getUrl()));

        template.getImage().setAlt(replaceInput(template.getImage().getAlt()));
        template.getImage().setAlt(replaceThat(template.getImage().getAlt()));
        template.getImage().setAlt(replaceSrai(template.getImage().getAlt()));
        
        for(int i = 0; i < template.getUrls().size(); i++){
            template.getUrls().get(i).setUrl(replaceInput(template.getUrls().get(i).getUrl()));
            template.getUrls().get(i).setTitle(replaceInput(template.getUrls().get(i).getTitle()));
            template.getUrls().get(i).setComment(replaceInput(template.getUrls().get(i).getComment()));

            template.getUrls().get(i).setUrl(replaceThat(template.getUrls().get(i).getUrl()));
            template.getUrls().get(i).setTitle(replaceThat(template.getUrls().get(i).getTitle()));
            template.getUrls().get(i).setComment(replaceThat(template.getUrls().get(i).getComment()));

            template.getUrls().get(i).setUrl(replaceSrai(template.getUrls().get(i).getUrl()));
            template.getUrls().get(i).setTitle(replaceSrai(template.getUrls().get(i).getTitle()));
            template.getUrls().get(i).setComment(replaceSrai(template.getUrls().get(i).getComment()));
        }

        for(int i = 0; i < template.getRecommends().size(); i++){
            template.getRecommends().get(i).setInput(replaceInput(template.getRecommends().get(i).getInput()));
            template.getRecommends().get(i).setInput(replaceThat(template.getRecommends().get(i).getInput()));
            template.getRecommends().get(i).setInput(replaceSrai(template.getRecommends().get(i).getInput()));
        }

        for(int i= 0; i < template.getOptions().size(); i++){
            template.getOptions().get(i).setVal(replaceInput(template.getOptions().get(i).getVal()));
            template.getOptions().get(i).setVal(replaceThat(template.getOptions().get(i).getVal()));
            template.getOptions().get(i).setVal(replaceSrai(template.getOptions().get(i).getVal()));
        }

        for(int i= 0; i < template.getMpatterns().size(); i++){
            template.getMpatterns().get(i).setReplyInput(replaceInput(template.getMpatterns().get(i).getReplyInput()));
            template.getMpatterns().get(i).setReplyInput(replaceThat(template.getMpatterns().get(i).getReplyInput()));
            template.getMpatterns().get(i).setReplyInput(replaceSrai(template.getMpatterns().get(i).getReplyInput()));
        }
    }
    /**
     * 봇 프로퍼티 사용할 수 있도록
     * @param src
     * @return
     */
    private String replaceBotProperty(String src){
        if(src == null || "".equals(src)){
            return src;
        }

        String temp = src;

        Pattern regex = Pattern.compile("<bot name=(.?\\\".*\\\")/>");
        Matcher regexMatcher = regex.matcher(src);
        while(regexMatcher.find()){
            String find = regexMatcher.group();
            find = find.replaceAll("\\\\", "\\\\\\\\");
            temp = temp.replaceAll(find, find.replaceAll("\\\\",""));
        }

        return temp;
    }
    
    /**
     * input을 홀 따옴표로 변경
     * @param src
     * @return
     */
    private String replaceInput(String src){
        if(src == null || "".equals(src)){
            return src;
        }

        String temp = src;

        Pattern regex = Pattern.compile("(?i)<input index=\"[0-9]{1,3}\".*?/>");
        Matcher regexMatcher = regex.matcher(src);

        while(regexMatcher.find()){
            String find = regexMatcher.group();
            temp = temp.replaceAll(find, find.replaceAll("\"","'"));
        }

        return temp;
    }

    /**
     * that을 홀따옴표로 변경
     * @param src
     * @return
     */
    private String replaceThat(String src){
        if(src == null || "".equals(src)){
            return src;
        }

        String temp = src;

        Pattern regex = Pattern.compile("(?i)<input that=\"[0-9]{1,3}\".*?/>");
        Matcher regexMatcher = regex.matcher(src);

        while(regexMatcher.find()){
            String find = regexMatcher.group();
            temp = temp.replaceAll(find, find.replaceAll("\"","'"));
        }

        return temp;
    }

    /**
     * srai를 홀 따옴표로 변경
     * @param src
     * @return
     */
    private String replaceSrai(String src){
        if(src == null || "".equals(src)){
            return src;
        }

        String temp = src;

        Pattern regex = Pattern.compile("(?i)<input srai=\"[0-9]{1,3}\".*?/>");
        Matcher regexMatcher = regex.matcher(src);

        while(regexMatcher.find()){
            String find = regexMatcher.group();
            temp = temp.replaceAll(find, find.replaceAll("\"","'"));
        }

        return temp;
    }



    /**
     * 옵션 추가
     *
     * @param aimlOption the aiml option
     * @param main       the main
     * @param template   the template
     */
    private void addOption(Map<Integer, Map<Integer, AimlOptionDTO>> aimlOption, AimlMain main, AimlTemplate template) {
        if (aimlOption.containsKey(main.getId())) {
            Map<Integer, AimlOptionDTO> map = aimlOption.get(main.getId());
            List<AimlOptionDTO> aimlOptionDTOList = new ArrayList<>();

            //옵션은 5개이며 순서로 정렬 해야 한다.
            for (int i = 0; i < OPTION_SIZE; i++) {
                if (!map.containsKey(i + 1)) {
                    AimlOptionDTO aimlOptionDTO = new AimlOptionDTO();
                    aimlOptionDTO.setSeq(i + 1);
                    aimlOptionDTO.setVal("");
                    aimlOptionDTOList.add(aimlOptionDTO);
                } else {
                    aimlOptionDTOList.add(map.get(i + 1));
                }
            }

//            for (Integer id : map.keySet()) {
//                aimlOptionDTOList.add(map.get(id));
//            }

            template.setOptions(aimlOptionDTOList);
        }
    }

    /**
     * 링크 추가
     *
     * @param aimlLink the aiml link
     * @param main     the main
     * @param template the template
     */
    private void addLink(Map<Integer, Map<Integer, AimlLinkDTO>> aimlLink, AimlMain main, AimlTemplate template) {
        if (aimlLink.containsKey(main.getId())) {
            Map<Integer, AimlLinkDTO> map = aimlLink.get(main.getId());

            //2016.08.12 정렬
            SortedSet<Integer> keys = new TreeSet<Integer>(map.keySet());

            List<AimlLinkDTO> aimlLinkDTOList = new ArrayList<>();

            for (Integer id : keys) {
                aimlLinkDTOList.add(map.get(id));
            }

            template.setUrls(aimlLinkDTOList);
        }
    }

    /**
     * 추가 답변 추가
     *
     * @param aimlAppendReply the aiml append reply
     * @param main            the main
     * @param template        the template
     */
    private void addReply(Map<Integer, Map<Integer, AimlReplyDTO>> aimlAppendReply, AimlMain main, AimlTemplate template) {
        if (aimlAppendReply.containsKey(main.getId())) {
            Map<Integer, AimlReplyDTO> map = aimlAppendReply.get(main.getId());
            List<AimlReplyDTO> aimlReplyDTOList = new ArrayList<>();

            //2016.08.12 정렬
            SortedSet<Integer> keys = new TreeSet<Integer>(map.keySet());

            for (Integer id : keys) {
                aimlReplyDTOList.add(map.get(id));
            }

            template.setMpatterns(aimlReplyDTOList);
        }
    }

    /**
     * 추천 질문 추가
     *
     * @param aimlRecommend the aiml recommend
     * @param main          the main
     * @param template      the template
     */
    private void addRecommend(Map<Integer, Map<Integer, AimlRecommendDTO>> aimlRecommend, AimlMain main, AimlTemplate template) {
        if (aimlRecommend.containsKey(main.getId())) {
            Map<Integer, AimlRecommendDTO> map = aimlRecommend.get(main.getId());
            List<AimlRecommendDTO> aimlRecommendDTOList = new ArrayList<>();

            //2016.08.12 정렬
            SortedSet<Integer> keys = new TreeSet<Integer>(map.keySet());

            for (Integer id : keys) {
                aimlRecommendDTOList.add(map.get(id));
            }

            template.setRecommends(aimlRecommendDTOList);

        }
    }

    /**
     * 이미지 추가
     *
     * @param aimlImages the aiml images
     * @param main       the main
     * @param template   the template
     */
    private void addImage(Map<Integer, Map<Integer, AimlImagesDTO>> aimlImages, AimlMain main, AimlTemplate template) {
        if (aimlImages.containsKey(main.getId())) {
            Map<Integer, AimlImagesDTO> map = aimlImages.get(main.getId());
            List<AimlImagesDTO> aimlImagesDTOList = new ArrayList<>();

            //2016.08.12 정렬
            SortedSet<Integer> keys = new TreeSet<Integer>(map.keySet());

            for (Integer id : keys) {
                aimlImagesDTOList.add(map.get(id));
            }

            //이미지는 1개만
            template.setImage(aimlImagesDTOList.get(0));
        }
    }

    /**
     * 카테고리가 토픽이라면 </TOPIC>을 생성한다.
     *
     * @param buffer the buffer
     * @param topic  the topic
     * @param str    the str
     */
    private void endTopic(StringBuffer buffer, String topic, String str) {
        if (CategoryTopicType.YES.getValue().equals(topic)) {
            buffer.append(str);
        }
    }

    /**
     * 카테고리가 토픽이라면 <TOPIC>을 생성한다.
     *
     * @param buffer the buffer
     * @param topic  the topic
     * @param str    the str
     */
    private void startTopic(StringBuffer buffer, String topic, String str) {
        if (CategoryTopicType.YES.getValue().equals(topic)) {
            buffer.append(str);
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
     * 사전을 만듬
     */
    private class ChatDictionary {
        /**
         * The Deploy aimls.
         */
        private final List<DeployAiml> deployAimls;
        /**
         * The Aiml main.
         */
        private Map<Integer, AimlMain> aimlMain;

        /******************************************************************
         * AIML 고유 번호, <이미지/링크/옵션 고유 번호,오브젝트></이미지/링크/옵션>
         */
        private Map<Integer, Map<Integer, AimlImagesDTO>> aimlImages;
        /**
         * The Aiml link.
         */
        private Map<Integer, Map<Integer, AimlLinkDTO>> aimlLink;
        /**
         * The Aiml recommend.
         */
        private Map<Integer, Map<Integer, AimlRecommendDTO>> aimlRecommend;
        /**
         * The Aiml append reply.
         */
        private Map<Integer, Map<Integer, AimlReplyDTO>> aimlAppendReply;
        /**
         * The Aiml option.
         */
        private Map<Integer, Map<Integer, AimlOptionDTO>> aimlOption;

        /**
         * Instantiates a new Chat dictionary.
         *
         * @param deployAimls the deploy aimls
         */
        public ChatDictionary(List<DeployAiml> deployAimls) {
            this.deployAimls = deployAimls;
        }

        /**
         * Gets aiml main.
         *
         * @return the aiml main
         */
        public Map<Integer, AimlMain> getAimlMain() {
            return aimlMain;
        }

        /**
         * Gets aiml images.
         *
         * @return the aiml images
         */
        public Map<Integer, Map<Integer, AimlImagesDTO>> getAimlImages() {
            return aimlImages;
        }

        /**
         * Gets aiml link.
         *
         * @return the aiml link
         */
        public Map<Integer, Map<Integer, AimlLinkDTO>> getAimlLink() {
            return aimlLink;
        }

        /**
         * Gets aiml recommend.
         *
         * @return the aiml recommend
         */
        public Map<Integer, Map<Integer, AimlRecommendDTO>> getAimlRecommend() {
            return aimlRecommend;
        }

        /**
         * Gets aiml append reply.
         *
         * @return the aiml append reply
         */
        public Map<Integer, Map<Integer, AimlReplyDTO>> getAimlAppendReply() {
            return aimlAppendReply;
        }

        /**
         * Gets aiml option.
         *
         * @return the aiml option
         */
        public Map<Integer, Map<Integer, AimlOptionDTO>> getAimlOption() {
            return aimlOption;
        }

        /**
         * Invoke chat dictionary.
         *
         * @return the chat dictionary
         */
        public ChatDictionary invoke() {
            //다음은 1개만 존재한다.
            aimlMain = new HashMap<>();

            //다음은 N개 존재한다.
            aimlImages = new HashMap<>();
            aimlLink = new HashMap<>();
            aimlRecommend = new HashMap<>();
            aimlAppendReply = new HashMap<>();
            aimlOption = new HashMap<>();

            for (DeployAiml aiml : deployAimls) {
                /*************************************
                 * AIML 메인
                 ************************************/
                if (!aimlMain.containsKey(aiml.getId())) {
                    AimlMain main = new AimlMain();
                    main.setId(aiml.getId());
                    main.setInput(aiml.getInput());
                    String reply = aiml.getReply();

                    if (reply != null && !isJavascript(reply)) {
                        //xml 특수 문자 처리
                        reply = reply.replaceAll("\n", "<html:br/>");
                        reply = reply.replaceAll("&", "&amp;");
                    }

                    main.setReply(reply);
                    main.setThatId(aiml.getThatId());
                    aimlMain.put(aiml.getId(), main);
                }

                /*************************************
                 * AIML 이미지
                 ************************************/
                String imageUrl = aiml.getImageUrl();
                String imageAlt = aiml.getImageAlt();
                if (imageUrl != null) {
                    imageUrl = imageUrl.replaceAll("&", "&amp;");
                }
                if (imageAlt != null) {
                    imageAlt = imageAlt.replaceAll("&", "&amp;");
                }
                if (aimlImages.containsKey(aiml.getId())) {
                    Map<Integer, AimlImagesDTO> dtoMap = aimlImages.get(aiml.getId());
                    if (!dtoMap.containsKey(aiml.getImageId())) {
                        AimlImagesDTO dto = new AimlImagesDTO();
                        //이미지 아이디 고유 번호로 맵 생성
                        dto.setUrl(imageUrl);
                        dto.setAlt(imageAlt);
                        dtoMap.put(aiml.getImageId(), dto);
                    }
                } else {
                    aimlImages.put(aiml.getId(), new HashMap<Integer, AimlImagesDTO>());
                    Map<Integer, AimlImagesDTO> dtoMap = aimlImages.get(aiml.getId());
                    AimlImagesDTO dto = new AimlImagesDTO();
                    dto.setUrl(imageUrl);
                    dto.setAlt(imageAlt);
                    dtoMap.put(aiml.getImageId(), dto);
                }

                /*************************************
                 * AIML LINK
                 ************************************/
                String linkUrl = aiml.getLinkUrl();
                if (linkUrl != null) {
                    linkUrl = linkUrl.replaceAll("&", "&amp;");
                }

                String linkTitle = aiml.getLinkTitle();
                if (linkTitle != null) {
                    linkTitle = linkTitle.replaceAll("&", "&amp;");
                }

                String linkComment = aiml.getLinkComment();
                if (linkComment != null) {
                    linkComment = linkComment.replaceAll("&", "&amp;");
                }

                if (aimlLink.containsKey(aiml.getId())) {
                    Map<Integer, AimlLinkDTO> dtoMap = aimlLink.get(aiml.getId());
                    if (!dtoMap.containsKey(aiml.getLinkId())) {
                        AimlLinkDTO dto = new AimlLinkDTO();
                        dto.setTitle(linkTitle);
                        dto.setUrl(linkUrl);
                        dto.setComment(linkComment);
                        dtoMap.put(aiml.getLinkId(), dto);
                    }
                } else {
                    aimlLink.put(aiml.getId(), new HashMap<Integer, AimlLinkDTO>());
                    Map<Integer, AimlLinkDTO> dtoMap = aimlLink.get(aiml.getId());
                    AimlLinkDTO dto = new AimlLinkDTO();
                    dto.setTitle(linkTitle);
                    dto.setUrl(linkUrl);
                    dto.setComment(linkComment);
                    dtoMap.put(aiml.getLinkId(), dto);
                }

                /*************************************
                 * AIML 다음 추천 질문
                 ************************************/
                String recommendInput = aiml.getRecommendInput();
                if (recommendInput != null) {
                    recommendInput = recommendInput.replaceAll("&", "&amp;");
                }

                if (aimlRecommend.containsKey(aiml.getId())) {
                    Map<Integer, AimlRecommendDTO> dtoMap = aimlRecommend.get(aiml.getId());
                    if (!dtoMap.containsKey(aiml.getRecommendId())) {
                        AimlRecommendDTO dto = new AimlRecommendDTO();
                        dto.setInput(recommendInput);
                        dtoMap.put(aiml.getRecommendId(), dto);
                    }
                } else {
                    aimlRecommend.put(aiml.getId(), new HashMap<Integer, AimlRecommendDTO>());
                    Map<Integer, AimlRecommendDTO> dtoMap = aimlRecommend.get(aiml.getId());
                    AimlRecommendDTO dto = new AimlRecommendDTO();
                    dto.setInput(recommendInput);
                    dtoMap.put(aiml.getRecommendId(), dto);
                }

                /*************************************
                 * 2개 이상의 답변을 보낼 때 추가할 질문 내역
                 ************************************/
                String replyInput = aiml.getReplyInput();
                if (replyInput != null) {
                    replyInput = replyInput.replaceAll("&", "&amp;");
                }

                if (aimlAppendReply.containsKey(aiml.getId())) {
                    Map<Integer, AimlReplyDTO> dtoMap = aimlAppendReply.get(aiml.getId());
                    if (!dtoMap.containsKey(aiml.getReplyId())) {
                        AimlReplyDTO dto = new AimlReplyDTO();
                        dto.setReplyInput(replyInput);
                        dtoMap.put(aiml.getReplyId(), dto);
                    }
                } else {
                    aimlAppendReply.put(aiml.getId(), new HashMap<Integer, AimlReplyDTO>());
                    Map<Integer, AimlReplyDTO> dtoMap = aimlAppendReply.get(aiml.getId());
                    AimlReplyDTO dto = new AimlReplyDTO();
                    dto.setReplyInput(replyInput);
                    dtoMap.put(aiml.getReplyId(), dto);
                }

                /*************************************
                 * 옵션
                 ************************************/
                if (aimlOption.containsKey(aiml.getId())) {
                    Map<Integer, AimlOptionDTO> dtoMap = aimlOption.get(aiml.getId());
                    if (!dtoMap.containsKey(aiml.getOptionId())) {
                        AimlOptionDTO dto = new AimlOptionDTO();
                        dto.setVal(aiml.getOptionVal());
                        dto.setSeq(aiml.getOptionSeq());
                        //순서를 키로 한다.
                        dtoMap.put(aiml.getOptionSeq(), dto);
                    }
                } else {
                    aimlOption.put(aiml.getId(), new HashMap<Integer, AimlOptionDTO>());
                    Map<Integer, AimlOptionDTO> dtoMap = aimlOption.get(aiml.getId());
                    AimlOptionDTO dto = new AimlOptionDTO();
                    dto.setVal(aiml.getOptionVal());
                    dto.setSeq(aiml.getOptionSeq());
                    //순서를 키로 한다.
                    dtoMap.put(aiml.getOptionSeq(), dto);
                }
            }
            return this;
        }

        /**
         * JAVASCRIPT 구문인지 확인
         *
         * @param reply the reply
         * @return boolean
         */
        private boolean isJavascript(String reply) {
            Pattern regex = Pattern.compile("(?i)<javascript>");
            Matcher regexMatcher = regex.matcher(reply);
            return regexMatcher.find();
        }
    }
}
