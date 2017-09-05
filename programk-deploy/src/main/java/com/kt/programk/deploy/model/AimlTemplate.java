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

import java.util.List;

/**
 * aiml_main, aiml_image, aiml_link 도메인 구조
 */
public class AimlTemplate {
    /**
     * 이미지는 1개
     */
    private AimlImagesDTO image;
    /**
     * 링크는 N개
     */
    private List<AimlLinkDTO> urls;
    /**
     * 추가 질문 내역 N개
     */
    private List<AimlReplyDTO> mpatterns;
    /**
     * 다음 추천 질문 N개
     */
    private List<AimlRecommendDTO> recommends;

    /**
     * 확장 필드 N개
     *
     * @return
     */
    private List<AimlOptionDTO> options;

    /**
     * Gets image.
     *
     * @return the image
     */
    public AimlImagesDTO getImage() {
        return image;
    }

    /**
     * Sets image.
     *
     * @param image the image
     */
    public void setImage(AimlImagesDTO image) {
        this.image = image;
    }

    /**
     * Gets urls.
     *
     * @return the urls
     */
    public List<AimlLinkDTO> getUrls() {
        return urls;
    }

    /**
     * Sets urls.
     *
     * @param urls the urls
     */
    public void setUrls(List<AimlLinkDTO> urls) {
        this.urls = urls;
    }

    /**
     * Gets mpatterns.
     *
     * @return the mpatterns
     */
    public List<AimlReplyDTO> getMpatterns() {
        return mpatterns;
    }

    /**
     * Sets mpatterns.
     *
     * @param mpatterns the mpatterns
     */
    public void setMpatterns(List<AimlReplyDTO> mpatterns) {
        this.mpatterns = mpatterns;
    }

    /**
     * Gets recommends.
     *
     * @return the recommends
     */
    public List<AimlRecommendDTO> getRecommends() {
        return recommends;
    }

    /**
     * Sets recommends.
     *
     * @param recommends the recommends
     */
    public void setRecommends(List<AimlRecommendDTO> recommends) {
        this.recommends = recommends;
    }

    /**
     * Gets options.
     *
     * @return the options
     */
    public List<AimlOptionDTO> getOptions() {
        return options;
    }

    /**
     * Sets options.
     *
     * @param options the options
     */
    public void setOptions(List<AimlOptionDTO> options) {
        this.options = options;
    }
}
