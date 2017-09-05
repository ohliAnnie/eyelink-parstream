/*
 *  Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
package com.kt.programk.cms.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import com.kt.programk.cms.service.ChatLogService;
import com.kt.programk.common.domain.stat.ChatLog;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.repository.stat.ChatLogMapper;
import com.kt.programk.common.utils.DbExceptionUtil;

/**
 * @author USER
 *
 */
@Service
public class ChatLogServiceImpl implements ChatLogService {
    /**
     * The chat Log mapper.
     */
    @Autowired
    private ChatLogMapper chatLogMapper;    

    /**
     * 전체 개수
     *
     * @return the int
     */
	@Override
	public int countAll(ChatLog chatLog) throws ApplicationException {
		try {
            return chatLogMapper.countAll(chatLog);
        }catch (DataAccessException ex) {
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
	public List<ChatLog> findListAll(ChatLog chatLog, int currentPageNo,
			int recordCountPerPage) throws ApplicationException {
		chatLog.setRecordCountPerPage(recordCountPerPage);
		chatLog.setFirstRecordIndex((currentPageNo - 1) * recordCountPerPage);

        try {
            return chatLogMapper.selectList(chatLog);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}

}
