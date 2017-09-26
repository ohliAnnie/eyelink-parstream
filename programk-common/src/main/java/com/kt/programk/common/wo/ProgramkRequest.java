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

import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

/**
 * Created by redpunk on 2016-05-31.
 */
@XmlRootElement
public class ProgramkRequest implements Serializable {
    /**
     * 연동에 필요한 토큰 값
     */
    private String token;
    /**
     * 사용자를 구분할수 있는 값
     */
    private String user;
    /**
     * 사용자의 대화 내역
     */
    private String chat;

    /**
     * Gets token.
     *
     * @return the token
     */
    public String getToken() {
        return token;
    }

    /**
     * Sets token.
     *
     * @param token the token
     */
    public void setToken(String token) {
        this.token = token;
    }

    /**
     * Gets user.
     *
     * @return the user
     */
    public String getUser() {
        return user;
    }

    /**
     * Sets user.
     *
     * @param user the user
     */
    public void setUser(String user) {
        this.user = user;
    }

    /**
     * Gets chat.
     *
     * @return the chat
     */
    public String getChat() {
        return chat;
    }

    /**
     * Sets chat.
     *
     * @param chat the chat
     */
    public void setChat(String chat) {
        this.chat = chat;
    }
}