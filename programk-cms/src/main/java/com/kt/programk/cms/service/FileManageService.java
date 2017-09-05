/*
 *  Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
package com.kt.programk.cms.service;

import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;

/**
 * 파일 업로드
 */
public interface FileManageService {
    /**
     * Upload aiml.
     *
     * @param cpId the cp id
     * @param path the path
     */
    public String uploadAiml(int cpId, String path) throws BizCheckedException, ApplicationException;

    /**
     * Upload subs.
     *
     * @param cpId the cp id
     * @param path the path
     */
    public String uploadSubs(int cpId, String path) throws BizCheckedException, ApplicationException;

    /**
     * Upload prop.
     *
     * @param cpId the cp id
     * @param path the path
     */
    public String uploadProp(int cpId, String path) throws BizCheckedException, ApplicationException;

    /**
     * Upload pred.
     *
     * @param cpId the cp id
     * @param path the path
     */
    public String uploadPred(int cpId, String path) throws ApplicationException, BizCheckedException;

    /**
     * Upload ChatLog.
     *
     * @param cpLabel the cp Label
     * @param path the path
     */
    public String uploadChatLog(String cpLabel, String path) throws ApplicationException, BizCheckedException;


    /**
     * Download aiml string.
     *
     * @param cpid the cpid
     * @return the string
     */
    public String downloadAiml(int cpid);

    /**
     * Download subs string.
     *
     * @param cpid the cpid
     * @return the string
     */
    public String downloadSubs(int cpid);

    /**
     * Download prop string.
     *
     * @param cpid the cpid
     * @return the string
     */
    public String downloadProp(int cpid);

    /**
     * Download pred string.
     *
     * @param cpid the cpid
     * @return the string
     */
    public String downloadPred(int cpid);
}
