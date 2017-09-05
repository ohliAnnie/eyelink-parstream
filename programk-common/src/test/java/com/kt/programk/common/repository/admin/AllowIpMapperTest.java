package com.kt.programk.common.repository.admin;

import com.kt.programk.common.domain.admin.AllowIp;
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
 * The type Allow ip mapper test.
 */
@RunWith(OrderedRunner.class)
public class AllowIpMapperTest {
    /**
     * The Mapper.
     */
    private AllowIpMapper mapper;
    /**
     * The constant allowIp.
     */
    private static AllowIp allowIp = new AllowIp();

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (AllowIpMapper) ctx.getBean("allowIpMapper");
        allowIp.setCpId(60);
        allowIp.setEnabled("Y");
        allowIp.setHostIp("10.214.188.70");
    }

    /**
     * Test select by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        AllowIp accessIp1 = mapper.selectByPrimaryKey(allowIp);
        Assert.assertTrue(accessIp1.getId() == allowIp.getId());
    }

    /**
     * Test select list.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<AllowIp> allowIps = mapper.selectList(allowIp);
        Assert.assertTrue(allowIps.size() > 0);
    }

    /**
     * Test insert.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
        int count = mapper.insert(allowIp);
        Assert.assertTrue(count == 1);
        Assert.assertTrue(allowIp.getId() > 0);
    }

    /**
     * Test delete by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 5)
    public void testDeleteByPrimaryKey() throws Exception {
        int count = mapper.deleteByPrimaryKey(allowIp);
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
        int count = mapper.updateByPrimaryKeySelective(allowIp);
        Assert.assertTrue(count == 1);
    }
}