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

package com.kt.programk.collector;

import org.apache.camel.spring.Main;
import org.slf4j.LoggerFactory;

/**
 * The type Camel main.
 */
public class CamelMain {
    /**
     * The constant LOGGER.
     */
    private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(CamelMain.class);
    /**
     * The Main.
     */
    private Main main;


    /**
     * The entry point of application.
     *
     * @param args the input arguments
     * @throws Exception the exception
     */
    public static void main(String[] args) {
        LOGGER.debug("Start Log Collector ======================================");
        CamelMain example = new CamelMain();
        example.boot();
    }

    /**
     * Boot.
     *
     * @throws Exception the exception
     */
    private void boot() {

        main = new Main();
        main.setApplicationContextUri("camel-file-route.xml");
        main.enableHangupSupport();
        LOGGER.info("Starting Camel. Use ctrl + c to terminate the JVM.\n");
        try {
            main.run();
        } catch (Exception e) {
            LOGGER.error("Start Log Collector Fail", e);
            System.exit(-1);
        }
    }
}
