
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

package com.kt.programk.api;

import junit.framework.Assert;
import org.aitools.programd.multiplexor.PredicateMap;
import org.aitools.programd.redis.MemoryCacheHandler;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import redis.clients.jedis.JedisCluster;

/**
 * Created by redpunk on 2016-06-10.
 */

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context-root.xml","classpath:/spring/context/redis.xml"})
public class RedisTest {
    @Autowired
    private MemoryCacheHandler memoryCacheHandler;

    @Test
    public void test(){
        Assert.assertNotNull(memoryCacheHandler);
        memoryCacheHandler.setPredicateMap("Samplebot","redpunk", new PredicateMap());
    }

}
