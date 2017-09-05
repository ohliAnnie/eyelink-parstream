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
 *  Seo Jong Hwa 16. 8. 22 오후 5:34
 *
 *
 */

package com.kt.programk.common.repository.thirdparty;

import com.kt.programk.common.domain.thirdparty.ThirdAuthInfo;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import java.util.List;

//@Repository
public class ThirdPartyAuthRepository {
	
	/** The sql session. */
    @Autowired
    @Qualifier("sessionTemplate")
    private SqlSession sqlSession;
    
    /**
	 * Third Party Server Info Select
	 */
	public List<ThirdAuthInfo> selectThirdPartyServerInfo(ThirdAuthInfo thirdAuthInfo) {
		return sqlSession.selectList("ThirdParty.selectThirdPartyServerInfo", thirdAuthInfo);
	}

    /**
     * Third Party Server Info Get
     */
    public ThirdAuthInfo getThirdPartyServerInfo(ThirdAuthInfo thirdAuthInfo) {
        return sqlSession.selectOne("ThirdParty.getThirdPartyServerInfo", thirdAuthInfo);
    }
    

	public ThirdAuthInfo newGetThirdPartyServerInfo(ThirdAuthInfo thirdAuthInfo) {
		return sqlSession.selectOne("ThirdParty.newGetThirdPartyServerInfo", thirdAuthInfo);
	}

	/**
	 * Third Party Server Info Register
	 */
	public void insertThirdPartyServerInfo(ThirdAuthInfo thirdAuthInfo) {
		sqlSession.insert("ThirdParty.insertThirdPartyServerInfo", thirdAuthInfo);
	}

	/**
	 * Third Party Server Info Modify
	 */
	public void updateThirdPartyServerInfo(ThirdAuthInfo thirdAuthInfo) {
		sqlSession.update("ThirdParty.updateThirdPartyServerInfo", thirdAuthInfo);
	}
	
	/**
	 * Third Party Server Delete
	 */
	public void deleteThirdPartyServerInfo(ThirdAuthInfo thirdAuthInfo) {
		sqlSession.update("ThirdParty.deleteThirdPartyServerInfo", thirdAuthInfo);
	}
	
	/**
	 * Third Party Token Select
	 */
	public List<ThirdAuthInfo> selectTokenInfo(ThirdAuthInfo thirdAuthInfo) {
		return sqlSession.selectList("ThirdParty.selectTokenInfo", thirdAuthInfo);
	}
	
	/**
	 * Third Party Token Register
	 */
	public void insertTokenInfo(ThirdAuthInfo thirdAuthInfo) {
		sqlSession.insert("ThirdParty.insertTokenInfo", thirdAuthInfo);
	}
	
	/**
	 * Third Party Token Modify
	 */
	public void updateTokenInfo(ThirdAuthInfo thirdAuthInfo) {
		sqlSession.insert("ThirdParty.updateTokenInfo", thirdAuthInfo);
	}
	
	/**
	 * Third Party Token Delete
	 */
	public void deleteTokenInfo(ThirdAuthInfo thirdAuthInfo) {
		sqlSession.insert("ThirdParty.deleteTokenInfo", thirdAuthInfo);
	}
	
	/**
	 * Allow IP Select
	 */
	public List<ThirdAuthInfo> selectAllowIPInfo(ThirdAuthInfo thirdAuthInfo) {
		return sqlSession.selectList("ThirdParty.selectAllowIPInfo", thirdAuthInfo);
	}

    /**
     * Third Party Server Manage Register
     */
    public void insertThirdPartyServerManage(ThirdAuthInfo thirdAuthInfo) {
        sqlSession.insert("ThirdParty.insertThirdPartyServerManage", thirdAuthInfo);
    }

    /**
     * Third Party Server Manage Modify
     */
    public void updateThirdPartyServerManage(ThirdAuthInfo thirdAuthInfo) {
        sqlSession.insert("ThirdParty.updateThirdPartyServerManage", thirdAuthInfo);
    }

    /**
     * Third Party Server Manage Delete
     */
    public void deleteThirdPartyServerManage(ThirdAuthInfo thirdAuthInfo) {
        sqlSession.delete("deleteThirdPartyServerManage", thirdAuthInfo);
    }

}
