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

import com.kt.programk.common.domain.admin.AllowIp;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.db.domain.AllowIpDTO;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

/**
 * Created by S.J.H on 2016-05-24.
 */
@Repository(value = "allowIpMapper")
public interface AllowIpMapper {
    /**
     * 조회
     *
     * @param example
     * @return
     */
    public AllowIp selectByPrimaryKey(AllowIp example);

    /**
     * 서비스 발급 토큰 정보를 이요해서 접근 허용 IP를 조회한다.
     * @param hashMap
     * @return
     */
    public List<AllowIpDTO> selectListByToken(HashMap<String, Object> hashMap);

    /**
     * 목록 조회
     *
     * @param example
     * @return
     */
    public List<AllowIp> selectList(AllowIp example);

    /**
     * 추가
     *
     * @param example
     * @return
     */
    public int insert(AllowIp example);

    /**
     * 삭제
     *
     * @param example
     * @return
     */
    public int deleteByPrimaryKey(AllowIp example);
    
    /**
     * 삭제 - cp_id
     *
     * @param example
     * @return
     */
    public int deleteByCpId(AllowIp example);

    /**
     * 수정
     *
     * @param example
     * @return
     */
    public int updateByPrimaryKeySelective(AllowIp example);

}
