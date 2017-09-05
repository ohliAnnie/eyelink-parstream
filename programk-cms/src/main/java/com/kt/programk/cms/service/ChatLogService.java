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

import java.util.List;

import com.kt.programk.common.domain.stat.ChatLog;
import com.kt.programk.common.exception.ApplicationException;

/**
 * 로그 관리
 */
public interface ChatLogService {
    /**
     * 전체 개수 조회
     *
     * @param ChatLog the chatLog
     * @return the int
     */
	public int countAll(ChatLog chatLog) throws ApplicationException;
	
	/**
     * 전체 목록
     *
     * @param ChatLog the chatLog
     * @return the list
     */
    public List<ChatLog> findListAll(ChatLog chatLog, int currentPageNo, int recordCountPerPage) throws ApplicationException;
}
