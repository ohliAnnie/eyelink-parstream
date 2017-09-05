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
 * Seo Jong Hwa        2016 . 7 . 12
 */

package com.kt.programk.common.domain.stat;

import com.kt.programk.common.domain.PagingExample;

import java.util.Date;

/**
 * Link URL 클릭 통계
 */
public class ClickStat extends PagingExample {
    /**
     * 사용자가 클릭한 링크의 아이디값
     */
    private int linkId;
    /**
     * 봇아이디, 서비스 아이디
     */
    private String label;
    /**
     * 인증 토큰값
     */
    private String token;
    /**
     * 사용자 구분할수 있는값(로그인아이디, 세션아이디)
     */
    private String userId;
    /**
     * 대화 내역
     */
    private String chat;
    /**
     * 생성일
     */
    private Date created;
    /**
     * 시작시간
     */
    private String startTime;
    /**
     * 종료시간
     */
    private String endTime;
    /**
     * 검색건수
     */
    private int searchCount;
    /**
     * 응답건수
     */
    private int responseCount;
    /**
     * 유니크 사용자수
     */
    private int userCount;
    /**
     * 건수
     */
    private int totalCnt;
    /**
     * 카테고리명
     */
    private String cateName;
    /**
     * 대화
     */
    private String input;
    /**
     * 질문
     */
    private String userInput;
    /**
     * 노출개수 - 파일다운로드시
     */
    private int viewCount;
    /**
     * 정렬조건
     */
    private String order;

    /**
     * Gets link id.
     *
     * @return the link id
     */
    public int getLinkId() {
        return linkId;
    }

    /**
     * Sets link id.
     *
     * @param linkId the link id
     */
    public void setLinkId(int linkId) {
        this.linkId = linkId;
    }

    /**
     * Gets label.
     *
     * @return the label
     */
    public String getLabel() {
        return label;
    }

    /**
     * Sets label.
     *
     * @param label the label
     */
    public void setLabel(String label) {
        this.label = label;
    }

    /**
     * Gets token.
     *
     * @return the token
     */
    public String getToken() {
        return token;
    }

    /**
     * Sets token.
     *
     * @param token the token
     */
    public void setToken(String token) {
        this.token = token;
    }

    /**
     * Gets user id.
     *
     * @return the user id
     */
    public String getUserId() {
        return userId;
    }

    /**
     * Sets user id.
     *
     * @param userId the user id
     */
    public void setUserId(String userId) {
        this.userId = userId;
    }

    /**
     * Gets chat.
     *
     * @return the chat
     */
    public String getChat() {
        return chat;
    }

    /**
     * Sets chat.
     *
     * @param chat the chat
     */
    public void setChat(String chat) {
        this.chat = chat;
    }

    /**
     * Gets created.
     *
     * @return the created
     */
    public Date getCreated() {
        return created;
    }

    /**
     * Sets created.
     *
     * @param created the created
     */
    public void setCreated(Date created) {
        this.created = created;
    }

    /**
     * Gets start time.
     *
     * @return the start time
     */
    public String getStartTime() {
        return startTime;
    }

    /**
     * Sets start time.
     *
     * @param startTime the start time
     */
    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    /**
     * Gets end time.
     *
     * @return the end time
     */
    public String getEndTime() {
        return endTime;
    }

    /**
     * Sets end time.
     *
     * @param endTime the end time
     */
    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    /**
     * Gets search count.
     *
     * @return the search count
     */
    public int getSearchCount() {
        return searchCount;
    }

    /**
     * Sets search count.
     *
     * @param searchCount the search count
     */
    public void setSearchCount(int searchCount) {
        this.searchCount = searchCount;
    }

    /**
     * Gets response count.
     *
     * @return the response count
     */
    public int getResponseCount() {
        return responseCount;
    }

    /**
     * Sets response count.
     *
     * @param responseCount the response count
     */
    public void setResponseCount(int responseCount) {
        this.responseCount = responseCount;
    }

    /**
     * Gets user count.
     *
     * @return the user count
     */
    public int getUserCount() {
        return userCount;
    }

    /**
     * Sets user count.
     *
     * @param userCount the user count
     */
    public void setUserCount(int userCount) {
        this.userCount = userCount;
    }

    /**
     * Gets total cnt.
     *
     * @return the total cnt
     */
    public int getTotalCnt() {
        return totalCnt;
    }

    /**
     * Sets total cnt.
     *
     * @param totalCnt the total cnt
     */
    public void setTotalCnt(int totalCnt) {
        this.totalCnt = totalCnt;
    }

    /**
     * Gets cate name.
     *
     * @return the cate name
     */
    public String getCateName() {
        return cateName;
    }

    /**
     * Sets cate name.
     *
     * @param cateName the cate name
     */
    public void setCateName(String cateName) {
        this.cateName = cateName;
    }

    /**
     * Gets input.
     *
     * @return the input
     */
    public String getInput() {
        return input;
    }

    /**
     * Sets input.
     *
     * @param input the input
     */
    public void setInput(String input) {
        this.input = input;
    }

    /**
     * Gets user input.
     *
     * @return the user input
     */
    public String getUserInput() {
        return userInput;
    }

    /**
     * Sets user input.
     *
     * @param userInput the user input
     */
    public void setUserInput(String userInput) {
        this.userInput = userInput;
    }

    /**
     * Gets view count.
     *
     * @return the view count
     */
    public int getViewCount() {
        return viewCount;
    }

    /**
     * Sets view count.
     *
     * @param viewCount the view count
     */
    public void setViewCount(int viewCount) {
        this.viewCount = viewCount;
    }

    /**
     * Gets order.
     *
     * @return the order
     */
    public String getOrder() {
        return order;
    }

    /**
     * Sets order.
     *
     * @param order the order
     */
    public void setOrder(String order) {
        this.order = order;
    }
}
