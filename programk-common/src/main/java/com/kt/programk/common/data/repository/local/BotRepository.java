/*
 * Copyright (c) 2016 KT, Inc.
 * All right reserved.
 * This software is the confidential and proprietary information of KT
 * , Inc. You shall not disclose such Confidential Information and
 * shall use it only in accordance with the terms of the license agreement
 * you entered into with KT.
 *
 * Revision History
 * Author              Date                  Description
 * ------------------   --------------       ------------------
 * Seo Jong Hwa        2016 . 7 . 4
 */

package com.kt.programk.common.data.repository.local;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.kt.programk.common.data.repository.Repository;
import com.kt.programk.common.db.domain.BotDTO;
import com.kt.programk.common.repository.core.BotMapper;
import com.kt.programk.common.utils.ConfigProperties;

/**
 * Created by Administrator on 2016-07-04.
 */
public class BotRepository implements Repository<BotDTO> {
    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(BotRepository.class);

    /**
     * 키 구분자
     */
    private static final String SEP = "_";
    
    /**
     * The Config.
     */
    @Autowired
    @Qualifier("config")
    private ConfigProperties config;

    /**
     * 데이터베이스 매퍼
     */
    @Autowired
    private BotMapper botMapper;

    /**
     * 데이터 저장맵
     */
    private ConcurrentHashMap<String, String> cmap = new ConcurrentHashMap<String, String>();
 
    /**
     * JSON 변환
     * GsonBuilder를 사용해야 유니코드가 생성되지 않는다.
     */
    private Gson gson = new GsonBuilder().disableHtmlEscaping().create();
    
    /**
     * 데이터 입력
     *
     * @param obj the obj
     */
    @Override
    public int put(BotDTO obj) {
    	try{
        	cmap.put(obj.getObjectKey() + SEP + obj.getKey(), gson.toJson(obj));
	    } catch (Exception ex) {
	    	LOGGER.error(ex.getMessage());
	    }
    	return 0;
    }

    /**
     * 데이터 조회
     *
     * @param key the key
     * @return bot dto
     */
    @Override
    public BotDTO get(BotDTO key) {
    	BotDTO obj = null;
    	
    	try {
    	    String value = cmap.get(key.getObjectKey() + SEP + key.getKey());
    	    
    	    if(StringUtils.isNotEmpty(value)) {
    	    	obj = gson.fromJson(value, BotDTO.class);
    	    }
	    }  catch (Exception ex) {
	    	LOGGER.error(ex.getMessage());
	    	return null;
	    }
    	
    	return obj;
    }

    /**
     * 해시맵에서 데이터를 삭제한다.
     *
     * @param key the key
     */
    @Override
    public void delete(BotDTO key) {
        LOGGER.info(key.getKey());
        
        try{
    		cmap.remove(key.getObjectKey() + SEP + key.getKey());
	    } catch (Exception ex) {
	    	LOGGER.error(ex.getMessage());
	    }
    }

    /**
     * 오브젝트 리스트 출력
     *
     * @param obj the obj
     * @return objects
     */
    @Override
    public List<BotDTO> getObjects(BotDTO obj) {
        List<BotDTO> list = new ArrayList<BotDTO>();
    	Set<String> listKeys = new HashSet<String>();
    	
    	for( String ckey : cmap.keySet() ){
    		if(0 == ckey.indexOf(obj.getObjectKey() + SEP)) {
    			listKeys.add(ckey);
    		}
        }
    	
        if (listKeys.size() > 0) {
    		Iterator<String> itr = listKeys.iterator();
    		while (itr.hasNext()) {
    		      String listKey = itr.next();
    		      BotDTO botDTO = gson.fromJson(listKey, BotDTO.class);
    		      list.add(botDTO);
    		}
        } else {
            List<BotDTO> botDTOs = botMapper.selectListByToken(obj.getToken());

            for (BotDTO bot : botDTOs) {
                this.put(bot);
            }

            return botDTOs;
        }

        return list;
    }

    /**
     * 봇아이디, 토큰으로 검색
     *
     * @param botId the bot id
     * @param obj   the obj
     * @return objects
     */
    public List<BotDTO> getObjects(String botId, BotDTO obj) {
        List<BotDTO> list = new ArrayList<BotDTO>();
    	Set<String> listKeys = new HashSet<String>();
    	
    	for( String ckey : cmap.keySet() ){
    		if(0 == ckey.indexOf(obj.getObjectKey() + SEP)) {
    			listKeys.add(ckey);
    		}
        }
    	
        if (listKeys.size() > 0) {
    		Iterator<String> itr = listKeys.iterator();
    		while (itr.hasNext()) {
    		      String listKey = itr.next();
    		      BotDTO botDTO = gson.fromJson(listKey, BotDTO.class);
    		      list.add(botDTO);
    		}
        } else {
            HashMap<String, Object> map = new HashMap<>();
            map.put("token", obj.getToken());
            map.put("label", botId);
            List<BotDTO> botDTOs = botMapper.selectListByTokenAndLabel(map);

            for (BotDTO bot : botDTOs) {
                this.put(bot);
            }

            return botDTOs;
        }

        return list;
    }

	@Override
	public void deleteObj(BotDTO key) {
	}
}
