/*
 * 플러스 검색 version 1.0
 * Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 *
 *  Revision History
 *  Author Date Description
 *  ------------------ -------------- ------------------
 *  Seo Jong Hwa 16. 8. 29 오후 4:38
 */

package com.kt.programk.common.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.RedisClusterConfiguration;
import org.springframework.data.redis.connection.RedisNode;

/**
 * REDIS 클러스터 노드 정보를 읽어 온다.
 */
public class RedisClusterInfo {
    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(RedisClusterInfo.class);

    /**
     * The Config.
     */
    private ConfigProperties config;

    /**
     * The Redis cluster configuration.
     */
    private static RedisClusterConfiguration redisClusterConfiguration;

    /**
     * Instantiates a new Redis cluster info.
     */
    @Autowired
    public RedisClusterInfo(ConfigProperties configProperties) {
        this.config = configProperties;
    }

    /**
     * Read node.
     */
    public RedisClusterConfiguration readNode() {
        if(redisClusterConfiguration != null){
            return redisClusterConfiguration;
        }

        redisClusterConfiguration = new RedisClusterConfiguration();

        int count = 1;
        while (true){
            try {
                String host = config.getString("commons.programk.redis.host" + count);
                Integer port = config.getInteger("commons.programk.redis.port" + count);

                if (host == null && port == null) {
                    break;
                }

                LOGGER.info("----------------------------------------------------------");
                LOGGER.info(host);
                LOGGER.info(String.valueOf(port));
                LOGGER.info("----------------------------------------------------------");

                RedisNode redisNode = new RedisNode(host, port);
                redisClusterConfiguration.addClusterNode(redisNode);

                count++;
            }catch (Exception e){
                LOGGER.info("Not found cluster info");
                break;
            }
        }

        redisClusterConfiguration.setMaxRedirects(5);

        return redisClusterConfiguration;
    }

    /**
     * Gets config.
     *
     * @return the config
     */
    public ConfigProperties getConfig() {
        return config;
    }

    /**
     * Sets config.
     *
     * @param config the config
     */
    public void setConfig(ConfigProperties config) {
        this.config = config;
    }

    /**
     * Gets redis cluster configuration.
     *
     * @return the redis cluster configuration
     */
    public RedisClusterConfiguration getRedisClusterConfiguration() {
        return redisClusterConfiguration;
    }

    /**
     * Sets redis cluster configuration.
     *
     * @param redisClusterConfiguration the redis cluster configuration
     */
    public void setRedisClusterConfiguration(RedisClusterConfiguration redisClusterConfiguration) {
        this.redisClusterConfiguration = redisClusterConfiguration;
    }
}
