package com.kt.programk.common.repository.admin;

import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.test.Order;
import com.kt.programk.common.test.OrderedRunner;
import junit.framework.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.List;

import static org.junit.Assert.*;

@RunWith(OrderedRunner.class)
public class CpMapperTest {

    /**
     * 매퍼
     */
    @Autowired
    private CpMapper mapper;

    /**
     * 데이터
     */
    private static Cp cp = new Cp();


    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (CpMapper) ctx.getBean("cpMapper");
        cp.setLabel("TEST");
        cp.setUrl("http://test.co.kr");
        cp.setToken("123355677878787877");
        cp.setEnabled("Y");
    }

    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        Cp cp1 = mapper.selectByPrimaryKey(cp);
        Assert.assertTrue(cp1 != null);
    }

    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<Cp> cps = mapper.selectList(cp);
        Assert.assertTrue(cps.size() > 0);
    }

    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
        int count = mapper.insert(cp);
        Assert.assertEquals(count, 1);
        Assert.assertTrue(cp.getId() > 0);
    }

    @Test
    @Order(order = 5)
    public void testDeleteByPrimaryKey() throws Exception {
        int count = mapper.deleteByPrimaryKey(cp);
        Assert.assertEquals(count, 1);
    }

    @Test
    @Order(order = 4)
    public void testUpdateByPrimaryKeySelective() throws Exception {
        int count = mapper.updateByPrimaryKeySelective(cp);
        Assert.assertEquals(count, 1);
    }
}