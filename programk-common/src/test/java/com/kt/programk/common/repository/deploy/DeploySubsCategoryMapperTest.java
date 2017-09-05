package com.kt.programk.common.repository.deploy;

import com.kt.programk.common.domain.deploy.DeployAimlCategory;
import com.kt.programk.common.domain.deploy.DeploySubsCategory;
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
public class DeploySubsCategoryMapperTest {

    /**
     * The Mapper.
     */
    private DeploySubsCategoryMapper mapper;
    /**
     * The constant aimlMain.
     */
    private static DeploySubsCategory deploySubsCategory = new DeploySubsCategory();

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (DeploySubsCategoryMapper) ctx.getBean("deploySubsCategoryMapper");
        deploySubsCategory.setCpId(1);
        deploySubsCategory.setCateId(1);
    }

    /**
     * Test select by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        DeploySubsCategory deploySubsCategory1 = mapper.selectByPrimaryKey(deploySubsCategory);
        Assert.assertNotNull(deploySubsCategory1);
    }

    /**
     * Test select list.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<DeploySubsCategory> deploySubsCategories = mapper.selectList(deploySubsCategory);
        Assert.assertTrue(deploySubsCategories.size() > 0);
    }

    /**
     * Test insert.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
        int count = mapper.insert(deploySubsCategory);
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
        int count = mapper.deleteByPrimaryKey(deploySubsCategory);
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
        int count = mapper.updateByPrimaryKeySelective(deploySubsCategory);
        Assert.assertTrue(count == 1);
    }
}