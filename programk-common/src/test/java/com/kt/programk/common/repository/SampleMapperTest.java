package com.kt.programk.common.repository;

import com.kt.programk.common.domain.Sample;
import com.kt.programk.common.domain.admin.AccessIp;
import com.kt.programk.common.test.Order;

import junit.framework.Assert;

import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({ "classpath:/spring/context-root.xml" })
public class SampleMapperTest {

    @Autowired
    private SampleMapper repository;

    /**
     * The Source.
     */
    private Sample source;

    /**
     * Before void.
     *
     * @throws Exception the exception
     */
    @Before
    public void before() throws Exception {
    	Sample sample = new Sample();
    	sample.setId("TESTID");
    	sample.setName("TESTNAME");
    	sample.setPassword("!@#$%");
        int count = repository.insertSample(sample);
        Assert.assertTrue(count == 1);
    }

    /**
     * Test 01 insert
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 1)
    public void test01Insert() throws Exception {
    	Sample sample = new Sample();
    	sample.setId("TESTID2");
    	sample.setName("TESTNAME2");
    	sample.setPassword("!@#$%12");
        int count = repository.insertSample(sample);
        Assert.assertTrue(count == 1);
    }

    /**
     * Test 02 select
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 2)
    public void test02Select() throws Exception {
    	Sample sample = new Sample();
        List<Sample> results = repository.selectListSample(sample);
        Assert.assertTrue(results.size() > 1);
    }
    
    /**
     * Test 03 update sample.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 3)
    public void test03Update() throws Exception {
    	Sample sample = new Sample();
    	sample.setId("TESTID2");
    	sample.setName("TESTNAME");
    	sample.setPassword("----");
        int count = repository.updateSample(sample);
        Assert.assertTrue(count == 1);
    }

    /**
     * Test 04 delete sample.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 4)
    public void test04Delete() throws Exception {
    	Sample sample = new Sample();
    	sample.setId("TESTID2");
        int count = repository.deleteSample(sample);
        Assert.assertTrue(count == 1);
    }
    
    /**
     * AfterClass void.
     *
     * @throws Exception the exception
     */
    @After
    public void after() throws Exception {
    	Sample sample = new Sample();
    	sample.setId("TESTID");
        int count = repository.deleteSample(sample);
        Assert.assertTrue(count > 0);
    }

}