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

package com.kt.programk.common.db.repository;

import com.kt.programk.common.db.domain.Sample;
import org.junit.Assert;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * Created by Administrator on 2016-07-04.
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context/context-cluster-redis.xml"})
public class SampleRepositoryTest {
//    @Autowired
//    private RedisTemplate redisTemplate;
//
//    @Autowired
//    private SampleRepository sampleRepository;
//
//    @Test
//    public void put() throws Exception {
//        Assert.assertNotNull(redisTemplate);
//        Assert.assertNotNull(sampleRepository);
//
//        Sample sample = new Sample();
//        sample.setId("redpunk");
//        sample.setName("서종화");
//        sampleRepository.put(sample);
//
//        Sample obj = sampleRepository.get(sample);
//        Assert.assertNotNull(obj);
//
//        System.out.println(obj.getName());
//        System.out.println(obj.getId());
//    }

}