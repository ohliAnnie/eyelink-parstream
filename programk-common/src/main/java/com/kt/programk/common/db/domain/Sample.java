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
 * Created by Administrator on 2016-07-04.
 */
public class Sample implements DomainObject{
    /**
     * 오브젝트키
     */
    public static final String OBJECT_KEY = "Sample_";
    /**
     * 아이디
     */
    private String id;

    /**
     * 이름
     */
    private String name;

    /**
     * @return
     */
    @Override
    public String getKey() {
        return OBJECT_KEY + id;
    }

    /**
     * @return
     */
    @Override
    public String getObjectKey() {
        return OBJECT_KEY + id;
    }

    /**
     * @return
     */
    public String getId() {
        return id;
    }

    /**
     * @param id
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * @return
     */
    public String getName() {
        return name;
    }

    /**
     * @param name
     */
    public void setName(String name) {
        this.name = name;
    }
}
