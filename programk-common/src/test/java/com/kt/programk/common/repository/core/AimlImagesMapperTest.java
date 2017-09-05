package com.kt.programk.common.repository.core;

import com.kt.programk.common.domain.core.AimlImages;
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
 * The type Aiml main mapper test.
 */
@RunWith(OrderedRunner.class)
public class AimlImagesMapperTest {
    /**
     * The Mapper.
     */
    private AimlImagesMapper mapper;
    /**
     * The constant aimlMain.
     */
    private static AimlImages aimlImages = new AimlImages();

    /**
     * Sets up.
     *
     * @throws Exception the exception
     */
    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (AimlImagesMapper) ctx.getBean("aimlImagesMapper");
        aimlImages.setCateId(1);
        aimlImages.setMainId(1);
        aimlImages.setTitle("title");
        aimlImages.setUrl("url");
    }

    /**
     * Test select by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        AimlImages aimlImages1 = mapper.selectByPrimaryKey(aimlImages);
        Assert.assertNotNull(aimlImages1);
    }

    /**
     * Test select list.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<AimlImages> aimlOpts = mapper.selectList(aimlImages);
        Assert.assertTrue(aimlOpts.size() > 0);
    }

    /**
     * Test insert.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
        int count = mapper.insert(aimlImages);
        Assert.assertTrue(count == 1);
        Assert.assertNotNull(aimlImages.getId());
    }

    /**
     * Test delete by primary key.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 5)
    public void testDeleteByPrimaryKey() throws Exception {
        int count = mapper.deleteByPrimaryKey(aimlImages);
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
        int count = mapper.updateByPrimaryKeySelective(aimlImages);
        Assert.assertTrue(count == 1);
    }
}