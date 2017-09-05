package com.kt.programk.common.repository.stat;

import com.kt.programk.common.domain.stat.ChatLog;
import com.kt.programk.common.test.Order;
import com.kt.programk.common.test.OrderedRunner;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.Date;
import java.util.List;

import static org.junit.Assert.*;

/**
 * Created by Administrator on 2016-07-25.
 */
@RunWith(OrderedRunner.class)
public class ChatLogMapperTest {
    private ChatLogMapper mapper;
    private static ChatLog chatLog = new ChatLog();

    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (ChatLogMapper) ctx.getBean("chatLogMapper");
        chatLog.setCateName("알수없음");
        chatLog.setUserId("test");
        chatLog.setInput("t");
        chatLog.setReply("reply");
        chatLog.setCreated(new Date());
    }

    @Test
    @Order(order = 2)
    public void selectByPrimaryKey() throws Exception {
        ChatLog chatLog1 = mapper.selectByPrimaryKey(chatLog);
        Assert.assertNotNull(chatLog1);
    }

    @Test
    @Order(order = 3)
    public void selectList() throws Exception {
        List<ChatLog> chatLogs = mapper.selectList(chatLog);
        Assert.assertTrue(chatLogs.size() > 0);
    }

    @Test
    @Order(order = 1)
    public void insert() throws Exception {
        int insert = mapper.insert(chatLog);
        Assert.assertTrue(insert == 1);
    }

    @Test
    @Order(order = 5)
    public void deleteByPrimaryKey() throws Exception {
        int delete = mapper.deleteByPrimaryKey(chatLog);
        Assert.assertTrue(delete == 1);
    }

    @Test
    @Order(order = 4)
    public void updateByPrimaryKeySelective() throws Exception {
        int update = mapper.updateByPrimaryKeySelective(chatLog);
        Assert.assertTrue(update == 1);
    }

}