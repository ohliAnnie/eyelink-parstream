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

import java.util.List;

import org.springframework.stereotype.Repository;

import com.kt.programk.common.domain.admin.Cp;

/**
 * Created by S.J.H on 2016-05-24.
 */
@Repository(value = "cpMapper")
public interface CpMapper {
    /**
     * Count by example int.
     *
     * @param cp the cp
     * @return the int
     */
    public int countByExample(Cp cp);
    
    /**
     * Count by Label int.
     *
     * @param cp the cp
     * @return the int
     */
    public int countByLabel(Cp cp);

    /**
     * 조회
     *
     * @param example the example
     * @return cp
     */
    public Cp selectByPrimaryKey(Cp example);

    /**
     * 라벨명으로 검색
     *
     * @param example the example
     * @return cp
     */
    public Cp selectByLable(Cp example);

    /**
     * 목록 조회
     *
     * @param example the example
     * @return list
     */
    public List<Cp> selectList(Cp example);

    /**
     * 추가
     *
     * @param example the example
     * @return int
     */
    public int insert(Cp example);

    /**
     * 삭제
     *
     * @param example the example
     * @return int
     */
    public int deleteByPrimaryKey(Cp example);

    /**
     * 수정
     *
     * @param example the example
     * @return int
     */
    public int updateByPrimaryKeySelective(Cp example);
}
