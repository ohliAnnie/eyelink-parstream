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
import com.kt.programk.cms.service.SubsService;
import com.kt.programk.cms.service.impl.FileManageServiceImpl;
import com.kt.programk.common.code.CategoryType;
import com.kt.programk.common.code.EnabledType;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.domain.core.AimlSubs;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.PagingUtil;

/**
 * 전처리 관리
 */
@Controller
public class SubsController {
	/**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(SubsController.class);
    
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
    
    /** The AimlSubs service. */
    @Autowired
    private SubsService subsService;
    
    /**
     * 전처리 목록  조회.
     *
     * @param AimlSubs the aimlSubs
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/listSubs", method = RequestMethod.GET)
    public void listSubs(@ModelAttribute AimlSubs aimlSubs, ModelMap map, HttpSession session, HttpServletRequest request) throws ApplicationException
    {
    	LOG.debug("/listSubs" );
    	
    	session.setAttribute("menuCode", "D202");
    	
    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp); 
    	
    	//cp관리자는 해당것만 노출
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(aimlSubs.getCpId() == 0){
    			aimlSubs.setCpId(resultCp.get(0).getId());
    		}
    		
    		aimlSubs.setUserAuth(userInfo.getAuth());
    	}   
    	
    	String searchType = request.getParameter("searchType");
    	String searchKeyword = request.getParameter("searchKeyword");
    	
    	if(searchType != null){
	    	if(searchType.equals("cateName")){
	    		aimlSubs.setCateName(searchKeyword);
	    	}else if(searchType.equals("find")){
	    		aimlSubs.setFind(searchKeyword);
	    	}else if(searchType.equals("replace")){
	    		aimlSubs.setReplace(searchKeyword);
	    	}    
    	}
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpId", aimlSubs.getCpId());
    	search.put("cateId", aimlSubs.getCateId());
    	search.put("order", aimlSubs.getOrder());
    	search.put("searchType", searchType);
    	search.put("searchKeyword", searchKeyword);
    	map.put("search", search); 
    	
    	int currentPageNo = aimlSubs.getCurrentPageNo();
    	int recordCountPerPage = aimlSubs.getRecordCountPerPage();    	
    	int countAll  = subsService.countAll(aimlSubs); 
    	
    	List<AimlSubs> result = subsService.findListAll(aimlSubs, currentPageNo, recordCountPerPage);
        map.put("results", result);        
        
        PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
        map.put("paging", pagingUtil.invoke());
        
        map.put("categoryType", CategoryType.values());
        map.put("enabledType", EnabledType.values());    
    }
    
    /**
     * 전처리 등록 폼.
     *
     * @param AimlSubs the aimlSubs
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/addSubs", method = RequestMethod.GET)
    public void addSubsForm(@ModelAttribute AimlSubs aimlSubs, ModelMap map, HttpSession session) throws ApplicationException
    {
        LOG.debug("/addSubsForm" );
        
        session.setAttribute("menuCode", "D202");
        
        List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp); 
    }
    
    /**
     * 전처리 등록.
     *
     * @param AimlSubs the aimlSubs
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/addSubs", method = RequestMethod.POST)
    @ResponseBody
    public Object addSubs(@ModelAttribute AimlSubs aimlSubs, ModelMap map, HttpServletRequest request) throws ApplicationException
    {
    	LOG.debug("/addSubs" );
    	
    	String status = "";
		String message = "";
    	
		try {
			subsService.create(aimlSubs);
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
     * 전처리 조회.
     *
     * @param aimlSubs the aimlSubs
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/detailSubs", method = RequestMethod.POST)
    @ResponseBody
    public AimlSubs detailSubs(@ModelAttribute AimlSubs aimlSubs, ModelMap map, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/detailSubs" );
    	       
        return subsService.findByCateId(aimlSubs);
    }
    
    /**
     * 전처리 수정.
     *
     * @param aimlSubs the aimlSubs
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/editSubs", method = RequestMethod.POST)
    @ResponseBody
    public Object editSubs(@ModelAttribute AimlSubs aimlSubs, ModelMap map, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/editSubs" );
        
        String status = "";
		String message = "";
		
		try {
    		subsService.modify(aimlSubs);
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
     * 전처리 삭제.
     *
     * @param aimlSubs the aimlSubs
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/deleteSubs", method = RequestMethod.GET)
    @ResponseBody
    public Object deleteSubs(@ModelAttribute AimlSubs aimlSubs, ModelMap map, HttpServletRequest request)
    {
        LOG.debug("/deleteSubs" );
        
        String status = "";
		String message = "";
		
		try {
			subsService.remove(aimlSubs);
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
     * 전처리 업로드.
     *
     * @param AimlSubs the aimlSubs
     * @param map the map
     * @param request the request
     * @throws Exception 
     * @ the exception
     */
    @RequestMapping(value = "/uploadSubs", method = RequestMethod.POST)
    @ResponseBody
    public Object uploadSubs(@ModelAttribute AimlSubs aimlSubs, ModelMap map, HttpSession session, MultipartHttpServletRequest request)
    {
        LOG.debug("/uploadSubs" );
        
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
					message = fileManageService.uploadSubs(Integer.parseInt(cpId), filePath);
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
     * 전처리  다운로드.
     *
     * @param AimlSubs the aimlSubs
     * @param map the map
     * @param request the request
     * @throws Exception 
     * @ the exception
     */
    @RequestMapping(value = "/downloadSubs", method = RequestMethod.GET)
    public ResponseEntity<String> downloadSubs(@ModelAttribute AimlSubs aimlSubs, HttpSession session, HttpServletRequest request)
    {
        LOG.debug("/downloadSubs" );
        
        String searchType = request.getParameter("searchType");
    	String searchKeyword = request.getParameter("searchKeyword");
    	
    	if(searchType != null){
	    	if(searchType.equals("cateName")){
	    		aimlSubs.setCateName(searchKeyword);
	    	}else if(searchType.equals("find")){
	    		aimlSubs.setFind(searchKeyword);
	    	}else if(searchType.equals("replace")){
	    		aimlSubs.setReplace(searchKeyword);
	    	}    
    	}
    	
    	StringBuilder theBuilder = new StringBuilder();
    	StringBuilder dataBuilder = new StringBuilder();
    	
    	try {
    		List<AimlSubs> result = subsService.findListAll(aimlSubs, 0, 0);    	
        	for (AimlSubs aimlSubs2 : result) {
        		theBuilder.append(StringUtil.setReplaceCsv(aimlSubs2.getCateName())); 
    			theBuilder.append(",");
    			theBuilder.append(StringUtil.setReplaceCsv(aimlSubs2.getFind())); 
    			theBuilder.append(",");
    			theBuilder.append(StringUtil.setReplaceCsv(aimlSubs2.getReplace()));
    			theBuilder.append("\n");
    		}
		} catch (Exception e) {
			theBuilder = null;
		}
    	
    	dataBuilder.append("카테고리" +","+ "대상키워드" +","+ "정규화키워드" + "\n");
    	dataBuilder.append(theBuilder.toString());
                
        HttpHeaders header = new HttpHeaders();
        header.add("Content-Type", "text/csv; charset=MS949");
        header.add("Content-Disposition", "attachment; filename=\"" + "substitution.csv" + "\"");
        
        return new ResponseEntity<String>(dataBuilder.toString(), header, HttpStatus.OK);
    }
    
    /**
     * 전처리  샘플 파일 다운로드.
     *
     * @param HttpServletRequest the request
     * @param HttpServletResponse the response
     * @throws Exception 
     * @ the exception
     */
    @RequestMapping(value = "/downloadSampleSubs", method = RequestMethod.GET)
    public void downloadSampleSubs(HttpServletRequest request, HttpServletResponse response)
    {
        LOG.debug("/downloadSampleSubs" );
        
        fileUtil.downloadFile(request, response, "subsSample.csv");
        
    }
    
    /**
     * 전처리  오류 파일 다운로드.
     *
     * @param HttpServletRequest the request
     * @param HttpServletResponse the response
     * @throws Exception 
     * @ the exception
     */
    @RequestMapping(value = "/downloadErrorSubs", method = RequestMethod.POST)
    public void downloadErrorSubs(HttpServletRequest request, HttpServletResponse response)
    {
        LOG.debug("/downloadErrorSubs" );
        
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
