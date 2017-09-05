package com.kt.programk.common.repository.category;

import com.kt.programk.common.code.CategoryTopicType;
import com.kt.programk.common.code.CategoryType;
import com.kt.programk.common.code.EnabledType;
import com.kt.programk.common.domain.category.AimlCategory;
import com.kt.programk.common.domain.core.AimlMain;
import com.kt.programk.common.repository.core.AimlMainMapper;
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
public class AimlCategoryMapperTest {
    /**
     * The Mapper.
     */
    private AimlCategoryMapper mapper;
    /**
     * The constant aimlMain.
     */
    private static AimlCategory aimlCategory = new AimlCategory();

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (AimlCategoryMapper) ctx.getBean("aimlCategoryMapper");
        aimlCategory.setName("TEST");
        aimlCategory.setCpId(10);
        aimlCategory.setRestriction(CategoryType.ALL.getValue());
        aimlCategory.setTopic(CategoryTopicType.NO.getValue());
    }

    /**
     * Test select by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        AimlCategory aimlCategory1 = mapper.selectByPrimaryKey(aimlCategory);
        Assert.assertNotNull(aimlCategory1);
        Assert.assertEquals(aimlCategory1.getId(), aimlCategory1.getId());
    }

    /**
     * Test select list.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<AimlCategory> aimlCategories = mapper.selectListAll(aimlCategory);
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
        int count = mapper.insert(aimlCategory);
        Assert.assertTrue(count == 1);
        Assert.assertNotNull(aimlCategory.getId());
    }

    /**
     * Test delete by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 5)
    public void testDeleteByPrimaryKey() throws Exception {
        int count = mapper.deleteByPrimaryKey(aimlCategory);
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
        int count = mapper.updateByPrimaryKeySelective(aimlCategory);
        Assert.assertTrue(count == 1);
    }

    @Test
    public void testSelectListByCpId(){
        AimlCategory aimlCategory = new AimlCategory();
        aimlCategory.setCpId(44);
        aimlCategory.setEnabled(EnabledType.ENABLE.getValue());

        List<AimlCategory> aimlCategories = mapper.selectListByCpId(aimlCategory);

        System.out.println(aimlCategories.size());
    }
}