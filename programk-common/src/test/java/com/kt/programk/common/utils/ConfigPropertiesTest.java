

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

package com.kt.programk.common.utils;

import junit.framework.Assert;
import org.apache.commons.lang.BooleanUtils;
import org.junit.Before;
import org.junit.Test;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.Properties;
import java.util.ResourceBundle;

/**
 * The type Config properties test.
 */
public class ConfigPropertiesTest {

    /**
     * The Config properties.
     */
    ConfigProperties configProperties;

    /**
     * Sets up.
     */
    @Before
    public void setUp() {
        configProperties = new ConfigProperties();
    }

    /**
     * Gets properties.
     *
     * @throws IOException the io exception
     */
    @Test
    public void getProperties() throws IOException {
        String result = "";
        Properties prop = new Properties();
        String propFileName = "config/commons/local/commons.properties";

        InputStream inputStream = getClass().getClassLoader().getResourceAsStream(propFileName);
        prop.load(inputStream);

        if (inputStream == null) {
            throw new FileNotFoundException("property file '" + propFileName + "' not found in the classpath");
        }
        System.out.println(prop.getProperty("license.serialnumber"));

    }

    /**
     * Test created.
     */
    @Test
    public void testCreated() {
        Assert.assertNotNull(configProperties);

        System.out.println(configProperties.getString("license.identifier"));
        System.out.println(configProperties.getString("license.serialnumber"));
        System.out.println(configProperties.getString("license.model"));
        System.out.println(configProperties.getString("license.id"));
        System.out.println(configProperties.getString("license.email"));
        System.out.println(configProperties.getString("license.key"));
    }

    /**
     * Test resource.
     */
    @Test
    public void testResource() {
        ResourceBundle bundle = ResourceBundle.getBundle("META-INF.beans-commons.config.license.properties");

        System.out.println(bundle.getString("license.identifier"));
        System.out.println(bundle.getString("license.serialnumber"));
        System.out.println(bundle.getString("license.model"));
        System.out.println(bundle.getString("license.id"));
        System.out.println(bundle.getString("license.email"));
        System.out.println(bundle.getString("license.key"));
    }

    /**
     * Test get mac address.
     *
     * @throws SocketException      the socket exception
     * @throws UnknownHostException the unknown host exception
     */
    @Test
    public void testGetMacAddress() throws SocketException, UnknownHostException {
        InetAddress ip;
        ip = InetAddress.getLocalHost();
        System.out.println("Current IP address : " + ip.getHostAddress());

        NetworkInterface network = NetworkInterface.getByInetAddress(ip);

        byte[] mac = network.getHardwareAddress();

        System.out.print("Current MAC address : ");

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < mac.length; i++) {
            sb.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? "-" : ""));
        }
        System.out.println(sb.toString());
    }

    /**
     * Test boolean.
     */
    @Test
    public void testBoolean() {
        System.out.println(BooleanUtils.toBoolean("yes"));
        System.out.println(BooleanUtils.toBoolean("no"));
    }


    /**
     * Test split.
     */
    @Test
    public void testSplit() {
        String pattern = "yy-MM-dd HH:mm,-,-,-,-,-,-,-,-,-,-,-";
        String[] dateFormat = pattern.split(",");

        System.out.println(dateFormat.length);
    }
}
