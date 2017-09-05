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
import com.kt.programk.cms.service.PredCategoryService;
import com.kt.programk.common.code.CategoryType;
import com.kt.programk.common.code.EnabledType;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.domain.category.PredCategory;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.PagingUtil;

/**
 * Predicates 카테고리  관리
 */
@Controller
public class PredCategoryController {
	/**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(PredCategoryController.class);
    
    /**
     * CONFIG 파일 정보 .
     */
    @Autowired
    @Qualifier("config")
    private ConfigProperties config;
    
    /** The cp service. */
    @Autowired
    private CpService cpService;
    
    /** The PredCategory service. */
    @Autowired
    private PredCategoryService predCategoryService;
    
    /**
     * Predicates 카테고리 목록  조회.
     *
     * @param PredCategory the PredCategory
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/listPredCategory", method = RequestMethod.GET)
    public void listPredCategory(@ModelAttribute PredCategory predCategory, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/listPredCategory" );
    	
    	session.setAttribute("menuCode", "D401"); 

    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp); 
    	
        //cp관리자는 해당것만 노출
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(predCategory.getCpId() == 0){
    			predCategory.setCpId(userInfo.getCpId());
    		}
    		
    		predCategory.setUserAuth(userInfo.getAuth());
    	}     
    	
    	int currentPageNo = predCategory.getCurrentPageNo();
    	int recordCountPerPage = predCategory.getRecordCountPerPage();    	
    	int countAll  = predCategoryService.countAll(predCategory);    	
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpId", predCategory.getCpId());
    	search.put("name", predCategory.getName());
    	search.put("restriction", predCategory.getRestriction());
    	map.put("search", search); 

    	List<PredCategory> result = predCategoryService.findListAll(predCategory, currentPageNo, recordCountPerPage);
        map.put("results", result);        
        
        PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
        map.put("paging", pagingUtil.invoke());
        
        map.put("categoryType", CategoryType.values());
        map.put("enabledType", EnabledType.values());    
    }
    
    /**
     * 전처리 카테고리 등록.
     *
     * @param PredCategory the predCategory
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/addPredCategory", method = RequestMethod.POST)
    @ResponseBody
    public Object addPropCategory(@ModelAttribute PredCategory predCategory, ModelMap map, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/addPredCategory" );
        
        String status = "";
		String message = "";		
		
		int result = predCategoryService.countByName(predCategory);

        if (result == 0) {
        	try {
        		predCategoryService.create(predCategory);
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
     * 전처리 카테고리 조회.
     *
     * @param PredCategory the predCategory
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/detailPredCategory", method = RequestMethod.GET)
    @ResponseBody
    public PredCategory detailPropCategory(@ModelAttribute PredCategory predCategory, ModelMap map, HttpSession session, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/detailPredCategory" );
        
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		//predCategory.setCpId(userInfo.getCpId());
    		predCategory.setUserAuth(userInfo.getAuth());
    	}   
    	       
        return predCategoryService.findById(predCategory);
    }
    
    /**
     * 전처리 카테고리 수정.
     *
     * @param PredCategory the predCategory
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/editPredCategory", method = RequestMethod.POST)
    @ResponseBody
    public Object editPropCategory(@ModelAttribute PredCategory predCategory, ModelMap map, HttpSession session, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/editPredCategory" );
        
        String status = "";
		String message = "";
		String type = request.getParameter("type");
		
		if("2".equals(type)){//배포 카테고리 등록
	    	try {
	    		predCategoryService.createDeploy(predCategory);
			} catch (Exception e) {
				status = "FAIL";
    			message = e.getMessage();
			}
		}else{
			int result = predCategoryService.countByName(predCategory);
	        if (result == 0) {
	        	try {
	        		predCategoryService.modify(predCategory);
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
     * 전처리 카테고리 삭제.
     *
     * @param PredCategory the predCategory
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/deletePredCategory", method = RequestMethod.GET)
    @ResponseBody
    public Object deletePropCategory(@ModelAttribute PredCategory predCategory, ModelMap map, HttpServletRequest request)
    {
        LOG.debug("/deletePredCategory" );
        
        String status = "";
		String message = "";
		
		try {
			predCategoryService.remove(predCategory);
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
     * @param PredCategory the predCategory
     * @param map the map
     * @param request the request
     * @return the string
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/isPredCategory")
    @ResponseBody
    public Object isPropCategory(@ModelAttribute PredCategory predCategory, ModelMap map, HttpServletRequest request) throws BizCheckedException, ApplicationException  {
    	LOG.debug("/isPredCategory" );

        String status = "";
		
		int result = predCategoryService.countByName(predCategory);

        if (result != 0) {
        	status = "FAIL"; //중복
        }
		
		HashMap<String, String> vo = new HashMap<String, String>();
    	vo.put("status", status);	
    	
        return vo;
    }
    
    /**
     * Predicates 카테고리 조회 - 검색
     *
     * @param PredCategory the predCategory
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/searchPredCategory", method = RequestMethod.GET)
    public void searchPredCategory(@ModelAttribute PredCategory predCategory, ModelMap map, HttpSession session, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/searchPredCategory" );
        
        List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp);        
        
        CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(predCategory.getCpId() == 0){
    			predCategory.setCpId(resultCp.get(0).getId());
    		}
    		
    		predCategory.setUserAuth("");
    		predCategory.setRestriction(CategoryType.USER.getValue()); //CP전용만
    	} 
        
        int currentPageNo = predCategory.getCurrentPageNo();
    	int recordCountPerPage = predCategory.getRecordCountPerPage();    	
    	int countAll  = predCategoryService.countAll(predCategory);
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpId", predCategory.getCpId());
    	search.put("name", predCategory.getName());
    	map.put("search", search); 

    	List<PredCategory> result = predCategoryService.findListAll(predCategory, currentPageNo, recordCountPerPage);
        map.put("results", result);        
        
        PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
        map.put("paging", pagingUtil.invoke());  
    }       
}
