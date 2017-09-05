package com.kt.programk.common.repository.admin;

import com.kt.programk.common.code.CategoryTopicType;
import com.kt.programk.common.domain.admin.AccessIp;
import com.kt.programk.common.test.Order;
import com.kt.programk.common.test.OrderedRunner;
import junit.framework.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.List;

import static org.junit.Assert.*;

/**
 * The type Access ip mapper test.
 */
@RunWith(OrderedRunner.class)
public class AccessIpMapperTest {
    /**
     * The Mapper.
     */
    private AccessIpMapper mapper;
    /**
     * The constant accessIp.
     */
    private static AccessIp accessIp = new AccessIp();

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (AccessIpMapper) ctx.getBean("accessIpMapper");
        accessIp.setUserId("redpunk");
        accessIp.setEnabled(CategoryTopicType.YES.getValue());
        accessIp.setHostIp("127.0.0.1");
    }

    /**
     * Test select by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        AccessIp accessIp1 = mapper.selectByPrimaryKey(accessIp);
        Assert.assertTrue(accessIp1.getId() == accessIp.getId());
    }

    /**
     * Test select list.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<AccessIp> accessIps = mapper.selectList(accessIp);
        Assert.assertTrue(accessIps.size() > 0);
    }

    /**
     * Test insert.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
        int count = mapper.insert(accessIp);
        Assert.assertTrue(count == 1);
        Assert.assertTrue(accessIp.getId() > 0);
    }

    /**
     * Test delete by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 5)
    public void testDeleteByPrimaryKey() throws Exception {
        int count = mapper.deleteByPrimaryKey(accessIp);
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
        int count = mapper.updateByPrimaryKeySelective(accessIp);
        Assert.assertTrue(count == 1);
    }
}