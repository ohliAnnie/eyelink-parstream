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
 *  Seo Jong Hwa 16. 8. 22 오후 5:07
 *
 *
 */

package com.kt.programk.common.domain.core;

import java.util.Date;

import com.kt.programk.common.domain.PagingExample;

/**
 * CP별로 BOT 파일이 두개 생긴다.(Active, Standby)
 */
public class Bot extends PagingExample{
    /**
     * The Bot id.
     */
    private int id;
    /**
     * The Label.
     */
    private String subLabel;
    /**
     * The Cp id.
     */
    private int cpId;
    /**
     * 활성화 여부
     */
    private String active;
    /**
     * The Last loaded.
     */
    private Date lastLoaded;
    /**
     * 작업자 아이디
     */
    private String userId;
    /**
     * 설명
     */
    private String description;
    /**
     * The Deploy date.
     */
    private Date deployDate;
    /**
     * cp group
     */
    private String cpGroup;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSubLabel() {
        return subLabel;
    }

    public void setSubLabel(String subLabel) {
        this.subLabel = subLabel;
    }

    public int getCpId() {
        return cpId;
    }

    public void setCpId(int cpId) {
        this.cpId = cpId;
    }

    public String getActive() {
        return active;
    }

    public void setActive(String active) {
        this.active = active;
    }

	public Date getLastLoaded() {
		return lastLoaded;
	}

	public void setLastLoaded(Date lastLoaded) {
		this.lastLoaded = lastLoaded;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getDeployDate() {
		return deployDate;
	}

	public void setDeployDate(Date deployDate) {
		this.deployDate = deployDate;
	}
	
	public String getCpGroup() {
		return cpGroup;
	}

	public void setCpGroup(String cpGroup) {
		this.cpGroup = cpGroup;
	} 
}
