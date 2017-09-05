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

package com.kt.programk.common.domain.core;

import com.kt.programk.common.domain.PagingExample;

/**
 * 이미지 링크 정보
 */
public class AimlImages extends PagingExample {
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
     * 대체 텍스트
     */
    private String alt;
    
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
     * Gets alt.
     *
     * @return the alt
     */
    public String getAlt() {
        return alt;
    }

    /**
     * Sets alt.
     *
     * @param alt the alt
     */
    public void setAlt(String alt) {
        this.alt = alt;
    }
}
