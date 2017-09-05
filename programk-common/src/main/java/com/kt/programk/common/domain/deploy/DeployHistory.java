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
 *  Seo Jong Hwa 16. 8. 22 오후 5:09
 *
 *
 */

package com.kt.programk.common.domain.deploy;

import java.util.Date;

import com.kt.programk.common.domain.PagingExample;

/**
 * 배포 성공/실패 또는 봇 변경시 입력된다.
 */
public class DeployHistory extends PagingExample{
    /**
     * The Id.
     */
    private int id;
    /**
     * The Scheduler id.
     */
    private int schedulerId;
    /**
     * The File name.
     */
    private String fileName;
    /**
     * The File body.
     */
    private String fileBody;
    /**
     * The File type.
     */
    private String fileType;
    /**
     * The Description.
     */
    private String description;
    /**
     * The Created.
     */
    private Date created;
    /**
     * 파일정보
     */
    private String fileInfo;
    /**
     * cpId
     */
    private int cpId;
    /**
     * 배포설정시간
     */
    private Date deployDate;
    /**
     * 처리메세지
     */
    private String message;
    /**
     * 완료여부
     */
    private String completed;
    /**
     * 작업자
     */
    private String userId;
    /**
     * 구분자
     */
    private String gubun;
    /**
     * subLabel
     */
    private String subLabel;

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
     * Gets scheduler id.
     *
     * @return the scheduler id
     */
    public int getSchedulerId() {
        return schedulerId;
    }

    /**
     * Sets scheduler id.
     *
     * @param schedulerId the scheduler id
     */
    public void setSchedulerId(int schedulerId) {
        this.schedulerId = schedulerId;
    }

    /**
     * Gets file name.
     *
     * @return the file name
     */
    public String getFileName() {
        return fileName;
    }

    /**
     * Sets file name.
     *
     * @param fileName the file name
     */
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    /**
     * Gets file body.
     *
     * @return the file body
     */
    public String getFileBody() {
        return fileBody;
    }

    /**
     * Sets file body.
     *
     * @param fileBody the file body
     */
    public void setFileBody(String fileBody) {
        this.fileBody = fileBody;
    }

    /**
     * Gets file type.
     *
     * @return the file type
     */
    public String getFileType() {
        return fileType;
    }

    /**
     * Sets file type.
     *
     * @param fileType the file type
     */
    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    /**
     * Gets description.
     *
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets description.
     *
     * @param description the description
     */
    public void setDescription(String description) {
        this.description = description;
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
     * Gets file info.
     *
     * @return the file info
     */
    public String getFileInfo() {
		return fileInfo;
	}

    /**
     * Sets file info.
     *
     * @param fileInfo the file info
     */
    public void setFileInfo(String fileInfo) {
		this.fileInfo = fileInfo;
	}

	public int getCpId() {
		return cpId;
	}

	public void setCpId(int cpId) {
		this.cpId = cpId;
	}

	public Date getDeployDate() {
		return deployDate;
	}

	public void setDeployDate(Date deployDate) {
		this.deployDate = deployDate;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getCompleted() {
		return completed;
	}

	public void setCompleted(String completed) {
		this.completed = completed;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getGubun() {
		return gubun;
	}

	public void setGubun(String gubun) {
		this.gubun = gubun;
	}

	public String getSubLabel() {
		return subLabel;
	}

	public void setSubLabel(String subLabel) {
		this.subLabel = subLabel;
	}		
}
