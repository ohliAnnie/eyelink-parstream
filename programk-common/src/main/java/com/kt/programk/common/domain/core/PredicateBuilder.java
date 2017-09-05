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
 *  Seo Jong Hwa 16. 8. 22 오후 5:08
 *
 *
 */

package com.kt.programk.common.domain.core;

/**
 * The type Predicate builder.
 */
public class PredicateBuilder {
    /**
     * The Userid.
     */
    private String userid;
    /**
     * The Botid.
     */
    private String botid;
    /**
     * The Name.
     */
    private String name;
    /**
     * The Value.
     */
    private String value;

    /**
     * Sets userid.
     *
     * @param userid the userid
     * @return the userid
     */
    public PredicateBuilder setUserid(String userid) {
        this.userid = userid;
        return this;
    }

    /**
     * Sets botid.
     *
     * @param botid the botid
     * @return the botid
     */
    public PredicateBuilder setBotid(String botid) {
        this.botid = botid;
        return this;
    }

    /**
     * Sets name.
     *
     * @param name the name
     * @return the name
     */
    public PredicateBuilder setName(String name) {
        this.name = name;
        return this;
    }

    /**
     * Sets value.
     *
     * @param value the value
     * @return the value
     */
    public PredicateBuilder setValue(String value) {
        this.value = value;
        return this;
    }

    /**
     * Create predicate predicate.
     *
     * @return the predicate
     */
    public AimlPredicate createPredicate() {
        return new AimlPredicate(userid, botid, name, value);
    }
}