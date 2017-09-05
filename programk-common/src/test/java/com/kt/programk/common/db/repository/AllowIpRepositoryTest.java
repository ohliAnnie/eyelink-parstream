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

package com.kt.programk.common.db.repository;

import com.kt.programk.common.data.repository.db.AllowIpRepository;
import com.kt.programk.common.db.domain.AllowIpDTO;
import org.junit.Assert;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

/**
 * Created by Administrator on 2016-07-04.
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({ "classpath:/spring/context-root.xml", "classpath:/spring/context/context-single-redis.xml"})
public class AllowIpRepositoryTest {

    @Autowired
    private AllowIpRepository allowIpRepository;

    private AllowIpDTO dto;

    @Before
    public void setUp() throws Exception {
        dto = new AllowIpDTO();
        dto.setToken("12345678");
        dto.setIp("10.214.188.70");
    }

    @Test
    public void put() throws Exception {
        allowIpRepository.put(dto);
        AllowIpDTO allowIpDTO = allowIpRepository.get(dto);
        Assert.assertNotNull(allowIpDTO);
        System.out.println(allowIpDTO.getIp());
    }

    @Test
    public void get() throws Exception {
        AllowIpDTO allowIpDTO = allowIpRepository.get(dto);
        Assert.assertNotNull(allowIpDTO);
        System.out.println(allowIpDTO.getIp());
    }

    @Test
    public void delete() throws Exception {
//        allowIpRepository.delete(dto);
//        AllowIpDTO allowIpDTO = allowIpRepository.get(dto);
//        Assert.assertNotNull(allowIpDTO);
        allowIpRepository.deleteObj(dto);
    }

    @Test
    public void getObjects() throws Exception {
        AllowIpDTO dto = new AllowIpDTO();
        dto.setToken("12345678");

        List<AllowIpDTO> objects = allowIpRepository.getObjects(dto);
        Assert.assertTrue(objects.size() == 1);
    }

}