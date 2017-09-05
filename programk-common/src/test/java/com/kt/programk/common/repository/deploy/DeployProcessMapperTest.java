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
 * Seo Jong Hwa        2016 . 6 . 29
 */

package com.kt.programk.common.repository.deploy;

import com.kt.programk.common.domain.core.AimlMain;
import com.kt.programk.common.domain.deploy.DeployAiml;
import org.junit.Assert;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.Assert.*;

/**
 * Created by Administrator on 2016-06-29.
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({ "classpath:/spring/context-root.xml" })
public class DeployProcessMapperTest {
    @Autowired
    private DeployProcessMapper deployProcessMapper;


    @Test
    public void selectListFromAimlMain() throws Exception {
        Assert.assertNotNull(deployProcessMapper);

        AimlMain aimlMain = new AimlMain();
        aimlMain.setCateId(19);

        List<DeployAiml> deployAimls = deployProcessMapper.selectListFromAimlMain(aimlMain);
        Assert.assertNotNull(deployAimls);
    }

}