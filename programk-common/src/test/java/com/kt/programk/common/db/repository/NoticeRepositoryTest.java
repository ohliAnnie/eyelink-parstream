/*
 * 플러스 검색 version 1.0
 * Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 *
 *  Revision History
 *  Author Date Description
 *  ------------------ -------------- ------------------
 *  Seo Jong Hwa 16. 8. 25 오후 3:48
 */

package com.kt.programk.common.db.repository;

import com.kt.programk.common.data.repository.db.NoticeRepository;
import com.kt.programk.common.db.domain.NoticeDTO;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;

/**
 * Created by Administrator on 2016-08-25.
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context-root.xml", "classpath:/spring/context/context-single-redis.xml"})
public class NoticeRepositoryTest {
    @Autowired
    NoticeRepository noticeRepository;

    @Test
    public void put() throws Exception {
        NoticeDTO dto = new NoticeDTO();
        dto.setActive("Y");
        dto.setMessage("서비스 작업중입니다.");

        noticeRepository.put(dto);

        NoticeDTO noticeDTO = noticeRepository.get(dto);

        System.out.println(noticeDTO.getMessage());
    }

    @Test
    public void get() throws Exception {

    }

}