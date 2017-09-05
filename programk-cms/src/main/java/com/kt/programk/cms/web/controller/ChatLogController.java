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

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
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

import com.kt.programk.cms.common.StringUtil;
import com.kt.programk.cms.service.ChatLogService;
import com.kt.programk.cms.service.CpService;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.domain.stat.ChatLog;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.PagingUtil;

/**
 * 로그 컨트롤러
 *
 */
@Controller
public class ChatLogController {
	/**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(ChatLogController.class);
    
    /**
     * CONFIG 파일 정보 .
     */
    @Autowired
    @Qualifier("config")
    private ConfigProperties config;
    
    /** The cp service. */
    @Autowired
    private CpService cpService;
    
    /** The cp service. */
    @Autowired
    private ChatLogService chatLogService;
    
    /**
     * 로그  조회.
     *
     * @param ChatLog the chatLog
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/listChatLog", method = RequestMethod.GET)
    public void listChatLog(@ModelAttribute ChatLog chatLog, ModelMap map, HttpSession session, HttpServletRequest request) throws ApplicationException
    {
    	LOG.debug("/listChatLog" );
    	
    	session.setAttribute("menuCode", "F101");
    	
    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp);  
    	
    	//cp관리자 초기 선택값
        CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){    		
            if(chatLog.getCpLabel() == null || chatLog.getCpLabel() == ""){
            	chatLog.setCpLabel(resultCp.get(0).getLabel());
    		}
    	} 
    	
    	String searchSDate = request.getParameter("searchSDate");
    	String searchEDate = request.getParameter("searchEDate");
    	String searchType = request.getParameter("searchType");
    	String searchKeyword = request.getParameter("searchKeyword");
    	
    	if(searchType != null){
    		if(searchType.equals("cateName")){
	    		chatLog.setCateName(searchKeyword);
	    	}else if(searchType.equals("userInput")){
	    		chatLog.setUserInput(searchKeyword);
	    	}else if(searchType.equals("input")){
	    		chatLog.setInput(searchKeyword);
	    	}else if(searchType.equals("reply")){
	    		chatLog.setReply(searchKeyword);
	    	}else if(searchType.equals("userId")){
	    		chatLog.setUserId(searchKeyword);
	    	}       
    	}
    	
    	String exSearchType = request.getParameter("exSearchType");
    	String exSearchKeyword = request.getParameter("exSearchKeyword");
    	if(exSearchType != null){
    		if(exSearchType.equals("userInput")){
	    		chatLog.setExUserInput(exSearchKeyword);
	    	}else if(exSearchType.equals("reply")){
	    		chatLog.setExReply(exSearchKeyword);
	    	}else if(exSearchType.equals("userId")){
	    		chatLog.setExUserId(exSearchKeyword);
	    	}
    	}
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpLabel", chatLog.getCpLabel());
    	search.put("searchSDate", searchSDate);
    	search.put("searchEDate", searchEDate);
    	search.put("searchType", searchType);
    	search.put("searchKeyword", searchKeyword);
    	search.put("exSearchType", exSearchType);
    	search.put("exSearchKeyword", exSearchKeyword);
    	map.put("search", search);
    	
    	if(chatLog.getCpLabel() != null && (searchType != null || (searchSDate != null && searchEDate != null))){
    		chatLog.setSdate(searchSDate+ " 00:00:00");
    		chatLog.setEdate(searchEDate+ " 23:59:59");
    		
    		int currentPageNo = chatLog.getCurrentPageNo();
        	int recordCountPerPage = chatLog.getRecordCountPerPage();    	
        	int countAll  = chatLogService.countAll(chatLog);
        	
        	List<ChatLog> result = chatLogService.findListAll(chatLog, currentPageNo, recordCountPerPage);
            map.put("results", result);        
            
            PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
            map.put("paging", pagingUtil.invoke()); 
    	}
    }
    
    /**
     * 다운로드.
     *
     * @param ChatLog the chatLog
     * @param map the map
     * @param request the request
     * @throws Exception 
     * @ the exception
     */
    @RequestMapping(value = "/downloadChatLog", method = RequestMethod.GET)
    public ResponseEntity<String> downloadChat(@ModelAttribute ChatLog chatLog, HttpServletRequest request)
    {
        LOG.debug("/downloadChatLog" );
        
        String searchSDate = request.getParameter("searchSDate");
    	String searchEDate = request.getParameter("searchEDate");
    	String searchType = request.getParameter("searchType");
    	String searchKeyword = request.getParameter("searchKeyword");

    	if(searchType != null){
    		if(searchType.equals("cateName")){
	    		chatLog.setCateName(searchKeyword);
	    	}else if(searchType.equals("userInput")){
	    		chatLog.setUserInput(searchKeyword);
	    	}else if(searchType.equals("input")){
	    		chatLog.setInput(searchKeyword);
	    	}else if(searchType.equals("reply")){
	    		chatLog.setReply(searchKeyword);
	    	}else if(searchType.equals("userId")){
	    		chatLog.setUserId(searchKeyword);
	    	}    
    	}
    	
    	String exSearchType = request.getParameter("exSearchType");
    	String exSearchKeyword = request.getParameter("exSearchKeyword");
    	if(exSearchType != null){
    		if(exSearchType.equals("userInput")){
	    		chatLog.setExUserInput(exSearchKeyword);
	    	}else if(exSearchType.equals("reply")){
	    		chatLog.setExReply(exSearchKeyword);
	    	}else if(exSearchType.equals("userId")){
	    		chatLog.setExUserId(exSearchKeyword);
	    	}
    	}
    	
    	StringBuilder theBuilder = new StringBuilder();
    	StringBuilder dataBuilder = new StringBuilder();
    	SimpleDateFormat dataFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    	
    	dataBuilder.append("질문" +","+ "카테고리" +","+ "대화" +","+ "답변" +","+ "사용자ID" +","+ "시간" + "\n");
    	
    	if(chatLog.getCpLabel() != null && (searchType != null || (searchSDate != null && searchEDate != null))){
    		chatLog.setSdate(searchSDate+ " 00:00:00");
    		chatLog.setEdate(searchEDate+ " 23:59:59");
	    	
	    	try {
	    		List<ChatLog> result = chatLogService.findListAll(chatLog, 0, 0); 		
	    		for (ChatLog chatLog2 : result) {
	    			theBuilder.append(StringUtil.setReplaceCsv(chatLog2.getUserInput())); 
	    			theBuilder.append(",");
	    			theBuilder.append(StringUtil.setReplaceCsv(chatLog2.getCateName()));
	    			theBuilder.append(",");
	    			theBuilder.append(StringUtil.setReplaceCsv(chatLog2.getInput()));
	    			theBuilder.append(",");
	    			theBuilder.append(StringUtil.setReplaceCsv(chatLog2.getReply()));
	    			theBuilder.append(",");
	    			theBuilder.append(StringUtil.maskingConvert(chatLog2.getUserId()));
	    			theBuilder.append(",");
	    			theBuilder.append(dataFormat.format(chatLog2.getCreated()));
	    			theBuilder.append("\n");
	    		}
	    		
	    		dataBuilder.append(theBuilder.toString());
	    		
			} catch (Exception e) {
				theBuilder = null;
			}
    	}
                
        HttpHeaders header = new HttpHeaders();
        header.add("Content-Type", "text/csv; charset=MS949");
        header.add("Content-Disposition", "attachment; filename=\"" + "chatLog.csv" + "\"");
        
        return new ResponseEntity<String>(dataBuilder.toString(), header, HttpStatus.OK);
    }
}