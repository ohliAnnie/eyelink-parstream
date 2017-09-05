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

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.kt.programk.common.data.repository.Repository;
import com.kt.programk.common.db.domain.PredicateDTO;
import com.kt.programk.common.utils.ConfigProperties;

/**
 * 해시맵의 키는 개별 Expire가 되지 않으므로 해시맵을 사용하지 않는다.
 */
public class PredicateRepository implements Repository<PredicateDTO> {
    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(PredicateRepository.class);

    /**
     * The Config.
     */
    @Autowired
    @Qualifier("config")
    private ConfigProperties config;

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
    public int put(PredicateDTO obj) {
    	try{
        	cmap.put(obj.getKey(), gson.toJson(obj));
	    } catch (Exception ex) {
	    	LOGGER.error(ex.getMessage());
	    }
    	return 0;
    }

    /**
     * 데이터 조회
     *
     * @param key the key
     * @return predicate dto
     */
    @Override
    public PredicateDTO get(PredicateDTO key) {
        PredicateDTO obj = null;
        
    	try {
    	    String value = cmap.get(key.getKey());
    	    
    	    if(StringUtils.isNotEmpty(value)) {
    	    	obj = gson.fromJson(value, PredicateDTO.class);
    	    }
	    }  catch (Exception ex) {
	    	LOGGER.error(ex.getMessage());
	    	return null;
	    }

        return obj;
    }

    /**
     * 데이터를 삭제한다.
     *
     * @param key the key
     */
    @Override
    public void delete(PredicateDTO key) {
    	LOGGER.info(key.getKey());
    	
    	try{
    		cmap.remove(key.getKey());
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
    public List<PredicateDTO> getObjects(PredicateDTO obj) {
        return null;
    }

	@Override
	public void deleteObj(PredicateDTO key) {
	}
}
