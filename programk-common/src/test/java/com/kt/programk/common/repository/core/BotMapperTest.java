package com.kt.programk.common.repository.core;

import com.kt.programk.common.domain.core.Bot;
import com.kt.programk.common.repository.admin.AccessIpMapper;
import com.kt.programk.common.test.Order;
import com.kt.programk.common.test.OrderedRunner;
import junit.framework.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.List;
import java.util.UUID;

import static org.junit.Assert.*;

@RunWith(OrderedRunner.class)
public class BotMapperTest {
    private BotMapper mapper;
    private static Bot bot = new Bot();

    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (BotMapper) ctx.getBean("botMapper");
        bot.setCpId(1);
        String unique = UUID.randomUUID().toString();
        bot.setSubLabel(unique);
        bot.setActive("Y");
    }

    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        Bot bot1 = mapper.selectByPrimaryKey(bot);
        Assert.assertNotNull(bot1);
        Assert.assertTrue(bot.getId() == bot1.getId());
    }

    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<Bot> bots = mapper.selectList(bot);
        Assert.assertTrue(bots.size() > 0);
    }

    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
        int count = mapper.insert(bot);
        Assert.assertTrue(count == 1);
        Assert.assertNotNull(bot.getId());
    }

    @Test
    @Order(order = 5)
    public void testDeleteByPrimaryKey() throws Exception {
        int count = mapper.deleteByPrimaryKey(bot);
        Assert.assertTrue(count == 1);
    }

    @Test
    @Order(order = 4)
    public void testUpdateByPrimaryKeySelective() throws Exception {
        int count = mapper.updateByPrimaryKeySelective(bot);
        Assert.assertTrue(count == 1);
    }
}