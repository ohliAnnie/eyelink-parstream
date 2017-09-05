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
import com.kt.programk.cms.service.PropService;
import com.kt.programk.cms.service.impl.FileManageServiceImpl;
import com.kt.programk.common.code.CategoryType;
import com.kt.programk.common.code.EnabledType;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.domain.core.AimlProp;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.PagingUtil;

/**
 * Properties 관리
 */
@Controller
public class PropController {
	/**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(PropController.class);
    
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
    
    /** The AimlProp service. */
    @Autowired
    private PropService propService;
    
    /**
     * Properties 목록  조회.
     *
     * @param AimlProp the aimlProp
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/listProp", method = RequestMethod.GET)
    public void listProp(@ModelAttribute AimlProp aimlProp, ModelMap map, HttpSession session, HttpServletRequest request) throws ApplicationException
    {
    	LOG.debug("/listProp" );
    	
    	session.setAttribute("menuCode", "D302"); 

    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp); 
    	
    	//cp관리자는 해당것만 노출
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(aimlProp.getCpId() == 0){
    			aimlProp.setCpId(resultCp.get(0).getId());
    		}
    		
    		aimlProp.setUserAuth(userInfo.getAuth());
    	}   
    	
    	String searchType = request.getParameter("searchType");
    	String searchKeyword = request.getParameter("searchKeyword");
    	
    	if(searchType != null){
	    	if(searchType.equals("cateName")){
	    		aimlProp.setCateName(searchKeyword);
	    	}else if(searchType.equals("name")){
	    		aimlProp.setName(searchKeyword);
	    	}else if(searchType.equals("val")){
	    		aimlProp.setVal(searchKeyword);
	    	}    
    	}
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpId", aimlProp.getCpId());
    	search.put("cateId", aimlProp.getCateId());
    	search.put("order", aimlProp.getOrder());
    	search.put("searchType", searchType);
    	search.put("searchKeyword", searchKeyword);
    	map.put("search", search); 
    	
    	int currentPageNo = aimlProp.getCurrentPageNo();
    	int recordCountPerPage = aimlProp.getRecordCountPerPage();    	
    	int countAll  = propService.countAll(aimlProp);  

    	List<AimlProp> result = propService.findListAll(aimlProp, currentPageNo, recordCountPerPage);
        map.put("results", result);        
        
        PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
        map.put("paging", pagingUtil.invoke());
        
        map.put("categoryType", CategoryType.values());
        map.put("enabledType", EnabledType.values());    
    }    
    
    /**
     * Properties 등록 폼.
     *
     * @param AimlProp the aimlProp
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/addProp", method = RequestMethod.GET)
    public void addPropForm(@ModelAttribute AimlProp aimlProp, ModelMap map, HttpSession session) throws ApplicationException
    {
        LOG.debug("/addPropForm" );
        
        session.setAttribute("menuCode", "D302");
        
        List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp); 
    }
    
    /**
     * Properties 등록.
     *
     * @param AimlProp the aimlProp
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/addProp", method = RequestMethod.POST)
    @ResponseBody
    public Object addProp(@ModelAttribute AimlProp aimlProp, ModelMap map, HttpServletRequest request) throws ApplicationException
    {
    	LOG.debug("/addProp" );
    	
    	String status = "";
		String message = "";
    	
		try {
			propService.create(aimlProp);
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
     * @param aimlProp the aimlProp
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/detailProp", method = RequestMethod.POST)
    @ResponseBody
    public AimlProp detailProp(@ModelAttribute AimlProp aimlProp, ModelMap map, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/detailProp" );
    	       
        return propService.findByCateId(aimlProp);
    }
    
    /**
     * Properties 수정.
     *
     * @param AimlProp the aimlProp
     * @param map the map
     * @param request the request
     * @throws ApplicationException 
     * @throws BizCheckedException 
     * @ the exception
     */
    @RequestMapping(value = "/editProp", method = RequestMethod.POST)
    @ResponseBody
    public Object editProp(@ModelAttribute AimlProp aimlProp, ModelMap map, HttpServletRequest request) throws BizCheckedException, ApplicationException
    {
        LOG.debug("/editProp" );
        
        String status = "";
		String message = "";
		
		try {
    		propService.modify(aimlProp);
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
     * Properties 삭제.
     *
     * @param AimlProp the aimlProp
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/deleteProp", method = RequestMethod.GET)
    @ResponseBody
    public Object deleteProp(@ModelAttribute AimlProp aimlProp, ModelMap map, HttpServletRequest request)
    {
        LOG.debug("/deleteProp" );
        
        String status = "";
		String message = "";
		
		try {
			propService.remove(aimlProp);
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
     * Properties 업로드.
     *
     * @param AimlProp the aimlProp
     * @param map the map
     * @param request the request
     * @throws Exception 
     * @ the exception
     */
    @RequestMapping(value = "/uploadProp", method = RequestMethod.POST)
    @ResponseBody
    public Object uploadProp(@ModelAttribute AimlProp aimlProp, ModelMap map, HttpSession session, MultipartHttpServletRequest request)
    {
        LOG.debug("/uploadProp" );
        
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
					message = fileManageService.uploadProp(Integer.parseInt(cpId), filePath);
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
     * Properties 다운로드.
     *
     * @param AimlProp the aimlProp
     * @param map the map
     * @param request the request
     * @throws Exception 
     * @ the exception
     */
    @RequestMapping(value = "/downloadProp", method = RequestMethod.GET)
    public ResponseEntity<String> downloadProp(@ModelAttribute AimlProp aimlProp, HttpSession session, HttpServletRequest request)
    {
        LOG.debug("/downloadProp" );
    	
        String searchType = request.getParameter("searchType");
    	String searchKeyword = request.getParameter("searchKeyword");
    	
    	if(searchType != null){
	    	if(searchType.equals("cateName")){
	    		aimlProp.setCateName(searchKeyword);
	    	}else if(searchType.equals("name")){
	    		aimlProp.setName(searchKeyword);
	    	}else if(searchType.equals("val")){
	    		aimlProp.setVal(searchKeyword);
	    	}    
    	}
    	
    	StringBuilder theBuilder = new StringBuilder();
    	StringBuilder dataBuilder = new StringBuilder();
    	
    	try {
    		List<AimlProp> result = propService.findListAll(aimlProp, 0, 0);    	
        	for (AimlProp aimlProp2 : result) {
        		theBuilder.append(StringUtil.setReplaceCsv(aimlProp2.getCateName())); 
    			theBuilder.append(",");
    			theBuilder.append(StringUtil.setReplaceCsv(aimlProp2.getName())); 
    			theBuilder.append(",");
    			theBuilder.append(StringUtil.setReplaceCsv(aimlProp2.getVal()));
    			theBuilder.append("\n");
    		}
		} catch (Exception e) {
			theBuilder = null;
		}
    	
    	dataBuilder.append("카테고리" +","+ "이름(name)" +","+ "값(value)" + "\n");
    	dataBuilder.append(theBuilder.toString());
                
        HttpHeaders header = new HttpHeaders();
        header.add("Content-Type", "text/csv; charset=MS949");
        header.add("Content-Disposition", "attachment; filename=\"" + "Properties.csv" + "\"");
        
        return new ResponseEntity<String>(dataBuilder.toString(), header, HttpStatus.OK);
    }
    
    /**
     * Properties 샘플 파일 다운로드.
     *
     * @param HttpServletRequest the request
     * @param HttpServletResponse the response
     * @throws Exception 
     * @ the exception
     */
    @RequestMapping(value = "/downloadSampleProp", method = RequestMethod.GET)
    public void downloadSampleProp(HttpServletRequest request, HttpServletResponse response)
    {
        LOG.debug("/downloadSampleProp" );
        
        fileUtil.downloadFile(request, response, "propSample.csv");
        
    }
    
    /**
     * Properties 오류 파일 다운로드.
     *
     * @param HttpServletRequest the request
     * @param HttpServletResponse the response
     * @throws Exception 
     * @ the exception
     */
    @RequestMapping(value = "/downloadErrorProp", method = RequestMethod.POST)
    public void downloadErrorProp(HttpServletRequest request, HttpServletResponse response)
    {
        LOG.debug("/downloadErrorProp" );
        
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
