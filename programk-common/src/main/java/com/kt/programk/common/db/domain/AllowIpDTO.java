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
 * API 접근 권한
 */
public class AllowIpDTO implements DomainObject{
    /**
     * The constant OBJECT_KEY.
     */
    public static final String OBJECT_KEY = "ALLOW_IP_";

    /**
     * CP에게 발급된 토큰
     */
    private String token;

    /**
     * 승인된 IP
     */
    private String ip;


    /**
     * 키를 이용해서 조회
     *
     * @return key
     */
    @Override
    public String getKey() {
        return ip;
    }

    /**
     * 오브젝트키를 이용해서 조회(해시키)
     *
     * @return object key
     */
    @Override
    public String getObjectKey() {
        return OBJECT_KEY + "_" + token;
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
     * Gets ip.
     *
     * @return the ip
     */
    public String getIp() {
        return ip;
    }

    /**
     * Sets ip.
     *
     * @param ip the ip
     */
    public void setIp(String ip) {
        this.ip = ip;
    }
}
