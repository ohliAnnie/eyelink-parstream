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
import java.util.Map;

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
import com.kt.programk.cms.service.PropCategoryService;
import com.kt.programk.common.code.CategoryType;
import com.kt.programk.common.code.EnabledType;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.domain.category.PropCategory;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.PagingUtil;

/**
 * Properties 카테고리 관리
 */
@Controller
public class PropCategoryController {
	/**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(PropCategoryController.class);
    
    /**
     * CONFIG 파일 정보 .
     */
    @Autowired
    @Qualifier("config")
    private ConfigProperties config;
    
    /** The cp service. */
    @Autowired
    private CpService cpService;
    
    /** The PropCategory service. */
    @Autowired
    private PropCategoryService propCategoryService;
    
    /**
     * Properties 카테고리 목록  조회.
     *
     * @param PropCategory the propCategory
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/listPropCategory", method = RequestMethod.GET)
    public void listPropCategory(@ModelAttribute PropCategory propCategory, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/listPropCategory" );
    	
    	session.setAttribute("menuCode", "D301"); 

    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp); 
    	
    	//cp관리자는 해당것만 노출
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(propCategory.getCpId() == 0){
    			propCategory.setCpId(userInfo.getCpId());
    		}
    		
    		propCategory.setUserAuth(userInfo.getAuth());
    	} 
    	
    	int currentPageNo = propCategory.getCurrentPageNo();
    	int recordCountPerPage = propCategory.getRecordCountPerPage();    	
    	int countAll  = propCategoryService.countAll(propCategory);    	
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpId", propCategory.getCpId());
    	search.put("name", propCategory.getName());
    	search.put("restriction", propCategory.getRestriction());
    	map.put("search", search); 

    	List<PropCategory> result = propCategoryService.findListAll(propCategory, currentPageNo, recordCountPerPage);
        map.put("results", result);        
        
        PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
        map.put("paging", pagingUtil.invoke());
        
        map.put("categoryType", CategoryType.values());
        map.put("enabledType", EnabledType.values());        
    }
    
    /**
     * Properties 카테고리 등록.
     *
     * @param PropCategory the propCategory
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/addPropCategory", method = RequestMethod.POST)
    @ResponseBody
    public Object addPropCategory(@ModelAttribute PropCategory propCategory, ModelMap map, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/addPropCategory" );
        
        String status = "";
		String message = "";		
		
		int result = propCategoryService.countByName(propCategory);

        if (result == 0) {
        	try {
        		propCategoryService.create(propCategory);
    		} catch (Exception e) {
    			status = "FAIL";
    			message = e.getMessage();
    		}
        }else{
        	status = "FAIL"; //중복
        	message = "사용중인 카테고리 입니다.";
        }
		
		HashMap<String, String> vo = new HashMap<String, String>();
    	vo.put("status", status);
		vo.put("message", message);	
    	
        return vo;
    }
    
    /**
     * Properties 카테고리 조회.
     *
     * @param PropCategory the propCategory
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/detailPropCategory", method = RequestMethod.GET)
    @ResponseBody
    public PropCategory detailPropCategory(@ModelAttribute PropCategory propCategory, ModelMap map, HttpSession session, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/detailPropCategory" );
        
        CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		//propCategory.setCpId(userInfo.getCpId());
    		propCategory.setUserAuth(userInfo.getAuth());
    	} 
    	       
        return propCategoryService.findById(propCategory);
    }
    
    /**
     * Properties 카테고리 수정.
     *
     * @param PropCategory the propCategory
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/editPropCategory", method = RequestMethod.POST)
    @ResponseBody
    public Object editPropCategory(@ModelAttribute PropCategory propCategory, ModelMap map, HttpSession session, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/editPropCategory" );
        
        String status = "";
		String message = "";
		String type = request.getParameter("type");
		
		if("2".equals(type)){//배포 카테고리 등록
	    	try {
	    		propCategoryService.createDeploy(propCategory);
			} catch (Exception e) {
				status = "FAIL";
    			message = e.getMessage();
			}
		}else{
			int result = propCategoryService.countByName(propCategory);
	        if (result == 0) {
	        	try {
	        		propCategoryService.modify(propCategory);
	    		} catch (Exception e) {
	    			status = "FAIL";
	    			message = e.getMessage();
	    		}
	        }else{
	        	status = "FAIL"; //중복
	        	message = "사용중인 카테고리 입니다.";
	        }
		}
		
		HashMap<String, String> vo = new HashMap<String, String>();
    	vo.put("status", status);
		vo.put("message", message);	
    	
        return vo;
    }
    
    /**
     * Properties 카테고리 삭제.
     *
     * @param PropCategory the propCategory
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/deletePropCategory", method = RequestMethod.GET)
    @ResponseBody
    public Object deletePropCategory(@ModelAttribute PropCategory propCategory, ModelMap map, HttpServletRequest request)
    {
        LOG.debug("/deletePropCategory" );
        
        String status = "";
		String message = "";
		
		try {
			propCategoryService.remove(propCategory);
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
     * 카테고리 유무 체크.
     *
     * @param PropCategory the propCategory
     * @param map the map
     * @param request the request
     * @return the string
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/isPropCategory")
    @ResponseBody
    public Object isPropCategory(@ModelAttribute PropCategory propCategory, ModelMap map, HttpServletRequest request) throws BizCheckedException, ApplicationException  {
    	LOG.debug("/isPropCategory" );

        String status = "";
		
		int result = propCategoryService.countByName(propCategory);

        if (result != 0) {
        	status = "FAIL"; //중복
        }
		
		HashMap<String, String> vo = new HashMap<String, String>();
    	vo.put("status", status);	
    	
        return vo;
    }    
    
    /**
     * Properties 카테고리 조회 - 검색
     *
     * @param PropCategory the propCategory
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/searchPropCategory", method = RequestMethod.GET)
    public void searchPropCategory(@ModelAttribute PropCategory propCategory, ModelMap map, HttpSession session, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/searchPropCategory" );
        
        List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp); 
        
        CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(propCategory.getCpId() == 0){
    			propCategory.setCpId(resultCp.get(0).getId());
    		}
    		
    		propCategory.setUserAuth("");
    		propCategory.setRestriction(CategoryType.USER.getValue()); //CP전용만
    	} 
        
        int currentPageNo = propCategory.getCurrentPageNo();
    	int recordCountPerPage = propCategory.getRecordCountPerPage();    	
    	int countAll  = propCategoryService.countAll(propCategory);
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpId", propCategory.getCpId());
    	search.put("name", propCategory.getName());
    	map.put("search", search); 

    	List<PropCategory> result = propCategoryService.findListAll(propCategory, currentPageNo, recordCountPerPage);
        map.put("results", result);        
        
        PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
        map.put("paging", pagingUtil.invoke());  
    }   
}
