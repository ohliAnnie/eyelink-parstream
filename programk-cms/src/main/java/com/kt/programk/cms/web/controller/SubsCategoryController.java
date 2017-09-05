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
import com.kt.programk.cms.service.SubsCategoryService;
import com.kt.programk.common.code.CategoryType;
import com.kt.programk.common.code.EnabledType;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.domain.category.SubsCategory;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.PagingUtil;

/**
 * 전처리 카테고리 관리
 */
@Controller
public class SubsCategoryController {
	/**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(SubsCategoryController.class);
    
    /**
     * CONFIG 파일 정보 .
     */
    @Autowired
    @Qualifier("config")
    private ConfigProperties config;
    
    /** The cp service. */
    @Autowired
    private CpService cpService;
    
    /** The SubsCategory service. */
    @Autowired
    private SubsCategoryService subsCategoryService;
    
    /**
     * 전처리 카테고리 목록  조회.
     *
     * @param SubsCategory the subsCategory
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/listSubsCategory", method = RequestMethod.GET)
    public void listSubsCategory(@ModelAttribute SubsCategory subsCategory, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/listSubsCategory" );
    	
    	session.setAttribute("menuCode", "D201"); 

    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp);     
    	
    	//cp관리자는 해당것만 노출
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(subsCategory.getCpId() == 0){
    			subsCategory.setCpId(userInfo.getCpId());
    		}
    		
    		subsCategory.setUserAuth(userInfo.getAuth());
    	}   
    	
    	int currentPageNo = subsCategory.getCurrentPageNo();
    	int recordCountPerPage = subsCategory.getRecordCountPerPage();    	
    	int countAll  = subsCategoryService.countAll(subsCategory);    	
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpId", subsCategory.getCpId());
    	search.put("name", subsCategory.getName());
    	search.put("restriction", subsCategory.getRestriction());
    	map.put("search", search); 

    	List<SubsCategory> result = subsCategoryService.findListAll(subsCategory, currentPageNo, recordCountPerPage);
        map.put("results", result);        
        
        PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
        map.put("paging", pagingUtil.invoke());
        
        map.put("categoryType", CategoryType.values());
        map.put("enabledType", EnabledType.values());        
    }
    
    /**
     * 전처리 카테고리 등록.
     *
     * @param SubsCategory the subsCategory
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/addSubsCategory", method = RequestMethod.POST)
    @ResponseBody
    public Object addSubsCategory(@ModelAttribute SubsCategory subsCategory, ModelMap map, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/addSubsCategory" );
        
        String status = "";
		String message = "";		
		
		int result = subsCategoryService.countByName(subsCategory);

        if (result == 0) {
        	try {
        		subsCategoryService.create(subsCategory);
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
     * @param SubsCategory the subsCategory
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/detailSubsCategory", method = RequestMethod.GET)
    @ResponseBody
    public SubsCategory detailSubsCategory(@ModelAttribute SubsCategory subsCategory, ModelMap map, HttpSession session, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/detailSubsCategory" );
        
        CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		//subsCategory.setCpId(userInfo.getCpId());
    		subsCategory.setUserAuth(userInfo.getAuth());
    	} 
    	       
        return subsCategoryService.findById(subsCategory);
    }
    
    /**
     * 전처리 카테고리 수정.
     *
     * @param SubsCategory the subsCategory
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/editSubsCategory", method = RequestMethod.POST)
    @ResponseBody
    public Object editSubsCategory(@ModelAttribute SubsCategory subsCategory, ModelMap map, HttpSession session, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/editSubsCategory" );
        
        String status = "";
		String message = "";
		String type = request.getParameter("type");
		
		if("2".equals(type)){//배포 카테고리 등록
	    	try {
	    		subsCategoryService.createDeploy(subsCategory);
			} catch (Exception e) {
				status = "FAIL";
    			message = e.getMessage();
			}
		}else{
			int result = subsCategoryService.countByName(subsCategory);
	        if (result == 0) {
	        	try {
	        		subsCategoryService.modify(subsCategory);
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
     * @param SubsCategory the subsCategory
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/deleteSubsCategory", method = RequestMethod.GET)
    @ResponseBody
    public Object deleteSubsCategory(@ModelAttribute SubsCategory subsCategory, ModelMap map, HttpServletRequest request)
    {
        LOG.debug("/deleteSubsCategory" );
        
        String status = "";
		String message = "";
		
		try {
			subsCategoryService.remove(subsCategory);
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
     * @param SubsCategory the subsCategory
     * @param map the map
     * @param request the request
     * @return the string
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/isSubsCategory")
    @ResponseBody
    public Object isSubsCategory(@ModelAttribute SubsCategory subsCategory, ModelMap map, HttpServletRequest request) throws BizCheckedException, ApplicationException  {
    	LOG.debug("/isSubsCategory" );

        String status = "";
		
		int result = subsCategoryService.countByName(subsCategory);

        if (result != 0) {
        	status = "FAIL"; //중복
        }
		
		HashMap<String, String> vo = new HashMap<String, String>();
    	vo.put("status", status);	
    	
        return vo;
    }
    
    /**
     * 전처리 카테고리 조회 - 검색
     *
     * @param SubsCategory the subsCategory
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/searchSubsCategory", method = RequestMethod.GET)
    public void searchSubsCategory(@ModelAttribute SubsCategory subsCategory, ModelMap map, HttpSession session, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/searchSubsCategory" );
        
        List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp); 
        
        CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(subsCategory.getCpId() == 0){
    			subsCategory.setCpId(resultCp.get(0).getId());
    		}
    		
    		subsCategory.setUserAuth("");
    		subsCategory.setRestriction(CategoryType.USER.getValue()); //CP전용만
    	} 
        
        int currentPageNo = subsCategory.getCurrentPageNo();
    	int recordCountPerPage = subsCategory.getRecordCountPerPage();    	
    	int countAll  = subsCategoryService.countAll(subsCategory);
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpId", subsCategory.getCpId());
    	search.put("name", subsCategory.getName());
    	map.put("search", search); 

    	List<SubsCategory> result = subsCategoryService.findListAll(subsCategory, currentPageNo, recordCountPerPage);
        map.put("results", result);        
        
        PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
        map.put("paging", pagingUtil.invoke());  
    }
}
