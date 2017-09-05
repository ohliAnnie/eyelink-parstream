/*
 * Copyright (c) 2016 KTF, Inc.
 * All right reserved.
 * This software is the confidential and proprietary information of {comp}
 * , Inc. You shall not disclose such Confidential Information and
 * shall use it only in accordance with the terms of the license agreement
 * you entered into with {comp}.
 *
 * Revision History
 * Author              Date                  Description
 * ------------------   --------------       ------------------
 * Seo Jong Hwa        2016 . 6 . 13
 */

package com.kt.programk.common.domain.core;

import com.kt.programk.common.domain.PagingExample;

/**
 * 링크 정보
 */
public class AimlLink extends PagingExample{
    /**
     * The constant MAX_LENGTH_TITLE.
     */
    public final static int MAX_LENGTH_TITLE = 100;
    /**
     * The constant MAX_LENGTH_COMMENT.
     */
    public final static int MAX_LENGTH_COMMENT = 255;
    /**
     * The constant MAX_LENGTH_URL.
     */
    public final static int MAX_LENGTH_URL = 255;

    /**
     * 대화 카테고리 고유 번호
     */
    private int cateId;
    /**
     * 대화 고유 번호
     */
    private int mainId;
    /**
     * 고유 번호
     */
    private int id;
    /**
     * 제목
     */
    private String title;
    /**
     * 링크 URL
     */
    private String url;

    /**
     * 설명
     */
    private String comment;

    /**
     * Gets cp id.
     *
     * @return the cp id
     */
    public int getCateId() {
        return cateId;
    }

    /**
     * Sets cp id.
     *
     * @param cpId the cp id
     */
    public void setCateId(int cpId) {
        this.cateId = cpId;
    }

    /**
     * Gets main id.
     *
     * @return the main id
     */
    public int getMainId() {
        return mainId;
    }

    /**
     * Sets main id.
     *
     * @param mainId the main id
     */
    public void setMainId(int mainId) {
        this.mainId = mainId;
    }

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
        this.title = title;
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
        this.url = url;
    }

    /**
     * Gets comment.
     *
     * @return comment
     */
    public String getComment() {
        return comment;
    }

    /**
     * Sets comment.
     *
     * @param comment the comment
     */
    public void setComment(String comment) {
        this.comment = comment;
    }
}
