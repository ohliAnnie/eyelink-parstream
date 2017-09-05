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
 * Seo Jong Hwa        2016 . 6 . 29
 */

package com.kt.programk.common.domain.deploy;

/**
 * Aiml 파일을 생성하기 위한 데이터 오브젝트
 */
public class DeployAiml {
    /**
     * 카테고리 고유번호
     */
    private int cateId;
    /**
     * AIML_MAIN 고유번호
     */
    private int id;
    /**
     * AIML 질문
     */
    private String input;
    /**
     * AIML 답변
     */
    private String reply;
    /**
     * that 고유 번호
     */
    private int thatId;
    /**
     * 이미지 URL
     */
    private String imageUrl;
    /**
     * 이미지 URL ALT
     */
    private String imageAlt;
    /**
     * link 제목
     */
    private String linkTitle;
    /**
     * link 코멘트
     */
    private String linkComment;
    /**
     * link URL
     */
    private String linkUrl;
    /**
     * 다음 추천 질문
     */
    private String recommendInput;
    /**
     * 추가적으로 내보낼 답변에 대한 질문
     */
    private String replyInput;
    /**
     * 이미지 고유 번호
     */
    private int imageId;
    /**
     * 링크 고유번호
     */
    private int linkId;
    /**
     * 다음 추천 질문 고유 번호
     */
    private int recommendId;
    /**
     * 추가적으로 내보낼 답변에 대한 질문에 대한 고유 번호
     */
    private int replyId;
    /**
     * 옵션 고유 번호
     */
    private int optionId;
    /**
     * 옵션 값
     */
    private String optionVal;
    /**
     * 옵션 순서 (1:키워드검색,2:핸드폰검색,3:이벤트)
     */
    private int optionSeq;

    /**
     * Gets image id.
     *
     * @return the image id
     */
    public int getImageId() {
        return imageId;
    }

    /**
     * Sets image id.
     *
     * @param imageId the image id
     */
    public void setImageId(int imageId) {
        this.imageId = imageId;
    }

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
     * Gets recommend id.
     *
     * @return the recommend id
     */
    public int getRecommendId() {
        return recommendId;
    }

    /**
     * Sets recommend id.
     *
     * @param recommendId the recommend id
     */
    public void setRecommendId(int recommendId) {
        this.recommendId = recommendId;
    }

    /**
     * Gets reply id.
     *
     * @return the reply id
     */
    public int getReplyId() {
        return replyId;
    }

    /**
     * Sets reply id.
     *
     * @param replyId the reply id
     */
    public void setReplyId(int replyId) {
        this.replyId = replyId;
    }

    /**
     * Gets cate id.
     *
     * @return the cate id
     */
    public int getCateId() {
        return cateId;
    }

    /**
     * Sets cate id.
     *
     * @param cateId the cate id
     */
    public void setCateId(int cateId) {
        this.cateId = cateId;
    }

    /**
     * Gets id.
     *
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * Sets id.
     *
     * @param id the id
     */
    public void setId(int id) {
        this.id = id;
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
     * Gets that id.
     *
     * @return the that id
     */
    public int getThatId() {
        return thatId;
    }

    /**
     * Sets that id.
     *
     * @param thatId the that id
     */
    public void setThatId(int thatId) {
        this.thatId = thatId;
    }

    /**
     * Gets image url.
     *
     * @return the image url
     */
    public String getImageUrl() {
        return imageUrl;
    }

    /**
     * Sets image url.
     *
     * @param imageUrl the image url
     */
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    /**
     * Gets image url alt.
     *
     * @return the image url alt
     */
    public String getImageAlt() {
        return imageAlt;
    }

    /**
     * Sets image url alt.
     *
     * @param imageAlt the image url alt
     */
    public void setImageAlt(String imageAlt) {
        this.imageAlt = imageAlt;
    }
    
    /**
     * Gets link title.
     *
     * @return the link title
     */
    public String getLinkTitle() {
        return linkTitle;
    }

    /**
     * Sets link title.
     *
     * @param linkTitle the link title
     */
    public void setLinkTitle(String linkTitle) {
        this.linkTitle = linkTitle;
    }

    /**
     * Gets link comment.
     *
     * @return the link comment
     */
    public String getLinkComment() {
        return linkComment;
    }

    /**
     * Sets link comment.
     *
     * @param linkComment the link comment
     */
    public void setLinkComment(String linkComment) {
        this.linkComment = linkComment;
    }

    /**
     * Gets link url.
     *
     * @return the link url
     */
    public String getLinkUrl() {
        return linkUrl;
    }

    /**
     * Sets link url.
     *
     * @param linkUrl the link url
     */
    public void setLinkUrl(String linkUrl) {
        this.linkUrl = linkUrl;
    }

    /**
     * Gets recommend input.
     *
     * @return the recommend input
     */
    public String getRecommendInput() {
        return recommendInput;
    }

    /**
     * Sets recommend input.
     *
     * @param recommendInput the recommend input
     */
    public void setRecommendInput(String recommendInput) {
        this.recommendInput = recommendInput;
    }

    /**
     * Gets reply input.
     *
     * @return the reply input
     */
    public String getReplyInput() {
        return replyInput;
    }

    /**
     * Sets reply input.
     *
     * @param replyInput the reply input
     */
    public void setReplyInput(String replyInput) {
        this.replyInput = replyInput;
    }

    /**
     * Gets reply.
     *
     * @return the reply
     */
    public String getReply() {
        return reply;
    }

    /**
     * Sets reply.
     *
     * @param reply the reply
     */
    public void setReply(String reply) {
        this.reply = reply;
    }

    /**
     * Gets option id.
     *
     * @return the option id
     */
    public int getOptionId() {
        return optionId;
    }

    /**
     * Sets option id.
     *
     * @param optionId the option id
     */
    public void setOptionId(int optionId) {
        this.optionId = optionId;
    }

    /**
     * Gets option val.
     *
     * @return the option val
     */
    public String getOptionVal() {
        return optionVal;
    }

    /**
     * Sets option val.
     *
     * @param optionVal the option val
     */
    public void setOptionVal(String optionVal) {
        this.optionVal = optionVal;
    }

    /**
     * Gets option seq.
     *
     * @return the option seq
     */
    public int getOptionSeq() {
        return optionSeq;
    }

    /**
     * Sets option seq.
     *
     * @param optionSeq the option seq
     */
    public void setOptionSeq(int optionSeq) {
        this.optionSeq = optionSeq;
    }
}
