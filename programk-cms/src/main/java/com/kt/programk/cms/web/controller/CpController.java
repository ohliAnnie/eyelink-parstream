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

import com.kt.programk.cms.service.CpService;
import com.kt.programk.common.code.EnabledType;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.PagingUtil;

/**
 * CP 관리 컨트롤러
 */
@Controller
public class CpController {
	
	/**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(CpController.class);
    
    /**
     * CONFIG 파일 정보 .
     */
    @Autowired
    @Qualifier("config")
    private ConfigProperties config;
    
    /** The cp service. */
    @Autowired
    private CpService cpService;
    
    /**
     * cp 목록  조회.
     *
     * @param Cp the cp
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/listCp", method = RequestMethod.GET)
    public void listCp(@ModelAttribute Cp cp, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/listCp" );
    	
    	session.setAttribute("menuCode", "B101");
    	
    	//cp관리자는 해당것만 노출
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		cp.setCpGroup(userInfo.getCpGroup());
    	}    	
    	
    	int currentPageNo = cp.getCurrentPageNo();
    	int recordCountPerPage = cp.getRecordCountPerPage();    	
    	int countAll  = cpService.countAll(cp);

    	List<Cp> result = cpService.findListAll(cp, currentPageNo, recordCountPerPage);
        map.put("results", result); 
        
        PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
        map.put("paging", pagingUtil.invoke()); 
    }
    
    /**
     * cp 상세 조회.
     *
     * @param Cp the cp
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/detailCp", method = RequestMethod.GET)
    public void detailCp(@ModelAttribute Cp cp, ModelMap map, HttpSession session) throws ApplicationException
    {
        LOG.debug("/detailCp" );
        
        session.setAttribute("menuCode", "B101");
        
        int id = cp.getId();
        
        Cp result = cpService.findById(id);
        map.put("result", result);
        
        map.put("enabledType", EnabledType.values());
    }
    
    /**
     * cp 등록 폼.
     *
     * @param Cp the cp
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/addCp", method = RequestMethod.GET)
    public void addCpForm(@ModelAttribute Cp cp, ModelMap map, HttpSession session)
    {
        LOG.debug("/addCpForm" );
        
        session.setAttribute("menuCode", "B101");
        
        map.put("enabledType", EnabledType.values());
    }
    
    /**
     * cp 등록.
     *
     * @param Cp the cp
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/addCp", method = RequestMethod.POST)
    @ResponseBody
    public Object addCp(@ModelAttribute Cp cp, ModelMap map, HttpServletRequest request) throws ApplicationException
    {
    	LOG.debug("/addCp" );
    	
    	String status = "";
		String message = "";
    	
		int result = cpService.countByLabel(cp);
		if (result == 0) {
			try {
				cpService.create(cp);
			} catch (Exception e) {
				status = "FAIL";
				message = e.getMessage();
			}
		}else{
			status = "FAIL";
			message = "CP명이(가) 중복된 데이터 입니다.";
		}
    	
    	HashMap<String, String> vo = new HashMap<String, String>();
    	vo.put("status", status);
		vo.put("message", message);	
    	
        return vo;
    }
    
    /**
     * cp 수정 폼.
     *
     * @param Cp the cp
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/editCp", method = RequestMethod.GET)
    public void editCpForm(@ModelAttribute Cp cp, ModelMap map, HttpSession session) throws ApplicationException
    {
        LOG.debug("/editCpForm" );
        
        session.setAttribute("menuCode", "B101");
        
        int id = cp.getId();
        
        Cp result = cpService.findById(id);
        map.put("result", result);
        
        map.put("enabledType", EnabledType.values());
    }
    
    /**
     * cp 수정.
     *
     * @param Cp the cp
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/editCp", method = RequestMethod.POST)
    @ResponseBody
    public Object editCp(@ModelAttribute Cp cp, ModelMap map, HttpServletRequest request) throws ApplicationException
    {
    	LOG.debug("/editCp" );
    	
    	String status = "";
		String message = "";
    	
		try {
			cpService.modifyById(cp);
		} catch (Exception e) {
			status = "FAIL";
			message = e.getMessage();
		}
    	
    	HashMap<String, String> vo = new HashMap<String, String>();
    	vo.put("status", status);
		vo.put("message", message);	
    	
        return vo;
    }
    
    /**
     * cp 삭제.(사용여부 N으로)
     *
     * @param Cp the cp
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/deleteCp", method = RequestMethod.GET)
    @ResponseBody
    public Object deleteCp(@ModelAttribute Cp cp, ModelMap map, HttpSession session) throws ApplicationException
    {
        LOG.debug("/deleteCp" );
        
        session.setAttribute("menuCode", "B101");
        
        String status = "";
		String message = "";
    	
		try {
			cp.setEnabled(EnabledType.DISABLE.getValue());
			cpService.modifyByEnabled(cp);
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
