/*
 *  Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
package com.kt.programk.cms.service;

import com.kt.programk.cms.domain.Sample;

import java.util.List;

/**
 * Created by Administrator on 2016-04-27.
 */
public interface SampleService {
    /**
     * 샘플 생성.
     *
     * @param sample the sample
     */
    void createSample(Sample sample);

    /**
     * 샘플 수정.
     *
     * @param sample the sample
     */
    void modifySample(Sample sample);

    /**
     * 샘플 삭제.
     *
     * @param sample the sample
     */
    void removeSample(Sample sample);

    /**
     * 샘플 조회.
     *
     * @param sample the sample
     * @return the sample
     */
    Sample findSample(Sample sample);


    /**
     * 샘플 목록 조회.
     *
     * @param sample the sample
     * @return the list
     * @ the exception
     */
    List<Sample> findListSample(Sample sample);
}
