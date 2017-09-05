package com.kt.programk.cms.service.impl;

import com.kt.programk.common.domain.admin.Cp;
import junit.framework.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
//@TransactionConfiguration(defaultRollback=true)
@ContextConfiguration(locations = {"classpath*:servlet-context.xml"})
//@Transactional
public class CpServiceImplTest {

    @Autowired
    private CpServiceImpl cpService;

    @Before
    public void setUp() throws Exception {
        Assert.assertNotNull(cpService);
    }

    /**
     * Test create.
     *
     * @throws Exception the exception
     */
    @Test
    public void testCreate() throws Exception {
        Cp cp = new Cp();
        cp.setLabel("AlpaBot");
        cp.setUrl("test");
        cp.setToken("1234");

        Assert.assertEquals(cpService.create(cp), 1);
        System.out.println(cp.getId());
    }
}