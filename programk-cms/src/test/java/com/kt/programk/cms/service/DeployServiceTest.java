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
 *  Seo Jong Hwa 16. 8. 29 오후 3:22
 */

package com.kt.programk.cms.service;

import com.google.gson.Gson;
import com.kt.programk.common.wo.ProgramkResponse;
import com.kt.programk.deploy.service.*;
import com.kt.programk.deploy.service.DeployService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2016-08-29.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:servlet-context.xml"})
public class DeployServiceTest {
    @Autowired
    private DeployService deployService;
    private Gson gson = new Gson();

    @Test
    public void test(){
        List<ProgramkResponse> programkResponses = new ArrayList<>();
        String response = deployService.makeResponse(programkResponses, "유심countrylock해제", "redpunk", "AutoBot-01", true, null);

        gson.toJson(programkResponses);

    }
}
