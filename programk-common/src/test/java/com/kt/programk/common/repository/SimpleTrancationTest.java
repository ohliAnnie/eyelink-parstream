package com.kt.programk.common.repository;

import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.core.BotFile;
import com.kt.programk.common.repository.admin.CpMapper;
import com.kt.programk.common.repository.core.BotFileMapper;
import junit.framework.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.springframework.transaction.annotation.Transactional;

/**
 * 트랜잭션 테스트
 */
@RunWith(SpringJUnit4ClassRunner.class)
@TransactionConfiguration(defaultRollback=true)
@ContextConfiguration(locations = {"classpath*:spring/context-root.xml"})
@Transactional
public class SimpleTrancationTest {
    /**
     * The Cp mapper.
     */
    @Autowired
    private CpMapper cpMapper;

    /**
     * The Bot file mapper.
     */
    @Autowired
    private BotFileMapper botFileMapper;

    /**
     * The Cp.
     */
    private Cp cp;
    /**
     * The Bot file.
     */
    private BotFile botFile;

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        cp = new Cp();
        cp.setUrl("http//text.com");
        cp.setLabel("Samplebot");

        botFile = new BotFile();
        botFile.setPath("/home/jobsss/programd");
    }

    /**
     * Test tx 1 save.
     *
     * @throws Exception the exception
     */
    @Test
    public void testTx1Save() throws Exception {
        Assert.assertEquals(1, cpMapper.insert(cp));
        Assert.assertEquals(1, botFileMapper.insert(botFile));
    }
}
