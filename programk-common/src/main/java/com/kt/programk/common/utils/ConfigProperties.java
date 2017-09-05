/*
 *  Copyright (c) 2013 KT, Inc.
 *  * All right reserved.
 *  * http://www.kt.com
 *  * This software is the confidential and proprietary information of KT
 *  * , Inc. You shall not disclose such Confidential Information and
 *  * shall use it only in accordance with the terms of the license agreement
 *  * you entered into with KT.
 *  *
 *  * Revision History
 *  * Author              Date                  Description
 *  * ===============    ================       ======================================
 *  *  beyondj2ee          ${date}
 *
 */
package com.kt.programk.common.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Properties;

/**
 * 어플리케이션에서 사용할 config 정보가 실제로 저장될 클래스.
 */
public class ConfigProperties {

    // ~ Instance fields. ~~~~~~~~~~~~~~

    /** The Constant logger. */
    private static final Logger LOG = LoggerFactory.getLogger(ConfigProperties.class);

    /** 실제 config 정보가 저정될 properties 객체. */
    private Properties properties;

    // ~ Constructors. ~~~~~~~~~~~~~~~~~
    /**
     * 생성자 함수.
     */
    public ConfigProperties() {
        LOG.info("ConfigProperties");
    }

    // ~ Implementation Method. ~~~~~~~~
    // ~ Self Methods. ~~~~~~~~~~~~~~~~~

    /**
     * 초기화 한다.
     * 
     */
    public final void init() {
        // 환경 변수 설정 log 출력
        if (this.properties != null) {
            LOG.info("Initialize Config Variables");
//            LOG.info(JsonUtil.marshallingJsonWithPretty(this.properties));
        }
    }

    // ~ Getter and Setter
    // ==============================================================================================

    /**
     * config 정보가 저장된 Properties를 변경 한다 .
     * 
     * @param properties
     *            the new properties
     */
    public final void setProperties(final Properties properties) {
        this.properties = properties;
    }

    /**
     * key를 기준으로 맵핑된 값을 스트링 형태로 리턴 한다.
     * 
     * @param key
     *            the key
     * @return the string
     */
    public final String getString(final String key) {

        return this.properties.getProperty(key);
    }

    /**
     * key에 해당하는 값을 Integer 형태로 리턴 한다.
     * 
     * @param key
     *            the key
     * @return the integer
     */
    public final Integer getInteger(final String key) {
        String value = this.properties.getProperty(key);
        return new Integer(value);
    }
    
    // TODO : delete....testing....
    public void printProps() {
    	System.out.println("Printing config properties...");
    	for ( Object  key : this.properties.keySet() ) {
    		System.out.println("key: " + (String)key + ", value: " + properties.getProperty((String)key));
    	}
    }

}
