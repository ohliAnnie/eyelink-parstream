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
 * preludio	            2016 . 10 . 18
 */

package com.kt.programk.redis;

import org.slf4j.LoggerFactory;

public class ShutdownHook {
	
	private static final org.slf4j.Logger LOGGER = LoggerFactory.getLogger(ShutdownHook.class);
	
    /**
     * shutdown 이벤트 연결
     *
     */
	public ShutdownHook() {
		Runtime.getRuntime().addShutdownHook(new ShutdownHookThread());
		LOGGER.info("ShutdownHook Registered =========================");
	}

	public class ShutdownHookThread extends Thread {
		
        public ShutdownHookThread() {
            
        }
        
        public void run() {
    		LOGGER.info("Shutdown Redis===================================");
        }
    }
}
