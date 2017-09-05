package com.kt.programk.common.repository.category;

import com.kt.programk.common.code.CategoryType;
import com.kt.programk.common.domain.category.AimlCategory;
import com.kt.programk.common.domain.category.SubsCategory;
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
public class SubsCategoryMapperTest {
    /**
     * The Mapper.
     */
    private SubsCategoryMapper mapper;
    /**
     * The constant aimlMain.
     */
    private static SubsCategory subsCategory = new SubsCategory();

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (SubsCategoryMapper) ctx.getBean("subsCategoryMapper");
        subsCategory.setName("TEST");
        subsCategory.setCpId(0);
        subsCategory.setRestriction(CategoryType.ALL.getValue());
    }

    /**
     * Test select by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        SubsCategory subsCategory1 = mapper.selectByPrimaryKey(subsCategory);
        Assert.assertNotNull(subsCategory1);
        Assert.assertEquals(subsCategory1.getId(), subsCategory1.getId());
    }

    /**
     * Test select list.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<SubsCategory> aimlCategories = mapper.selectList(subsCategory);
        Assert.assertTrue(aimlCategories.size() > 0);
    }

    /**
     * Test insert.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
        int count = mapper.insert(subsCategory);
        Assert.assertTrue(count == 1);
        Assert.assertNotNull(subsCategory.getId());
    }

    /**
     * Test delete by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 5)
    public void testDeleteByPrimaryKey() throws Exception {
        int count = mapper.deleteByPrimaryKey(subsCategory);
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
        int count = mapper.updateByPrimaryKeySelective(subsCategory);
        Assert.assertTrue(count == 1);
    }
}