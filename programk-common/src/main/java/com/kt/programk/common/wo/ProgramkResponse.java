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

package com.kt.programk.common.wo;

import javax.xml.bind.annotation.*;
import java.io.Serializable;

/**
 * Created by redpunk on 2016-05-31.
 */
@XmlRootElement(name = "response")
@XmlAccessorType(XmlAccessType.NONE)
public class ProgramkResponse implements Serializable {
    /**
     * The constant serialVersionUID.
     */
    private static final long serialVersionUID = 1L;

    /**
     * 사용자 질문에 대한 답변
     */
    @XmlAttribute
    protected String body;

    /**
     * 전달도니 URL은 새창으로 표시
     */
    @XmlElement
    protected Urls[] urls;

    /**
     * 이미지 링크
     */
    @XmlElement
    protected String[] image;

    /**
     * 이미지 설명
     */
    @XmlElement
    protected String[] image_alt_text;
    
    /**
     * 사용자에게 제시할 다음 질문에 대한 예시
     */
    @XmlElement
    protected String[] responses;

    /**
     * 확장 필드
     */
    @XmlElement
    protected String[] option1;

    /**
     * 확장 필드
     */
    @XmlElement
    protected String[] option2;

    /**
     * 확장 필드
     */
    @XmlElement
    protected String[] option3;

    /**
     * 확장 필드
     */
    @XmlElement
    protected String[] option4;

    /**
     * 확장 필드
     */
    @XmlElement
    protected String[] option5;


    /**
     * Instantiates a new Programk response.
     */
    public ProgramkResponse() {
    }

    /**
     * Gets body.
     *
     * @return the body
     */
    public String getBody() {
        return body;
    }

    /**
     * Sets body.
     *
     * @param body the body
     */
    public void setBody(String body) {
        this.body = body;
    }

    /**
     * Get urls urls [ ].
     *
     * @return the urls [ ]
     */
    public Urls[] getUrls() {
        return urls;
    }

    /**
     * Sets urls.
     *
     * @param urls the urls
     */
    public void setUrls(Urls[] urls) {
        this.urls = urls;
    }

    /**
     * Gets image.
     *
     * @return the image
     */
    public String[] getImage() {
        return image;
    }

    /**
     * Sets image.
     *
     * @param image the image
     */
    public void setImage(String[] image) {
        this.image = image;
    }

    /**
     * Gets image alt.
     *
     * @return the image alt
     */
    public String[] getAlt() {
        return image_alt_text;
    }

    /**
     * Sets image alt.
     *
     * @param image alt the image alt
     */
    public void setAlt(String[] alt) {
        this.image_alt_text = alt;
    }
    
    /**
     * Get responses string [ ].
     *
     * @return the string [ ]
     */
    public String[] getResponses() {
        return responses;
    }

    /**
     * Sets responses.
     *
     * @param responses the responses
     */
    public void setResponses(String[] responses) {
        this.responses = responses;
    }


    /**
     * Get option 1 string [ ].
     *
     * @return the string [ ]
     */
    public String[] getOption1() {
        return option1;
    }

    /**
     * Sets option 1.
     *
     * @param option1 the option 1
     */
    public void setOption1(String[] option1) {
        this.option1 = option1;
    }

    /**
     * Get option 2 string [ ].
     *
     * @return the string [ ]
     */
    public String[] getOption2() {
        return option2;
    }

    /**
     * Sets option 2.
     *
     * @param option2 the option 2
     */
    public void setOption2(String[] option2) {
        this.option2 = option2;
    }

    /**
     * Get option 3 string [ ].
     *
     * @return the string [ ]
     */
    public String[] getOption3() {
        return option3;
    }

    /**
     * Sets option 3.
     *
     * @param option3 the option 3
     */
    public void setOption3(String[] option3) {
        this.option3 = option3;
    }

    /**
     * Get option 4 string [ ].
     *
     * @return the string [ ]
     */
    public String[] getOption4() {
        return option4;
    }

    /**
     * Sets option 4.
     *
     * @param option4 the option 4
     */
    public void setOption4(String[] option4) {
        this.option4 = option4;
    }

    /**
     * Get option 5 string [ ].
     *
     * @return the string [ ]
     */
    public String[] getOption5() {
        return option5;
    }

    /**
     * Sets option 5.
     *
     * @param option5 the option 5
     */
    public void setOption5(String[] option5) {
        this.option5 = option5;
    }
}
