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
 *  Seo Jong Hwa 16. 8. 19 오후 5:09
 *
 *
 */

package com.kt.programk.scheduler;

import org.apache.camel.spring.Main;
import org.slf4j.LoggerFactory;

/**
 * 통계 스케줄러, Active-Bot 변경
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
     */
    public static void main(String[] args) {
        LOGGER.debug("Start scheduler======================================");
        CamelMain example = new CamelMain();
        example.boot();
    }

    /**
     * Boot.
     */
    public void boot(){

        main = new Main();
        main.setApplicationContextUri("camel-scheduler-route.xml");
        main.enableHangupSupport();
        LOGGER.info("Starting Camel. Use ctrl + c to terminate the JVM.\n");
        try {
            main.run();
        } catch (Exception e) {
            LOGGER.error("Start schedule fail", e);
            System.exit(-1);
        }
    }
}
