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
 * Seo Jong Hwa        2016 . 7 . 6
 */

package com.kt.programk.common.wo;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

/**
 * Trace용
 */
@XmlRootElement(name="response")
@XmlAccessorType(XmlAccessType.NONE)
public class ProgramkTraceResponse {

    /**
     * API 응답 값
     */
    private List<ProgramkResponse> programkResponses;

    /**
     * 전처리 결과
     */
    private String input;

    /**
     * Bot 파일 경로
     */
    List<String> file;

    /**
     * 카테고리 경로
     */
    List<String> path;

    /**
     * Gets programk responses.
     *
     * @return the programk responses
     */
    public List<ProgramkResponse> getProgramkResponses() {
        return programkResponses;
    }

    /**
     * Sets programk responses.
     *
     * @param programkResponses the programk responses
     */
    public void setProgramkResponses(List<ProgramkResponse> programkResponses) {
        this.programkResponses = programkResponses;
    }

    /**
     * Gets file.
     *
     * @return the file
     */
    public List<String> getFile() {
        return file;
    }

    /**
     * Sets file.
     *
     * @param file the file
     */
    public void setFile(List<String> file) {
        this.file = file;
    }

    /**
     * Gets path.
     *
     * @return the path
     */
    public List<String> getPath() {
        return path;
    }

    /**
     * Sets path.
     *
     * @param trace the trace
     */
    public void setPath(List<String> trace) {
        this.path = trace;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }
}
