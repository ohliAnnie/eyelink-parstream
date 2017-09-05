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

package com.kt.programk.common.repository.stat;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.kt.programk.common.domain.stat.ChatLog;
import com.kt.programk.common.domain.stat.ChatLogProcess;

/**
 * The interface Chat log mapper.
 */
@Repository(value = "chatLogProcessMapper")
public interface ChatLogProcessMapper {
    /**
     * 개수 조회
     *
     * @param chatLogProcess the ChatLogProcess
     * @return the int
     */
    public int countAll(ChatLogProcess chatLogProcess);

    /**
     * 조회
     *
     * @param chatLogProcess the ChatLogProcess
     * @return chat log
     */
    public ChatLogProcess select(ChatLogProcess chatLogProcess);
    
    /**
     * 조회
     *
     * @param chatLogProcess the ChatLogProcess
     * @return chat log
     */
    public int selectCount(ChatLogProcess chatLogProcess);
 
    /**
     * 조회
     *
     * @param chatLogProcess the ChatLogProcess
     * @return chat log process
     */
    public ChatLogProcess selectByPrimaryKey(ChatLogProcess chatLogProcess);
 
    /**
     * chatlog 연계조회
     *
     * @param chatLogProcess the ChatLogProcess
     * @return chat log process
     */
    public ChatLogProcess selectChatLogByPrimaryKey(ChatLogProcess chatLogProcess);
 
 
    /**
     * 최근 한건 조회
     *
     * @param chatLogProcess the ChatLogProcess
     * @return chat log process
     */
    public ChatLogProcess selectNewChatLogProcess(ChatLogProcess chatLogProcess);
    
    /**
     * 목록 조회
     *
     * @param chatLogProcess the ChatLogProcess
     * @return list
     */
    public List<ChatLogProcess> selectList(ChatLogProcess chatLogProcess);

    /**
     * 추가
     *
     * @param chatLogProcess the ChatLogProcess
     * @return int
     */
    public int insert(ChatLogProcess chatLogProcess);

    /**
     * 추가
     *
     * @param chatLogProcess the ChatLogProcess
     * @return int
     */
    public int insertNewUserInput(ChatLogProcess chatLogProcess);    
    
    /**
     * 상태 업데이트
     *
     * @param chatLogProcess the ChatLogProcess
     * @return int
     */
    public int updateType(ChatLogProcess chatLogProcess);
   
    /**
     * 수정
     *
     * @param chatLogProcess the ChatLogProcess
     * @return int
     */
    public int updateTypeByPrimaryKeySelective(ChatLogProcess chatLogProcess);
}
