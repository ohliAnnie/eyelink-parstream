package com.kt.programk.cms.service.impl;

import com.kt.programk.common.domain.core.AimlTopic;
import junit.framework.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context-root.xml","classpath:servlet-context.xml"})
public class TopicServiceImplTest {

    @Autowired
    TopicServiceImpl topicService;

    @Test
    public void testCountByCateId() throws Exception {
        int count = topicService.countByCateId(0);
        Assert.assertTrue(count == 0);
    }

    @Test
    public void testFindListByCateId() throws Exception {
        List<AimlTopic> listByCateId = topicService.findListByCateId(0, 1, 10);

        Assert.assertNotNull(listByCateId);
    }

    @Test
    public void testFindById() throws Exception {
        AimlTopic aimlTopic = topicService.findById(0, 0);
        Assert.assertNotNull("결과가 없습니다.", aimlTopic);
    }

    @Test
    public void testCreate() throws Exception {
        AimlTopic aimlTopic = new AimlTopic();
        aimlTopic.setCateId(1);
        aimlTopic.setName("test");

        int count = topicService.create(aimlTopic);

        Assert.assertTrue(count == 1);
    }

    @Test
    public void testCreate1() throws Exception {
        AimlTopic one = new AimlTopic();
        one.setCateId(1);
        one.setName("test1");

        AimlTopic two = new AimlTopic();
        two.setCateId(1);
        two.setName("test2");

        List<AimlTopic> aimlTopics = new ArrayList<>();
        aimlTopics.add(one);
        aimlTopics.add(two);

        int count = topicService.create(aimlTopics);

        Assert.assertTrue(count == 2);
    }

    @Test
    public void testModify() throws Exception {

    }

    @Test
    public void testRemove() throws Exception {

    }
}