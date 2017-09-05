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

package com.kt.programk.common.data.repository.db;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.kt.programk.common.data.repository.Repository;
import com.kt.programk.common.db.domain.NoticeDTO;
import com.kt.programk.common.domain.core.AimlRepository;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.repository.core.AimlRepositoryMapper;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.DbExceptionUtil;

/**
 * Created by Administrator on 2016-07-04.
 */
public class NoticeRepository implements Repository<NoticeDTO> {
    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(NoticeRepository.class);

    /**
     * The Config.
     */
    @Autowired
    @Qualifier("config")
    private ConfigProperties config;

    /**
     * The Redis template.
     */
//    @Autowired
//    private RedisTemplate<String, NoticeDTO> redisTemplate;

    /**
     * 데이터베이스 매퍼
     */
    @Autowired
    private AimlRepositoryMapper aimlRepositoryMapper;
    
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
	@Transactional
	public int put(NoticeDTO obj) {
		AimlRepository repository = new AimlRepository();
    	repository.setObjectKey(obj.getObjectKey());
    	repository.setKey(obj.getKey());
    	repository.setValue(gson.toJson(obj));
    	
    	try{
    		List<AimlRepository> results = aimlRepositoryMapper.selectListByAll(repository);
			if (results.size() > 0) {
				aimlRepositoryMapper.update(repository);
			} else {
				aimlRepositoryMapper.insert(repository);
			}
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
    	AimlRepository repository = new AimlRepository();
    	repository.setObjectKey(key.getObjectKey());
    	repository.setKey(key.getKey());
    	
    	List<AimlRepository> results;
    	NoticeDTO obj = null;
    	
    	try {
    	    results = aimlRepositoryMapper.selectListByAll(repository);
    	    
    	    if( results.size()>0 ) {
    	    	obj = gson.fromJson(results.get(0).getValue(), NoticeDTO.class);
    	    }
	    } catch (DataAccessException ex) {
	        throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)), ex);
	    }
    	
    	return obj;
	}

	/**
     * 삭제
     *
     * @param key the key
     */
	@Override
	@Transactional
	public void delete(NoticeDTO key) {
        LOGGER.info(key.getKey());
        
    	AimlRepository repository = new AimlRepository();
    	repository.setObjectKey(key.getObjectKey());
    	repository.setKey(key.getKey());
    	
    	try{
    		aimlRepositoryMapper.deleteByAll(repository);
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

        AimlRepository repository = new AimlRepository();
    	repository.setObjectKey(obj.getObjectKey());
        
    	List<AimlRepository> results;
    	
    	try {
    		results = aimlRepositoryMapper.selectListByObjectKey(repository);
	    } catch (Exception ex) {
	    	results = new ArrayList<AimlRepository>();
	    	LOGGER.error(ex.getMessage());
	    }
        
        if (results.size() > 0) {
            for (AimlRepository result : results) {
            	NoticeDTO noticeDTO = gson.fromJson(result.getValue(), NoticeDTO.class);
                list.add(noticeDTO);
            }
            return list;
        }

        return list;
	}

	@Override
	@Transactional
	public void deleteObj(NoticeDTO key) {
	}
}
