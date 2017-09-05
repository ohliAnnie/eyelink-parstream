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
 * Seo Jong Hwa 16. 8. 21 오전 3:19
 */

package com.kt.programk.deploy.service;

import com.google.gson.Gson;
import com.kt.programk.common.exception.ApplicationRuntimeException;
import com.kt.programk.common.wo.ProgramkResponse;
import com.kt.programk.common.wo.Urls;
import com.kt.programk.deploy.model.AimlLinkDTO;
import com.kt.programk.deploy.model.AimlRecommendDTO;
import com.kt.programk.deploy.model.AimlReplyDTO;
import com.kt.programk.deploy.model.AimlTemplate;
import org.aitools.programd.Core;
import org.aitools.programd.bot.Bot;
import org.aitools.programd.bot.Bots;
import org.aitools.programd.graph.Match;
import org.aitools.programd.util.DeveloperError;
import org.aitools.programd.util.InputNormalizer;
import org.aitools.programd.util.UserError;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * AIML 파일 파싱 서비스
 * api, cms 에서 공통으로 사용하기 위해..
 */
public class DeployService {
    /**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(DeployService.class);
    /**
     * 카테고리 아이디 패턴(로그에 저장할 패턴)
     */
    public static final String CATEGORY_PATTERN = "[|][0-9a-zA-Z]{10}$";

    /**
     * Srai인 경우 여러개 올수있으므로 제거해야 한다.
     */
    public static final String CATEGORY_SRAI_PATTERN = "[|][0-9a-zA-Z]{10}";
    /**
     * 템플릿 패턴
     */
    public static final String TEMPLATE_PATTERN = "(?>\\{\\{.*?\\}\\})";
    /**
     * JSON 변환
     */
    private final Gson gson = new Gson();

    /**
     * The Core.
     */
    private Core core;

    /**
     * 생성자
     *
     * @param core the core
     */
    public DeployService(Core core) {
        this.core = core;
    }

    /**
     * programk에서 실제 서비스 중인 봇인지
     *
     * @param activeBotid the active botid
     */
    public void isCoreRunningBot(String activeBotid) {
        Bot programDBot;
        if (this.core != null) {
            Bots bots = this.core.getBots();
            if (bots != null && bots.getCount() > 0) {
                try {
                    programDBot = bots.getBot(activeBotid);
                    LOG.info("programDBot= " + programDBot);
                } catch (DeveloperError e) {
                    throw new ApplicationRuntimeException(activeBotid + " is invalid");
                } catch (UserError e) {
                    throw new ApplicationRuntimeException("user error", e);
                }
            } else {
                throw new ApplicationRuntimeException("programk is not active");
            }
        }
    }


    /**
     * 재귀 호출 = rootNode가 false이면 재귀 호출 하지 않는다.
     *
     * @param programkResponses the programk responses
     * @param chat              the chat
     * @param user              the user
     * @param activeBotid       the active botid
     * @param rootNode          the root node
     * @param matches           the matches
     * @return 카테고리 아이디
     */
    public String makeResponse(List<ProgramkResponse> programkResponses, String chat, String user, String activeBotid, boolean rootNode, List<Match> matches) {
        ProgramkResponse programkResponse = new ProgramkResponse();
        String response;
        String category;

        try {
            if (matches == null) {
                response = this.core.getResponse(chat, user, activeBotid);
            } else {
                response = this.core.getResponse(chat, user, activeBotid, matches);
            }
            LOG.info("core response ===============================================================");
            LOG.info(response);
        } catch (DeveloperError e1) {
            LOG.error(e1.getMessage(), e1);
            throw new ApplicationRuntimeException("developer error", e1);
        } catch (UserError e2) {
            LOG.error(e2.getMessage(), e2);
            throw new ApplicationRuntimeException("user error", e2);
        }

        //답변이 없는 경우는 없어야 한다.
        if ("".equals(response)) {
            return "";
        } else {
            //html tag remove
            response = response.replaceAll(" xmlns=\"http://www.w3.org/1999/xhtml\"", "");
        }

        String tempStr = response;

        List<String> resultList = new ArrayList<>();

        Pattern regex = Pattern.compile(TEMPLATE_PATTERN);
        Matcher regexMatcher = regex.matcher(response);

        //srai인 경우 여러개 올수 있다.
        while ((regexMatcher.find())) {
            resultList.add(regexMatcher.group());
        }

        //srai인 경우 템플릿이 2개이다.
        List<AimlTemplate> aimlTemplates = new ArrayList<>();

        for (String data : resultList) {
            //양끝의 {{ }}을 제거한다.
            String temp = data.substring(1, data.length() - 1);
            AimlTemplate aimlTemplate = gson.fromJson(temp, AimlTemplate.class);
            aimlTemplates.add(aimlTemplate);
        }

        tempStr = tempStr.replaceAll(regex.pattern(), "");
        category = findCategory(tempStr);
        programkResponse.setBody(tempStr.replaceAll(CATEGORY_SRAI_PATTERN, ""));

        //srai 병합
        //array로 표현되어야 할 것들
        ArrayList<String> images = new ArrayList<>();
        ArrayList<String> alts = new ArrayList<>();
        ArrayList<Urls> urls = new ArrayList<>();
        ArrayList<String> responses = new ArrayList<>();

        //확장 필드 5개 추가
        ArrayList<String> option1 = new ArrayList<>();
        ArrayList<String> option2 = new ArrayList<>();
        ArrayList<String> option3 = new ArrayList<>();
        ArrayList<String> option4 = new ArrayList<>();
        ArrayList<String> option5 = new ArrayList<>();

        for (AimlTemplate aimlTemplate : aimlTemplates) {

            if (aimlTemplate.getImage() != null &&
                    aimlTemplate.getImage().getUrl() != null &&
                    !"".equals(aimlTemplate.getImage().getUrl())) {
                images.add(aimlTemplate.getImage().getUrl());
                alts.add(aimlTemplate.getImage().getAlt());
            }

            if (aimlTemplate.getUrls().size() > 0) {
                for (AimlLinkDTO aimlLinkDTO : aimlTemplate.getUrls()) {
                    if (aimlLinkDTO.getUrl() != null && !"".equals(aimlLinkDTO.getUrl())) {
                        Urls url = new Urls();
                        url.setTitle(aimlLinkDTO.getTitle());
                        url.setUrl(aimlLinkDTO.getUrl());
                        url.setComment(aimlLinkDTO.getComment());
                        urls.add(url);
                    }
                }
            }

            if (aimlTemplate.getRecommends() != null) {
                for (AimlRecommendDTO aimlRecommendDTO : aimlTemplate.getRecommends()) {
                    if (aimlRecommendDTO.getInput() != null && !"".equals(aimlRecommendDTO.getInput())) {
                        responses.add(aimlRecommendDTO.getInput());
                    }
                }
            }

            if (aimlTemplate.getOptions() != null) {
                for (int i = 0; i < aimlTemplate.getOptions().size(); i++) {
                    switch (i) {
                        case (0):
                            if (aimlTemplate.getOptions().get(i).getVal() != null && !"".equals(aimlTemplate.getOptions().get(i).getVal())) {
                                option1.add(aimlTemplate.getOptions().get(i).getVal());
                            }
                            break;
                        case (1):
                            if (aimlTemplate.getOptions().get(i).getVal() != null && !"".equals(aimlTemplate.getOptions().get(i).getVal())) {
                                option2.add(aimlTemplate.getOptions().get(i).getVal());
                            }
                            break;
                        case (2):
                            if (aimlTemplate.getOptions().get(i).getVal() != null && !"".equals(aimlTemplate.getOptions().get(i).getVal())) {
                                option3.add(aimlTemplate.getOptions().get(i).getVal());
                            }
                            break;
                        case (3):
                            if (aimlTemplate.getOptions().get(i).getVal() != null && !"".equals(aimlTemplate.getOptions().get(i).getVal())) {
                                option4.add(aimlTemplate.getOptions().get(i).getVal());
                            }
                            break;
                        case (4):
                            if (aimlTemplate.getOptions().get(i).getVal() != null && !"".equals(aimlTemplate.getOptions().get(i).getVal())) {
                                option5.add(aimlTemplate.getOptions().get(i).getVal());
                            }
                            break;
                        default:
                            LOG.info("확장 필드는 5개까지만 지원 합니다.");
                    }
                }
            }
        }//End For

        programkResponse.setImage(images.toArray(new String[0]));
        programkResponse.setAlt(alts.toArray(new String[0]));
        programkResponse.setResponses(responses.toArray(new String[0]));
        programkResponse.setUrls(urls.toArray(new Urls[0]));
        programkResponse.setOption1(option1.toArray(new String[0]));
        programkResponse.setOption2(option2.toArray(new String[0]));
        programkResponse.setOption3(option3.toArray(new String[0]));
        programkResponse.setOption4(option4.toArray(new String[0]));
        programkResponse.setOption5(option5.toArray(new String[0]));

        programkResponses.add(programkResponse);

        /**
         * 추가할 질문 내역이 있으면 재귀 호출을 한다.
         */
        for (AimlTemplate aimlTemplate : aimlTemplates) {
            if (rootNode && aimlTemplate.getMpatterns() != null) {
                for (AimlReplyDTO aimlReplyDTO : aimlTemplate.getMpatterns()) {
                    if (aimlReplyDTO.getReplyInput() != null && !"".equals(aimlReplyDTO.getReplyInput())) {
                        makeResponse(programkResponses, aimlReplyDTO.getReplyInput(), user, activeBotid, false, matches);
                    }
                }
            }
        }//End For

        return category;
    }

    /**
     * 카테고리 아이디를 찾는다.
     *
     * @param tempStr the temp str
     * @return string
     */
    private String findCategory(String tempStr) {
        Pattern regex = Pattern.compile(CATEGORY_SRAI_PATTERN);
        Matcher regexMatcher = regex.matcher(tempStr);
        StringBuffer buf = new StringBuffer();

        while ((regexMatcher.find())) {
            buf.append(regexMatcher.group());
        }

        return buf.toString();
    }

    /**
     * 마지막 카테고리를 구한다.
     *
     * @param tempStr the temp str
     * @return string
     */
    public String findLastCategory(String tempStr) {
        Pattern regex = Pattern.compile(CATEGORY_PATTERN);
        Matcher regexMatcher = regex.matcher(tempStr);
        String category = "";

        while ((regexMatcher.find())) {
            category = regexMatcher.group();
            if (category != null) {
                break;
            }
        }

        if(category != null){
            category = category.replaceAll("\\|", "");
        }
        return category;
    }

    /**
     * AIML 봇을 리로드 한다.
     */
    public void loadBots(){
        this.core.loadBot(core.getSettings().getStartupFilePath());
    }


    /**
     * AIML 봇을 언로드 한다
     *
     * @param sublabel the sublabel
     */
    public void unLoadBots(String sublabel){
        this.core.unloadBot(sublabel);
    }

    /**
     * 전처리 결과를 전달한다.
     * @param input
     * @param botid
     * @return
     */
    public String getSubs(String input, String botid){
        Bot bot = core.getBot(botid);

        if(bot != null) {
            return InputNormalizer.patternFitIgnoreCase(bot.applyInputSubstitutions(input));
        }else {
            return input;
        }
    }
}
