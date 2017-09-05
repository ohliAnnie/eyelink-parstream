/*
 *  Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
package com.kt.programk.cms.service.impl;

import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kt.programk.cms.service.MonitoringService;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.core.Bot;
import com.kt.programk.common.domain.core.BotFile;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.repository.admin.CpMapper;
import com.kt.programk.common.repository.core.BotMapper;
import com.kt.programk.common.utils.DbExceptionUtil;

/**
 * 모니터링 관리
 */
@Service
public class MonitoringServiceImpl implements MonitoringService {  
    /**
     * The Cp mapper.
     */
    @Autowired
    private CpMapper cpMapper;
    
    /**
     * The bot mapper.
     */
    @Autowired
    private BotMapper botMapper;
    
    @Override
    public int countAll() {
        return 0;
    }

    @Override
    public List<Bot> findListAll(Bot bot) throws ApplicationException {
    	try {
        	return botMapper.selectList(bot); 
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        }
    }

    @Override
    public int modifyById(BotFile botFile) {
        return 0;
    }
    
    @Override
    public String check(Map<String, Object> map) throws ApplicationException {
    	String jsonResult = "";    	
    	String body = "";
    	String token = "";
    	
    	String apiUrl = (String) map.get("server");        
        
        Cp cp = new Cp();
		cp.setLabel(map.get("label").toString().replace("-01", "").replace("-02", ""));
		Cp cpResult = cpMapper.selectByLable(cp);
		if(cpResult != null){
			token = cpResult.getToken();
		}		
    	
    	Map<String, Object> params = new HashMap<String, Object>();
		params.put("token", token);		
		params.put("user", map.get("user"));
		params.put("chat", "*");
		params.put("label", map.get("label"));
		
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> result;    	
    	HttpHeaders headers = null;
        HttpEntity entity = null;
        
		try{
			body = new ObjectMapper().writeValueAsString(params);
            headers = new HttpHeaders();
            headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
            entity = new HttpEntity<>(body, headers);
            
            result = restTemplate.postForEntity(apiUrl, entity, String.class, params);
            jsonResult = result.getBody();
		} catch(HttpClientErrorException e){
			if(e.getStatusCode() == HttpStatus.NOT_FOUND){
				throw new ApplicationException(e.getMessage());
			}else{
				throw new ApplicationException(e.getResponseBodyAsString());
			}			
		} catch(Exception e){
			throw new ApplicationException(e.getMessage());
		}
		
		return jsonResult;
    }
}
