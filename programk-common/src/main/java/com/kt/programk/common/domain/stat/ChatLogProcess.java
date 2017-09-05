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
 *  preludio 16. 12. 05
 *
 *
 */

package com.kt.programk.common.domain.stat;

import com.kt.programk.common.domain.PagingExample;
import org.apache.camel.dataformat.bindy.annotation.CsvRecord;
import org.apache.camel.dataformat.bindy.annotation.DataField;

import java.util.Date;

/**
 * chat_log_process 레파지토리 도메인
 */
@CsvRecord(separator = ",")
public class ChatLogProcess extends PagingExample{
    /**
     * The constant MAX_LENGTH_USER_INPUT.
     */
    public final static int MAX_LENGTH_USER_INPUT = 255;
    /**
     * The constant MAX_LENGTH_CREATED.
     */
    public final static int MAX_LENGTH_CREATED= 14;
    /**
     * The constant MAX_LENGTH_CP_LABEL.
     */
    public final static int MAX_LENGTH_CP_LABEL= 255;
    /**
     * The constant MAX_LENGTH_TYPE.
     */
    public final static int MAX_LENGTH_TYPE= 1;
    /**
     * The constant MAX_LENGTH_INPUT.
     */
    public final static int MAX_LENGTH_INPUT = 255;
    /**
     * The constant MAX_LENGTH_CATE_NAME.
     */
    public final static int MAX_LENGTH_CATE_NAME = 128;
    
    /**
     * 고유 번호
     */
    @DataField(pos = 1)
    private int id;
    /**
     * cp라벨
     */
    @DataField(pos = 2)
    private String cpLabel;
    /**
     * 처리한(할) 질문 내역
     */
    @DataField(pos = 3)
    private String userInput;
    /**
     * 처리상태 ( S:신규 P:확인필요 E:처리완료 )
     */
    @DataField(pos = 4)
    private String type;
    /**
     * 생성일
     */
    @DataField(pos = 5)
    private Date created;

    /**
     * sDate - 검색용
     */
    private String sdate;
    /**
     * eDate - 검색용
     */
    private String edate;
    
    /**
     * 질문
     */
    private String input;
    /**
     * 대화 카테고리명
     */
    private String cateName;
    /**
     * 대화 응답
     */
    private String reply;

    /**
     * 대화 갯수
     */
    private int count;
   
    /**
     * sDate - 대화 최초 발생일
     */
    private Date mdate;
    /**
     * eDate - 대화 마지막 발생일
     */
    private Date xdate;
    
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
     * @param input the cpLabel
     */
    public void setCpLabel(String cpLabel) {
        this.cpLabel = cpLabel;
    }

    /**
     * Gets userInput.
     *
     * @return the userInput
     */
    public String getUserInput() {
        return userInput;
    }

    /**
     * Sets userInput.
     *
     * @param input the userInput
     */
    public void setUserInput(String userInput) {
        this.userInput = userInput;
    }

    /**
     * Gets type.
     *
     * @return the type
     */
    public String getType() {
        return type;
    }

    /**
     * Sets type.
     *
     * @param input the type
     */
    public void setType(String type) {
        this.type = type;
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
     * @param input the created
     */
    public void setCreated(Date created) {
        this.created = created;
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
     * Gets reply.
     *
     * @return the reply
     */
    public String getReply() {
        return reply;
    }

    /**
     * Sets cate name.
     *
     * @param cateName the cate name
     */
    public void setReply(String reply) {
        this.reply = reply;
    }
    
    /**
     * Gets count.
     *
     * @return the id
     */
    public int getCount() {
        return count;
    }

    /**
     * Sets count.
     *
     * @param id the id
     */
    public void setCount(int count) {
        this.count = count;
    }
    
    /**
     * Gets mdate.
     *
     * @return the mdate
     */
    public Date getMdate() {
		return mdate;
	}

    /**
     * Sets stDate.
     *
     * @param stDate the stDate
     */
    public void setMdate(Date mdate) {
		this.mdate = mdate;
	}

    /**
     * Gets xdate.
     *
     * @return the xdate
     */
    public Date getXdate() {
		return xdate;
	}

    /**
     * Sets edate.
     *
     * @param edate the edate
     */
    public void setXdate(Date xdate) {
		this.xdate = xdate;
	}
}
