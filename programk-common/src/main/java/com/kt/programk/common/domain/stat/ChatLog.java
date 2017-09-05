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
 *  Seo Jong Hwa 16. 8. 22 오후 5:11
 *
 *
 */

package com.kt.programk.common.domain.stat;

import com.kt.programk.common.domain.PagingExample;
import org.apache.camel.dataformat.bindy.annotation.CsvRecord;
import org.apache.camel.dataformat.bindy.annotation.DataField;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * chat_log 레파지토리 도메인
 */
@CsvRecord(separator = ",")
public class ChatLog extends PagingExample{
    /**
     * The constant MAX_LENGTH_USER_ID.
     */
    public final static int MAX_LENGTH_USER_ID = 50;
    /**
     * The constant MAX_LENGTH_INPUT.
     */
    public final static int MAX_LENGTH_INPUT = 255;
    /**
     * The constant MAX_LENGTH_USER_INPUT.
     */
    public final static int MAX_LENGTH_USER_INPUT = 255;
    /**
     * The constant MAX_LENGTH_CATE_NAME.
     */
    public final static int MAX_LENGTH_CATE_NAME = 128;
    /**
     * The constant MAX_LENGTH_CREATED.
     */
    public final static int MAX_LENGTH_CREATED= 14;
    /**
     * The constant MAX_LENGTH_CP_LABEL.
     */
    public final static int MAX_LENGTH_CP_LABEL= 255;

    /**
     * 고유 번호
     */
    @DataField(pos = 1)
    private int id;
    
    /**
     * 사용자 아이디
     */
    @DataField(pos = 3)
    private String userId;
    
    /**
     * 사용자 아이디 - 다중 검색용
     */
    private List<String> userIdList;
    
    /**
     * 사용자 아이디 제외
     */
    private String exUserId;
    
    /**
     * 사용자 아이디 제외 - 다중 검색용
     */
    private List<String> exUserIdList;
    
    /**
     * 질문
     */
    @DataField(pos = 5)
    private String input;
    
    /**
     * 답변
     */
    @DataField(pos = 5)
    private String reply;
    
    /**
     * 답변 - 다중 검색용
     */
    private List<String> replyList;
    
    /**
     * 답변 제외
     */
    private String exReply;
    
    /**
     * 답변 제외 - 다중 검색용
     */
    private List<String> exReplyList;   
    
    /**
     * 대화 카테고리명
     */
    @DataField(pos = 6)
    private String cateName;
    /**
     * 생성일
     */
    @DataField(pos = 7)
    private Date created;
    /**
     * cp id - 검색용
     */
    private int cpId;
    /**
     * sDate - 검색용
     */
    private String sdate;
    /**
     * eDate - 검색용
     */
    private String edate;
    
    /**
     * 사용자가 입력한 질문
     */
    @DataField(pos = 4)
    private String userInput;
    
    /**
     * 사용자가 입력한 질문 - 다중 검색용
     */
    private List<String> userInputList;
    
    /**
     * 사용자가 입력한 질문 제외
     */
    private String exUserInput;
    
    /**
     * 사용자가 입력한 질문 제외 - 다중 검색용
     */
    private List<String> exUserInputList;
    
    /**
     * 봇아이디
     */
    @DataField(pos = 2)
    private String cpLabel;


    /**
     * Gets id.
     *
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * Sets id.
     *
     * @param id the id
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Gets user id.
     *
     * @return the user id
     */
    public String getUserId() {
        return userId;
    }
    
    public List<String> getUserIdList() {
        return userIdList;
    }
    
    /**
     * Sets user id.
     *
     * @param userId the user id
     */
    public void setUserId(String userId) {
        this.userId = userId;
        
        userIdList = new ArrayList<String>(); 
    	// 다중 검색을 위한 array 추가
        String[] array = userId.split(",");
    	for(int i = 0 ; i < array.length ; i++) {
    		String arr = array[i].trim();
    		if(arr.length() > 0) userIdList.add(arr);
    	}
    }

    /**
     * Gets ex user id.
     *
     * @return the ex user id
     */
    public String getExUserId() {
        return exUserId;
    }
    
    public List<String> getExUserIdList() {
        return exUserIdList;
    }
    
    /**
     * Sets ex user id.
     *
     * @param userId the ex user id
     */
    public void setExUserId(String exUserId) {
        this.exUserId = exUserId;
        
        exUserIdList = new ArrayList<String>(); 
    	// 다중 검색을 위한 array 추가
        String[] array = exUserId.split(",");
    	for(int i = 0 ; i < array.length ; i++) {
    		String arr = array[i].trim();
    		if(arr.length() > 0) exUserIdList.add(arr);
    	}
    }
    
    /**
     * Gets input.
     *
     * @return the input
     */
    public String getInput() {
        return input;
    }
    
    /**
     * Sets input.
     *
     * @param input the input
     */
    public void setInput(String input) {
        this.input = input;
    }

    /**
     * Gets reply.
     *
     * @return the reply
     */
    public String getReply() {
        return reply;
    }

    public List<String> getReplyList() {
        return replyList;
    }
    
    /**
     * Sets reply.
     *
     * @param reply the reply
     */
    public void setReply(String reply) {
        this.reply = reply;
        
        replyList = new ArrayList<String>(); 
    	// 다중 검색을 위한 array 추가
        String[] array = reply.split(",");
    	for(int i = 0 ; i < array.length ; i++) {
    		String arr = array[i].trim();
    		if(arr.length() > 0) replyList.add(arr);
    	}
    }

    /**
     * Gets ex reply.
     *
     * @return the ex reply
     */
    public String getExReply() {
        return exReply;
    }

    public List<String> getExReplyList() {
        return exReplyList;
    }
    
    /**
     * Sets ex reply.
     *
     * @param reply the ex reply
     */
    public void setExReply(String exReply) {
        this.exReply = exReply;
        
        exReplyList = new ArrayList<String>(); 
    	// 다중 검색을 위한 array 추가
        String[] array = exReply.split(",");
    	for(int i = 0 ; i < array.length ; i++) {
    		String arr = array[i].trim();
    		if(arr.length() > 0) exReplyList.add(arr);
    	}
    }
    
    /**
     * Gets cate name.
     *
     * @return the cate name
     */
    public String getCateName() {
        return cateName;
    }

    /**
     * Sets cate name.
     *
     * @param cateName the cate name
     */
    public void setCateName(String cateName) {
        this.cateName = cateName;
    }

    /**
     * Gets created.
     *
     * @return the created
     */
    public Date getCreated() {
        return created;
    }

    /**
     * Sets created.
     *
     * @param created the created
     */
    public void setCreated(Date created) {
        this.created = created;
    }

    /**
     * Gets cp id.
     *
     * @return the cp id
     */
    public int getCpId() {
		return cpId;
	}

    /**
     * Sets cp id.
     *
     * @param cpId the cp id
     */
    public void setCpId(int cpId) {
		this.cpId = cpId;
	}

    /**
     * Gets sdate.
     *
     * @return the sdate
     */
    public String getSdate() {
		return sdate;
	}

    /**
     * Sets sdate.
     *
     * @param sdate the sdate
     */
    public void setSdate(String sdate) {
		this.sdate = sdate;
	}

    /**
     * Gets edate.
     *
     * @return the edate
     */
    public String getEdate() {
		return edate;
	}

    /**
     * Sets edate.
     *
     * @param edate the edate
     */
    public void setEdate(String edate) {
		this.edate = edate;
	}

    /**
     * Gets user input.
     *
     * @return the user input
     */
    public String getUserInput() {
        return userInput;
    }
    /**
     * Gets user input list.
     *
     * @return the user input list
     */
    public List<String> getUserInputList() {
        return userInputList;
    }
    
    /**
     * Sets user input.
     *
     * @param userInput the user input
     */
    public void setUserInput(String userInput) {
        this.userInput = userInput;
        
        userInputList = new ArrayList<String>(); 
    	// 다중 검색을 위한 array 추가
        String[] array = userInput.split(",");
    	for(int i = 0 ; i < array.length ; i++) {
    		String arr = array[i].trim();
    		if(arr.length() > 0) userInputList.add(arr);
    	}
    }

    /**
     * Gets ex user input.
     *
     * @return the ex user input
     */
    public String getExUserInput() {
        return exUserInput;
    }
    /**
     * Gets ex user input list.
     *
     * @return the ex user input list
     */
    public List<String> getExUserInputList() {
        return exUserInputList;
    }
    
    /**
     * Sets ex user input.
     *
     * @param userInput the ex user input
     */
    public void setExUserInput(String exUserInput) {
        this.exUserInput = exUserInput;
        
        exUserInputList = new ArrayList<String>(); 
    	// 다중 검색을 위한 array 추가
        String[] array = exUserInput.split(",");
    	for(int i = 0 ; i < array.length ; i++) {
    		String arr = array[i].trim();
    		if(arr.length() > 0) exUserInputList.add(arr);
    	}
    }    
    
    /**
     * Gets cp label.
     *
     * @return the cp label
     */
    public String getCpLabel() {
        return cpLabel;
    }

    /**
     * Sets cp label.
     *
     * @param cpLabel the cp label
     */
    public void setCpLabel(String cpLabel) {
        this.cpLabel = cpLabel;
    }
}
