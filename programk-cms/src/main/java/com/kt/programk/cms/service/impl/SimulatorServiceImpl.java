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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.kt.programk.cms.service.SimulatorService;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.core.Bot;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.repository.admin.CpMapper;
import com.kt.programk.common.repository.core.BotMapper;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.wo.ProgramkResponse;
import com.kt.programk.deploy.service.DeployService;

/**
 * Created by Administrator on 2016-04-27.
 */
@Service
public class SimulatorServiceImpl implements SimulatorService {
    /**
     * CONFIG 파일 정보 .
     */
    @Autowired
    @Qualifier("config")
    private ConfigProperties config;
	
    /**
     * The bot mapper.
     */
    @Autowired
    private BotMapper botMapper;
    
    /**
     * The Cp mapper.
     */
    @Autowired
    private CpMapper cpMapper;
    
    /** The deploy service. */
    @Autowired
    private DeployService deployService;
    
    /** JSON 변환 */
    private Gson gson = new Gson();

	/**
     * 대화 검색
     *
     * @return the String
     */
	@Override
	public String searchChat(int cpId, String botType, String userId, String input) throws ApplicationException, BizCheckedException {
		if(cpId == 0){
            throw new BizCheckedException(BizErrCode.ERR_0003, "CP ID");
        }
		
		if(botType == null || "".equals(botType)){
            throw new BizCheckedException(BizErrCode.ERR_0003, "BOT TYPE");
        }
		
    	if(userId == null || "".equals(userId)){
            throw new BizCheckedException(BizErrCode.ERR_0003, "USER ID");
        }
    	
    	if(input == null || "".equals(input)){
            throw new BizCheckedException(BizErrCode.ERR_0003, "질문");
        }
		
    	String subLabel = "";
    	String token = "";
    	String body = null;
    	
    	Bot bot = new Bot();
		bot.setCpId(cpId);
		List<Bot> result = botMapper.selectList(bot);
		
		if("1".equals(botType)){//개발
			subLabel = result.get(0).getSubLabel().replace("-02", "-01");
			
			List<ProgramkResponse> programkResponses = new ArrayList<>();
			
			try {
				deployService.makeResponse(programkResponses, input, userId, subLabel, true, null);
				
				if (programkResponses != null) {
					body = gson.toJson(programkResponses);
				}
			} catch (Exception e) {
				throw new ApplicationException(e.getMessage());
			}
			
		}else{//상용
			for (Bot bot2 : result) {
				if("2".equals(botType) && "N".equals(bot2.getActive())){
					subLabel = bot2.getSubLabel();
					break;
				}else if("3".equals(botType) && "Y".equals(bot2.getActive())){
					subLabel = bot2.getSubLabel();
					break;
				}
			}	
			
			Cp cp = new Cp();
			cp.setId(cpId);
			Cp cpResult = cpMapper.selectByPrimaryKey(cp);
			token = cpResult.getToken();

			String bodys = "";	    	
	    	ResponseEntity<String> results;    	
	    	HttpHeaders headers = null;
	        HttpEntity entity = null;
	    	
	        String apiUrl = config.getString("server.api.url");
	    	
	    	Map<String, Object> params = new HashMap<String, Object>();
			params.put("token", token);		
			params.put("user", userId);
			params.put("chat", input);
			params.put("label", subLabel);
			
			RestTemplate restTemplate = new RestTemplate();
			
			try{
				bodys = new ObjectMapper().writeValueAsString(params);
	            headers = new HttpHeaders();
	            headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
	            entity = new HttpEntity<>(bodys, headers);
	            
	            results = restTemplate.postForEntity(apiUrl, entity, String.class, params);
	            body = results.getBody();
			} catch(HttpClientErrorException e){
				if(e.getStatusCode() == HttpStatus.NOT_FOUND){
					throw new ApplicationException(e.getMessage());
				}else{
					throw new ApplicationException(e.getResponseBodyAsString());
				}	
			}catch(Exception e){
				throw new ApplicationException(e.getMessage());
			}
		}
		
		return body;
	}

}
