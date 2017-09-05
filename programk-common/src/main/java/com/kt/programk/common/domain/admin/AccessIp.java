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
 *  Seo Jong Hwa 16. 8. 22 오후 5:03
 *
 *
 */

package com.kt.programk.common.domain.admin;

import com.kt.programk.common.domain.PagingExample;

import java.util.Date;

/**
 * CP 관리자 저근 권한 관리
 */
public class AccessIp extends PagingExample{
    /**
     * The constant MAX_LENGTH_HOST_IP.
     */
    public final static int MAX_LENGTH_HOST_IP = 16;
    /**
     * The constant MAX_LENGTH_ENABLED.
     */
    public final static int MAX_LENGTH_ENABLED = 1;
    /**
     * The constant MAX_LENGTH_USER_ID.
     */
    public final static int MAX_LENGTH_USER_ID = 50;

    /**
     * The Id.
     */
    private int id;
    /**
     * The Host ip.
     */
    private String hostIp;
    /**
     * The Enabled.
     */
    private String enabled;
    /**
     * The Created.
     */
    private Date created;
    /**
     * The Modified.
     */
    private Date modified;
    /**
     * The User id.
     */
    private String userId;

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
}
