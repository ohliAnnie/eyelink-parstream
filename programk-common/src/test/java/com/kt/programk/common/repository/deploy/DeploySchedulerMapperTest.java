package com.kt.programk.common.repository.deploy;

import com.kt.programk.common.code.AimlFileType;
import com.kt.programk.common.code.DeploySchedulerCompletedType;
import com.kt.programk.common.domain.core.AimlTopic;
import com.kt.programk.common.domain.deploy.DeployScheduler;
import com.kt.programk.common.repository.core.AimlTopicMapper;
import com.kt.programk.common.test.Order;
import com.kt.programk.common.test.OrderedRunner;
import junit.framework.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.Date;
import java.util.List;

import static org.junit.Assert.*;

@RunWith(OrderedRunner.class)
public class DeploySchedulerMapperTest {

    /**
     * The Mapper.
     */
    private DeploySchedulerMapper mapper;
    /**
     * The constant aimlMain.
     */
    private static DeployScheduler deployScheduler = new DeployScheduler();

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (DeploySchedulerMapper) ctx.getBean("deploySchedulerMapper");
        deployScheduler.setCompleted(DeploySchedulerCompletedType.NONCOMPLETED.getValue());
        deployScheduler.setCpId(60);
        deployScheduler.setDeployDate(new Date());
        deployScheduler.setDescription("8월 정규배포");
        deployScheduler.setUserId("redpunk");
        deployScheduler.setSubLabel("AutoBot-02");
        deployScheduler.setGubun("배포");
    }

    /**
     * Test select by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        DeployScheduler deployScheduler1 = mapper.selectByPrimaryKey(deployScheduler);
        Assert.assertNotNull(deployScheduler1);
        Assert.assertEquals(deployScheduler1.getId(), deployScheduler.getId());
    }

    /**
     * Test select list.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<DeployScheduler> deploySchedulers = mapper.selectList(deployScheduler);
        Assert.assertTrue(deploySchedulers.size() > 0);
    }

    /**
     * Test insert.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
        int count = mapper.insert(deployScheduler);
        Assert.assertTrue(count == 1);
        Assert.assertNotNull(deployScheduler.getId());
    }

    /**
     * Test delete by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 5)
    public void testDeleteByPrimaryKey() throws Exception {
        int count = mapper.deleteByPrimaryKey(deployScheduler);
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
        int count = mapper.updateByPrimaryKeySelective(deployScheduler);
        Assert.assertTrue(count == 1);
    }

    /**
     * 봇 변경 테스트
     */
    @Test
    public void botChangeTest(){
        DeployScheduler exmple = new DeployScheduler();
        exmple.setCompleted(DeploySchedulerCompletedType.NONCOMPLETED.getValue());
        exmple.setCpId(60);
        exmple.setDeployDate(new Date());
        exmple.setDescription("8월 정규배포");
        exmple.setUserId("redpunk");
        exmple.setSubLabel("AutoBot-01");
        exmple.setGubun("BOT변경");
        mapper.insert(exmple);
    }
}