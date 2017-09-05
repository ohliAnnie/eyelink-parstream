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
 * Seo Jong Hwa        2016 . 6 . 21
 */

package com.kt.programk.common.domain.core;

import com.kt.programk.common.domain.PagingExample;

/**
 * Created by redpunk on 2016-06-13.
 */
public class AimlTopic extends PagingExample{
    /**
     * The Cp id.
     */
    private int cateId;
    /**
     * The Id.
     */
    private int id;
    /**
     * The Name.
     */
    private String name;

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
}
