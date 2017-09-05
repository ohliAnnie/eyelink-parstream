package com.kt.programk.common.domain.admin;

import com.kt.programk.common.domain.PagingExample;

import java.util.Date;

/**
 * 컨텐츠 관리자
 */
public class CpUser extends PagingExample {
    public final static int MAX_LENGTH_USER_ID = 50;
    public final static int MAX_LENGTH_NAME = 128;
    public final static int MAX_LENGTH_PASSWORD = 128;
    
    /**
     * The Id.
     */
    private int id;
    /**
     * 아이디
     */
    private String userId;
    /**
     * 패스워드
     */
    private String userPwd;
    /**
     * 이름
     */
    private String name;
    /**
     * 비밀번호
     */
    private String password;
    /**
     * 핸드폰 번호
     */
    private String cellPhone;
    /**
     * 메일 주소
     */
    private String mail;
    /**
     * 사용여부
     */
    private String enabled;
    /**
     * 생성일
     */
    private Date created;
    /**
     * 수정일
     */
    private Date modified;

    /**
     * cpId
     */
    private int cpId;

    /**
     * 설명
     */
    private String description;

    /**
     * 인증
     */
    private String auth;

    /**
     * 메뉴
     */
    private String menu;
    
    /**
     * 소속
     */
    private String groupName;
    
    /**
     * cp명
     */
    private String label;
    
    /**
     * 마지막로그인시간
     */
    private Date lastLogin;
    
    /**
     * cp group
     */
    private String cpGroup;
    
    
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
     * Gets user id.
     *
     * @return the user id
     */
    public String getUserId() {
        return userId;
    }

    /**
     * Sets user id.
     *
     * @param userId the user id
     */
    public void setUserId(String userId) {
        this.userId = userId;
    }

    /**
     * Gets user id.
     *
     * @return the user password
     */
    public String getUserPwd() {
        return userPwd;
    }

    /**
     * Sets user password.
     *
     * @param userId the user id
     */
    public void setUserPwd(String userPwd) {
        this.userPwd = userPwd;
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

//    /**
//     * Gets password.
//     *
//     * @return the password
//     */
//    public String getPassword() {
//        return password;
//    }
//
//    /**
//     * Sets password.
//     *
//     * @param password the password
//     */
//    public void setPassword(String password) {
//        this.password = password;
//    }

    /**
     * Gets cell phone.
     *
     * @return the cell phone
     */
    public String getCellPhone() {
        return cellPhone;
    }

    /**
     * Sets cell phone.
     *
     * @param cellPhone the cell phone
     */
    public void setCellPhone(String cellPhone) {
        this.cellPhone = cellPhone;
    }

    /**
     * Gets mail.
     *
     * @return the mail
     */
    public String getMail() {
        return mail;
    }

    /**
     * Sets mail.
     *
     * @param mail the mail
     */
    public void setMail(String mail) {
        this.mail = mail;
    }

    /**
     * Gets enabled.
     *
     * @return the enabled
     */
    public String getEnabled() {
        return enabled;
    }

    /**
     * Sets enabled.
     *
     * @param enabled the enabled
     */
    public void setEnabled(String enabled) {
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
     * @param modifed the modifed
     */
    public void setModified(Date modifed) {
        this.modified = modifed;
    }


    /**
     * Gets cp id.
     *
     * @return the cp id
     */
    public int getCpId() {
        return cpId;
    }

    /**
     * Sets cp id.
     *
     * @param cpId the cp id
     */
    public void setCpId(int cpId) {
        this.cpId = cpId;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAuth() {
        return auth;
    }

    public void setAuth(String auth) {
        this.auth = auth;
    }

    public String getMenu() {
        return menu;
    }

    public void setMenu(String menu) {
        this.menu = menu;
    }

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public Date getLastLogin() {
		return lastLogin;
	}

	public void setLastLogin(Date lastLogin) {
		this.lastLogin = lastLogin;
	}    	

	public String getCpGroup() {
		return cpGroup;
	}

	public void setCpGroup(String cpGroup) {
		this.cpGroup = cpGroup;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("CpUser [id=");
		builder.append(id);
		builder.append(", userId=");
		builder.append(userId);
		builder.append(", name=");
		builder.append(name);
		builder.append(", userPwd=");
		builder.append(userPwd);
		builder.append(", cellPhone=");
		builder.append(cellPhone);
		builder.append(", mail=");
		builder.append(mail);
		builder.append(", enabled=");
		builder.append(enabled);
		builder.append(", created=");
		builder.append(created);
		builder.append(", modified=");
		builder.append(modified);
		builder.append(", cpId=");
		builder.append(cpId);
		builder.append(", description=");
		builder.append(description);
		builder.append(", auth=");
		builder.append(auth);
		builder.append(", menu=");
		builder.append(menu);
		builder.append(", groupName=");
		builder.append(groupName);
		builder.append(", label=");
		builder.append(label);
		builder.append(", lastLogin=");
		builder.append(lastLogin);
		builder.append(", cpGroup=");
		builder.append(cpGroup);
		builder.append("]");
		return builder.toString();
	}
	
}
