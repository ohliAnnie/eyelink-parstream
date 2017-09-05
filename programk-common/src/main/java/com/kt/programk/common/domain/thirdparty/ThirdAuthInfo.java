/*
 *  Copyright (c) 2016 KT, Inc.
 *  All right reserved.
 *  This software is the confidential and proprietary information of KT
 *  , Inc. You shall not disclose such Confidential Information and
 *  shall use it only in accordance with the terms of the license agreement
 *  you entered into with KT.
 *
 *  Revision History
 *  Author Date Description
 *  ------------------ -------------- ------------------
 *  Seo Jong Hwa 16. 8. 22 오후 5:11
 *
 *
 */

package com.kt.programk.common.domain.thirdparty;

/**
 * The type Third auth info.
 */
public class ThirdAuthInfo {

	/**
	 * The Hosts.
	 */
	private String[] hosts;

	/**
	 * The host.
	 */
	private String host;

	/**
	 * The description.
	 */
	private String description;

	/**
	 * The filterExcludeYn.
	 */
	private String filterExcludeYn;

	/**
	 * The useYn.
	 */
	private String useYn;

	/**
	 * The createTime.
	 */
	private String createTime;

	/**
	 * The token.
	 */
	private String token;

	/**
	 * The expiredYn.
	 */
	private String expireYn;

	/**
	 * The ticketedTime.
	 */
	private String ticketedTime;

	/**
	 * Get hosts string [ ].
	 *
	 * @return the string [ ]
	 */
	public String[] getHosts() {
		return hosts;
	}

	/**
	 * Sets hosts.
	 *
	 * @param hosts the hosts
	 */
	public void setHosts(String[] hosts) {
		this.hosts = hosts;
	}

	/**
	 * Gets host.
	 *
	 * @return the host
	 */
	public String getHost() {
		return host;
	}

	/**
	 * Sets host.
	 *
	 * @param host the host
	 */
	public void setHost(String host) {
		this.host = host;
	}

	/**
	 * Gets description.
	 *
	 * @return the description
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * Sets description.
	 *
	 * @param description the description
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * Gets filter exclude yn.
	 *
	 * @return the filter exclude yn
	 */
	public String getFilterExcludeYn() {
		return filterExcludeYn;
	}

	/**
	 * Sets filter exclude yn.
	 *
	 * @param filterExcludeYn the filter exclude yn
	 */
	public void setFilterExcludeYn(String filterExcludeYn) {
		this.filterExcludeYn = filterExcludeYn;
	}

	/**
	 * Gets use yn.
	 *
	 * @return the use yn
	 */
	public String getUseYn() {
		return useYn;
	}

	/**
	 * Sets use yn.
	 *
	 * @param useYn the use yn
	 */
	public void setUseYn(String useYn) {
		this.useYn = useYn;
	}

	/**
	 * Gets create time.
	 *
	 * @return the create time
	 */
	public String getCreateTime() {
		return createTime;
	}

	/**
	 * Sets create time.
	 *
	 * @param createTime the create time
	 */
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

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
	 * Gets expire yn.
	 *
	 * @return the expire yn
	 */
	public String getExpireYn() {
		return expireYn;
	}

	/**
	 * Sets expire yn.
	 *
	 * @param expireYn the expire yn
	 */
	public void setExpireYn(String expireYn) {
		this.expireYn = expireYn;
	}

	/**
	 * Gets ticketed time.
	 *
	 * @return the ticketed time
	 */
	public String getTicketedTime() {
		return ticketedTime;
	}

	/**
	 * Sets ticketed time.
	 *
	 * @param ticketedTime the ticketed time
	 */
	public void setTicketedTime(String ticketedTime) {
		this.ticketedTime = ticketedTime;
	}
}
