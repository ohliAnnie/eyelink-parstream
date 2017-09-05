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
 *  Seo Jong Hwa 16. 8. 22 오후 5:06
 *
 *
 */

package com.kt.programk.common.domain.core;

import org.apache.camel.dataformat.bindy.annotation.CsvRecord;
import org.apache.camel.dataformat.bindy.annotation.DataField;

import java.util.Date;

/**
 * 사용자 predicate
 */
@CsvRecord(separator = ",", quote = "\"", quoting= true)
public class AimlPredicate {
    /**
     * The Userid.
     */
    @DataField(pos = 1)
    private String userid;
    /**
     * The Botid.
     */
    @DataField(pos = 2)
    private String botid;
    /**
     * The Name.
     */
    @DataField(pos = 3)
    private String name;
    /**
     * The Value.
     */
    @DataField(pos = 4)
    private String val;
    /**
     * The Created.s
     */
    @DataField(pos = 5, pattern = "yyyy-MM-dd")
    private Date created;

    /**
     * Instantiates a new Aiml predicate.
     */
    public AimlPredicate() {
    }

    /**
     * Instantiates a new Predicate.
     *
     * @param userid the userid
     * @param botid  the botid
     * @param name   the name
     * @param value  the value
     */
    public AimlPredicate(String userid, String botid, String name, String value) {
        this.userid = userid;
        this.botid = botid;
        this.name = name;
        this.val = value;
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


}
