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

import com.kt.programk.cms.service.ChatCategoryService;
import com.kt.programk.cms.service.CpService;
import com.kt.programk.common.code.CategoryTopicType;
import com.kt.programk.common.code.CategoryType;
import com.kt.programk.common.code.EnabledType;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.domain.category.AimlCategory;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.PagingUtil;

/**
 * 대화 카테고리 관리
 */
@Controller
public class ChatCategoryController {
	/**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(ChatCategoryController.class);
    
    /**
     * CONFIG 파일 정보 .
     */
    @Autowired
    @Qualifier("config")
    private ConfigProperties config;
    
    /** The cp service. */
    @Autowired
    private CpService cpService;
    
    /** The ChatCategory service. */
    @Autowired
    private ChatCategoryService chatCategoryService;
    
    /**
     * 대화 카테고리 목록  조회.
     *
     * @param ChatCategory the chatCategory
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/listChatCategory", method = RequestMethod.GET)
    public void listChatCategory(@ModelAttribute AimlCategory aimlCategory, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/listChatCategory" );
    	
    	session.setAttribute("menuCode", "D101");
        
        List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp);
    	
    	//cp관리자는 해당것만 노출
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(aimlCategory.getCpId() == 0){
    			aimlCategory.setCpId(userInfo.getCpId());
    		}
    		
    		aimlCategory.setUserAuth(userInfo.getAuth());
    	}   
    	
    	int currentPageNo = aimlCategory.getCurrentPageNo();
    	int recordCountPerPage = aimlCategory.getRecordCountPerPage();    	
    	int countAll  = chatCategoryService.countAll(aimlCategory);
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpId", aimlCategory.getCpId());
    	search.put("name", aimlCategory.getName());
    	search.put("restriction", aimlCategory.getRestriction());
    	map.put("search", search); 
    	
    	List<AimlCategory> result = chatCategoryService.findListAll(aimlCategory, currentPageNo, recordCountPerPage);
        map.put("results", result); 
        
        PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
        map.put("paging", pagingUtil.invoke()); 
        
        map.put("categoryType", CategoryType.values());
        map.put("topicType", CategoryTopicType.values());
        map.put("enabledType", EnabledType.values());
    }
    
    /**
     * 대화 카테고리 등록.
     *
     * @param AimlCategory the aimlCategory
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/addChatCategory", method = RequestMethod.POST)
    @ResponseBody
    public Object addChatCategory(@ModelAttribute AimlCategory aimlCategory, ModelMap map, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/addChatCategory" );
        
        String status = "";
		String message = "";		
		
		int result = chatCategoryService.countByName(aimlCategory);

        if (result == 0) {
        	try {
        		chatCategoryService.create(aimlCategory);
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
     * 대화 카테고리 조회.
     *
     * @param AimlCategory the aimlCategory
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/detailChatCategory", method = RequestMethod.GET)
    @ResponseBody
    public AimlCategory detailChatCategory(@ModelAttribute AimlCategory aimlCategory, ModelMap map, HttpSession session, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/detailChatCategory" );
        
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		//aimlCategory.setCpId(userInfo.getCpId());
    		aimlCategory.setUserAuth(userInfo.getAuth());
    	}  
    	       
        return chatCategoryService.findById(aimlCategory);
    }
    
    /**
     * 대화 카테고리 수정.
     *
     * @param AimlCategory the aimlCategory
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/editChatCategory", method = RequestMethod.POST)
    @ResponseBody
    public Object editChatCategory(@ModelAttribute AimlCategory aimlCategory, ModelMap map, HttpSession session, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/editChatCategory" );
        
        String status = "";
		String message = "";
		String type = request.getParameter("type");
		
		if("2".equals(type)){//배포 카테고리 등록
	    	try {
	    		chatCategoryService.createDeploy(aimlCategory);
			} catch (Exception e) {
				status = "FAIL";
    			message = e.getMessage();
			}
		}else{
			int result = chatCategoryService.countByName(aimlCategory);
	        if (result == 0) {
	        	try {
	        		chatCategoryService.modify(aimlCategory);
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
     * 대화 카테고리 삭제.
     *
     * @param AimlCategory the aimlCategory
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/deleteChatCategory", method = RequestMethod.GET)
    @ResponseBody
    public Object deleteChatCategory(@ModelAttribute AimlCategory aimlCategory, ModelMap map, HttpServletRequest request)
    {
        LOG.debug("/deleteChatCategory" );
        
        String status = "";
		String message = "";
		
		try {
			chatCategoryService.remove(aimlCategory);
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
     * @param AimlCategory the aimlCategory
     * @param map the map
     * @param request the request
     * @return the string
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/isChatCategory", method = RequestMethod.POST)
    @ResponseBody
    public Object isChatCategory(@ModelAttribute AimlCategory aimlCategory, ModelMap map, HttpServletRequest request) throws BizCheckedException, ApplicationException  {
    	LOG.debug("/isChatCategory" );

        String status = "";
		
		int result = chatCategoryService.countByName(aimlCategory);

        if (result != 0) {
        	status = "FAIL"; //중복
        }
		
		HashMap<String, String> vo = new HashMap<String, String>();
    	vo.put("status", status);	
    	
        return vo;
    }    
    
    /**
     * 대화 카테고리 조회 - 검색
     *
     * @param AimlCategory the aimlCategory
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/searchChatCategory", method = RequestMethod.GET)
    public void searchChatCategory(@ModelAttribute AimlCategory aimlCategory, ModelMap map, HttpSession session, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/searchChatCategory" );   
        
        List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp); 
        
        CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(aimlCategory.getCpId() == 0){
    			aimlCategory.setCpId(resultCp.get(0).getId());
    		}
    		
    		aimlCategory.setUserAuth("");
    		aimlCategory.setRestriction(CategoryType.USER.getValue()); //CP전용만
    	}   
        
        int currentPageNo = aimlCategory.getCurrentPageNo();
    	int recordCountPerPage = aimlCategory.getRecordCountPerPage();    	
    	int countAll  = chatCategoryService.countAll(aimlCategory);
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpId", aimlCategory.getCpId());
    	search.put("name", aimlCategory.getName());
    	map.put("search", search); 
    	
    	List<AimlCategory> result = chatCategoryService.findListAll(aimlCategory, currentPageNo, recordCountPerPage);
        map.put("results", result); 
        
        PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
        map.put("paging", pagingUtil.invoke());
    }   
}
