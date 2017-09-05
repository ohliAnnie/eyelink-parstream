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

import java.util.Date;
import java.util.HashMap;
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

import com.kt.programk.cms.common.StringUtil;
import com.kt.programk.cms.service.CpService;
import com.kt.programk.cms.service.CpUserService;
import com.kt.programk.common.code.EnabledType;
import com.kt.programk.common.code.UserAuthType;
import com.kt.programk.common.code.UserMenuType;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.PagingUtil;

/**
 * 사용자 관리 컨트롤러
 */
@Controller
public class CpUserController {
	
	/**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(CpUserController.class);
    
    /**
     * CONFIG 파일 정보 .
     */
    @Autowired
    @Qualifier("config")
    private ConfigProperties config;
    
    /** The cp service. */
    @Autowired
    private CpService cpService;
    
    /** The cpUser service. */
    @Autowired
    private CpUserService cpUserService;
    
    /**
     * cpUser 목록  조회.
     *
     * @param CpUser the cpUser
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/listCpUser", method = RequestMethod.GET)
    public void listCpUser(@ModelAttribute CpUser cpUser, ModelMap map, HttpSession session) throws ApplicationException, BizCheckedException
    {
    	LOG.debug("/listCpUser" );
    	
    	session.setAttribute("menuCode", "C101");
    	
    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp); 
    	
        //cp관리자 초기 선택값
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(cpUser.getCpId() == 0){
    			cpUser.setCpId(resultCp.get(0).getId());
    		}
    	}   
    	
    	int currentPageNo = cpUser.getCurrentPageNo();
    	int recordCountPerPage = cpUser.getRecordCountPerPage();    	
    	int countAll  = cpUserService.countByCpId(cpUser);
    	
    	List<CpUser> result = cpUserService.findListAll(cpUser, currentPageNo, recordCountPerPage);
        map.put("results", result); 
        
        PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
        map.put("paging", pagingUtil.invoke()); 
        
        map.put("cpId", cpUser.getCpId());
        map.put("authType", UserAuthType.values());
    }
    
    /**
     * cpUser 상세 조회.
     *
     * @param CpUser the cpUser
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/detailCpUser", method = RequestMethod.GET)
    public void detailCp(@ModelAttribute CpUser cpUser, ModelMap map, HttpSession session) throws ApplicationException
    {
        LOG.debug("/detailCpUser" );
        
        session.setAttribute("menuCode", "C101");
        
    	List<Cp> resultCp = cpService.listAll(session);
        map.put("resultCp", resultCp);
        
        CpUser result = cpUserService.findById(cpUser);
        map.put("result", result);
        
        map.put("authType", UserAuthType.values());
        map.put("menuType", UserMenuType.values());
        map.put("enabledType", EnabledType.values());
    }
    
    /**
     * cpUser 등록 폼.
     *
     * @param CpUser the cpUser
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/addCpUser", method = RequestMethod.GET)
    public void addCpUserForm(@ModelAttribute CpUser cpUser, ModelMap map, HttpSession session) throws ApplicationException
    {
        LOG.debug("/addCpUserForm" );
        
        session.setAttribute("menuCode", "C101");
    	
        List<Cp> resultCp = cpService.listAll(session);
        map.put("resultCp", resultCp);
        
        map.put("authType", UserAuthType.values());
        map.put("menuType", UserMenuType.values());
        map.put("enabledType", EnabledType.values());
    }
    
    /**
     * cpUser 등록.
     *
     * @param CpUser the cpUser
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/addCpUser", method = RequestMethod.POST)
    @ResponseBody
    public Object addCpUser(@ModelAttribute CpUser cpUser, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/addCpUser" );
    	
    	String status = "";
		String message = "";
		
		CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		status = "FAIL";
			message = "접근 권한이 없습니다.";
    	}else{
    		cpUser.setUserId(StringUtil.base64Decode(cpUser.getUserId()));
    		cpUser.setName(StringUtil.base64Decode(cpUser.getName()));
    		cpUser.setCellPhone(StringUtil.base64Decode(cpUser.getCellPhone()));
    		cpUser.setGroupName(StringUtil.base64Decode(cpUser.getGroupName()));

    		CpUser result = cpUserService.findByUserId(cpUser.getUserId());
    		if(result == null){
    			try {
    				cpUserService.create(cpUser);
    			} catch (Exception e) {
    				status = "FAIL";
    				message = e.getMessage();
    			}
    		}else{
    			status = "FAIL";
    			message = "ID명이(가) 중복된 데이터 입니다.";
    		}
    	}
    	
    	HashMap<String, String> vo = new HashMap<String, String>();
    	vo.put("status", status);
		vo.put("message", message);	
    	
        return vo;
    }
    
    /**
     * cpUser 수정 폼.
     *
     * @param CpUser the cpUser
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/editCpUser", method = RequestMethod.GET)
    public void editCpUserForm(@ModelAttribute CpUser cpUser, ModelMap map, HttpSession session) throws ApplicationException
    {
        LOG.debug("/editCpForm" );
        
        session.setAttribute("menuCode", "C101");
        
        List<Cp> resultCp = cpService.listAll(session);
        map.put("resultCp", resultCp);
        
        CpUser result = cpUserService.findById(cpUser);
        map.put("result", result);
        
        map.put("authType", UserAuthType.values());
        map.put("menuType", UserMenuType.values());
        map.put("enabledType", EnabledType.values());
    }
    
    /**
     * cpUser 수정.
     *
     * @param CpUser the cpUser
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/editCpUser", method = RequestMethod.POST)
    @ResponseBody
    public Object editCpUser(@ModelAttribute CpUser cpUser, ModelMap map, HttpSession session, HttpServletRequest request) throws ApplicationException
    {
    	LOG.debug("/editCpUser" );
    	
    	String status = "";
		String message = "";
		String type = request.getParameter("type");
		
		if("login".equals(type)){//마지막 로그인시간 업데이트시
			CpUser userInfo = (CpUser) session.getAttribute("userInfo");
			
			session.setAttribute("lastLogin", ""); 
			cpUser.setLastLogin(new Date());
			cpUser.setUserId(userInfo.getUserId());
			
			try {
				cpUserService.modifyById(cpUser);
			} catch (Exception e) {
				status = "FAIL";
				message = e.getMessage();
			}
		}else{
			CpUser userInfo = (CpUser) session.getAttribute("userInfo");
	    	if("CPA".equals(userInfo.getAuth())){
	    		status = "FAIL";
				message = "접근 권한이 없습니다.";
	    	}else{
	    		cpUser.setCellPhone(StringUtil.base64Decode(cpUser.getCellPhone()));
	    		cpUser.setGroupName(StringUtil.base64Decode(cpUser.getGroupName()));

	    		CpUser result = cpUserService.findById(cpUser);	    		
	    		if(result != null){
	    			cpUser.setUserId(result.getUserId());	    			
	    			try {
		    			cpUserService.modifyById(cpUser);
		    		} catch (Exception e) {
		    			status = "FAIL";
		    			message = e.getMessage();
		    		}
	    		}else{
	    			status = "FAIL";
					message = "접근 권한이 없습니다.";
	    		}
	    	}
		}
    	
    	HashMap<String, String> vo = new HashMap<String, String>();
    	vo.put("status", status);
		vo.put("message", message);	
    	
        return vo;
    }
    
    /**
     * cpUser 삭제.
     *
     * @param CpUser the cpUser
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/deleteCpUser", method = RequestMethod.GET)
    @ResponseBody
    public Object deleteCpUser(@ModelAttribute CpUser cpUser, ModelMap map, HttpSession session) throws ApplicationException
    {
        LOG.debug("/deleteCpUser" );
        
        session.setAttribute("menuCode", "C101");
        
        String status = "";
		String message = "";
    	
		try {
			cpUserService.remove(cpUser);
		} catch (Exception e) {
			status = "FAIL";
			message = e.getMessage();
		}
    	
    	HashMap<String, String> vo = new HashMap<String, String>();
    	vo.put("status", status);
		vo.put("message", message);	
    	
        return vo;
    }
}
