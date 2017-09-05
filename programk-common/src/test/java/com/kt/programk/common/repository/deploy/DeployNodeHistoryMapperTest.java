package com.kt.programk.common.repository.deploy;

import com.kt.programk.common.code.AimlFileType;
import com.kt.programk.common.code.DeploySchedulerCompletedType;
import com.kt.programk.common.domain.deploy.DeployNodeHistory;
import com.kt.programk.common.domain.deploy.DeployScheduler;
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

@RunWith(OrderedRunner.class)
public class DeployNodeHistoryMapperTest {

    /**
     * The Mapper.
     */
    private DeployNodeHistoryMapper mapper;
    /**
     * The constant aimlMain.
     */
    private static DeployNodeHistory deployNodeHistory = new DeployNodeHistory();

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (DeployNodeHistoryMapper) ctx.getBean("deployNodeHistoryMapper");
        deployNodeHistory.setWriteSuccess(DeploySchedulerCompletedType.NONCOMPLETED.getValue());
        deployNodeHistory.setHostIp("127.0.0.1");
        deployNodeHistory.setSchedulerId(1);
        deployNodeHistory.setFileName("ABCDEFG");
    }

    /**
     * Test select by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        DeployNodeHistory deployNodeHistory1 = mapper.selectByPrimaryKey(deployNodeHistory);
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
        List<DeployNodeHistory> deployNodeHistories = mapper.selectList(deployNodeHistory);
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
        int count = mapper.insert(deployNodeHistory);
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
        int count = mapper.deleteByPrimaryKey(deployNodeHistory);
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
        int count = mapper.updateByPrimaryKeySelective(deployNodeHistory);
        Assert.assertTrue(count == 1);
    }
}