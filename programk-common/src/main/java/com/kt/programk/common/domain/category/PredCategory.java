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
 * Seo Jong Hwa        2016 . 6 . 22
 */

package com.kt.programk.common.domain.category;

import java.util.Date;

import com.kt.programk.common.domain.PagingExample;

/**
 * Predicates 카테고리
 */
public class PredCategory extends PagingExample{
	/**
     * The constant MAX_LENGTH_NAME.
     */
    public final static int MAX_LENGTH_NAME = 128;
    /**
     * The constant MAX_LENGTH_RESTRICTION.
     */
    public final static int MAX_LENGTH_RESTRICTION = 7;
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
     * 활성화여부(Y,N)
     */
    private String enabled;
    /**
     * 배포여부(Y,N)
     */
    private String deploy;    
    /**
     * 검색 서비스 고유 번호
     */
    private int cpId;    
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

    public String getEnabled() {
        return enabled;
    }

    public void setEnabled(String enabled) {
        this.enabled = enabled;
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
