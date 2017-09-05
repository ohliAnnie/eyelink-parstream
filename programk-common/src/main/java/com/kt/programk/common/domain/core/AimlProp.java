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

package com.kt.programk.common.domain.core;

import java.util.Date;

import com.kt.programk.common.domain.PagingExample;

/**
 *properties 규칙
 */
public class AimlProp extends PagingExample{
    /**
     * 카테고리 고유 번호
     */
    private int cateId;
    /**
     * 이름
     */
    private String name;
    /**
     * 값
     */
    private String val;
    /**
     * 생성일
     */
    private Date created;
    /**
     * 수정일
     */
    private Date modified;
    /**
     * cp id - 검색용
     */
    private int cpId;
    /**
     * 카테고리명 - 검색용
     */
    private String cateName;
    /**
     * 정렬조건
     */
    private String order;
    /**
     * 유저 권한
     */
    private String userAuth;
    /**
     * 유형
     */
    private String restriction;

    /**
     * Gets cp id.
     *
     * @return the cp id
     */
    public int getCateId() {
        return cateId;
    }

    /**
     * Sets cp id.
     *
     * @param cateId the cp id
     */
    public void setCateId(int cateId) {
        this.cateId = cateId;
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
     * Gets val.
     *
     * @return the val
     */
    public String getVal() {
        return val;
    }

    /**
     * Sets val.
     *
     * @param val the val
     */
    public void setVal(String val) {
        this.val = val;
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
	
	/**
     * Gets order.
     *
     * @return order the order
     */
	public String getOrder() {
		return order;
	}
	
	/**
     * Sets order.
     *
     * @return order the order
     */
	public void setOrder(String order) {
		this.order = order;
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
