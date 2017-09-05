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

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.kt.programk.cms.service.CpService;
import com.kt.programk.cms.service.CpUserService;
import com.kt.programk.cms.service.SimulatorService;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.domain.core.BotFile;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.utils.ConfigProperties;

/**
 * 시뮬레이터 컨트롤러
 *
 */
@Controller
public class SimulatorController {
	/**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(SimulatorController.class);
    
    /**
     * CONFIG 파일 정보 .
     */
    @Autowired
    @Qualifier("config")
    private ConfigProperties config;
    
    /** The cp service. */
    @Autowired
    private CpService cpService;
    
    /** The Simulator service. */
    @Autowired
    private SimulatorService simulatorService;
    
    /** The cpUser service. */
    @Autowired
    private CpUserService cpUserService;
    
    /**
     * 시뮬레이터.
     *
     * @param BotFile the botFile
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/simulator", method = RequestMethod.GET)
    public void simulator(@ModelAttribute BotFile botFile, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/simulator" );
    	
    	//session.setAttribute("menuCode", "H101");
    	
    	//사용자 정보
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	CpUser menuUser = cpUserService.findByUserId(userInfo.getUserId());
    	String message = "";
    	
    	//메뉴권한 체크    	
    	if(menuUser == null){
    		message = "로그인 정보가 없습니다.";
    	}else{
    		String menu = "," + menuUser.getMenu();
    		String code = ",H";
    		
        	if(menu.indexOf(code) == -1){
        		message = "잘못된 경로의 접근입니다.";
    		}
    	}
    	
    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp);  
        map.put("message", message);
    }
    
    /**
     * 시뮬레이터 - 검색.
     *
     * @param BotFile the botFile
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/simulatorChat", method = RequestMethod.POST, produces="text/plain;charset=UTF-8")
    @ResponseBody
    public Object simulatorChat(HttpSession session, HttpServletRequest request) throws ApplicationException
    {
    	LOG.debug("/simulatorChat");    	

		CpUser userInfo = (CpUser) session.getAttribute("userInfo");
		
		String userId = userInfo.getUserId();	
		String cpId = request.getParameter("cpId");
		String botType = request.getParameter("botType");
		String input = request.getParameter("input");
		String body = null;
		
        //채팅에서 엔터 제거
		input = input.replaceAll("\n", " ").replaceAll("[|]", " ");
        //태그 정보 제거
		input = input.replaceAll("<", " ").replaceAll(">", " ");
		
		try {
			body = simulatorService.searchChat(Integer.parseInt(cpId), botType, userId, input);
		} catch (Exception e) {			
			body = e.getMessage();
		}
		
        return body;
    }
}
