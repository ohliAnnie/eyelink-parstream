/*
 * Copyright (c) 2016 KT, Inc.
 * All right reserved.
 * This software is the confidential and proprietary information of KT
 * , Inc. You shall not disclose such Confidential Information and
 * shall use it only in accordance with the terms of the license agreement
 * you entered into with KT.
 *
 * Revision History
 * Author Date Description
 *  ------------------ -------------- ------------------
 * Seo Jong Hwa 16. 8. 30 오전 12:32
 */

package com.kt.programk.common.domain.core;

/**
 * Created by redpunk on 2016-08-30.
 */
public class AimlBots {
    /**
     * The Sub label.
     */
    private String subLabel;
    /**
     * The File name.
     */
    private String fileName;
    /**
     * The File type.
     */
    private String fileType;

    /**
     * Gets sub label.
     *
     * @return the sub label
     */
    public String getSubLabel() {
        return subLabel;
    }

    /**
     * Sets sub label.
     *
     * @param subLabel the sub label
     */
    public void setSubLabel(String subLabel) {
        this.subLabel = subLabel;
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
}
