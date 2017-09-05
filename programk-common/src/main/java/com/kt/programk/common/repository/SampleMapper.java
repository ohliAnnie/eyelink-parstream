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
package com.kt.programk.common.repository;

import com.kt.programk.common.domain.Sample;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * The type Sample repository.
 */
@Repository(value="sampleMapper")
public interface SampleMapper {

    /**
     * Select sample.
     *
     * @param sample the sample
     * @return the sample
     */
    public Sample selectSample(Sample sample);

    /**
     * Select list sample.
     *
     * @param sample the sample
     * @return the list
     */
    public List<Sample> selectListSample(Sample sample);

    /**
     * Insert sample.
     *
     * @param sample the sample
     */
    public int insertSample(Sample sample);

    /**
     * Update sample.
     *
     * @param sample the sample
     * @return the int
     */
    public int updateSample(Sample sample);

    /**
     * Delete sample.
     *
     * @param sample the sample
     * @return the int
     */
    public int deleteSample(Sample sample);
}
