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
 *  Seo Jong Hwa 16. 8. 22 오후 5:10
 *
 *
 */

package com.kt.programk.common.domain.deploy;

import com.kt.programk.common.domain.PagingExample;

import java.util.Date;

/**
 * 노드별 파일 배포 완료 여부 기록
 */
public class DeployNodeHistory extends PagingExample{
    /**
     * 스케줄러 고유 번호
     */
    private int schedulerId;
    /**
     * 호스트명
     */
    private String hostIp;
    /**
     * 생성일
     */
    private Date created;
    /**
     * 수정일
     */
    private Date modified;
    /**
     * 파일 배포 성공
     */
    private String writeSuccess;

    /**
     * 파일 reload 성공
     */
    private String readSuccess;

    /**
     * 파일명
     */
    private String fileName;


    /**
     * 에러가 난 구문
     */
    private String errMsg;

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
     * Gets host ip.
     *
     * @return the host ip
     */
    public String getHostIp() {
        return hostIp;
    }

    /**
     * Sets host ip.
     *
     * @param hostIp the host ip
     */
    public void setHostIp(String hostIp) {
        this.hostIp = hostIp;
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
     * Gets modified.
     *
     * @return the modified
     */
    public Date getModified() {
        return modified;
    }

    /**
     * Sets modified.
     *
     * @param modified the modified
     */
    public void setModified(Date modified) {
        this.modified = modified;
    }

    /**
     * Gets write success.
     *
     * @return the write success
     */
    public String getWriteSuccess() {
        return writeSuccess;
    }

    /**
     * Sets write success.
     *
     * @param writeSuccess the write success
     */
    public void setWriteSuccess(String writeSuccess) {
        this.writeSuccess = writeSuccess;
    }

    /**
     * Gets read success.
     *
     * @return the read success
     */
    public String getReadSuccess() {
        return readSuccess;
    }

    /**
     * Sets read success.
     *
     * @param readSuccess the read success
     */
    public void setReadSuccess(String readSuccess) {
        this.readSuccess = readSuccess;
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
     * Gets err msg.
     *
     * @return the err msg
     */
    public String getErrMsg() {
        return errMsg;
    }

    /**
     * Sets err msg.
     *
     * @param errMsg the err msg
     */
    public void setErrMsg(String errMsg) {
        this.errMsg = errMsg;
    }
}
