package com.kt.programk.common.repository.core;

import com.kt.programk.common.domain.core.AimlLink;
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
public class AimlLinkMapperTest {
    /**
     * The Mapper.
     */
    private AimlLinkMapper mapper;
    /**
     * The constant aimlMain.
     */
    private static AimlLink aimlLink = new AimlLink();

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (AimlLinkMapper) ctx.getBean("aimlLinkMapper");
        aimlLink.setCateId(1);
        aimlLink.setMainId(1);
        aimlLink.setTitle("title");
        aimlLink.setUrl("url");
    }

    /**
     * Test select by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        AimlLink aimlLink1 = mapper.selectByPrimaryKey(aimlLink);
        Assert.assertNotNull(aimlLink1);
    }

    /**
     * Test select list.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<AimlLink> aimlOpts = mapper.selectList(aimlLink);
        Assert.assertTrue(aimlOpts.size() > 0);
    }

    /**
     * Test insert.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
        int count = mapper.insert(aimlLink);
        Assert.assertTrue(count == 1);
        Assert.assertNotNull(aimlLink.getId());
    }

    /**
     * Test delete by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 5)
    public void testDeleteByPrimaryKey() throws Exception {
        int count = mapper.deleteByPrimaryKey(aimlLink);
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
        int count = mapper.updateByPrimaryKeySelective(aimlLink);
        Assert.assertTrue(count == 1);
    }
}