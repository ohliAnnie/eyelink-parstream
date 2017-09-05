package com.kt.programk.common.repository.core;

import com.kt.programk.common.domain.core.AimlRecommend;
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
public class AimlRecommendMapperTest {
    /**
     * The Mapper.
     */
    private AimlRecommendMapper mapper;
    /**
     * The constant aimlMain.
     */
    private static AimlRecommend aimlRecommend = new AimlRecommend();

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (AimlRecommendMapper) ctx.getBean("aimlRecommendMapper");
        aimlRecommend.setCateId(1);
        aimlRecommend.setMainId(1);
        aimlRecommend.setRecommendInput("TESTT");
    }

    /**
     * Test select by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        AimlRecommend aimlRecommend1 = mapper.selectByPrimaryKey(aimlRecommend);
        Assert.assertNotNull(aimlRecommend1);
    }

    /**
     * Test select list.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<AimlRecommend> aimlRecommends = mapper.selectList(aimlRecommend);
        Assert.assertTrue(aimlRecommends.size() > 0);
    }

    /**
     * Test insert.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
        int count = mapper.insert(aimlRecommend);
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
        int count = mapper.deleteByPrimaryKey(aimlRecommend);
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
        int count = mapper.updateByPrimaryKeySelective(aimlRecommend);
        Assert.assertTrue(count == 1);
    }
}