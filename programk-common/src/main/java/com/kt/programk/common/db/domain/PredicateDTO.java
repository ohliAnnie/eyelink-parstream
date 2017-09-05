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
 * 사용자별로 predicate 정보를 저장한다.
 */
public class PredicateDTO implements DomainObject {
    /**
     * The constant OBJECT_KEY.
     */
    public static final String OBJECT_KEY = "PREDICATE_";

    /**
     * The Botid.
     */
    private String botid;
    /**
     * The Userid.
     */
    private String userid;
    /**
     * The Predicate map.
     */
    private String predicateMap;

    /**
     * Gets botid.
     *
     * @return the botid
     */
    public String getBotid() {
        return botid;
    }

    /**
     * Sets botid.
     *
     * @param botid the botid
     */
    public void setBotid(String botid) {
        this.botid = botid;
    }

    /**
     * Gets userid.
     *
     * @return the userid
     */
    public String getUserid() {
        return userid;
    }

    /**
     * Sets userid.
     *
     * @param userid the userid
     */
    public void setUserid(String userid) {
        this.userid = userid;
    }

    /**
     * Gets predicate map.
     *
     * @return the predicate map
     */
    public String getPredicateMap() {
        return predicateMap;
    }

    /**
     * Sets predicate map.
     *
     * @param predicateMap the predicate map
     */
    public void setPredicateMap(String predicateMap) {
        this.predicateMap = predicateMap;
    }

    /**
     * 키를 이용해서 조회
     *
     * @return key
     */
    @Override
    public String getKey() {
        return botid + "_" + userid;
    }

    /**
     * 오브젝트키를 이용해서 조회
     *
     * @return object key
     */
    @Override
    public String getObjectKey() {
        return OBJECT_KEY + botid + "_" + userid;
    }
}
