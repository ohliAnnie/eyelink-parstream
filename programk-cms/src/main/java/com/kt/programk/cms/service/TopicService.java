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

import com.kt.programk.common.domain.core.AimlTopic;
import com.kt.programk.common.exception.ApplicationException;

import java.util.List;

/**
 * 토픽 서비스
 */
public interface TopicService {
    /**
     * 검색 서비스 조건 총 개수
     *
     * @param cateId the cate id
     * @return the int
     */
    public int countByCateId(int cateId) throws ApplicationException;

    /**
     * 토픽 목록 출력
     *
     * @param cateId             the cate id
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     */
    public List<AimlTopic> findListByCateId(int cateId, int currentPageNo, int recordCountPerPage) throws ApplicationException;

    /**
     * 상세 보기
     * @param cateId
     * @param id
     * @return
     */
    public AimlTopic findById(int cateId, int id) throws ApplicationException;

    /**
     * 신규 생성
     *
     * @param aimlTopic the aiml topic
     * @return the int
     */
    public int create(AimlTopic aimlTopic) throws ApplicationException;

    /**
     * 업로드
     *
     * @param aimlTopics the aiml topics
     * @return the int
     */
    public int create(List<AimlTopic> aimlTopics) throws ApplicationException;


    /**
     * 수정
     * @param aimlTopic
     * @return
     */
    public int modify(AimlTopic aimlTopic) throws ApplicationException;

    /**
     * 삭제
     *
     * @param cateId the cate id
     * @param id     the id
     * @return the int
     */
    public int remove(int cateId, int id) throws ApplicationException;

}
