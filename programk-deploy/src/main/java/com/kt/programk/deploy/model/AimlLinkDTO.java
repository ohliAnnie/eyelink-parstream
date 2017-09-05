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
 * Seo Jong Hwa        2016 . 6 . 27
 */

package com.kt.programk.deploy.model;

/**
 * Created by redpunk on 2016-06-27.
 */
public class AimlLinkDTO {
    /**
     * 제목
     */
    private String title = "";
    /**
     * 링크 URL
     */
    private String url = "";
    /**
     * 링크에 대한 간략한 설명
     */
    private String comment = "";

    /**
     * Gets title.
     *
     * @return the title
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets title.
     *
     * @param title the title
     */
    public void setTitle(String title) {
        if(title != null) {
            this.title = title;
        }
    }

    /**
     * Gets url.
     *
     * @return the url
     */
    public String getUrl() {
        return url;
    }

    /**
     * Sets url.
     *
     * @param url the url
     */
    public void setUrl(String url) {
        if(url != null) {
            this.url = url;
        }
    }

    /**
     * @return
     */
    public String getComment() {
        return comment;
    }

    /**
     * @param comment
     */
    public void setComment(String comment) {
        if(comment != null) {
            this.comment = comment;
        }
    }
}
