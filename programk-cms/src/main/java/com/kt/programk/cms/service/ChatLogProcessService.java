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

import com.kt.programk.common.domain.stat.ChatLogProcess;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;

/**
 * 로그 관리
 */
public interface ChatLogProcessService {
    /**
     * 전체 개수 조회
     *
     * @param ChatLogProcess the chatLogProcess
     * @return the int
     */
	public int countAll(ChatLogProcess chatLogProcess) throws ApplicationException;

    /**
     * 한건 조회
     *
     * @param ChatLogProcess the chatLogProcess
     * @return the ChatLogProcess
     */
	public ChatLogProcess selectChatLog(ChatLogProcess chatLogProcess) throws ApplicationException;

    /**
     * 최근 항목 하나 조회
     *
     * @param ChatLogProcess the chatLogProcess
     * @return the ChatLogProcess
     */
	public ChatLogProcess selectNewChatLogProcess(ChatLogProcess chatLogProcess) throws ApplicationException;
	
	/**
     * 전체 목록
     *
     * @param ChatLogProcess the chatLogProcess
     * @return the list
     */
    public List<ChatLogProcess> findListAll(ChatLogProcess chatLogProcess, int currentPageNo, int recordCountPerPage) throws ApplicationException;
    
    /**
     * 타입 업데이트
     *
     * @param ChatLogProcess the chatLogProcess
     * @return the int
     */
	public int updateTypeByPrimaryKeySelective(ChatLogProcess chatLogProcess) throws ApplicationException;
	
	/**
	 * Log Process를 전체 갱신 한다.
	 * 
	 * @param cpLabel
	 * @param date
	 * @return
	 * @throws BizCheckedException
	 */
	public String updateChatLogProcessAll(String cpLabel, String date) throws BizCheckedException;
}
