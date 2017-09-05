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
 * preludio            2016 . 12 . 06
 */

package com.kt.programk.cms.service.impl;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import com.kt.programk.cms.service.ChatLogProcessService;
import com.kt.programk.common.domain.stat.ChatLogProcess;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.repository.stat.ChatLogProcessMapper;
import com.kt.programk.common.utils.DbExceptionUtil;

/**
 * @author USER
 *
 */
@Service
public class ChatLogProcessServiceImpl implements ChatLogProcessService {
	/**
	 * The chat Log mapper.
	 */
	@Autowired
	private ChatLogProcessMapper chatLogProcessMapper;

	/**
	 * 전체 개수
	 *
	 * @return the int
	 */
	@Override
	public int countAll(ChatLogProcess chatLogProcess) throws ApplicationException {
		try {
			return chatLogProcessMapper.countAll(chatLogProcess);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
		}
	}

	/**
	 * 한건 조회
	 *
	 * @return the int
	 */
	@Override
	public ChatLogProcess selectChatLog(ChatLogProcess chatLogProcess) throws ApplicationException {
		try {
			return chatLogProcessMapper.selectChatLogByPrimaryKey(chatLogProcess);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
		}
	}

	/**
	 * 전체 목록
	 *
	 * @param currentPageNo
	 * @param recordCountPerPage
	 * @return the list
	 */
	@Override
	public List<ChatLogProcess> findListAll(ChatLogProcess chatLogProcess, int currentPageNo, int recordCountPerPage) throws ApplicationException {
		chatLogProcess.setRecordCountPerPage(recordCountPerPage);
		chatLogProcess.setFirstRecordIndex((currentPageNo - 1) * recordCountPerPage);

		try {
			return chatLogProcessMapper.selectList(chatLogProcess);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
		}
	}

	/**
	 * 타입 업데이트
	 *
	 * @return the int
	 */
	@Override
	public int updateTypeByPrimaryKeySelective(ChatLogProcess chatLogProcess) throws ApplicationException {
		try {
			return chatLogProcessMapper.updateTypeByPrimaryKeySelective(chatLogProcess);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
		}
	}

	/**
	 * 최근 한건 조회
	 *
	 * @return the int
	 */
	@Override
	public ChatLogProcess selectNewChatLogProcess(ChatLogProcess chatLogProcess) throws ApplicationException {
		try {
			return chatLogProcessMapper.selectNewChatLogProcess(chatLogProcess);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
		}
	}

	@Override
	public String updateChatLogProcessAll(String cpLabel, String date) throws BizCheckedException {

		if (StringUtils.isEmpty(cpLabel))
			throw new BizCheckedException(BizErrCode.ERR_0001, "cpLabel");
		if (StringUtils.isEmpty(date))
			throw new BizCheckedException(BizErrCode.ERR_0001, "date");

		ChatLogProcess chatLogProcess = new ChatLogProcess();
		chatLogProcess.setSdate(date + " 00:00:00");
		chatLogProcess.setEdate(date + " 23:59:59");

		chatLogProcess.setCpLabel(cpLabel);
		int result = chatLogProcessMapper.insertNewUserInput(chatLogProcess);
		return String.valueOf(result);
	}
}
