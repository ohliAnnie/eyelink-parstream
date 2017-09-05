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
 * Seo Jong Hwa        2016 . 6 . 21
 */

package com.kt.programk.common.domain.deploy;

import java.util.Date;
import java.util.TreeMap;

import com.kt.programk.common.domain.PagingExample;

/**
 * 배포 스케줄러
 */
public class DeployScheduler extends PagingExample {
    /**
     * The Id.
     */
    private int id;
    /**
     * The Label.
     */
    private String subLabel;
    /**
     * The Path.
     */
    private String path;
    /**
     * The Deploy date.
     */
    private Date deployDate;
    /**
     * The Cp id.
     */
    private int cpId;
    /**
     * 완료 여부
     */
    private String completed;
    /**
     * The File type.
     */
    private String fileType;
    /**
     * 파일 배포시에 경로 저장
     */
    private TreeMap<String, String> fileMap = new TreeMap<>();
    /**
     * 부연 설명
     */
    private String description;
    /**
     * 작업자아이디
     */
    private String userId;
    /**
     * 작업구분
     */
    private String gubun;

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
     * Gets label.
     *
     * @return the label
     */
    public String getSubLabel() {
		return subLabel;
	}

    /**
     * Sets label.
     *
     * @param subLabel the sub label
     */
    public void setSubLabel(String subLabel) {
		this.subLabel = subLabel;
	}

    /**
     * Gets path.
     *
     * @return the path
     */
    public String getPath() {
        return path;
    }

    /**
     * Sets path.
     *
     * @param path the path
     */
    public void setPath(String path) {
        this.path = path;
    }

    /**
     * Gets deploy date.
     *
     * @return the deploy date
     */
    public Date getDeployDate() {
        return deployDate;
    }

    /**
     * Sets deploy date.
     *
     * @param deployDate the deploy date
     */
    public void setDeployDate(Date deployDate) {
        this.deployDate = deployDate;
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
     * Gets completed.
     *
     * @return the completed
     */
    public String getCompleted() {
        return completed;
    }

    /**
     * Sets completed.
     *
     * @param completed the completed
     */
    public void setCompleted(String completed) {
        this.completed = completed;
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
     * Gets file map.
     *
     * @return the file map
     */
    public TreeMap<String, String> getFileMap() {
        return fileMap;
    }

    /**
     * Gets user id.
     *
     * @return the user id
     */
    public String getUserId() {
		return userId;
	}

    /**
     * Sets user id.
     *
     * @param userId the user id
     */
    public void setUserId(String userId) {
		this.userId = userId;
	}

    /**
     * Gets gubun.
     *
     * @return the gubun
     */
    public String getGubun() {
		return gubun;
	}

    /**
     * Sets gubun.
     *
     * @param gubun the gubun
     */
    public void setGubun(String gubun) {
		this.gubun = gubun;
	}    
}
