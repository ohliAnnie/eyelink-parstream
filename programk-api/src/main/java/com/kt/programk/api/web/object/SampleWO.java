/* Copyright (c) 2013 UNUS, Inc.
 * All right reserved.
 * http://www.unus.com
 * This software is the confidential and proprietary information of UNUS
 * , Inc. You shall not disclose such Confidential Information and
 * shall use it only in accordance with the terms of the license agreement
 * you entered into with UNUS.
 *
 * Revision History
 * Author              Date                  Description
 * ===============    ================       ======================================
 *                    2013. 10. 7     
 */
package com.kt.programk.api.web.object;


import com.kt.programk.common.domain.Sample;

/**
 * The Class SampleWO.
 */
public class SampleWO {
    /**
     * The sample.
     */
    private Sample sample;

    /**
     * The exist.
     */
    private boolean exist = false;

    /**
     * The id.
     */
    private String id;


    /**
     * Gets sample.
     *
     * @return the sample
     */
    public Sample getSample() {
        return sample;
    }

    /**
     * Sets sample.
     *
     * @param sample the sample
     */
    public void setSample(Sample sample) {
        this.sample = sample;
    }

    /**
     * Is exist boolean.
     *
     * @return the boolean
     */
    public boolean isExist() {
        return exist;
    }

    /**
     * Sets exist.
     *
     * @param exist the exist
     */
    public void setExist(boolean exist) {
        this.exist = exist;
    }

    /**
     * Gets id.
     *
     * @return the id
     */
    public String getId() {
        return id;
    }

    /**
     * Sets id.
     *
     * @param id the id
     */
    public void setId(String id) {
        this.id = id;
    }
}
