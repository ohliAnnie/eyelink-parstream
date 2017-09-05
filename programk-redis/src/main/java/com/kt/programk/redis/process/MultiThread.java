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
 *  Seo Jong Hwa 16. 8. 19 오후 6:11
 *
 *
 */

package com.kt.programk.redis.process;

import com.kt.programk.redis.CamelMain;
import com.kt.programk.redis.listener.KeyExpiredListener;
import org.apache.camel.ProducerTemplate;
import org.slf4j.LoggerFactory;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.exceptions.JedisConnectionException;

/**
 * Created by Administrator on 2016-07-28.
 */
public class MultiThread extends Thread {
    /**
     * The constant LOGGER.
     */
    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(CamelMain.class);

    /**
     * The Host.
     */
    private String host;
    /**
     * The Port.
     */
    private int port;
    /**
     * The Producer template.
     */
    private ProducerTemplate producerTemplate;


    /**
     * Instantiates a new Multi thread.
     *
     * @param host             the host
     * @param port             the port
     * @param producerTemplate the producer template
     */
    public MultiThread(String host, int port, ProducerTemplate producerTemplate) {
        LOGGER.info("Start Thread==========================");
        this.host = host;
        this.port = port;
        this.producerTemplate = producerTemplate;
    }

    /**
     * Run.
     */
    public void run(){
    	while(true) {
    		try {
    			Thread.sleep(5000);

    			JedisPoolConfig poolConfig = new JedisPoolConfig();
    	        poolConfig.setTestWhileIdle(true);
    	        JedisPool pool = new JedisPool(host,port);
    	        Jedis jedis = pool.getResource();
    	        jedis.psubscribe(new KeyExpiredListener(producerTemplate), "*");
    		}
    		catch(InterruptedException e){
    			LOGGER.info("Timeout ==========================");
    		}
    		catch(JedisConnectionException e) {
    			LOGGER.info("Retry Connection = " + host + ":" + port );
    		}
    	}
    }
}
