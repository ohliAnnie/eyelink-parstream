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

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.kt.programk.cms.common.FileUtil;
import com.kt.programk.cms.common.StringUtil;
import com.kt.programk.cms.service.CpService;
import com.kt.programk.cms.service.PredService;
import com.kt.programk.cms.service.impl.FileManageServiceImpl;
import com.kt.programk.common.code.CategoryType;
import com.kt.programk.common.code.EnabledType;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.domain.core.AimlPred;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.PagingUtil;

/**
 * Predicates 관리
 */
@Controller
public class PredController {
	/**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(PredController.class);
    
    /**
     * CONFIG 파일 정보 .
     */
    @Autowired
    @Qualifier("config")
    private ConfigProperties config;
    
    /** fileUtils */
    @Resource(name="fileUtil")
    private FileUtil fileUtil;
    
    /** The fileManage service. */
    @Autowired
    private FileManageServiceImpl fileManageService;
    
    /** The cp service. */
    @Autowired
    private CpService cpService;
    
    /** The AimlPred service. */
    @Autowired
    private PredService predService;
    
    /**
     * Predicates 목록  조회.
     *
     * @param AimlPred the aimlPred
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/listPred", method = RequestMethod.GET)
    public void listPred(@ModelAttribute AimlPred aimlPred, ModelMap map, HttpSession session, HttpServletRequest request) throws ApplicationException
    {
    	LOG.debug("/listPred" );
    	
    	session.setAttribute("menuCode", "D402"); 

    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp); 
    	
    	//cp관리자는 해당것만 노출
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(aimlPred.getCpId() == 0){
    			aimlPred.setCpId(resultCp.get(0).getId());
    		}
    		
    		aimlPred.setUserAuth(userInfo.getAuth());
    	}   
    	
    	String searchType = request.getParameter("searchType");
    	String searchKeyword = request.getParameter("searchKeyword");
    	
    	if(searchType != null){
	    	if(searchType.equals("cateName")){
	    		aimlPred.setCateName(searchKeyword);
	    	}else if(searchType.equals("name")){
	    		aimlPred.setName(searchKeyword);
	    	}else if(searchType.equals("basic")){
	    		aimlPred.setBasic(searchKeyword);
	    	}    
    	}
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpId", aimlPred.getCpId());
    	search.put("cateId", aimlPred.getCateId());
    	search.put("order", aimlPred.getOrder());
    	search.put("searchType", searchType);
    	search.put("searchKeyword", searchKeyword);    	
    	map.put("search", search); 
    	
    	int currentPageNo = aimlPred.getCurrentPageNo();
    	int recordCountPerPage = aimlPred.getRecordCountPerPage();    	
    	int countAll  = predService.countAll(aimlPred);
    	
    	List<AimlPred> result = predService.findListAll(aimlPred, currentPageNo, recordCountPerPage);
        map.put("results", result);        
        
        PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
        map.put("paging", pagingUtil.invoke());
        
        map.put("categoryType", CategoryType.values());
        map.put("enabledType", EnabledType.values());        	
    }
    
    /**
     * Properties 등록 폼.
     *
     * @param AimlPred the aimlPred
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/addPred", method = RequestMethod.GET)
    public void addPredForm(@ModelAttribute AimlPred aimlPred, ModelMap map, HttpSession session) throws ApplicationException
    {
        LOG.debug("/addPredForm" );
        
        session.setAttribute("menuCode", "D402");
        
        List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp); 
    }
    
    /**
     * Properties 등록.
     *
     * @param AimlPred the aimlPred
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/addPred", method = RequestMethod.POST)
    @ResponseBody
    public Object addPred(@ModelAttribute AimlPred aimlPred, ModelMap map, HttpServletRequest request) throws ApplicationException
    {
    	LOG.debug("/addPred" );
    	
    	String status = "";
		String message = "";
    	
		try {
			predService.create(aimlPred);
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
     * Properties 조회.
     *
     * @param AimlPred the aimlPred
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/detailPred", method = RequestMethod.POST)
    @ResponseBody
    public AimlPred detailPred(@ModelAttribute AimlPred aimlPred, ModelMap map, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/detailPred" );
    	       
        return predService.findByCateId(aimlPred);
    }
    
    /**
     * Predicates 수정.
     *
     * @param AimlPred the aimlPred
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/editPred", method = RequestMethod.POST)
    @ResponseBody
    public Object editPred(@ModelAttribute AimlPred aimlPred, ModelMap map, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/editPred" );
        
        String status = "";
		String message = "";
		
		try {
    		predService.modify(aimlPred);
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
     * Predicates 삭제.
     *
     * @param AimlPred the aimlPred
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/deletePred", method = RequestMethod.GET)
    @ResponseBody
    public Object deletePred(@ModelAttribute AimlPred aimlPred, ModelMap map, HttpServletRequest request)
    {
        LOG.debug("/deletePred" );
        
        String status = "";
		String message = "";
		
		try {
			predService.remove(aimlPred);
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
     * Predicates 업로드.
     *
     * @param AimlPred the aimlPred
     * @param map the map
     * @param request the request
     * @throws Exception 
     * @ the exception
     */
    @RequestMapping(value = "/uploadPred", method = RequestMethod.POST)
    @ResponseBody
    public Object uploadPred(@ModelAttribute AimlPred aimlPred, ModelMap map, HttpSession session, MultipartHttpServletRequest request)
    {
        LOG.debug("/uploadPred" );
        
        String status = "";
		String message = "";
		String filename = "";
		int lastIndex = 0;
		
		try {
			List<Map<String,Object>> result = fileUtil.uploadFileInfo(request);
			if("0".equals(result.get(0).get("status"))){
				String cpId = request.getParameter("cpId");
				String filePath = (String) result.get(0).get("filePath");
				
				lastIndex = filePath.lastIndexOf("/");
		    	filename = filePath.substring(lastIndex+1);
				
				try {
					message = fileManageService.uploadPred(Integer.parseInt(cpId), filePath);
				} catch (Exception e) {
					status = "FAIL";
					message = "업로드시 오류가 발생하였습니다.";
				} 
			}else{
				status = "FAIL";
				message = (String) result.get(0).get("status");
			}	
		} catch (Exception e) {
			status = "FAIL";
			message = "업로드시 오류가 발생하였습니다.";
		}	
		
		HashMap<String, Object> vo = new HashMap<String, Object>();
    	vo.put("status", status);
		vo.put("message", message);
		vo.put("filename", filename);
    	
        return vo;
    }
    
    /**
     * Predicates 다운로드.
     *
     * @param AimlPred the aimlPred
     * @param map the map
     * @param request the request
     * @throws Exception 
     * @ the exception
     */
    @RequestMapping(value = "/downloadPred", method = RequestMethod.GET)
    public ResponseEntity<String> downloadPred(@ModelAttribute AimlPred aimlPred, HttpSession session, HttpServletRequest request)
    {
        LOG.debug("/downloadPred" );
        
        String searchType = request.getParameter("searchType");
    	String searchKeyword = request.getParameter("searchKeyword");
    	
    	if(searchType != null){
	    	if(searchType.equals("cateName")){
	    		aimlPred.setCateName(searchKeyword);
	    	}else if(searchType.equals("name")){
	    		aimlPred.setName(searchKeyword);
	    	}else if(searchType.equals("basic")){
	    		aimlPred.setBasic(searchKeyword);
	    	}    
    	}
    	
    	StringBuilder theBuilder = new StringBuilder();
    	StringBuilder dataBuilder = new StringBuilder();
    	
    	try {
    		List<AimlPred> result = predService.findListAll(aimlPred, 0, 0);        	
        	for (AimlPred aimlPred2 : result) {
        		theBuilder.append(StringUtil.setReplaceCsv(aimlPred2.getCateName())); 
    			theBuilder.append(",");
    			theBuilder.append(StringUtil.setReplaceCsv(aimlPred2.getName())); 
    			theBuilder.append(",");
    			theBuilder.append(StringUtil.setReplaceCsv(aimlPred2.getBasic())); 
    			theBuilder.append(",");
    			theBuilder.append(StringUtil.setReplaceCsv(aimlPred2.getVal()));
    			theBuilder.append("\n");
    		}
		} catch (Exception e) {
			theBuilder = null;
		}
        
    	dataBuilder.append("카테고리" +","+ "이름(name)" +","+ "기본값(default)" +","+ "동작" + "\n");
    	dataBuilder.append(theBuilder.toString());

		HttpHeaders header = new HttpHeaders();
        header.add("Content-Type", "text/csv; charset=MS949");
        header.add("Content-Disposition", "attachment; filename=\"" + "Predicates.csv" + "\"");  
        
		return new ResponseEntity<String>(dataBuilder.toString(), header, HttpStatus.OK);
    }
    
    /**
     * Predicates 샘플 파일 다운로드.
     *
     * @param HttpServletRequest the request
     * @param HttpServletResponse the response
     * @throws Exception 
     * @ the exception
     */
    @RequestMapping(value = "/downloadSamplePred", method = RequestMethod.GET)
    public void downloadSamplePred(HttpServletRequest request, HttpServletResponse response)
    {
        LOG.debug("/downloadSamplePred" );
        
        fileUtil.downloadFile(request, response, "predSample.csv");
    }
    
    /**
     * Predicates 오류 파일 다운로드.
     *
     * @param HttpServletRequest the request
     * @param HttpServletResponse the response
     * @throws Exception 
     * @ the exception
     */
    @RequestMapping(value = "/downloadErrorPred", method = RequestMethod.POST)
    public void downloadErrorPred(HttpServletRequest request, HttpServletResponse response)
    {
        LOG.debug("/downloadErrorPred" );
        
        String fileName = request.getParameter("filename");
        
        try {
        	fileUtil.downloadFile(request, response, "error_" + fileName);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			fileUtil.removeFile(fileName); //업로드 파일 삭제
			fileUtil.removeFile("error_" + fileName);
        }
    }
}
