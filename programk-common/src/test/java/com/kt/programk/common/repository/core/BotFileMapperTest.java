package com.kt.programk.common.repository.core;

import com.kt.programk.common.domain.core.BotFile;
import com.kt.programk.common.test.Order;
import com.kt.programk.common.test.OrderedRunner;
import junit.framework.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.Date;
import java.util.List;

@RunWith(OrderedRunner.class)
public class BotFileMapperTest {
    private BotFileMapper mapper;
    private static BotFile botFile = new BotFile();

    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (BotFileMapper) ctx.getBean("botFileMapper");
        botFile.setFileName("Samplebot-1");
        botFile.setFileType("AIML");
        botFile.setLastLoaded(new Date());
        botFile.setPath("/var/log");
    }

    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        BotFile bot1 = mapper.selectByPrimaryKey(botFile);
        Assert.assertNotNull(bot1);
    }

    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<BotFile> botFiles = mapper.selectList(botFile);
        Assert.assertTrue(botFiles.size() > 0);
    }

    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
        int count = mapper.insert(botFile);
        Assert.assertTrue(count == 1);
    }

    @Test
    @Order(order = 5)
    public void testDeleteByPrimaryKey() throws Exception {
        int count = mapper.deleteByPrimaryKey(botFile);
        Assert.assertTrue(count == 1);
    }

    @Test
    @Order(order = 4)
    public void testUpdateByPrimaryKeySelective() throws Exception {
        int count = mapper.updateByPrimaryKeySelective(botFile);
        Assert.assertTrue(count == 1);
    }
}