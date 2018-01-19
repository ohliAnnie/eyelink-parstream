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

import com.kt.programk.common.domain.core.*;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;

import java.util.List;

/**
 * 대화 관리
 */
public interface ChatServcie {
    /**
     * 전체 개수
     *
     * @return the int
     */
    public int countAll(AimlMain aimlMain) throws ApplicationException;

    /**
     * CP별 개수
     *
     * @param cpId the cp id
     * @return the int
     */
    public int countByCpId(int cpId) throws ApplicationException, BizCheckedException;

    /**
     * 카테고리별 개수
     *
     * @param cateName the cate name
     * @return the int
     */
    public int countByCateName(String cateName) throws ApplicationException, BizCheckedException;

    /**
     * 토픽별 개수
     *
     * @param topicName the topic name
     * @return the int
     */
    public int countByTopicId(String topicName);

    /**
     * 질문별 개수
     *
     * @param input the input
     * @return the int
     */
    public int countByInput(AimlMain aimlMain) throws ApplicationException;

    /**
     * 답변별 개수
     *
     * @param reply the reply
     * @return the int
     */
    public int countByReply(String reply) throws ApplicationException, BizCheckedException;

    /**
     * 전체 목록
     *
     * @return the list
     */
    public List<AimlMain> findListAll(AimlMain aimlMain, int currentPageNo, int recordCountPerPage) throws ApplicationException;

    /**
     * 전체 다운로드 목록
     *
     * @return the list
     */
    public List<AimlMain> findDownloadListAll(AimlMain aimlMain, int currentPageNo, int recordCountPerPage) throws ApplicationException;

    /**
     * CP별 목록
     *
     * @param cpId the cp id
     * @return the list
     */
    public List<AimlMain>  findListByCpId(int cpId, int currentPageNo, int recordCountPerPage) throws ApplicationException, BizCheckedException;

    /**
     * 카테고리별 목록
     *
     * @param cateName the cate name
     * @return the list
     */
    public List<AimlMain>  findListByCateName(String cateName, int currentPageNo, int recordCountPerPage) throws ApplicationException, BizCheckedException;

    /**
     * 토픽별 목록
     *
     * @param topicName the topic name
     * @return the list
     */
    public List<AimlMain>  findListByTopicId(String topicName, int currentPageNo, int recordCountPerPage);

    /**
     * 질문별 목록
     *
     * @param input the input
     * @return the list
     */
    public List<AimlMain>  findListByInput(String input, int currentPageNo, int recordCountPerPage) throws ApplicationException, BizCheckedException;

    /**
     * 단변별 목록
     *
     * @param reply the reply
     * @return the list
     */
    public List<AimlMain>  findListByReply(String reply, int currentPageNo, int recordCountPerPage) throws ApplicationException, BizCheckedException;

    /**
     * 신규 생성
     *
     * @param aimlMain the aiml main
     * @return the int
     */
    public int create(AimlMain aimlMain) throws ApplicationException, BizCheckedException;

    /**
     * 업로드
     *
     * @param aimlMains the aiml mains
     * @return the int
     */
    public int create(List<AimlMain> aimlMains) throws ApplicationException, BizCheckedException;

    /**
     * 수정
     *
     * @param aimlMain the aiml main
     * @return the int
     */
    public int modify(AimlMain aimlMain) throws ApplicationException, BizCheckedException;

    /**
     * 삭제
     *
     * @param aimlMain the aiml main
     * @return the int
     */
    public int remove(AimlMain aimlMain) throws ApplicationException, BizCheckedException;


    /**
     * 링크 추가
     * @param aimlMain
     * @return
     */
    public void addLink(AimlMain aimlMain) throws ApplicationException, BizCheckedException;

    /**
     * 링크 추가
     * @param aimlLinks
     * @return
     */
    public int addLink(List<AimlLink> aimlLinks) throws ApplicationException, BizCheckedException;

    /**
     * 링크 목록 출력
     * @param cateId
     * @param mainId
     * @return
     */
    public List<AimlLink> findListLink(int cateId, int mainId) throws ApplicationException;

    /**
     * 링크 수정
     * @param aimlLink
     * @return
     */
    public int modifyLink(AimlLink aimlLink) throws ApplicationException, BizCheckedException;

    /**
     * 링크 삭제
     * @param cateId
     * @param mainId
     * @return
     */
    public int removeLink(int cateId, int mainId) throws ApplicationException;

    /**
     * 이미지 추가
     * @param aimlMain
     * @return
     */
    public void addImage(AimlMain aimlMain) throws ApplicationException, BizCheckedException;

    /**
     * 이미지 목록 출력
     * @param cateId
     * @param mainId
     * @return
     */
    public List<AimlImages> findListImages(int cateId, int mainId) throws ApplicationException;

    /**
     * 이미지 삭제
     * @param id
     * @return
     */
    public int removeImages(int cateId, int mainId) throws ApplicationException;
    
    /**
     * 추가 답변 등록
     * @param aimlRecommend
     * @return
     */
    public void addRecommend(AimlMain aimlMain) throws ApplicationException, BizCheckedException;

    /**
     * 추가 답변 목록 출력
     * @param cateId
     * @param mainId
     * @return
     */
    public List<AimlRecommend> findListRecommend(int cateId, int mainId) throws ApplicationException;

    /**
     * 추가 답변 수정
     * @param aimlRecommend
     * @return
     */
    public int modifyRecommend(AimlRecommend aimlRecommend) throws ApplicationException, BizCheckedException;

    /**
     * 추가 답변 삭제
     * @param cateId
     * @param mainId
     * @return
     */
    public int removeRecommend(int cateId, int mainId) throws ApplicationException;

    /**
     * 테스트 질문 추가
     *
     * @param aimlMain the aimlMain
     * @return
     */
    public void addTest(AimlMain aimlMain) throws ApplicationException, BizCheckedException;
   
    /**
     * 테스트 질문 출력
     * @param cateId
     * @param mainId
     * @return
     */
    public List<AimlTest> findListTest(int cateId, int mainId) throws ApplicationException;

    /**
     * 테스트 질문 삭제
     * @param id
     * @return
     */
    public int removeTest(int cateId, int mainId) throws ApplicationException;
    
    /**
     * 추천 질문 추가
     *
     * @param aimlMain the aimlMain
     * @return the int
     * @throws ApplicationException the application exception
     */
    public void addReply(AimlMain aimlMain) throws ApplicationException, BizCheckedException;
    
    /**
     * 추천 질문 목록 출력
     * @param cateId
     * @param mainId
     * @return
     */
    public List<AimlReply> findListReply(int cateId, int mainId) throws ApplicationException;
  
    /**
     * 추천 질문 삭제
     * @param id
     * @return
     */
    public int removeReply(int cateId, int mainId) throws ApplicationException;
    
    /**
     * 옵션 추가
     *
     * @param aimlMain the aimlMain
     * @return the int
     * @throws ApplicationException the application exception
     */
    public void addOption(AimlMain aimlMain) throws ApplicationException, BizCheckedException;
    
    /**
     * 옵션 목록 출력
     * @param cateId
     * @param mainId
     * @return
     */
    public List<AimlOption> findListOption(int cateId, int mainId) throws ApplicationException;
  
    /**
     * 옵션 삭제
     * @param id
     * @return
     */
    public int removeOption(int cateId, int mainId) throws ApplicationException;
    
    /**
     * 상세 조회
     *
     * @param id the id
     * @return aimlMain
     */
    public AimlMain findById(int id) throws ApplicationException;
    
    /**
     * 검증
     * @param subLabel
     * @param userId
     * @return
     */
    public String selectTest(int cpId, String subLabel, String userId) throws ApplicationException, BizCheckedException;
}
