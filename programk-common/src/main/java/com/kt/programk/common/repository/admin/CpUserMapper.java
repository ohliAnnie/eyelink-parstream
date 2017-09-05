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
 *  Seo Jong Hwa 16. 8. 22 오후 5:17
 *
 *
 */

package com.kt.programk.common.repository.admin;

import com.kt.programk.common.domain.admin.CpUser;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by S.J.H on 2016-05-24.
 */
@Repository(value = "cpUserMapper")
public interface CpUserMapper {
    /**
     * 개수 조회
     *
     * @param example the example
     * @return int
     */
    public int countAll(CpUser example);

    /**
     * Count by user id int.
     *
     * @param example the example
     * @return the int
     */
    public int countByUserId(CpUser example);

    /**
     * Count by cp id int.
     *
     * @param example the example
     * @return the int
     */
    public int countByCpId(CpUser example);

    /**
     * 조회
     *
     * @param example the example
     * @return cp user
     */
    public CpUser selectByPrimaryKey(CpUser example);

    /**
     * Select by name cp user.
     *
     * @param example the example
     * @return the cp user
     */
    public CpUser selectByName(CpUser example);

    /**
     * 목록 조회
     *
     * @param example the example
     * @return list
     */
    public List<CpUser> selectList(CpUser example);

    /**
     * @param example
     * @return
     */
    public List<CpUser> selectListByCpId(CpUser example);

    /**
     * 추가
     *
     * @param example the example
     * @return int
     */
    public int insert(CpUser example);

    /**
     * 삭제
     *
     * @param example the example
     * @return int
     */
    public int deleteByPrimaryKey(CpUser example);

    /**
     * 수정
     *
     * @param example the example
     * @return int
     */
    public int updateByPrimaryKeySelective(CpUser example);
    
    /**
     * cp그룹 추가
     *
     * @param example the example
     * @return int
     */
    public int insertByCpGroup(CpUser example);
    
    /**
     * cp그룹 삭제
     *
     * @param example the example
     * @return int
     */
    public int deleteByCpGroup(int id);
}
