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
 * Seo Jong Hwa        2016 . 6 . 23
 */

package com.kt.programk.common.repository.core;

import com.kt.programk.common.domain.core.AimlReply;
import com.kt.programk.common.test.Order;
import com.kt.programk.common.test.OrderedRunner;
import junit.framework.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.List;

@RunWith(OrderedRunner.class)
public class AimlReplyMapperTest {

    /**
     * The Mapper.
     */
    private AimlReplyMapper mapper;
    /**
     * The constant aimlMain.
     */
    private static AimlReply aimlReply = new AimlReply();

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (AimlReplyMapper) ctx.getBean("aimlReplyMapper");
        aimlReply.setCateId(9);
        aimlReply.setMainId(10);
        aimlReply.setReplyInput("TEST");
        aimlReply.setFirstRecordIndex(0);
        aimlReply.setRecordCountPerPage(100);

    }

    /**
     * Test select by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        AimlReply aimlReply1 = mapper.selectByPrimaryKey(aimlReply);
        Assert.assertNotNull(aimlReply1);
        Assert.assertEquals(aimlReply.getId(), aimlReply1.getId());
    }

    /**
     * Test select list.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<AimlReply> aimlReplies = mapper.selectList(aimlReply);
        Assert.assertTrue(aimlReplies.size() > 0);
    }

    /**
     * Test insert.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
        int count = mapper.insert(aimlReply);
        Assert.assertTrue(count == 1);
        Assert.assertNotNull(aimlReply.getId());
    }

    /**
     * Test delete by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 5)
    public void testDeleteByPrimaryKey() throws Exception {
        int count = mapper.deleteByPrimaryKey(aimlReply);
        Assert.assertTrue(count == 1);
    }

    /**
     * Test update by primary key selective.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 4)
    public void testUpdateByPrimaryKeySelective() throws Exception {
        int count = mapper.updateByPrimaryKeySelective(aimlReply);
        Assert.assertTrue(count == 1);
    }
}