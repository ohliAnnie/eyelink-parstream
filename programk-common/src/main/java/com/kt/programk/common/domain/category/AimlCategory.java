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
 *  Seo Jong Hwa 16. 8. 22 오후 5:04
 *
 *
 */

package com.kt.programk.common.domain.category;

import com.kt.programk.common.domain.PagingExample;

import java.util.Date;

/**
 * AIML 대화 카테고리
 */
public class AimlCategory extends PagingExample{
    /**
     * The constant MAX_LENGTH_NAME.
     */
    public final static int MAX_LENGTH_NAME = 128;
    /**
     * The constant MAX_LENGTH_RESTRICTION.
     */
    public final static int MAX_LENGTH_RESTRICTION = 7;
    /**
     * The constant MAX_LENGTH_TOPIC.
     */
    public final static int MAX_LENGTH_TOPIC = 1;
    /**
     * The constant MAX_LENGTH_ENABLED.
     */
    public final static int MAX_LENGTH_ENABLED = 1;

    /**
     * 카테고리 고유 번호
     */
    private int id;
    /**
     * 카테고리 명
     */
    private String name;
    /**
     * 생성일
     */
    private Date created;
    /**
     * 수정일
     */
    private Date modified;
    /**
     * 접근제한(all, owner)
     */
    private String restriction;
    /**
     * 검색 서비스 고유 번호
     */
    private int cpId;
    /**
     * 토픽 여부(Y,N)
     */
    private String topic;    
    /**
     * 토픽 이름
     */
    private String topicName;

    /**
     * 활성화여부(Y,N)
     */
    private String enabled;
    
    /**
     * 업로드 lock 여부(Y,N)
     */
    private String uploadLock;
    
    /**
     * 배포여부(Y,N)
     */
    private String deploy;    
    /**
     * cp명
     */
    private String cpLabel;
    /**
     * 등록건수
     */
    private String count;
    /**
     * 유저 권한
     */
    private String userAuth;


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
     * Gets name.
     *
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets name.
     *
     * @param name the name
     */
    public void setName(String name) {
        this.name = name;
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
     * Gets modified.
     *
     * @return the modified
     */
    public Date getModified() {
        return modified;
    }

    /**
     * Sets modified.
     *
     * @param modified the modified
     */
    public void setModified(Date modified) {
        this.modified = modified;
    }

    /**
     * Gets restriction.
     *
     * @return the restriction
     */
    public String getRestriction() {
        return restriction;
    }

    /**
     * Sets restriction.
     *
     * @param restriction the restriction
     */
    public void setRestriction(String restriction) {
        this.restriction = restriction;
    }

    /**
     * Gets cp id.
     *
     * @return the cp id
     */
    public int getCpId() {
        return cpId;
    }

    /**
     * Sets cp id.
     *
     * @param cpId the cp id
     */
    public void setCpId(int cpId) {
        this.cpId = cpId;
    }

    /**
     * Gets topic.
     *
     * @return the topic
     */
    public String getTopic() {
        return topic;
    }

    /**
     * Sets topic.
     *
     * @param topic the topic
     */
    public void setTopic(String topic) {
        this.topic = topic;
    }
    
    /**
     * Gets topic.
     *
     * @return the topic
     */
    public String getTopicName() {
        return topicName;
    }

    /**
     * Sets topic.
     *
     * @param topic the topic
     */
    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    /**
     * Gets enabled.
     *
     * @return the enabled
     */
    public String getEnabled() {
        return enabled;
    }

    /**
     * Sets enabled.
     *
     * @param enabled the enabled
     */
    public void setEnabled(String enabled) {
        this.enabled = enabled;
    }

    /**
     * Gets upload lock.
     *
     * @return enabled the lock
     */
    public String getUploadLock() {
        return uploadLock;
    }

    /**
     * Sets upload lock.
     *
     * @param enabled the lock
     */
    public void setUploadLock(String uploadLock) {
        this.uploadLock = uploadLock;
    }
    
    /**
     * Gets deploy.
     *
     * @return the deploy
     */
	public String getDeploy() {
		return deploy;
	}
	
	/**
     * Sets deploy.
     *
     * @param enabled the deploy
     */
	public void setDeploy(String deploy) {
		this.deploy = deploy;
	}   
	
	/**
     * Gets cp label.
     *
     * @return cp label the cp label
     */
	public String getCpLabel() {
		return cpLabel;
	}
	
	/**
     * Sets cp label.
     *
     * @return cp label the cp label
     */
	public void setCpLabel(String cpLabel) {
		this.cpLabel = cpLabel;
	}   	
	
	/**
     * Gets cp count.
     *
     * @return cp count the cp count
     */
	public String getCount() {
		return count;
	}
	
	/**
     * Sets cp count.
     *
     * @return cp count the cp count
     */
	public void setCount(String count) {
		this.count = count;
	}

	public String getUserAuth() {
		return userAuth;
	}

	public void setUserAuth(String userAuth) {
		this.userAuth = userAuth;
	} 	
}
