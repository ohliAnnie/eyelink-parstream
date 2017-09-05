/*
 *  Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
package com.kt.programk.cms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kt.programk.cms.service.TopicService;
import com.kt.programk.common.domain.core.AimlTopic;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.CommonCode;
import com.kt.programk.common.exception.ErrorCode;
import com.kt.programk.common.repository.core.AimlTopicMapper;
import com.kt.programk.common.utils.DbExceptionUtil;

/**
 * Created by Administrator on 2016-06-21.
 */
@Service
public class TopicServiceImpl implements TopicService {
    /**
     * The Topic mapper.
     */
    @Autowired
    private AimlTopicMapper topicMapper;

    /**
     * 검색 서비스 조건 총 개수
     *
     * @param cateId the cate id
     * @return the int
     */
    @Override
    public int countByCateId(int cateId) throws ApplicationException {
        int count = 0;
        AimlTopic topic = new AimlTopic();
        topic.setCateId(cateId);
        try {
            count = topicMapper.countByCateId(topic);
        }catch (DataAccessException ex) {
            ErrorCode errorCode = DbExceptionUtil.parseException(ex);
            throw new ApplicationException(String.valueOf(errorCode.getNumber()), ex);
        }

        return count;
    }

    /**
     * 토픽 목록 출력
     *
     * @param cateId             the cate id
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     */
    @Override
    public List<AimlTopic> findListByCateId(int cateId, int currentPageNo, int recordCountPerPage) throws ApplicationException {
        AimlTopic topic = new AimlTopic();
        topic.setCateId(cateId);
        topic.setRecordCountPerPage(recordCountPerPage);
        topic.setFirstRecordIndex((currentPageNo - 1) * recordCountPerPage);

        List<AimlTopic> aimlTopics;

        try {
            aimlTopics = topicMapper.selectList(topic);
        }catch (DataAccessException ex) {
            ErrorCode errorCode = DbExceptionUtil.parseException(ex);
            throw new ApplicationException(String.valueOf(errorCode.getNumber()), ex);
        }
        return aimlTopics;
    }

    /**
     * 상세 보기
     *
     * @param cateId
     * @param id
     * @return
     */
    @Override
    public AimlTopic findById(int cateId, int id) throws ApplicationException {
        AimlTopic topic = new AimlTopic();
        topic.setCateId(cateId);
        topic.setId(id);

        AimlTopic result;
        try {
            result = topicMapper.selectByPrimaryKey(topic);
        }catch (DataAccessException ex){
            ErrorCode errorCode = DbExceptionUtil.parseException(ex);
            throw new ApplicationException(String.valueOf(errorCode.getNumber()), ex);
        }
        return result;
    }

    /**
     * 신규 생성
     *
     * @param aimlTopic the aiml topic
     * @return the int
     */
    @Override
    @Transactional
    public int create(AimlTopic aimlTopic) throws ApplicationException {
        isValid(aimlTopic);

        try {
            return topicMapper.insert(aimlTopic);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    private void isValid(AimlTopic aimlTopic) throws ApplicationException {
        if(aimlTopic == null) {
            throw new ApplicationException(String.valueOf(CommonCode.COM_VALUE_VALIDATE_ERROR.getNumber()));
        }else if(aimlTopic.getCateId() == 0){
            throw new ApplicationException(String.valueOf(CommonCode.COM_VALUE_VALIDATE_ERROR.getNumber()));
        }else if(aimlTopic.getName() == null){
            throw new ApplicationException(String.valueOf(CommonCode.COM_VALUE_VALIDATE_ERROR.getNumber()));
        }else if("".equals(aimlTopic.getName())){
            throw new ApplicationException(String.valueOf(CommonCode.COM_VALUE_VALIDATE_ERROR.getNumber()));
        }
    }

    /**
     * 업로드
     *
     * @param aimlTopics the aiml topics
     * @return the int
     */
    @Override
    @Transactional
    public int create(List<AimlTopic> aimlTopics) throws ApplicationException {
        if(aimlTopics == null){
            throw new ApplicationException(String.valueOf(CommonCode.COM_VALUE_VALIDATE_ERROR.getNumber()));
        }
        if(aimlTopics.size() == 0) {
            return 0;
        }

        int sum = 0;

        for(AimlTopic aimlTopic : aimlTopics){
            isValid(aimlTopic);
            topicMapper.insert(aimlTopic);
            sum += 1;
        }

        return sum;
    }


    /**
     * 수정
     * @param aimlTopic
     * @return
     */
    @Override
    @Transactional
    public int modify(AimlTopic aimlTopic) throws ApplicationException {
        isValid(aimlTopic);
        try {
            return topicMapper.updateByPrimaryKeySelective(aimlTopic);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * 삭제
     *
     * @param cateId the cate id
     * @param id     the id
     * @return the int
     */
    @Override
    @Transactional
    public int remove(int cateId, int id) throws ApplicationException {
        AimlTopic aimlTopic = new AimlTopic();
        aimlTopic.setCateId(cateId);
        aimlTopic.setId(id);
        try {
            return topicMapper.deleteByPrimaryKey(aimlTopic);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }
}
