package com.kt.programk.common.repository.core;

import com.kt.programk.common.domain.core.AimlRepository;
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
public class AimlRepositoryMapperTest {
    /**
     * The Mapper.
     */
    private AimlRepositoryMapper mapper;
    /**
     * The constant aimlMain.
     */
    private static AimlRepository aimlRepository = new AimlRepository();

    /**
     * Test insert.
     *
     * @throws Exception the exception
     */
    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (AimlRepositoryMapper) ctx.getBean("aimlRepositoryMapper");
        aimlRepository.setObjectKey("OBJECT_KEY");
        aimlRepository.setKey("KEY");
        aimlRepository.setValue("VALUE");
        int count = mapper.deleteByAll(aimlRepository);
        Assert.assertTrue(count <= 1);
        count = mapper.insert(aimlRepository);
        Assert.assertTrue(count == 1);
        count = mapper.deleteByAll(aimlRepository);
        Assert.assertTrue(count == 1);
    }
}