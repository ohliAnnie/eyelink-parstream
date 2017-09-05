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
 * Seo Jong Hwa        2016 . 7 . 12
 */

package com.kt.programk.common.repository.stat;

import com.kt.programk.common.domain.category.AimlCategory;
import com.kt.programk.common.domain.core.AimlMain;
import com.kt.programk.common.domain.stat.ClickStat;
import com.kt.programk.common.repository.deploy.DeploySubsCategoryMapper;
import com.kt.programk.common.test.Order;
import com.kt.programk.common.test.OrderedRunner;
import com.kt.programk.common.utils.JodaDateUtil;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.HashMap;
import java.util.List;

import static org.junit.Assert.*;

/**
 * Created by Administrator on 2016-07-12.
 */

@RunWith(OrderedRunner.class)
public class ClickStatMapperTest {
    private ClickStatMapper mapper;
    private static ClickStat clickStat = new ClickStat();

    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (ClickStatMapper) ctx.getBean("clickStatMapper");
        clickStat.setChat("TEST");
        clickStat.setLabel("SampleBot");
        clickStat.setLinkId(1);
        clickStat.setToken("22324242");
        clickStat.setUserId("HELLO");
    }

    @Test
    @Order(order = 2)
    public void testSelectAimlNameByStat() throws Exception {
        List<AimlMain> aimlMains = mapper.selectAimlNameByStat();
        Assert.assertTrue(aimlMains.size() > 0);
    }

    @Test
    @Order(order = 1)
    public void testSelectCategoryNameByStat() throws Exception {
        List<AimlCategory> aimlCategories = mapper.selectCategoryNameByStat();
        Assert.assertTrue(aimlCategories.size() > 0);
    }

    /**
     * 시간대별 통계 입력 \
     *
     * @throws Exception
     */
    @Test
    public void insertTimeStatTest() throws Exception {
        HashMap<String, Object> map = new HashMap<>();
        map.put("startTime", JodaDateUtil.getMinusHours(1, "yyyy-MM-dd HH"));
        map.put("endTime", JodaDateUtil.getMinusHours(0, "yyyy-MM-dd HH"));
        map.put("searchStart", JodaDateUtil.getMinusHours(1, "yyyy-MM-dd HH") + ":00:00");
        map.put("searchEnd", JodaDateUtil.getMinusHours(1, "yyyy-MM-dd HH") + ":59:59");
        mapper.insertTimeStat(map);
    }

    /**
     * 사용자별 통게
     */
    @Test
    public void insertUserStatTest() {
        HashMap<String, Object> map = new HashMap<>();
        map.put("startTime", JodaDateUtil.getMinusDays(1, "yyyy-MM-dd") + " 00:00:00");
        map.put("endTime", JodaDateUtil.getMinusDays(0, "yyyy-MM-dd") + " 00:00:00");
        map.put("searchStart", JodaDateUtil.getMinusDays(1, "yyyy-MM-dd") + " 00:00:00");
        map.put("searchEnd", JodaDateUtil.getMinusDays(1, "yyyy-MM-dd") + " 23:59:59");
        mapper.insertUserStat(map);
    }

    /**
     * 카테고리 통계
     */
    @Test
    public void insertCategoryStat(){
        HashMap<String, Object> map = new HashMap<>();
        map.put("startTime", JodaDateUtil.getMinusDays(1, "yyyy-MM-dd") + " 00:00:00");
        map.put("endTime", JodaDateUtil.getMinusDays(0, "yyyy-MM-dd") + " 00:00:00");
        map.put("searchStart", JodaDateUtil.getMinusDays(1, "yyyy-MM-dd") + " 00:00:00");
        map.put("searchEnd", JodaDateUtil.getMinusDays(1, "yyyy-MM-dd") + " 23:59:59");
        mapper.insertCategoryStat(map);
    }

    /**
     * 대화 통계
     */
    @Test
    public void insertChatStat(){
        HashMap<String, Object> map = new HashMap<>();
        map.put("startTime", JodaDateUtil.getMinusDays(1, "yyyy-MM-dd") + " 00:00:00");
        map.put("endTime", JodaDateUtil.getMinusDays(0, "yyyy-MM-dd") + " 00:00:00");
        map.put("searchStart", JodaDateUtil.getMinusDays(1, "yyyy-MM-dd") + " 00:00:00");
        map.put("searchEnd", JodaDateUtil.getMinusDays(1, "yyyy-MM-dd") + " 23:59:59");
        mapper.insertChatStat(map);
    }

    /**
     * 사용자 질문 통계
     */
    @Test
    public void insertInputStat(){
        HashMap<String, Object> map = new HashMap<>();
        map.put("startTime", JodaDateUtil.getMinusDays(1, "yyyy-MM-dd") + " 00:00:00");
        map.put("endTime", JodaDateUtil.getMinusDays(0, "yyyy-MM-dd") + " 00:00:00");
        map.put("searchStart", JodaDateUtil.getMinusDays(1, "yyyy-MM-dd") + " 00:00:00");
        map.put("searchEnd", JodaDateUtil.getMinusDays(1, "yyyy-MM-dd") + " 23:59:59");
        mapper.insertInputUserStat(map);
    }
}