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

package com.kt.programk.common.data.repository;

import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.db.domain.DomainObject;

import java.util.List;

/**
 * Created by Administrator on 2016-03-04.
 */
public interface Repository<V extends DomainObject> {
    /**
     * 데이터 입력
     * @param obj
     */
    int put(V obj);

    /**
     * 데이터 조회
     * @param key
     * @return
     */
    V get(V key) throws ApplicationException;

    /**
     * 데이터 삭제
     * @param key
     */
    void delete(V key);

    /**
     * 데이터 삭제
     * @param key
     */
    void deleteObj(V key);

    /**
     * 오브젝트 리스트 출력
     * @param obj
     * @return
     */
    List<V> getObjects(V obj);
}