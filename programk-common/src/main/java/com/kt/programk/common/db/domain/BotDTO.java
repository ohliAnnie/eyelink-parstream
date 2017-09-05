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
 * CP 별로 ACTIVE/STANDBY 정보를 가지고 있다.
 */
public class BotDTO implements DomainObject {
    /**
     * The constant OBJECT_KEY.
     */
    public static final String OBJECT_KEY = "BOT_";

    /**
     * The Token.
     */
    private String token;
    /**
     * The Sub label.
     */
    private String subLabel;
    /**
     * The Active.
     */
    private String active;

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
     * Gets sub label.
     *
     * @return the sub label
     */
    public String getSubLabel() {
        return subLabel;
    }

    /**
     * Sets sub label.
     *
     * @param subLabel the sub label
     */
    public void setSubLabel(String subLabel) {
        this.subLabel = subLabel;
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
     * 키를 이용해서 조회
     *
     * @return key
     */
    @Override
    public String getKey() {
        return this.subLabel;
    }

    /**
     * 오브젝트키를 이용해서 조회
     *
     * @return object key
     */
    @Override
    public String getObjectKey() {
        return OBJECT_KEY + "_" + token;
    }
}
