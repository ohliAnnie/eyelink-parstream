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
import org.springframework.web.bind.annotation.ResponseBody;

import com.kt.programk.cms.service.CpService;
import com.kt.programk.cms.service.DeployService;
import com.kt.programk.common.code.DeploySchedulerCompletedType;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.domain.core.Bot;
import com.kt.programk.common.domain.deploy.DeployHistory;
import com.kt.programk.common.domain.deploy.DeployScheduler;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.PagingUtil;

/**
 * 배포관리 컨트롤러
 *
 */
@Controller
public class DeployController {
	/**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(DeployController.class);
    
    /**
     * CONFIG 파일 정보 .
     */
    @Autowired
    @Qualifier("config")
    private ConfigProperties config;
    
    /** The cp service. */
    @Autowired
    private CpService cpService;
    
    /** The deploy service. */
    @Autowired
    private DeployService deployService;
    
    /**
     * 배포 히스토리.
     *
     * @param DeployHistory the deployHistory
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/deployHistory", method = RequestMethod.GET)
    public void deployHistory(@ModelAttribute DeployHistory deployHistory, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/deployHistory" );
    	
    	session.setAttribute("menuCode", "G101");
    	
    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp);  
    	
        //초기 선택값
        if(deployHistory.getCpId() == 0){
			deployHistory.setCpId(resultCp.get(0).getId());
		}
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpId", deployHistory.getCpId());
    	map.put("search", search); 
    	
    	int currentPageNo = deployHistory.getCurrentPageNo();
    	int recordCountPerPage = deployHistory.getRecordCountPerPage();    	
    	int countAll  = deployService.countByHistory(deployHistory);
        
        List<DeployHistory> result = deployService.findListByHistory(deployHistory, currentPageNo, recordCountPerPage);
        map.put("results", result); 
        
        PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
        map.put("paging", pagingUtil.invoke()); 
        
        map.put("completed", DeploySchedulerCompletedType.values()); 
    }
    
    /**
     * 배포 히스토리 - 파일 다운로드
     *
     * @param DeployHistory the deployHistory
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/deployHistoryFileDownload", method = RequestMethod.GET)
    public ResponseEntity<String> deployHistoryFileDownload(@ModelAttribute DeployHistory deployHistory, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/deployHistoryFileDownload" );
    	
    	String data = "";
    	String fileName = "";
    	
    	DeployHistory result = deployService.findById(deployHistory);
    	
    	if(result != null){
    		data = result.getFileBody();
    		
    		if("aiml".equals(result.getFileType())){
    			fileName = result.getFileType() + ".aiml";
    		}else{
    			fileName = result.getFileType() + ".xml";
    		}    		
    	}
    	
    	HttpHeaders header = new HttpHeaders();
        header.add("Content-Type", "text/xml; charset=utf-8");
        header.add("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
        
        return new ResponseEntity<String>(data, header, HttpStatus.OK);
    }
    
    /**
     * 배포 설정.
     *
     * @param DeployHistory the deployHistory
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/deploySet", method = RequestMethod.GET)
    public void deploySet(@ModelAttribute Bot bot, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/deploySet" );
    	
    	session.setAttribute("menuCode", "G102");
    	
    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp);  
    	
    	//초기 선택값
        if(bot.getCpId() == 0){
			bot.setCpId(resultCp.get(0).getId());
		}
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpId", bot.getCpId());
    	map.put("search", search); 
    	
    	// 최종배포 상태
    	DeployScheduler deployScheduler = new DeployScheduler();
    	deployScheduler.setCpId(bot.getCpId());
    	int clean = deployService.cleanLastBotDeploy(deployScheduler);
    	map.put("clean", clean); 
    	
    	List<Bot> result = deployService.findListByBot(bot);
        map.put("results", result); 
    }
    
    /**
     * 배포 등록.
     *
     * @param DeployScheduler the deployScheduler
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/addDeploy", method = RequestMethod.POST)
    @ResponseBody
    public Object addDeploy(@ModelAttribute DeployScheduler deployScheduler, ModelMap map, HttpSession session, HttpServletRequest request) throws ApplicationException
    {
    	LOG.debug("/addDeploy");
    	
    	String status = "";
		String message = "";	
		String type = request.getParameter("type");
		
		CpUser userInfo = (CpUser) session.getAttribute("userInfo");

		try {
			deployScheduler.setUserId(userInfo.getUserId());
			deployScheduler.setCompleted("N");
			
			if("1".equals(type)){ //배포
				deployScheduler.setDeployDate(new Date());
				deployScheduler.setGubun("배포");
			}else{ //BOT 변경
				deployScheduler.setGubun("BOT변경");
			}
			
			deployService.create(deployScheduler);
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
     * 봇 메모리 정리
     *
     * @param DeployScheduler the deployScheduler
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/cleanDeploy", method = RequestMethod.POST)
    @ResponseBody
    public Object cleanDeploy(@ModelAttribute DeployScheduler deployScheduler, ModelMap map, HttpSession session, HttpServletRequest request) throws ApplicationException
    {
    	LOG.debug("/cleanDeploy");
    	
    	String status = "";
		String message = "";	
		
		CpUser userInfo = (CpUser) session.getAttribute("userInfo");

		try {
			deployScheduler.setUserId(userInfo.getUserId());
			deployScheduler.setCompleted("N");
			deployScheduler.setDeployDate(new Date());
			deployScheduler.setGubun("정리");

			deployService.create(deployScheduler);
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
     * 배포 취소.
     *
     * @param DeployScheduler the deployScheduler
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/editDeploy", method = RequestMethod.POST)
    @ResponseBody
    public Object editDeploy(@ModelAttribute DeployScheduler deployScheduler, ModelMap map, HttpSession session, HttpServletRequest request) throws ApplicationException
    {
    	LOG.debug("/editDeploy");
    	
    	String status = "";
		String message = "";	
		
		CpUser userInfo = (CpUser) session.getAttribute("userInfo");

		try {
			deployScheduler.setUserId(userInfo.getUserId());
			deployService.modify(deployScheduler);
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
     * bot 변경.
     *
     * @param Bot the bot
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/editBot", method = RequestMethod.POST)
    @ResponseBody
    public Object editBot(@ModelAttribute Bot bot, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/editBot");
    	
    	String status = "";
		String message = "";
		
		//작업자 아이디 - 히스토리용
		CpUser userInfo = (CpUser) session.getAttribute("userInfo");
		bot.setUserId(userInfo.getUserId());

		try {
			List<Bot> result = deployService.findListByBot(bot);
			
			if(result != null){				
				for (Bot bot2 : result) {
					if("N".equals(bot2.getActive())){
						bot.setId(bot2.getId());
						bot.setSubLabel(bot2.getSubLabel());
						bot.setCpId(bot2.getCpId());
						bot.setActive("Y");						
						deployService.modifyByBot(bot);
					}else{
						bot.setId(bot2.getId());
						bot.setSubLabel(bot2.getSubLabel());
						bot.setCpId(bot2.getCpId());
						bot.setActive("N");
						deployService.modifyByBot(bot);
					}					
				}
			}			
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
