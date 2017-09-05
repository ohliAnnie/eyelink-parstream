package com.kt.programk.common.repository.core;

import com.kt.programk.common.domain.core.AimlTopic;
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
public class AimlTopicMapperTest {
    /**
     * The Mapper.
     */
    private AimlTopicMapper mapper;
    /**
     * The constant aimlMain.
     */
    private static AimlTopic aimlTopic = new AimlTopic();

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (AimlTopicMapper) ctx.getBean("aimlTopicMapper");
        aimlTopic.setCateId(9);
        aimlTopic.setName("topic");
    }

    /**
     * Test select by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        AimlTopic aimlTopic1 = mapper.selectByPrimaryKey(aimlTopic);
        Assert.assertNotNull(aimlTopic1);
        Assert.assertEquals(aimlTopic.getId(), aimlTopic1.getId());
    }

    /**
     * Test select list.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<AimlTopic> aimlTopics = mapper.selectList(null);
        Assert.assertTrue(aimlTopics.size() > 0);
    }

    /**
     * Test insert.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
        int count = mapper.insert(aimlTopic);
        Assert.assertTrue(count == 1);
        Assert.assertNotNull(aimlTopic.getId());
    }

    /**
     * Test delete by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 5)
    public void testDeleteByPrimaryKey() throws Exception {
        int count = mapper.deleteByPrimaryKey(aimlTopic);
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
        int count = mapper.updateByPrimaryKeySelective(aimlTopic);
        Assert.assertTrue(count == 1);
    }
}