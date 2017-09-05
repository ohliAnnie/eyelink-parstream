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
 * preludio        2016 . 6 . 21
 */

package com.kt.programk.common.domain.core;

/**
 * redis를 db로 변경하기 위한 데이터 구조
 */
public class AimlRepository {
    /**
     * The ObjectKey.
     */
    private String objectKey;
    /**
     * The Key.
     */
    private String key;
    /**
     * The Value.
     */
    private String value;

    /**
     * Gets Object Key.
     *
     * @return the object key
     */
    public String getObjectKey() {
        return objectKey;
    }

    /**
     * Sets Object Key.
     *
     * @param objectKey the object key
     */
    public void setObjectKey(String objectKey) {
        this.objectKey = objectKey;
    }

    /**
     * Gets Key.
     *
     * @return the key
     */
    public String getKey() {
        return key;
    }

    /**
     * Sets Key.
     *
     * @param key the key
     */
    public void setKey(String key) {
        this.key = key;
    }
    
    /**
     * Gets Value.
     *
     * @return the value
     */
    public String getValue() {
        return value;
    }

    /**
     * Sets Value.
     *
     * @param value the value
     */
    public void setValue(String value) {
        this.value = value;
    }
}
