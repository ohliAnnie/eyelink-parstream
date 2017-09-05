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
 * Seo Jong Hwa        2016 . 6 . 21
 */

package com.kt.programk.deploy.cache;

import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * 동일한 스케줄링을 두번하는 것을 방지 하기 위해 캐시에 저장
 */
public class ChildrenCache {
    /**
     * The Working job.
     */
    private ConcurrentMap<Integer, Date> workingJob = new ConcurrentHashMap<Integer, Date>();

    /**
     * Add void.
     *
     * @param id   the id
     * @param date the date
     */
    public void add(Integer id, Date date) {
        workingJob.put(id, date);
    }

    /**
     * Remove void.
     *
     * @param id the id
     */
    public void remove(Integer id) {
        workingJob.remove(id);
    }

    /**
     * Is exist.
     *
     * @param id the id
     * @return the boolean
     */
    public boolean isExist(Integer id) {
        return workingJob.containsKey(id);
    }

    /**
     * Is not exist boolean.
     *
     * @param id the id
     * @return the boolean
     */
    public boolean isNotExist(Integer id){
        return !workingJob.containsKey(id);
    }
}
