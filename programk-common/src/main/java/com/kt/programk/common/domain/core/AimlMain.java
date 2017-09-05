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

package com.kt.programk.common.domain.core;

import com.kt.programk.common.domain.PagingExample;

/**
 * AIML 대화
 */
public class AimlMain extends PagingExample{
    /**
     * The constant MAX_LENGTH_INPUT.
     */
    public final static int MAX_LENGTH_INPUT = 255;

    /**
     * 대화 카테고리 고유번호
     */
    private int cateId;
    /**
     * 고유번호(10자리)
     */
    private int id;
    /**
     * 질문
     */
    private String input;
    /**
     * 답변
     */
    private String reply;

    /**
     * 이전 답변 번호
     */
    private int thatId;
    /**
     * 이미지 url
     */
    private String imageUrl;
    /**
     * 이미지 url alt
     */
    private String imageAlt;
    /**
     * 텍스트 링크-제목
     */
    private String linkTitle;
    /**
     * 텍스트 링크-설명
     */
    private String linkComment;
    /**
     * 텍스트 링크-url
     */
    private String linkUrl;
    /**
     * 추천질문
     */
    private String recommendInput;
    /**
     * 추가답변
     */
    private String replyInput;
    /**
     * 테스트질문
     */
    private String testInput;
    /**
     * 옵션
     */
    private String[] optionInput;
    /**
     * 이전 답변 질문
     */
    private String thatInput;
    /**
     * cp id - 검색용
     */
    private int cpId;
    /**
     * 카테고리명 - 검색용
     */
    private String cateName;
    /**
     * 유저 권한
     */
    private String userAuth;
    /**
     * 유형
     */
    private String restriction;

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
     * Gets imageUrl.
     *
     * @return imageUrl the imageUrl
     */
	public String getImageUrl() {
		return imageUrl;
	}
	
	/**
     * Sets imageUrl.
     *
     * @return imageUrl the imageUrl
     */
	public void setImageAlt(String imageAlt) {
		this.imageAlt = imageAlt;
	}
	
	/**
     * Gets imageUrl.
     *
     * @return imageUrl the imageUrl
     */
	public String getImageAlt() {
		return imageAlt;
	}
	
	/**
     * Sets imageUrl.
     *
     * @return imageUrl the imageUrl
     */
	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
	
	/**
     * Gets linkTitle.
     *
     * @return linkTitle the linkTitle
     */
	public String getLinkTitle() {
		return linkTitle;
	}
	
	/**
     * Sets linkTitle.
     *
     * @return linkTitle the linkTitle
     */
	public void setLinkTitle(String linkTitle) {
		this.linkTitle = linkTitle;
	}
	
	/**
     * Gets linkComment.
     *
     * @return linkComment the linkComment
     */
	public String getLinkComment() {
		return linkComment;
	}
	
	/**
     * Sets linkComment.
     *
     * @return linkComment the linkComment
     */
	public void setLinkComment(String linkComment) {
		this.linkComment = linkComment;
	}
	
	/**
     * Gets linkUrl.
     *
     * @return linkUrl the linkUrl
     */
	public String getLinkUrl() {
		return linkUrl;
	}
	
	/**
     * Sets linkUrl.
     *
     * @return linkUrl the linkUrl
     */
	public void setLinkUrl(String linkUrl) {
		this.linkUrl = linkUrl;
	}
	
	/**
     * Gets recommendInput.
     *
     * @return recommendInput the recommendInput
     */
	public String getRecommendInput() {
		return recommendInput;
	}
	
	/**
     * Sets recommendInput.
     *
     * @return recommendInput the recommendInput
     */
	public void setRecommendInput(String recommendInput) {
		this.recommendInput = recommendInput;
	}
	
	/**
     * Gets replyInput.
     *
     * @return replyInput the replyInput
     */
	public String getReplyInput() {
		return replyInput;
	}
	
	/**
     * Sets replyInput.
     *
     * @return replyInput the replyInput
     */
	public void setReplyInput(String replyInput) {
		this.replyInput = replyInput;
	}
	
	/**
     * Gets testInput.
     *
     * @return testInput the testInput
     */
	public String getTestInput() {
		return testInput;
	}
	
	/**
     * Sets testInput.
     *
     * @return testInput the testInput
     */
	public void setTestInput(String testInput) {
		this.testInput = testInput;
	}	
	
	/**
     * Gets optionInput.
     *
     * @return optionInput the optionInput
     */
	public String[] getOptionInput() {
		return optionInput;
	}
	
	/**
     * Sets optionInput.
     *
     * @return optionInput the optionInput
     */
	public void setOptionInput(String[] optionInput) {
		this.optionInput = optionInput;
	}	
	
	/**
     * Gets thatInput.
     *
     * @return thatInput the thatInput
     */
    public String getThatInput() {
		return thatInput;
	}
    
	/**
     * Sets thatInput.
     *
     * @return thatInput the thatInput
     */
	public void setThatInput(String thatInput) {
		this.thatInput = thatInput;
	}

	/**
     * Gets cp id.
     *
     * @return cp id the cp id
     */
	public int getCpId() {
		return cpId;
	}
	
	/**
     * Sets cp id.
     *
     * @param cp id the cp id
     */
	public void setCpId(int cpId) {
		this.cpId = cpId;
	}
	
	/**
     * Gets cateName.
     *
     * @return cateName the cateName
     */
	public String getCateName() {
		return cateName;
	}
	
	/**
     * Sets cateName.
     *
     * @return cateName the cateName
     */
	public void setCateName(String cateName) {
		this.cateName = cateName;
	}

	public String getUserAuth() {
		return userAuth;
	}

	public void setUserAuth(String userAuth) {
		this.userAuth = userAuth;
	}

	public String getRestriction() {
		return restriction;
	}

	public void setRestriction(String restriction) {
		this.restriction = restriction;
	}		
}
