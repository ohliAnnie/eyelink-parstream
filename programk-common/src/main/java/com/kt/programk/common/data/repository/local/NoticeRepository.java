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
import com.kt.programk.common.db.domain.NoticeDTO;
import com.kt.programk.common.domain.core.AimlRepository;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.utils.ConfigProperties;

/**
 * Created by Administrator on 2016-07-04.
 */
public class NoticeRepository implements Repository<NoticeDTO> {
    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(NoticeRepository.class);

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
	public int put(NoticeDTO obj) {
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
	public NoticeDTO get(NoticeDTO key) throws ApplicationException {
    	NoticeDTO obj = null;

    	try {
    	    String value = cmap.get(key.getObjectKey() + SEP + key.getKey());
    	    
    	    if(StringUtils.isNotEmpty(value)) {
    	    	obj = gson.fromJson(value, NoticeDTO.class);
    	    }
	    }  catch (Exception ex) {
	    	LOGGER.error(ex.getMessage());
	    }

    	return obj;
	}

	/**
     * 삭제
     *
     * @param key the key
     */
	@Override
	public void delete(NoticeDTO key) {
        LOGGER.info(key.getKey());
        
    	AimlRepository repository = new AimlRepository();
    	repository.setObjectKey(key.getObjectKey());
    	repository.setKey(key.getKey());
    	
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
	public List<NoticeDTO> getObjects(NoticeDTO obj) {
        List<NoticeDTO> list = new ArrayList<NoticeDTO>();
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
    		      NoticeDTO noticeDTO = gson.fromJson(listKey, NoticeDTO.class);
    		      list.add(noticeDTO);
    		}
        }

        return list;
	}

	@Override
	public void deleteObj(NoticeDTO key) {
	}
}
