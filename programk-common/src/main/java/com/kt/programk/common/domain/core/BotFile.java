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
 *  Seo Jong Hwa 16. 8. 22 오후 5:08
 *
 *
 */

package com.kt.programk.common.domain.core;

import com.kt.programk.common.domain.PagingExample;

import java.util.Date;

/**
 * 서비스 마다 네개의 subLabel 이 생성된다.
 */
public class BotFile extends PagingExample{
    /**
     * The Bot id.
     */
    private int id;
    /**
     * 봇아이디
     */
    private int botId;
    /**
     * The Path.
     */
    private String path;
    /**
     * The Last loaded.
     */
    private Date lastLoaded;
    /**
     * The File type.
     */
    private String fileType;

    /**
     * 파일명
     */
    private String fileName;

    /**
     * Gets bot id.
     *
     * @return the bot id
     */
    public int getId() {
        return id;
    }

    /**
     * Sets bot id.
     *
     * @param id the bot id
     */
    public void setId(int id) {
        this.id = id;
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
     * Gets last loaded.
     *
     * @return the last loaded
     */
    public Date getLastLoaded() {
        return lastLoaded;
    }

    /**
     * Sets last loaded.
     *
     * @param lastLoaded the last loaded
     */
    public void setLastLoaded(Date lastLoaded) {
        this.lastLoaded = lastLoaded;
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
     * Gets bot id.
     *
     * @return the bot id
     */
    public int getBotId() {
        return botId;
    }

    /**
     * Sets bot id.
     *
     * @param botId the bot id
     */
    public void setBotId(int botId) {
        this.botId = botId;
    }
}
