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

package com.kt.programk.common.db.domain;

import java.io.Serializable;

/**
 * Created by Administrator on 2016-07-04.
 */
public interface DomainObject extends Serializable {
    /**
     * 키를 이용해서 조회
     * @return
     */
    String getKey();

    /**
     * 오브젝트키를 이용해서 조회
     * @return
     */
    String getObjectKey();
}
