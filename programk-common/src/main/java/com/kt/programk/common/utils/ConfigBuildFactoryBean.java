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
 *  Seo Jong Hwa 16. 8. 22 오후 5:35
 *
 *
 */

package com.kt.programk.common.utils;


import com.kt.programk.common.exception.CommonCode;
import com.kt.programk.common.exception.SystemException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.util.Properties;

/**
 * 어플리케이션에서 Config 정보를 관리 및 생성하는 클래스.
 */
public class ConfigBuildFactoryBean {

    // ~ Instance fields. ~~~~~~~~~~~~~~
    /**
     * The Constant logger.
     */
    private static final Logger LOG = LoggerFactory.getLogger(ConfigBuildFactoryBean.class);
    /**
     * config 파일들의 위치 정보.
     */
    private Resource[] locations;
    /**
     * config 파일에 있는 모든 정보는 저장하는 오브젝트.
     */
    private Properties config = new Properties();

    // ~ Constructors. ~~~~~~~~~~~~~~~~~

    /**
     * 생성자 함수.
     */
    public ConfigBuildFactoryBean() {
        LOG.info("ConfigBuildFactoryBean");
    }

    // ~ Implementation Method. ~~~~~~~~
    // ~ Self Methods. ~~~~~~~~~~~~~~~~~

    /**
     * 빈이 초기화 될때 실행 된다. config.properties, system properties 값들을 하나의 properties로
     * 만든다.
     *
     */
    public final void init() {
        if (locations != null) {
            Props props = new Props();
            for (Resource resource : locations) {
                try {
					props.load(resource.getInputStream());
				} catch (IOException e) {
					LOG.error("Config Build Factory init ERROR() !!!");
					throw new SystemException(e, CommonCode.UTIL_CONFIG_LOAD_ERROR);
				}
            }
            props.fromProperties(System.getProperties());
            props.expandVariables();
            config = props.toProperties();
        }
    }

    /**
     * Config 정보를 저장할 Properties 객체를 생성 한다.
     *
     * @return the properties
     */
    public final Properties createInstance() {
        return config;
    }

    /**
     * Gets the object type.
     *
     * @return the object type
     */
    public final Class<Properties> getObjectType() {
        return Properties.class;
    }

    // ~ Getter and Setter. ~~~~~~~~~~~~

    /**
     * config 파일 위치 정보를 변경 한다.
     *
     * @param locations
     *            the new locations
     */
    public final void setLocations(final Resource[] locations) {
        this.locations = locations;
    }

}
