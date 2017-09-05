package com.kt.programk.common.repository.deploy;

import com.kt.programk.common.code.AimlFileType;
import com.kt.programk.common.domain.core.BotFile;
import com.kt.programk.common.domain.deploy.DeployAimlCategory;
import com.kt.programk.common.domain.deploy.DeployHistory;
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
 * Created by redpunk on 2016-07-11.
 */
@RunWith(OrderedRunner.class)

public class DeployHistoryMapperTest {
    /**
     * The Mapper.
     */
    private DeployHistoryMapper mapper;
    /**
     * The constant aimlMain.
     */
    private static DeployHistory deployHistory = new DeployHistory();


    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (DeployHistoryMapper) ctx.getBean("deployHistoryMapper");
        deployHistory.setSchedulerId(1);
        deployHistory.setFileBody("TEST");
        deployHistory.setFileName("TEST");
        deployHistory.setFileType(AimlFileType.AIML.getValue());
    }

    /**
     * Test select by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        DeployHistory deployHistory1 = mapper.selectByPrimaryKey(deployHistory);
        Assert.assertNotNull(deployHistory1);
    }

    /**
     * Test select list.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<DeployHistory> deployHistories = mapper.selectList(deployHistory);
        Assert.assertTrue(deployHistories.size() > 0);
    }

    /**
     * Test insert.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
//        int count = mapper.insert(deployHistory);
        int count = mapper.insertNotExist(deployHistory);
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
        int count = mapper.deleteByPrimaryKey(deployHistory);
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
        int count = mapper.updateByPrimaryKeySelective(deployHistory);
        Assert.assertTrue(count == 1);
    }

}