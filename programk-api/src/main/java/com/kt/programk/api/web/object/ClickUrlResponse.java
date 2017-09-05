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
 * Seo Jong Hwa        2016 . 7 . 12
 */

package com.kt.programk.api.web.object;

/**
 * Created by redpunk on 2016-05-31.
 */
public class ClickUrlResponse{
    /**
     * The Result.
     */
    private String result = "ok";

    /**
     * Instantiates a new Click url response.
     */
    public ClickUrlResponse() {
    }

    /**
     * Instantiates a new Click url response.
     *
     * @param result the result
     */
    public ClickUrlResponse(String result) {
        this.result = result;
    }

    /**
     * Gets result.
     *
     * @return the result
     */
    public String getResult() {
        return result;
    }

    /**
     * Sets result.
     *
     * @param result the result
     */
    public void setResult(String result) {
        this.result = result;
    }
}
