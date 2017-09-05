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
import com.kt.programk.cms.service.CpService;
import com.kt.programk.cms.service.StatisticsService;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.domain.stat.ClickStat;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.PagingUtil;

/**
 * 통계 컨트롤러
 *
 */
@Controller
public class StatisticsController {
	/**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(StatisticsController.class);
    
    /**
     * CONFIG 파일 정보 .
     */
    @Autowired
    @Qualifier("config")
    private ConfigProperties config;
    
    /** The cp service. */
    @Autowired
    private CpService cpService;
    
    /** The statistics service. */
    @Autowired
    private StatisticsService statisticsService;
    
    /**
     * 기간별통계(월별) 목록  조회.
     *
     * @param ClickStat the clickStat
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/statPeriodMonth", method = RequestMethod.GET)
    public void statPeriodMonth(@ModelAttribute ClickStat clickStat, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/statPeriodMonth" );
    	
    	session.setAttribute("menuCode", "E101");
    	
    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp);  
    	
        //cp관리자 초기 선택값
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(clickStat.getLabel() == null || clickStat.getLabel() == ""){
    			clickStat.setLabel(resultCp.get(0).getLabel());
    		}
    	}    	
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpLabel", clickStat.getLabel());
    	search.put("startTime", clickStat.getStartTime());
    	search.put("endTime", clickStat.getEndTime());	
    	map.put("search", search); 
    	
    	if(clickStat.getLabel() != null && clickStat.getStartTime() != null && clickStat.getEndTime() != null){
    		clickStat.setStartTime(clickStat.getStartTime() + "-01 00:00:00");
    		clickStat.setEndTime(clickStat.getEndTime() + "-31 23:59:59");
    		
    		List<ClickStat> result = statisticsService.findListPeriodMonth(clickStat);
    		map.put("results", result);  
    	}
    }
    
    /**
     * 월별 통계 다운로드  조회.
     *
     * @param ClickStat the clickStat
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/statPeriodMonthDownload", method = RequestMethod.GET)
    public ResponseEntity<String> statPeriodMonthDownload(@ModelAttribute ClickStat clickStat, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/statPeriodMonthDownload" );
    	
    	StringBuilder dataBuilder = new StringBuilder();  
    	StringBuilder theBuilder = new StringBuilder();
    	
    	dataBuilder.append("기간" +","+ "검색 건수" +","+ "응답 건수" +","+ "응답율(%)" +","+ "유니크 사용자 수" + "\n");
    	
    	if(clickStat.getLabel() != null && clickStat.getStartTime() != null && clickStat.getEndTime() != null){
    		clickStat.setStartTime(clickStat.getStartTime() + "-01 00:00:00");
    		clickStat.setEndTime(clickStat.getEndTime() + "-31 23:59:59");
    		
    		List<ClickStat> result = statisticsService.findListPeriodMonth(clickStat);
    		
    		int searchCountSum = 0;
    		int responseCountSum = 0;
    		int userCountSum = 0;
    		double searchCountAvg = 0;
    		double responseCountAvg = 0;
    		double userCountAvg = 0;
    		double responsePercent = 0.00;
    		double responseAvgPercent = 0.00;
    		double count = result.size();
    		
    		for (ClickStat clickStat2 : result) {
    			theBuilder.append(clickStat2.getStartTime());
    			theBuilder.append(",");
    			theBuilder.append(clickStat2.getSearchCount());
    			theBuilder.append(",");
    			theBuilder.append(clickStat2.getResponseCount());
    			theBuilder.append(",");
    			
    			if(clickStat2.getSearchCount() > 0 && clickStat2.getResponseCount() > 0){
    				theBuilder.append(Double.parseDouble(String.format("%.2f",((clickStat2.getResponseCount()*100.0)/clickStat2.getSearchCount())))+"%");
    			}else{
    				theBuilder.append("0%");
    			}
    			
    			theBuilder.append(",");
    			theBuilder.append(clickStat2.getUserCount());
    			theBuilder.append("\n");
    					
    			searchCountSum += clickStat2.getSearchCount();
    			responseCountSum += clickStat2.getResponseCount();
    			userCountSum += clickStat2.getUserCount();
			}    		
    		
    		searchCountAvg = Double.parseDouble(String.format("%.2f",(searchCountSum/count)));
    		responseCountAvg = Double.parseDouble(String.format("%.2f",(responseCountSum/count)));
    		userCountAvg = Double.parseDouble(String.format("%.2f",(userCountSum/count))); 
    		
    		if(responseCountSum > 0 && searchCountSum > 0){
    			responsePercent = ((responseCountSum*100.0)/searchCountSum);
    		}
    		
    		if(responseCountAvg > 0.00 && searchCountAvg > 0.00){
    			responseAvgPercent = ((responseCountAvg*100.0)/searchCountAvg);
    		}    		
    		
    		dataBuilder.append("합계" +","+ searchCountSum +","+ responseCountSum +","+ responsePercent +"%,"+ userCountSum + "\n");
    		dataBuilder.append("월평균" +","+ searchCountAvg +","+ responseCountAvg +","+ responseAvgPercent +"%,"+ userCountAvg + "\n");
    	}
    	
    	dataBuilder.append(theBuilder.toString());
                
        HttpHeaders header = new HttpHeaders();
        header.add("Content-Type", "text/csv; charset=MS949");
        header.add("Content-Disposition", "attachment; filename=\"" + "periodMonth.csv" + "\"");
        
        return new ResponseEntity<String>(dataBuilder.toString(), header, HttpStatus.OK);
    }
    
    /**
     * 기간별통계(일별) 목록  조회.
     *
     * @param ClickStat the clickStat
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/statPeriodDay", method = RequestMethod.GET)
    public void statPeriodDay(@ModelAttribute ClickStat clickStat, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/statPeriodDay" );
    	
    	session.setAttribute("menuCode", "E101");
    	
    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp);  
    	
        //cp관리자 초기 선택값
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(clickStat.getLabel() == null || clickStat.getLabel() == ""){
    			clickStat.setLabel(resultCp.get(0).getLabel());
    		}
    	} 
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpLabel", clickStat.getLabel());
    	search.put("startTime", clickStat.getStartTime());
    	search.put("endTime", clickStat.getEndTime());	
    	map.put("search", search); 
    	
    	if(clickStat.getLabel() != null && clickStat.getStartTime() != null && clickStat.getEndTime() != null){
    		clickStat.setStartTime(clickStat.getStartTime() + " 00:00:00");
    		clickStat.setEndTime(clickStat.getEndTime() + " 23:59:59");
    		
    		List<ClickStat> result = statisticsService.findListPeriodDay(clickStat);
    		map.put("results", result);  
    	}      
    }
    
    /**
     * 일별 통계 다운로드  조회.
     *
     * @param ClickStat the clickStat
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/statPeriodDayDownload", method = RequestMethod.GET)
    public ResponseEntity<String> statPeriodDayDownload(@ModelAttribute ClickStat clickStat, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/statPeriodDayDownload" );
    	
    	StringBuilder dataBuilder = new StringBuilder();
    	StringBuilder theBuilder = new StringBuilder();    	
    	
    	dataBuilder.append("기간" +","+ "검색 건수" +","+ "응답 건수" +","+ "응답율(%)" +","+ "유니크 사용자 수" + "\n");
    	
    	if(clickStat.getLabel() != null && clickStat.getStartTime() != null && clickStat.getEndTime() != null){
    		clickStat.setStartTime(clickStat.getStartTime() + " 00:00:00");
    		clickStat.setEndTime(clickStat.getEndTime() + " 23:59:59");
    		
    		List<ClickStat> result = statisticsService.findListPeriodDay(clickStat);
    		
    		int searchCountSum = 0;
    		int responseCountSum = 0;
    		int userCountSum = 0;
    		double searchCountAvg = 0;
    		double responseCountAvg = 0;
    		double userCountAvg = 0;
    		double responsePercent = 0.00;
    		double responseAvgPercent = 0.00;
    		double count = result.size();
    		
    		for (ClickStat clickStat2 : result) {
    			theBuilder.append(clickStat2.getStartTime());
    			theBuilder.append(",");
    			theBuilder.append(clickStat2.getSearchCount());
    			theBuilder.append(",");
    			theBuilder.append(clickStat2.getResponseCount());
    			theBuilder.append(",");
    			
    			if(clickStat2.getSearchCount() > 0 && clickStat2.getResponseCount() > 0){
    				theBuilder.append(Double.parseDouble(String.format("%.2f",((clickStat2.getResponseCount()*100.0)/clickStat2.getSearchCount())))+"%");
    			}else{
    				theBuilder.append("0%");
    			}
    			
    			theBuilder.append(",");
    			theBuilder.append(clickStat2.getUserCount());
    			theBuilder.append("\n");
    					
    			searchCountSum += clickStat2.getSearchCount();
    			responseCountSum += clickStat2.getResponseCount();
    			userCountSum += clickStat2.getUserCount();
			}    		
    		
    		searchCountAvg = Double.parseDouble(String.format("%.2f",(searchCountSum/count)));
    		responseCountAvg = Double.parseDouble(String.format("%.2f",(responseCountSum/count)));
    		userCountAvg = Double.parseDouble(String.format("%.2f",(userCountSum/count))); 
    		
    		if(responseCountSum > 0 && searchCountSum > 0){
    			responsePercent = ((responseCountSum*100.0)/searchCountSum);
    		}
    		
    		if(responseCountAvg > 0.00 && searchCountAvg > 0.00){
    			responseAvgPercent = ((responseCountAvg*100.0)/searchCountAvg);
    		}    
    		
    		dataBuilder.append("합계" +","+ searchCountSum +","+ responseCountSum +","+ responsePercent +"%,"+ userCountSum + "\n");
    		dataBuilder.append("일평균" +","+ searchCountAvg +","+ responseCountAvg +","+ responseAvgPercent +"%,"+ userCountAvg + "\n");
    	}
    	
    	dataBuilder.append(theBuilder.toString());
                
        HttpHeaders header = new HttpHeaders();
        header.add("Content-Type", "text/csv; charset=MS949");
        header.add("Content-Disposition", "attachment; filename=\"" + "periodDay.csv" + "\"");
        
        return new ResponseEntity<String>(dataBuilder.toString(), header, HttpStatus.OK);
    }
    
    /**
     * 시간대별 통계 목록  조회.
     *
     * @param ClickStat the clickStat
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/statPeriodTime", method = RequestMethod.GET)
    public void statPeriodTime(@ModelAttribute ClickStat clickStat, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/statPeriodTime" );
    	
    	session.setAttribute("menuCode", "E102");
    	
    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp);  
    	
        //cp관리자 초기 선택값
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(clickStat.getLabel() == null || clickStat.getLabel() == ""){
    			clickStat.setLabel(resultCp.get(0).getLabel());
    		}
    	}  
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpLabel", clickStat.getLabel());
    	search.put("startTime", clickStat.getStartTime());
    	search.put("endTime", clickStat.getEndTime());
    	search.put("diff", StringUtil.getDiffDay(clickStat.getStartTime(),clickStat.getEndTime()));
    	map.put("search", search); 
    	
    	if(clickStat.getLabel() != null && clickStat.getStartTime() != null && clickStat.getEndTime() != null){
    		clickStat.setStartTime(clickStat.getStartTime() + " 00:00:00");
    		clickStat.setEndTime(clickStat.getEndTime() + " 23:59:59");
    		
    		List<ClickStat> result = statisticsService.findListPeriodTime(clickStat);
    		map.put("results", result);  
    	}      
    }
    
    /**
     * 시간대별 통계 다운로드  조회.
     *
     * @param ClickStat the clickStat
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/statPeriodTimeDownload", method = RequestMethod.GET)
    public ResponseEntity<String> statPeriodTimeDownload(@ModelAttribute ClickStat clickStat, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/statPeriodTimeDownload" );
    	
    	StringBuilder dataBuilder = new StringBuilder();
    	StringBuilder theBuilder = new StringBuilder(); 
    	
    	dataBuilder.append("기간" +","+ "검색 건수" +","+ "응답 건수" +","+ "응답율(%)" +","+ "평균 유니크 사용자 수" + "\n");
    	
    	if(clickStat.getLabel() != null && clickStat.getStartTime() != null && clickStat.getEndTime() != null){
    		clickStat.setStartTime(clickStat.getStartTime() + " 00:00:00");
    		clickStat.setEndTime(clickStat.getEndTime() + " 23:59:59");
    		
    		List<ClickStat> result = statisticsService.findListPeriodTime(clickStat);
    		
    		int searchCountSum = 0;
    		int responseCountSum = 0;
    		int userCountSum = 0;
    		double searchCountAvg = 0;
    		double responseCountAvg = 0;
    		double userCountAvg = 0;
    		double responsePercent = 0.00;
    		double responseAvgPercent = 0.00;
    		double count = result.size();
    		int index = 0;
    		int diff = StringUtil.getDiffDay(clickStat.getStartTime(),clickStat.getEndTime());
    		
    		for (ClickStat clickStat2 : result) {
    			theBuilder.append(String.format("%02d", index) + "시~" + String.format("%02d", (index+1)) + "시");
    			theBuilder.append(",");
    			theBuilder.append(clickStat2.getSearchCount());
    			theBuilder.append(",");
    			theBuilder.append(clickStat2.getResponseCount());
    			theBuilder.append(",");
    			
    			if(clickStat2.getSearchCount() > 0 && clickStat2.getResponseCount() > 0){
    				theBuilder.append(Double.parseDouble(String.format("%.2f",((clickStat2.getResponseCount()*100.0)/clickStat2.getSearchCount())))+"%");
    			}else{
    				theBuilder.append("0%");
    			}
    			
    			theBuilder.append(",");
    			
    			if(diff > 0 && clickStat2.getUserCount() > 0){
    				theBuilder.append(Double.parseDouble(String.format("%.2f",((clickStat2.getUserCount()*1.0)/(diff+1)))));
    			}else{
    				theBuilder.append(clickStat2.getUserCount());
    			}
    			
    			theBuilder.append("\n");
    			
    			index ++;    			
    			searchCountSum += clickStat2.getSearchCount();
    			responseCountSum += clickStat2.getResponseCount();
    			userCountSum += clickStat2.getUserCount();    			
			}    		
    		
    		searchCountAvg = Double.parseDouble(String.format("%.2f",(searchCountSum/count)));
    		responseCountAvg = Double.parseDouble(String.format("%.2f",(responseCountSum/count)));
    		userCountAvg = Double.parseDouble(String.format("%.2f",(userCountSum/count))); 
    		
    		if(responseCountSum > 0 && searchCountSum > 0){
    			responsePercent = ((responseCountSum*100.0)/searchCountSum);
    		}
    		
    		if(responseCountAvg > 0.00 && searchCountAvg > 0.00){
    			responseAvgPercent = ((responseCountAvg*100.0)/searchCountAvg);
    		}    
    		
    		dataBuilder.append("합계" +","+ searchCountSum +","+ responseCountSum +","+ responsePercent +"%,"+ userCountSum/(diff+1) + "\n");
    		dataBuilder.append("시간대 평균" +","+ searchCountAvg +","+ responseCountAvg +","+ responseAvgPercent +"%,"+ userCountAvg/(diff+1) + "\n");
    	}
    	
    	dataBuilder.append(theBuilder.toString());
                
        HttpHeaders header = new HttpHeaders();
        header.add("Content-Type", "text/csv; charset=MS949");
        header.add("Content-Disposition", "attachment; filename=\"" + "periodTime.csv" + "\"");
        
        return new ResponseEntity<String>(dataBuilder.toString(), header, HttpStatus.OK);
    }
    
    /**
     * 사용자별 통계 목록  조회.
     *
     * @param ClickStat the clickStat
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/statPeriodUser", method = RequestMethod.GET)
    public void statPeriodUser(@ModelAttribute ClickStat clickStat, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/statPeriodUser" );
    	
    	session.setAttribute("menuCode", "E103");
    	
    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp);  
    	
        //cp관리자 초기 선택값
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(clickStat.getLabel() == null || clickStat.getLabel() == ""){
    			clickStat.setLabel(resultCp.get(0).getLabel());
    		}
    	} 
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpLabel", clickStat.getLabel());
    	search.put("startTime", clickStat.getStartTime());
    	search.put("endTime", clickStat.getEndTime());	
    	search.put("order", clickStat.getOrder());
    	map.put("search", search); 
    	
    	int currentPageNo = clickStat.getCurrentPageNo();
    	int recordCountPerPage = clickStat.getRecordCountPerPage();
    	int countAll  = 0;
    	
    	if(clickStat.getLabel() != null && clickStat.getStartTime() != null && clickStat.getEndTime() != null){
    		clickStat.setStartTime(clickStat.getStartTime() + " 00:00:00");
    		clickStat.setEndTime(clickStat.getEndTime() + " 23:59:59");
    		
    		countAll  = statisticsService.countPeriodUser(clickStat);
    		
    		List<ClickStat> resultAll = statisticsService.findListPeriodUser(clickStat, 0, 0);
    		map.put("resultAll", resultAll);
    		
    		List<ClickStat> result = statisticsService.findListPeriodUser(clickStat, currentPageNo, recordCountPerPage);
    		map.put("results", result);
    	}
    	
    	PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
        map.put("paging", pagingUtil.invoke());
    }
    
    /**
     * 사용자별 통계 다운로드  조회.
     *
     * @param ClickStat the clickStat
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/statPeriodUserDownload", method = RequestMethod.GET)
    public ResponseEntity<String> statPeriodUserDownload(@ModelAttribute ClickStat clickStat, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/statPeriodUserDownload" );
    	
    	StringBuilder dataBuilder = new StringBuilder();
    	StringBuilder theBuilder = new StringBuilder();    	
    	
    	dataBuilder.append("사용자" +","+ "검색 건수" +","+ "응답 건수" +","+ "응답율(%)" + "\n");
    	
    	if(clickStat.getLabel() != null && clickStat.getStartTime() != null && clickStat.getEndTime() != null){
    		clickStat.setStartTime(clickStat.getStartTime() + " 00:00:00");
    		clickStat.setEndTime(clickStat.getEndTime() + " 23:59:59");
    		
    		List<ClickStat> result = statisticsService.findListPeriodUser(clickStat, 0, 0);
    		
    		int searchCountSum = 0;
    		int responseCountSum = 0;
    		double searchCountAvg = 0;
    		double responseCountAvg = 0;
    		double count = result.size();
    		
    		for (ClickStat clickStat2 : result) {
    			theBuilder.append(StringUtil.maskingConvert(clickStat2.getUserId()));
    			theBuilder.append(",");
    			theBuilder.append(clickStat2.getSearchCount());
    			theBuilder.append(",");
    			theBuilder.append(clickStat2.getResponseCount());
    			theBuilder.append(",");
    			theBuilder.append(Double.parseDouble(String.format("%.2f",((clickStat2.getResponseCount()*100.0)/clickStat2.getSearchCount())))+"%");
    			theBuilder.append("\n");
    			
    			searchCountSum += clickStat2.getSearchCount();
    			responseCountSum += clickStat2.getResponseCount();
			}    		
    		
    		searchCountAvg = Double.parseDouble(String.format("%.2f",(searchCountSum/count)));
    		responseCountAvg = Double.parseDouble(String.format("%.2f",(responseCountSum/count)));

    		dataBuilder.append("합계" +","+ searchCountSum +","+ responseCountSum +","+ ((responseCountSum*100.0)/searchCountSum) + "%\n");
    		dataBuilder.append("사용자 평균" +","+ searchCountAvg +","+ responseCountAvg +","+ ((responseCountAvg*100.0)/searchCountAvg) + "%\n");
    	}
    	
    	dataBuilder.append(theBuilder.toString());
                
        HttpHeaders header = new HttpHeaders();
        header.add("Content-Type", "text/csv; charset=MS949");
        header.add("Content-Disposition", "attachment; filename=\"" + "periodUser.csv" + "\"");
        
        return new ResponseEntity<String>(dataBuilder.toString(), header, HttpStatus.OK);
    }
    
    /**
     * 카테고리 통계 목록  조회.
     *
     * @param ClickStat the clickStat
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/statOrderCategory", method = RequestMethod.GET)
    public void statOrderCategory(@ModelAttribute ClickStat clickStat, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/statOrderCategory" );
    	
    	session.setAttribute("menuCode", "E201");
    	
    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp);  
    	
        //cp관리자 초기 선택값
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(clickStat.getLabel() == null || clickStat.getLabel() == ""){
    			clickStat.setLabel(resultCp.get(0).getLabel());
    		}
    	} 
    	
    	//노출수
    	clickStat.setViewCount(100);
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpLabel", clickStat.getLabel());
    	search.put("startTime", clickStat.getStartTime());
    	search.put("endTime", clickStat.getEndTime());	
    	search.put("viewCount", clickStat.getViewCount());	
    	map.put("search", search); 
    	
    	if(clickStat.getLabel() != null && clickStat.getStartTime() != null && clickStat.getEndTime() != null){
    		clickStat.setStartTime(clickStat.getStartTime() + " 00:00:00");
    		clickStat.setEndTime(clickStat.getEndTime() + " 23:59:59");
    		
    		List<ClickStat> result = statisticsService.findListOrderCategory(clickStat);
    		map.put("results", result);    
    	}
    }
    
    /**
     * 카테고리 통계 다운로드  조회.
     *
     * @param ClickStat the clickStat
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/statOrderCategoryDownload", method = RequestMethod.GET)
    public ResponseEntity<String> statOrderCategoryDownload(@ModelAttribute ClickStat clickStat, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/statOrderCategoryDownload" );
    	
    	StringBuilder dataBuilder = new StringBuilder();
    	StringBuilder theBuilder = new StringBuilder();
    	
    	if(clickStat.getLabel() != null && clickStat.getStartTime() != null && clickStat.getEndTime() != null){
    		clickStat.setStartTime(clickStat.getStartTime() + " 00:00:00");
    		clickStat.setEndTime(clickStat.getEndTime() + " 23:59:59");
    		
    		List<ClickStat> result = statisticsService.findListOrderCategory(clickStat);
    		
    		int index = 1;
    		
    		for (ClickStat clickStat2 : result) {
    			theBuilder.append(index);
    			theBuilder.append(",");
    			theBuilder.append(StringUtil.setReplaceCsv(clickStat2.getCateName()));
    			theBuilder.append(",");
    			theBuilder.append(clickStat2.getTotalCnt());
    			theBuilder.append("\n");
    			index ++;
			}
    	}
    	
    	dataBuilder.append("순위" +","+ "카테고리" +","+ "검색 건수" + "\n");
    	dataBuilder.append(theBuilder.toString());
                
        HttpHeaders header = new HttpHeaders();
        header.add("Content-Type", "text/csv; charset=MS949");
        header.add("Content-Disposition", "attachment; filename=\"" + "orderCategory.csv" + "\"");
        
        return new ResponseEntity<String>(dataBuilder.toString(), header, HttpStatus.OK);
    }
    
    /**
     * 대화 통계 목록  조회.
     *
     * @param ClickStat the clickStat
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/statOrderInput", method = RequestMethod.GET)
    public void statOrderInput(@ModelAttribute ClickStat clickStat, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/statOrderInput" );
    	
    	session.setAttribute("menuCode", "E202");
    	
    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp);  
    	
        //cp관리자 초기 선택값
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(clickStat.getLabel() == null || clickStat.getLabel() == ""){
    			clickStat.setLabel(resultCp.get(0).getLabel());
    		}
    	}  
    	
    	//노출수
    	clickStat.setViewCount(100);
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpLabel", clickStat.getLabel());
    	search.put("startTime", clickStat.getStartTime());
    	search.put("endTime", clickStat.getEndTime());
    	search.put("viewCount", clickStat.getViewCount());	
    	map.put("search", search); 
    	
    	if(clickStat.getLabel() != null && clickStat.getStartTime() != null && clickStat.getEndTime() != null){
    		clickStat.setStartTime(clickStat.getStartTime() + " 00:00:00");
    		clickStat.setEndTime(clickStat.getEndTime() + " 23:59:59");
    		
    		List<ClickStat> result = statisticsService.findListOrderInput(clickStat);
    		map.put("results", result); 
    	}
    }
    
    /**
     * 대화 통계 다운로드  조회.
     *
     * @param ClickStat the clickStat
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/statOrderInputDownload", method = RequestMethod.GET)
    public ResponseEntity<String> statOrderInputDownload(@ModelAttribute ClickStat clickStat, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/statOrderInputDownload" );
    	
    	StringBuilder dataBuilder = new StringBuilder();
    	StringBuilder theBuilder = new StringBuilder();
    	
    	if(clickStat.getLabel() != null && clickStat.getStartTime() != null && clickStat.getEndTime() != null){
    		clickStat.setStartTime(clickStat.getStartTime() + " 00:00:00");
    		clickStat.setEndTime(clickStat.getEndTime() + " 23:59:59");
    		
    		List<ClickStat> result = statisticsService.findListOrderInput(clickStat);
    		
    		int index = 1;
    		
    		for (ClickStat clickStat2 : result) {
    			theBuilder.append(index);
    			theBuilder.append(",");
    			theBuilder.append(StringUtil.setReplaceCsv(clickStat2.getInput()));
    			theBuilder.append(",");
    			theBuilder.append(clickStat2.getTotalCnt());
    			theBuilder.append("\n");
    			index ++;
			}
    	}
    	
    	dataBuilder.append("순위" +","+ "대화" +","+ "검색 건수" + "\n");
    	dataBuilder.append(theBuilder.toString());
                
        HttpHeaders header = new HttpHeaders();
        header.add("Content-Type", "text/csv; charset=MS949");
        header.add("Content-Disposition", "attachment; filename=\"" + "orderInput.csv" + "\"");
        
        return new ResponseEntity<String>(dataBuilder.toString(), header, HttpStatus.OK);
    }
    
    /**
     * 질문 통계 목록  조회.
     *
     * @param ClickStat the clickStat
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/statOrderUserInput", method = RequestMethod.GET)
    public void statOrderUserInput(@ModelAttribute ClickStat clickStat, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/statOrderUserInput" );
    	
    	session.setAttribute("menuCode", "E203");
    	
    	List<Cp> resultCp = cpService.listAll(session);
        map.put("result", resultCp);  
    	
        //cp관리자 초기 선택값
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		if(clickStat.getLabel() == null || clickStat.getLabel() == ""){
    			clickStat.setLabel(resultCp.get(0).getLabel());
    		}
    	} 
    	
    	//노출수
    	clickStat.setViewCount(100);
    	
    	Map<String, Object> search = new HashMap<String, Object>();
    	search.put("cpLabel", clickStat.getLabel());
    	search.put("startTime", clickStat.getStartTime());
    	search.put("endTime", clickStat.getEndTime());	
    	search.put("viewCount", clickStat.getViewCount());	
    	map.put("search", search); 
    	
    	if(clickStat.getLabel() != null && clickStat.getStartTime() != null && clickStat.getEndTime() != null){
    		clickStat.setStartTime(clickStat.getStartTime() + " 00:00:00");
    		clickStat.setEndTime(clickStat.getEndTime() + " 23:59:59");
    		
    		List<ClickStat> result = statisticsService.findListOrderUserInput(clickStat);
    		map.put("results", result); 
    	}
    }
    
    /**
     * 질문 통계 다운로드  조회.
     *
     * @param ClickStat the clickStat
     * @param map the map
     * @param session the session
     * @throws ApplicationException 
     * @ the exception
     */
    @RequestMapping(value = "/statOrderUserInputDownload", method = RequestMethod.GET)
    public ResponseEntity<String> statOrderUserInputDownload(@ModelAttribute ClickStat clickStat, ModelMap map, HttpSession session) throws ApplicationException
    {
    	LOG.debug("/statOrderUserInputDownload" );
    	
    	StringBuilder dataBuilder = new StringBuilder();
    	StringBuilder theBuilder = new StringBuilder();
    	
    	if(clickStat.getLabel() != null && clickStat.getStartTime() != null && clickStat.getEndTime() != null){
    		clickStat.setStartTime(clickStat.getStartTime() + " 00:00:00");
    		clickStat.setEndTime(clickStat.getEndTime() + " 23:59:59");
    		
    		List<ClickStat> result = statisticsService.findListOrderUserInput(clickStat);
    		
    		int index = 1;
    		
    		for (ClickStat clickStat2 : result) {
    			theBuilder.append(index);
    			theBuilder.append(",");
    			theBuilder.append(StringUtil.setReplaceCsv(clickStat2.getUserInput()));
    			theBuilder.append(",");
    			theBuilder.append(clickStat2.getTotalCnt());
    			theBuilder.append("\n");
    			index ++;
			}
    	}
    	
    	dataBuilder.append("순위" +","+ "질문" +","+ "검색 건수" + "\n");
    	dataBuilder.append(theBuilder.toString());
                
        HttpHeaders header = new HttpHeaders();
        header.add("Content-Type", "text/csv; charset=MS949");
        header.add("Content-Disposition", "attachment; filename=\"" + "orderUserInput.csv" + "\"");
        
        return new ResponseEntity<String>(dataBuilder.toString(), header, HttpStatus.OK);
    }
}
