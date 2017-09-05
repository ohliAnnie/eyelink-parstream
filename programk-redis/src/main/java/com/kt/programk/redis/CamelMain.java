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
 *  Seo Jong Hwa 16. 8. 19 오후 6:09
 *
 *
 */

package com.kt.programk.redis;

import com.kt.programk.common.data.repository.db.PredicateRepository;
import com.kt.programk.common.repository.core.AimlPredicateMapper;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.RedisClusterInfo;
import com.kt.programk.redis.listener.KeyExpiredListener;
import com.kt.programk.redis.process.MultiThread;
import com.kt.programk.redis.route.BackupRoute;
import org.apache.camel.CamelContext;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.impl.DefaultCamelContext;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.data.redis.connection.RedisNode;
import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisCluster;
import redis.clients.jedis.JedisPool;

import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

/**
 * Created by Administrator on 2016-07-27.
 */
public class CamelMain {
    /**
     * The constant LOGGER.
     */
    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(CamelMain.class);

    static ShutdownHook shutdownHook;
    /**
     * main
     *
     * @param args the args
     * @throws Exception
     */
    public static void main(String[] args) {
        LOGGER.debug("Start Redis======================================");
        
        shutdownHook = new ShutdownHook();

        String env = System.getProperty("env");

        if (env == null) {
            LOGGER.error("usage -Denv=parameter");
            System.exit(-1);
        }

        CamelContext camelContext = new DefaultCamelContext();
        //스프링 어플리케이션 컨텍스트 호출
        ApplicationContext springContext = null;

        /**
         * 개발 환경은 Redis가 클러스터 구성이 아님
         */
        BackupRoute backupRoute = new BackupRoute();
        LOGGER.info("Cluster mode");
        springContext = new ClassPathXmlApplicationContext("spring/context-root.xml", "spring/context/context-cluster-redis.xml");
        ConfigProperties config = (ConfigProperties) springContext.getBean("config");

        backupRoute.setThread(config.getString("redis.concurrent.thread"));
        backupRoute.setAimlPredicateMapper((AimlPredicateMapper) springContext.getBean("aimlPredicateMapper"));
        backupRoute.setPredicateRepository((PredicateRepository) springContext.getBean("predicateRepository"));
        try {
            camelContext.addRoutes(backupRoute);
            camelContext.start();
        } catch (Exception e) {
            LOGGER.error("Start Redis Fail", e);
        }
        connectCluster(camelContext, config);
    }

    /**
     * REDIS 클러스트 연결
     *
     * @param camelContext the camel context
     * @param config       the config
     */
    private static void connectCluster(CamelContext camelContext, ConfigProperties config) {
        ProducerTemplate producerTemplate = camelContext.createProducerTemplate();
        RedisClusterInfo redisClusterInfo = new RedisClusterInfo(config);

//        Set<HostAndPort> hosts = new HashSet<>();
//
//
//        HostAndPort hostA = new HostAndPort(config.getString("commons.programk.redis.host1"), config.getInteger("commons.programk.redis.port1"));
//        HostAndPort hostB = new HostAndPort(config.getString("commons.programk.redis.host2"), config.getInteger("commons.programk.redis.port2"));
//        HostAndPort hostC = new HostAndPort(config.getString("commons.programk.redis.host3"), config.getInteger("commons.programk.redis.port3"));
//        HostAndPort hostD = new HostAndPort(config.getString("commons.programk.redis.host4"), config.getInteger("commons.programk.redis.port4"));
//        HostAndPort hostE = new HostAndPort(config.getString("commons.programk.redis.host5"), config.getInteger("commons.programk.redis.port5"));
//        HostAndPort hostF = new HostAndPort(config.getString("commons.programk.redis.host6"), config.getInteger("commons.programk.redis.port6"));
//
//        hosts.add(hostA);
//        hosts.add(hostB);
//        hosts.add(hostC);
//        hosts.add(hostD);
//        hosts.add(hostE);
//        hosts.add(hostF);
//
        Set<RedisNode> clusterNodes = redisClusterInfo.getRedisClusterConfiguration().getClusterNodes();
        Iterator<RedisNode> iterator = clusterNodes.iterator();

        while (iterator.hasNext()) {
            RedisNode next = iterator.next();
            LOGGER.info("LOOP-----------------------------------");
            new MultiThread(next.getHost(), next.getPort(), producerTemplate).start();
        }

//        for(HostAndPort hostAndPort: redisClusterInfo.getRedisClusterConfiguration().getClusterNodes()){
//            LOGGER.info("LOOP-----------------------------------");
//            new MultiThread(hostAndPort.getHost(), hostAndPort.getPort(), producerTemplate).start();
//        }
    }

    /**
     * REDIS SINGLE 서버 연거
     *
     * @param camelContext the camel context
     * @param config       the config
     */
    private static void connectSingle(CamelContext camelContext, ConfigProperties config) {
        ProducerTemplate producerTemplate = camelContext.createProducerTemplate();

        attachListener(config.getString("commons.programk.redis.host1"), config.getInteger("commons.programk.redis.port1"), producerTemplate);
    }

    /**
     * Attach listener.
     *
     * @param host             the host
     * @param port             the port
     * @param producerTemplate the producer template
     */
    private static void attachListener(String host, int port, ProducerTemplate producerTemplate) {
        JedisPool pool = new JedisPool(host, port);
        Jedis jedis = pool.getResource();
        jedis.psubscribe(new KeyExpiredListener(producerTemplate), "*");
    }
}
