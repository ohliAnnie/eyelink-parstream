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
 * Seo Jong Hwa        2016 . 7 . 4
 */

package com.kt.programk.common.db.domain;

/**
 * 작업공지 정보를 가지고 있다.
 */
public class NoticeDTO implements DomainObject {
    /**
     * 오브젝트키
     */
    public static final String OBJECT_KEY = "Notice_";
    /**
     * 사용여부(Y/N)
     */
    private String active;

    /**
     * 작업내용
     */
    private String message;
    
    /**
     * @return
     */
    @Override
    public String getKey() {
        return OBJECT_KEY + active;
    }

    /**
     * @return
     */
    @Override
    public String getObjectKey() {
        return OBJECT_KEY + active;
    }

    /**
     * Gets active.
     *
     * @return the active
     */
    public String getActive() {
        return active;
    }

    /**
     * Sets active.
     *
     * @param active the active
     */
    public void setActive(String active) {
        this.active = active;
    }
    
    /**
     * Gets message.
     *
     * @return the message
     */
	public String getMessage() {
		return message;
	}

    /**
     * Sets message.
     *
     * @param active the message
     */
	public void setMessage(String message) {
		this.message = message;
	}  
}
