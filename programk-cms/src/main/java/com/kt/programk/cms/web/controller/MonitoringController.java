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
import com.kt.programk.cms.service.MonitoringService;
import com.kt.programk.cms.service.VerifyDeployService;
import com.kt.programk.common.code.EnabledType;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.domain.core.Bot;
import com.kt.programk.common.domain.deploy.DeployHistory;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.db.domain.NoticeDTO;
import com.kt.programk.common.data.repository.Repository;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.deploy.service.DeployService;

/**
 * 모니터링 관리
 */
@Controller
public class MonitoringController {
	/**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(MonitoringController.class);
    
    /**
     * CONFIG 파일 정보 .
     */
    @Autowired
    @Qualifier("config")
    private ConfigProperties config;
    
    /** The cp service. */
    @Autowired
    private CpService cpService;
    
    /** The monitering service. */
    @Autowired
    private MonitoringService monitoringService;    

    /** The repository service. */
    @Autowired
    private Repository noticeRepository;
    
    /** The VerifyDeploy service. */
    @Autowired
    private VerifyDeployService verifyDeployService;
    
    /** The deploy service. */
    @Autowired
    private DeployService deployService;
    
    /**
     * 모니터링 목록  조회.
     *
     * @param BotFile the botFile
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/listMonitoring", method = RequestMethod.GET)
    public void listMonitoring(@ModelAttribute Bot bot, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/listMonitoring" );
    	
    	session.setAttribute("menuCode", "A101");
    	
    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp);  
    	
    	//cp관리자는 해당것만 노출
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		bot.setCpGroup(userInfo.getCpGroup());
    	}
    	
    	List<Bot> result = monitoringService.findListAll(bot);
        map.put("results", result); 
    }
    
    /**
     * 모니터링 체크.
     *
     * @param HttpServletRequest the request
     * @param map the map
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/checkMonitoring", method = RequestMethod.POST)
    @ResponseBody
    public Object checkMonitoring(HttpServletRequest request, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/checkMonitoring");
    	
    	String status = "";
		String message = "";
    	
		CpUser userInfo = (CpUser) session.getAttribute("userInfo");
		String server = config.getString("server.api.url");
		String label = request.getParameter("label");
		
    	Map<String, Object> map = new HashMap<String, Object>();
    	map.put("server", server);
		map.put("label", label);
		map.put("user", userInfo.getUserId());
		
		try {
			message = monitoringService.check(map);
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
     * 작업공지 등록.
     *
     * @param HttpServletRequest the request
     * @param map the map
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/addNotice", method = RequestMethod.GET)
    public void addNoticeForm(ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/addNoticeForm");
    	
    	session.setAttribute("menuCode", "A102");
    	
    	String active = "";
    	String message = "";
    	
    	NoticeDTO noticeDTO = new NoticeDTO();
    	noticeDTO.setActive("Y");
        List<NoticeDTO> objects = noticeRepository.getObjects(noticeDTO);

    	if(objects.size() > 0){
        	for (NoticeDTO noticeDTO2 : objects) {
            	active = noticeDTO2.getActive();
            	message = noticeDTO2.getMessage();
    		}
        }else{
        	active = "N";
        	message = "";
        }       
        
        noticeDTO.setActive(active);
        noticeDTO.setMessage(message);
        map.put("notice", noticeDTO);
        
        map.put("enabledType", EnabledType.values());
    }
    
    /**
     * 작업공지 처리.
     *
     * @param HttpServletRequest the request
     * @param map the map
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/addNotice", method = RequestMethod.POST)
    @ResponseBody
    public Object addNotice(@ModelAttribute NoticeDTO noticeDTO) throws ApplicationException
    {
    	LOG.debug("/addNotice");
    	
    	String status = "";
		String message = "";
		
		if("Y".equals(noticeDTO.getActive())){
			try {
	    		noticeRepository.put(noticeDTO);
			} catch (Exception e) {
				status = "FAIL";
				message = "저장시 오류가 발생하였습니다.";
			}	
		}else{
			noticeDTO.setActive("Y");
			noticeRepository.delete(noticeDTO);
		}
		
		HashMap<String, String> vo = new HashMap<String, String>();
    	vo.put("status", status);
		vo.put("message", message);	
    	
        return vo;
    }
    
    /**
     * bots 파일 리로드.
     *
     * @param HttpServletRequest the request
     * @param map the map
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/loadBots", method = RequestMethod.POST)
    @ResponseBody
    public Object loadBots(@ModelAttribute NoticeDTO noticeDTO) throws ApplicationException
    {
    	LOG.debug("/loadBots");
    	
    	String status = "";
		String message = "";
		
		try {
			deployService.loadBots();
		} catch (Exception e) {
			status = "FAIL";
			message = "bots 파일 리로드시 오류가 발생하였습니다. 오류:"+ e.getMessage();
		}	
		
		HashMap<String, String> vo = new HashMap<String, String>();
    	vo.put("status", status);
		vo.put("message", message);	
    	
        return vo;
    }
    
    /**
     * bots 파일 다운로드.
     *
     * @param HttpServletRequest the request
     * @param map the map
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/downLoadBots", method = RequestMethod.GET)
    public ResponseEntity<String> downLoadBots(@ModelAttribute DeployHistory deployHistory, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/downLoadBots" );
    	
    	String data = "";
    	String fileName = "";
    	
    	data = verifyDeployService.downLoadBots();
    	fileName = "bots.xml";   	
    	
    	HttpHeaders header = new HttpHeaders();
        header.add("Content-Type", "text/xml; charset=utf-8");
        header.add("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
        
        return new ResponseEntity<String>(data, header, HttpStatus.OK);
    }
}
