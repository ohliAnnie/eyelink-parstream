/*
 *  Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
package com.kt.programk.cms.web.controller;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.kt.programk.cms.service.CpUserService;
import com.kt.programk.common.code.UserMenuType;
import com.kt.programk.common.code.StagingUserMenuType;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.utils.ConfigProperties;

/**
 * 메뉴 컨트롤러
 *
 */
@Controller
public class MenuController {
	/**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(MenuController.class);
    
    /** The cpUser service. */
    @Autowired
    private CpUserService cpUserService;

    /**
     * The Config.
     */
    @Autowired
    private ConfigProperties config;
    
    /**
	 * 왼쪽 메뉴.
	 * @param map the map
	 * @param session the session
     * @throws ApplicationException 
	 */
    @RequestMapping(value = "/menuLeft", method = RequestMethod.GET)
	private void menuLeft(ModelMap map, HttpSession session) throws ApplicationException {
    	LOG.debug("/menuLeft" );
    	
    	//현재메뉴코드
    	String menuCode = (String)session.getAttribute("menuCode");
    	
    	//사용자 정보
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	CpUser menuUser = cpUserService.findByUserId(userInfo.getUserId());
    	
    	//메뉴권한 체크    	
    	if(menuUser == null){
    		map.addAttribute("message", "로그인 정보가 없습니다.");
    	}else{
    		String menu = "," + menuUser.getMenu();
    		String code = "," + menuCode.substring(0, 1);
    		
        	if(menu.indexOf(code) == -1){
        		map.addAttribute("message", "잘못된 경로의 접근입니다.");
    		}
    	}
    	
    	if( "staging".equals(config.getString("cms.menu.type")) ) {
        	map.put("menuType", StagingUserMenuType.values());
    	}
    	else {
        	map.put("menuType", UserMenuType.values());
    	}
    	
    	map.put("menuCode", menuCode);
    	map.put("menuUser", menuUser);
	}
}
