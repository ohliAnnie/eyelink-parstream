package com.kt.programk.common.repository.core;

import com.kt.programk.common.domain.core.AimlSubs;
import com.kt.programk.common.test.Order;
import com.kt.programk.common.test.OrderedRunner;
import junit.framework.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.List;

/**
 * The type Aiml main mapper test.
 */
@RunWith(OrderedRunner.class)
public class AimlSubsMapperTest {
    /**
     * The Mapper.
     */
    private AimlSubsMapper mapper;
    /**
     * The constant aimlMain.
     */
    private static AimlSubs aimlSubs = new AimlSubs();

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (AimlSubsMapper) ctx.getBean("aimlSubsMapper");
        aimlSubs.setCateId(1);
        aimlSubs.setFind("TEST");
        aimlSubs.setReplace("HELLO");
    }

    /**
     * Test select by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        AimlSubs aimlSubs1 = mapper.selectByPrimaryKey(aimlSubs);
        Assert.assertNotNull(aimlSubs1);
    }

    /**
     * Test select list.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<AimlSubs> aimlSubses = mapper.selectList(aimlSubs);
        Assert.assertTrue(aimlSubses.size() > 0);
    }

    /**
     * Test insert.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
        int count = mapper.insert(aimlSubs);
        Assert.assertTrue(count == 1);
    }

    /**
     * Test delete by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 5)
    public void testDeleteByPrimaryKey() throws Exception {
        int count = mapper.deleteByPrimaryKey(aimlSubs);
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
        int count = mapper.updateByPrimaryKeySelective(aimlSubs);
        Assert.assertTrue(count == 1);
    }
}