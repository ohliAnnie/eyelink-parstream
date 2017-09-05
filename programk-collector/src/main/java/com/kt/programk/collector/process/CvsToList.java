/*
 *  Copyright (c) 2016 KT, Inc.
 *  All right reserved.
 *  This software is the confidential and proprietary information of KT
 *  , Inc. You shall not disclose such Confidential Information and
 *  shall use it only in accordance with the terms of the license agreement
 *  you entered into with KT.
 *
 *  Revision History
 *  Author Date Description
 *  ------------------ -------------- ------------------
 *  Seo Jong Hwa 16. 8. 19 오후 6:24
 *
 *
 */

package com.kt.programk.collector.process;

import com.kt.programk.common.domain.category.AimlCategory;
import com.kt.programk.common.domain.core.AimlMain;
import com.kt.programk.common.domain.stat.ChatLog;
import com.kt.programk.common.logs.CLogger;
import com.kt.programk.common.repository.stat.ChatLogMapper;
import com.kt.programk.common.repository.stat.ClickStatMapper;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * CSV 포맷으로 변경한다.
 */
public class CvsToList implements Processor {
    /**
     * 필드 개수
     */
    public static final int ROW_FIELD_SIZE = 6;
    /**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(CvsToList.class);
    /**
     * 로그 데이터 포맷
     */
    private static final SimpleDateFormat transFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    /**
     * The Tb calculated dAO.
     */
    private final ChatLogMapper chatLogMapper;
    /**
     * 통계용 쿼리
     */
    private final ClickStatMapper clickStatMapper;

    /**
     * Instantiates a new Cvs to list.
     *
     * @param chatLogMapper the tb calculated dAO
     */
    public CvsToList(ChatLogMapper chatLogMapper, ClickStatMapper clickStatMapper) {
        this.chatLogMapper = chatLogMapper;
        this.clickStatMapper = clickStatMapper;
    }

    /**
     * Process void.
     *
     * @param exchange the exchange
     * @throws Exception the exception
     */
    @Override
    public void process(Exchange exchange) throws ParseException {
        CLogger.mainTitle("CvsToList.process");
        List<List<String>> data = (List<List<String>>) exchange.getIn().getBody();

        //카테고리 해시맵
        HashMap<Integer, String> categoryMap = new HashMap<>();
        List<AimlCategory> aimlCategories = clickStatMapper.selectCategoryNameByStat();
        for (AimlCategory aimlCategory : aimlCategories) {
            categoryMap.put(aimlCategory.getId(), aimlCategory.getName());
        }

        //Aiml 해시맵
        HashMap<String, String> aimlMap = new HashMap<>();
        List<AimlMain> aimlMains = clickStatMapper.selectAimlNameByStat();
        for (AimlMain aimlMain : aimlMains) {
            aimlMap.put(String.valueOf(aimlMain.getId()), aimlMain.getInput());
        }

        //데이터베이스 배치 입력 맵
        HashMap<String, Object> param = new HashMap<>();

        List<ChatLog> chatLogs = new ArrayList<>();

        int count = 0;

        /**
         * 날짜
         * 사용자가 입력한 질문
         * 사용자 아이디
         * 응답값
         * 카테고리
         * 봇아디
         */
        for (List<String> line : data) {

            if (line.size() != ROW_FIELD_SIZE){
                continue;
            }

            ChatLog record = new ChatLog();

            String created = line.get(0);
            String userInput = line.get(1);
            userInput = removeUserName(userInput);
            String userId = line.get(2);
            String reply = line.get(3);
            String category = line.get(4);
            String botid = line.get(5);

            if (created != null && created.length() == 19) {
                record.setCreated(transFormat.parse(created));
            } else {
                //포맷이 잘못되었으니 수집 날짜를 넣는다.
                record.setCreated(new Date());
            }

            if (userInput != null && userInput.length() > ChatLog.MAX_LENGTH_USER_INPUT) {
                userInput = userInput.substring(0, ChatLog.MAX_LENGTH_USER_INPUT - 1);
            }

            record.setUserInput(userInput);

            if (userId != null && userId.length() > ChatLog.MAX_LENGTH_USER_ID) {
                userId = userId.substring(0, ChatLog.MAX_LENGTH_USER_ID - 1);
            }

            record.setUserId(userId);
            record.setReply(reply);
            /*******************************************
             * 사용자 입력 값을 구한다.
             *******************************************/
            if (category != null && !"".equals(category)) {
                if (aimlMap.containsKey(category)) {
                    record.setInput(aimlMap.get(category));
                } else {
                    record.setInput("None");

                }
            } else {
                record.setInput("None");
            }

            record.setCpLabel(botid);

            /*******************************************
             *카테고리 아이디를 구한다.
             *******************************************/
            int cateId = 0;
            if (category != null && !"".equals(category)) {
                cateId = Integer.valueOf(category);

                if (categoryMap.containsKey(cateId)) {
                    record.setCateName(categoryMap.get(cateId));
                } else {
                    record.setCateName("None");
                }
            } else {
                record.setCateName("None");
            }

            chatLogs.add(record);
            count++;
        }

        try {
            param.put("list", chatLogs);
            chatLogMapper.insertBatch(param);
        } catch (DataAccessException ex) {
            LOG.error(ex.getMessage());
        }
        CLogger.info("총 레코드 건수 : " + count);
        CLogger.functionEnd();
    }

    /**
     * 사용자 이름을 제거 한다.
     * @param userInput
     * @return
     */
    private String removeUserName(String userInput) {
        String botRegex = "(플러스 검색 INTRO NAME).*";
        Pattern pattern = Pattern.compile(botRegex);
        Matcher matcher = pattern.matcher(userInput);

        if (matcher.matches()) {
            return matcher.group(1);
        }else{
            return userInput;
        }
    }
}
