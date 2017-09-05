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
 *  Seo Jong Hwa 16. 8. 19 오후 6:10
 *
 *
 */

package com.kt.programk.redis.route;

import com.google.gson.Gson;
import com.kt.programk.common.domain.core.AimlPredicate;
import com.kt.programk.common.logs.CLogger;
import com.kt.programk.common.data.repository.db.PredicateRepository;
import com.kt.programk.common.db.domain.PredicateDTO;
import com.kt.programk.common.repository.core.AimlPredicateMapper;
import com.kt.programk.common.utils.DbExceptionUtil;
import org.aitools.programd.multiplexor.NoSuchPredicateException;
import org.aitools.programd.multiplexor.PredicateMap;
import org.aitools.programd.multiplexor.PredicateValue;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Administrator on 2016-07-27.
 */
public class BackupRoute extends RouteBuilder {

    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(BackupRoute.class);
    /**
     * JSON TO OBJECT
     */
    private final Gson gson = new Gson();
    /**
     * 스레드 개수
     */
    private String thread;
    /**
     * REDIS 레파지토리 조회
     */
    private PredicateRepository predicateRepository;
    /**
     * AIML 레파지토리 조회
     */
    private AimlPredicateMapper aimlPredicateMapper;

    /**
     * Configure.
     */
    @Override
    public void configure() {
        from("seda:backup?concurrentConsumers=" + thread)
                .process(new Processor() {
                    @Override
                    public void process(Exchange exchange) throws NoSuchPredicateException {
                        String message = exchange.getIn().getBody(String.class);
                        CLogger.functionStart("BACKUP USER : " + message);
                        LOGGER.info("Create New Tasks : " + message);
                        if (message != null) {
                            String str = message.replace("PREDICATE_", "");
                            if (str != null) {
                                LOGGER.info("key = " + str);

                                String botid = findBot(str);
                                if (botid == null) {
                                    CLogger.error("Not Found botid = " + botid);
                                    return;
                                }
                                String userid = str.replace(botid + "_", "");

                                PredicateDTO dto = new PredicateDTO();
                                dto.setUserid(userid);
                                dto.setBotid(botid);

                                CLogger.info(dto.getKey());
                                PredicateDTO predicateDTO = predicateRepository.get(dto);

                                if (predicateDTO == null) {
                                    CLogger.info("해당되는 데이터가 REDIS 서버에 없습니다.");
                                    return;
                                } else {
                                    //삭제하고 입력
                                    predicateRepository.delete(predicateDTO);
                                    if (predicateDTO.getPredicateMap() != null) {
                                        PredicateMap userPredicates = gson.fromJson(predicateDTO.getPredicateMap(), PredicateMap.class);
                                        int saveItemCount = 0;
                                        for (String name : userPredicates.keySet()) {
                                            PredicateValue value = userPredicates.get(name);
                                            insertUserPredicate(saveItemCount, dto.getBotid(), dto.getUserid(), name, value);
                                        }
                                    }
//                                    predicateRepository.delete(predicateDTO);
                                    CLogger.functionEnd("Success Delete " + predicateDTO.getKey());
                                }
                            }
                        } else {
                            LOGGER.error("message is zero : " + message);
                        }
                    }
                });

    }

    /**
     * 봇아이디를 구한다.
     *
     * @param message the message
     * @return string
     */
    private String findBot(String message) {
        String botRegex = "(?>(^.*?)_).*";
        Pattern pattern = Pattern.compile(botRegex);
        Matcher matcher = pattern.matcher(message);

        String botId = null;
        if (matcher.matches()) {
            botId = matcher.group(1);
        }

        return botId;
    }

    /**
     * 데이터 베이스 저장
     *
     * @param saveItemCount the save item count
     * @param botid         the botid
     * @param userid        the userid
     * @param name          the name
     * @param value         the value
     * @return int
     */
    private int insertUserPredicate(int saveItemCount, String botid, String userid, String name, PredicateValue value) {
        int totalCnt = 0;
        // Save single-valued predicates.
        if (!value.isMultiValued()) {
            String singleValue = value.getFirstValue();

            AimlPredicate aimlPredicate = new AimlPredicate();
            aimlPredicate.setName(name);
            aimlPredicate.setVal(singleValue);
            aimlPredicate.setUserid(userid);
            aimlPredicate.setBotid(botid);
            try {
                AimlPredicate select = aimlPredicateMapper.selectByPrimaryKey(aimlPredicate);
                if (select == null) {
                    aimlPredicateMapper.insert(aimlPredicate);
                } else {
                    aimlPredicateMapper.updateByPrimaryKeySelective(aimlPredicate);
                }
            } catch (DataAccessException ex) {
                LOGGER.error(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
            }
            totalCnt++; //sspark
        }
        // Save indexed predicates.
        else {
            // Try to get this as an indexed predicate.
            int valueCount = value.size();

//            for (int index = valueCount; --index > 0; ) {
            for(int index = valueCount; index > 0; index--){
                // Do not save default values.
                String aValue = value.get(index);
                AimlPredicate aimlPredicate = new AimlPredicate();
                aimlPredicate.setName(name + '.' + index);
                aimlPredicate.setVal(aValue);
                aimlPredicate.setUserid(userid);
                aimlPredicate.setBotid(botid);
                try {
                    AimlPredicate select = aimlPredicateMapper.selectByPrimaryKey(aimlPredicate);
                    if (select == null) {
                        aimlPredicateMapper.insert(aimlPredicate);
                    } else {
                        aimlPredicateMapper.updateByPrimaryKeySelective(aimlPredicate);
                    }
                } catch (DataAccessException ex) {
                    LOGGER.error(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
                }
                totalCnt++;
            }

        }
        return totalCnt;
    }

    /**
     * Sets thread.
     *
     * @param thread the thread
     */
    public void setThread(String thread) {
        this.thread = thread;
    }

    /**
     * Sets predicate repository.
     *
     * @param predicateRepository the predicate repository
     */
    public void setPredicateRepository(PredicateRepository predicateRepository) {
        this.predicateRepository = predicateRepository;
    }

    /**
     * Sets aiml predicate mapper.
     *
     * @param aimlPredicateMapper the aiml predicate mapper
     */
    public void setAimlPredicateMapper(AimlPredicateMapper aimlPredicateMapper) {
        this.aimlPredicateMapper = aimlPredicateMapper;
    }
}
