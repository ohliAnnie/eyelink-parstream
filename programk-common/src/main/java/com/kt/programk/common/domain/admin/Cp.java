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

package com.kt.programk.common.domain.admin;

import com.kt.programk.common.domain.PagingExample;

import java.util.Date;

/**
 * 검색 서비스
 */
public class Cp extends PagingExample {
    /**
     * The constant MAX_LENGTH_LABEL.
     */
    public static final int MAX_LENGTH_LABEL = 255;
    /**
     * The constant MAX_LENGTH_URL.
     */
    public static final int MAX_LENGTH_URL = 255;
    /**
     * The constant MAX_LENGTH_TOKEN.
     */
    public static final int MAX_LENGTH_TOKEN = 32;
    /**
     * The constant MAX_LENGTH_DESCRIPTION.
     */
    public static final int MAX_LENGTH_DESCRIPTION = 255;
    /**
     * 고유 번호
     */
    private int id;
    /**
     * 봇아이디
     */
    private String label;
    /**
     * 서비스 URL
     */
    private String url;
    /**
     * 생성일
     */
    private Date created;
    /**
     * 수정일
     */
    private Date modified;
    /**
     * API 키
     */
    private String token;

    /**
     * 설명
     */
    private String description;

    /**
     * 호스트 ip
     */
    private String hostIp;

    /**
     * 사용여부
     */
    private String enabled;
    
    /**
     * cp group
     */
    private String cpGroup;

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
     * Gets url.
     *
     * @return the url
     */
    public String getUrl() {
        return url;
    }

    /**
     * Sets url.
     *
     * @param url the url
     */
    public void setUrl(String url) {
        this.url = url;
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
     * Gets description.
     *
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets description.
     *
     * @param description the description
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Gets host ip.
     *
     * @return the host ip
     */
    public String getHostIp() {
		return hostIp;
	}

    /**
     * Sets host ip.
     *
     * @param hostIp the host ip
     */
    public void setHostIp(String hostIp) {
		this.hostIp = hostIp;
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
    
	public String getCpGroup() {
		return cpGroup;
	}

	public void setCpGroup(String cpGroup) {
		this.cpGroup = cpGroup;
	} 
}
