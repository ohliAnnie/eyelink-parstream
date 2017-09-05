package com.kt.programk.common.repository.core;

import com.kt.programk.common.domain.core.AimlMain;
import com.kt.programk.common.domain.core.BotFile;
import com.kt.programk.common.test.Order;
import com.kt.programk.common.test.OrderedRunner;
import junit.framework.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import static org.junit.Assert.*;

/**
 * The type Aiml main mapper test.
 */
@RunWith(OrderedRunner.class)
public class AimlMainMapperTest {
    /**
     * The Mapper.
     */
    private AimlMainMapper mapper;
    /**
     * The constant aimlMain.
     */
    private static AimlMain aimlMain = new AimlMain();

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (AimlMainMapper) ctx.getBean("aimlMainMapper");
        aimlMain.setCateId(9);
        aimlMain.setInput("connect");
        aimlMain.setReply("Hello");
        aimlMain.setThatId(0);
        aimlMain.setFirstRecordIndex(0);
        aimlMain.setRecordCountPerPage(10);
    }

    @Test
    public void selectListByReply() throws Exception {
        HashMap<String, Object> maps = new HashMap<>();
        maps.put("cateId", aimlMain.getCateId());
        maps.put("reply", "test");
        maps.put("firstRecordIndex", 0);
        maps.put("recordCountPerPage",10);

        List<AimlMain> aimlMains = mapper.selectListByReply(maps);
    }

    /**
     * Test select by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        AimlMain aimlMain1 = mapper.selectByPrimaryKey(aimlMain);
        Assert.assertNotNull(aimlMain1);
        Assert.assertEquals(aimlMain.getId(), aimlMain1.getId());
    }

    /**
     * Test select list.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        AimlMain aimlMain = new AimlMain();
        aimlMain.setFirstRecordIndex(0);
        aimlMain.setRecordCountPerPage(10);        
        List<AimlMain> aimlMains = mapper.selectListAll(aimlMain);
        Assert.assertTrue(aimlMains.size() > 0);
    }

    /**
     * Test insert.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
        int count = mapper.insert(aimlMain);
        Assert.assertTrue(count == 1);
        Assert.assertNotNull(aimlMain.getId());
    }

    /**
     * Test delete by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 5)
    public void testDeleteByPrimaryKey() throws Exception {
        int count = mapper.deleteByPrimaryKey(aimlMain);
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
        int count = mapper.updateByPrimaryKeySelective(aimlMain);
        Assert.assertTrue(count == 1);
    }
}