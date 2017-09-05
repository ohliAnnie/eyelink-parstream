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

import com.kt.programk.common.data.repository.db.BotRepository;
import com.kt.programk.common.db.domain.BotDTO;
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
public class BotRepositoryTest {

    @Autowired
    private BotRepository botRepository;

    private BotDTO dto = new BotDTO();

    @Before
    public void setUp() throws Exception {
        dto.setToken("bd45c23e75aa42b498cd7e62c21c55eb");
    }

    @Test
    public void getObjects() throws Exception {
        List<BotDTO> objects = botRepository.getObjects(dto);

        Assert.assertTrue(objects.size() == 2);

        for(BotDTO botDTO : objects){
            System.out.println(botDTO.getSubLabel() + " " + botDTO.getActive());
        }
    }

}