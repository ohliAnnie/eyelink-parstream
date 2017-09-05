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
import org.springframework.dao.DataAccessException;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.kt.programk.common.data.repository.Repository;
import com.kt.programk.common.db.domain.AllowIpDTO;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.repository.admin.AllowIpMapper;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.DbExceptionUtil;

/**
 * Created by Administrator on 2016-07-04.
 */
public class AllowIpRepository implements Repository<AllowIpDTO> {
	/**
	 * The constant LOGGER.
	 */
	private static final Logger LOGGER = LoggerFactory.getLogger(AllowIpRepository.class);

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
	private AllowIpMapper allowIpMapper;

	/**
	 * 데이터 저장맵
	 */
	private ConcurrentHashMap<String, String> cmap = new ConcurrentHashMap<String, String>();

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
	public int put(AllowIpDTO obj) {
		try {
			cmap.put(obj.getObjectKey() + SEP + obj.getKey(), gson.toJson(obj));
		} catch (Exception ex) {
			LOGGER.error(ex.getMessage());
		}
		return 0;
	}

	/**
	 * 데이터 조회
	 *
	 * @param key
	 *            the key
	 * @return allow ip dto
	 * @throws ApplicationException
	 *             the application exception
	 */
	@Override
	public AllowIpDTO get(AllowIpDTO key) throws ApplicationException {
		AllowIpDTO obj = null;

		try {
			String value = cmap.get(key.getObjectKey() + SEP + key.getKey());

			if (StringUtils.isNotEmpty(value)) {
				obj = gson.fromJson(value, AllowIpDTO.class);
			}
		} catch (Exception ex) {
			LOGGER.error(ex.getMessage());
		}

		try {
			if (obj == null) {
				HashMap<String, Object> map = new HashMap<>();
				map.put("token", key.getToken());
				map.put("hostIp", key.getIp());
				List<AllowIpDTO> allowIpDTOs = allowIpMapper.selectListByToken(map);

				if (allowIpDTOs.size() > 0) {
					for (AllowIpDTO allowIpDTO : allowIpDTOs) {
						this.put(allowIpDTO);
					}
					return allowIpDTOs.get(0);
				} else {
					return null;
				}
			}
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)), ex);
		}

		return obj;
	}

	/**
	 * 해시맵에서 데이터를 삭제한다.
	 *
	 * @param key
	 *            the key
	 */
	@Override
	public void delete(AllowIpDTO key) {
		LOGGER.info(key.getKey());

		try {
			cmap.remove(key.getObjectKey() + SEP + key.getKey());
		} catch (Exception ex) {
			LOGGER.error(ex.getMessage());
		}
	}

	/**
	 * 오브젝트 삭제
	 *
	 * @param key
	 *            the key
	 */
	public void deleteObj(AllowIpDTO key) {

		Set<String> deleteKeys = new HashSet<String>();

		for (String ckey : cmap.keySet()) {
			if (0 == ckey.indexOf(key.getObjectKey() + SEP)) {
				deleteKeys.add(ckey);
			}
		}

		try {
			Iterator<String> itr = deleteKeys.iterator();
			while (itr.hasNext()) {
				String deleteKey = itr.next();
				cmap.remove(deleteKey);
			}
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
	public List<AllowIpDTO> getObjects(AllowIpDTO obj) {
		List<AllowIpDTO> list = new ArrayList<AllowIpDTO>();
		Set<String> listKeys = new HashSet<String>();

		for (String ckey : cmap.keySet()) {
			if (0 == ckey.indexOf(obj.getObjectKey() + SEP)) {
				listKeys.add(ckey);
			}
		}

		try {
			Iterator<String> itr = listKeys.iterator();
			while (itr.hasNext()) {
				String listKey = itr.next();
				AllowIpDTO allowIpDTO = gson.fromJson(listKey, AllowIpDTO.class);
				list.add(allowIpDTO);
			}
		} catch (Exception ex) {
			LOGGER.error(ex.getMessage());
		}

		return list;
	}
}
