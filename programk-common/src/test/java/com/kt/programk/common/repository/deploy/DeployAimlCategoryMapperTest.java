package com.kt.programk.common.repository.deploy;

import com.kt.programk.common.code.DeploySchedulerCompletedType;
import com.kt.programk.common.domain.deploy.DeployAimlCategory;
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
public class DeployAimlCategoryMapperTest {

    /**
     * The Mapper.
     */
    private DeployAimlCategoryMapper mapper;
    /**
     * The constant aimlMain.
     */
    private static DeployAimlCategory deployAimlCategory = new DeployAimlCategory();

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (DeployAimlCategoryMapper) ctx.getBean("deployAimlCategoryMapper");
        deployAimlCategory.setCpId(1);
        deployAimlCategory.setCateId(1);
    }

    /**
     * Test select by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        DeployAimlCategory deployNodeHistory1 = mapper.selectByPrimaryKey(deployAimlCategory);
        Assert.assertNotNull(deployNodeHistory1);
    }

    /**
     * Test select list.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<DeployAimlCategory> deployNodeHistories = mapper.selectList(deployAimlCategory);
        Assert.assertTrue(deployNodeHistories.size() > 0);
    }

    /**
     * Test insert.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
        int count = mapper.insert(deployAimlCategory);
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
        int count = mapper.deleteByPrimaryKey(deployAimlCategory);
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
        int count = mapper.updateByPrimaryKeySelective(deployAimlCategory);
        Assert.assertTrue(count == 1);
    }
}