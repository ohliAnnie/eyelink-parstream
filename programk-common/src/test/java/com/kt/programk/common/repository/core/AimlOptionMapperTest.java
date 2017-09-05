package com.kt.programk.common.repository.core;

import com.kt.programk.common.domain.core.AimlLink;
import com.kt.programk.common.domain.core.AimlOption;
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
public class AimlOptionMapperTest {
    /**
     * The Mapper.
     */
    private AimlOptionMapper mapper;
    /**
     * The constant aimlMain.
     */
    private static AimlOption aimlOption = new AimlOption();

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (AimlOptionMapper) ctx.getBean("aimlOptionMapper");
        aimlOption.setCateId(1);
        aimlOption.setMainId(1);
        aimlOption.setVal("TEST");
    }

    /**
     * Test select by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        AimlOption aimlOption1 = mapper.selectByPrimaryKey(aimlOption);
        Assert.assertNotNull(aimlOption1);
    }

    /**
     * Test select list.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<AimlOption> aimlOptions = mapper.selectList(aimlOption);
        Assert.assertTrue(aimlOptions.size() > 0);
    }

    /**
     * Test insert.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
        int count = mapper.insert(aimlOption);
        Assert.assertTrue(count == 1);
        Assert.assertNotNull(aimlOption.getId());
    }

    /**
     * Test delete by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 5)
    public void testDeleteByPrimaryKey() throws Exception {
        int count = mapper.deleteByPrimaryKey(aimlOption);
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
        int count = mapper.updateByPrimaryKeySelective(aimlOption);
        Assert.assertTrue(count == 1);
    }
}