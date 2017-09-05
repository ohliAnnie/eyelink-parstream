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

package com.kt.programk.api.web.object;

import javax.xml.bind.annotation.*;
import java.io.Serializable;
import java.util.Date;

/**
 * CP 관리자 정보
 */
@XmlRootElement(name = "user")
@XmlAccessorType(XmlAccessType.NONE)
public class UserWO implements Serializable {
    /**
     * The constant serialVersionUID.
     */
    private static final long serialVersionUID = 1L;
    /**
     * The Userid.
     */
    @XmlAttribute
    private String userid;
    /**
     * The Name.
     */
    @XmlElement
    private String name;
    /**
     * The Password.
     */
    @XmlElement
    private String password;
    /**
     * The Cellphone.
     */
    @XmlElement
    private String cellphone;
    /**
     * The Email.
     */
    @XmlElement
    private String email;
    /**
     * The Enabled.
     */
    @XmlElement
    private boolean enabled;
    /**
     * The Created.
     */
    @XmlElement
    private Date created;
    /**
     * The Modified.
     */
    @XmlElement
    private Date modified;

    /**
     * Instantiates a new User.
     */
    public UserWO() {
    }

    /**
     * Instantiates a new User.
     *
     * @param userid   the userid
     * @param username the username
     */
    public UserWO(String userid, String username) {
        this.userid = userid;
        this.name = username;
    }

    /**
     * Gets userid.
     *
     * @return the userid
     */
    public String getUserid() {
        return userid;
    }

    /**
     * Sets userid.
     *
     * @param userid the userid
     */
    public void setUserid(String userid) {
        this.userid = userid;
    }

    /**
     * Gets name.
     *
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets name.
     *
     * @param name the name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets password.
     *
     * @return the password
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets password.
     *
     * @param password the password
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Gets cellphone.
     *
     * @return the cellphone
     */
    public String getCellphone() {
        return cellphone;
    }

    /**
     * Sets cellphone.
     *
     * @param cellphone the cellphone
     */
    public void setCellphone(String cellphone) {
        this.cellphone = cellphone;
    }

    /**
     * Gets email.
     *
     * @return the email
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets email.
     *
     * @param email the email
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Is enabled boolean.
     *
     * @return the boolean
     */
    public boolean isEnabled() {
        return enabled;
    }

    /**
     * Sets enabled.
     *
     * @param enabled the enabled
     */
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    /**
     * Gets created.
     *
     * @return the created
     */
    public Date getCreated() {
        return created;
    }

    /**
     * Sets created.
     *
     * @param created the created
     */
    public void setCreated(Date created) {
        this.created = created;
    }

    /**
     * Gets modified.
     *
     * @return the modified
     */
    public Date getModified() {
        return modified;
    }

    /**
     * Sets modified.
     *
     * @param modified the modified
     */
    public void setModified(Date modified) {
        this.modified = modified;
    }
}
