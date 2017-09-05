/*
 *  Copyright (c) 2016 KT, Inc.
 *  All right reserved.
 *  This software is the confidential and proprietary information of KT
 *  , Inc. You shall not disclose such Confidential Information and
 *  shall use it only in accordance with the terms of the license agreement
 *  you entered into with KT.
 *
 *  Revision History
 *  Author Date Description
 *  ------------------ -------------- ------------------
 *  Seo Jong Hwa 16. 8. 22 오후 5:16
 *
 *
 */

package com.kt.programk.common.repository.admin;

import com.kt.programk.common.domain.admin.AccessIp;
import com.kt.programk.common.domain.admin.AllowIp;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by S.J.H on 2016-05-24.
 */
@Repository(value = "accessIpMapper")
public interface AccessIpMapper {
    /**
     * Count example int.
     *
     * @param example the example
     * @return the int
     */
    public int countExample(AccessIp example);
    /**
     * 조회
     *
     * @param example
     * @return
     */
    public AccessIp selectByPrimaryKey(AccessIp example);

    /**
     * 목록 조회
     *
     * @param example
     * @return
     */
    public List<AccessIp> selectList(AccessIp example);

    /**
     * 추가
     *
     * @param example
     * @return
     */
    public int insert(AccessIp example);

    /**
     * 삭제
     *
     * @param example
     * @return
     */
    public int deleteByPrimaryKey(AccessIp example);

    /**
     * 수정
     *
     * @param example
     * @return
     */
    public int updateByPrimaryKeySelective(AccessIp example);

}
