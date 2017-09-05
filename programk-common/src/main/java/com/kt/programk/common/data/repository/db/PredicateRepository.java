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
import com.kt.programk.common.db.domain.PredicateDTO;
import com.kt.programk.common.domain.core.AimlRepository;
import com.kt.programk.common.repository.core.AimlRepositoryMapper;
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
	 * 데이터베이스 매퍼
	 */
	@Autowired
	private AimlRepositoryMapper aimlRepositoryMapper;

	/**
	 * JSON 변환 GsonBuilder를 사용해야 유니코드가 생성되지 않는다.
	 */
	private Gson gson = new GsonBuilder().disableHtmlEscaping().create();

	/**
	 * 데이터 입력
	 *
	 * @param obj
	 *            the obj
	 */
	@Override
	@Transactional
	public int put(PredicateDTO obj) {
		AimlRepository repository = new AimlRepository();
		repository.setObjectKey("Predicate");
		repository.setKey(obj.getKey());
		repository.setValue(gson.toJson(obj));

		int result = 0;
		try {
			List<AimlRepository> results = aimlRepositoryMapper.selectListByAll(repository);
			if (results.size() > 0) {
				result = aimlRepositoryMapper.update(repository);
			} else {
				result = aimlRepositoryMapper.insert(repository);
			}
		} catch (Exception ex) {
			String msg = ex.getMessage();
			if (msg.indexOf("duplicate key value violates unique constraint") > -1) {
				// 중복키 오류로 인한 재시도 요청 코드
				result = 2;
				LOGGER.info("duplicate Key let's retry");
			} else
				LOGGER.error(msg);
		}
		return result;
	}

	/**
	 * 데이터 조회
	 *
	 * @param key
	 *            the key
	 * @return predicate dto
	 */
	@Override
	public PredicateDTO get(PredicateDTO key) {
		AimlRepository repository = new AimlRepository();
		repository.setObjectKey("Predicate");
		repository.setKey(key.getKey());

		List<AimlRepository> results;
		PredicateDTO obj = null;

		try {
			results = aimlRepositoryMapper.selectListByAll(repository);

			if (results.size() > 0) {
				obj = gson.fromJson(results.get(0).getValue(), PredicateDTO.class);
			}
		} catch (DataAccessException ex) {
			return null;
		}

		return obj;
	}

	/**
	 * 데이터를 삭제한다.
	 *
	 * @param key
	 *            the key
	 */
	@Override
	@Transactional
	public void delete(PredicateDTO key) {
		AimlRepository repository = new AimlRepository();
		repository.setObjectKey("Predicate");
		repository.setKey(key.getKey());

		try {
			aimlRepositoryMapper.deleteByAll(repository);
		} catch (Exception ex) {
			LOGGER.error(ex.getMessage());
		}
	}

	/**
	 * 오브젝트 리스트 출력
	 *
	 * @param obj
	 *            the obj
	 * @return objects
	 */
	@Override
	public List<PredicateDTO> getObjects(PredicateDTO obj) {
		return null;
	}

	@Override
	@Transactional
	public void deleteObj(PredicateDTO key) {
	}
}
