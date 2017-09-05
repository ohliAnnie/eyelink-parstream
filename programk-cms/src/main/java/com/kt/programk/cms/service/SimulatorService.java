/*
 *  Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
package com.kt.programk.cms.service;

import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;

/**
 * 시뮬레이터
 */
public interface SimulatorService {
    /**
     * 대화 검색
     *
     * @return the String
     */
    public String searchChat(int cpId, String botType, String userId, String input) throws ApplicationException, BizCheckedException;
}
