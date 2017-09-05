package com.kt.programk.common.db.repository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.listener.KeyExpirationEventMessageListener;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.UUID;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.mockito.Mockito.*;

/**
 * Created by Administrator on 2016-07-25.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context-root.xml", "classpath:/spring/context/context-single-redis.xml"})
public class KeyExpirationEventMessageListenerTests {
    @Autowired
    private JedisConnectionFactory jedisConnectionFactory;

    RedisConnectionFactory connectionFactory;
    RedisMessageListenerContainer container;
    KeyExpirationEventMessageListener listener;

    @Mock
    ApplicationEventPublisher publisherMock;

    @Before
    public void setUp() {
//        JedisConnectionFactory connectionFactory = new JedisConnectionFactory();
        jedisConnectionFactory.afterPropertiesSet();
        this.connectionFactory = jedisConnectionFactory;

        container = new RedisMessageListenerContainer();

        container.setConnectionFactory(connectionFactory);
        container.afterPropertiesSet();
        container.start();

        listener = new KeyExpirationEventMessageListener(container);
        listener.setApplicationEventPublisher(publisherMock);
        listener.init();
    }

    @Test
    public void listenerShouldPublishEventCorrectly() throws InterruptedException {

        byte[] key = ("to-expire:" + UUID.randomUUID().toString()).getBytes();

        RedisConnection connection = connectionFactory.getConnection();
        try {
            connection.setEx(key, 2, "foo".getBytes());

            int iteration = 0;
            while (connection.get(key) != null || iteration >= 3) {

                Thread.sleep(2000);
                iteration++;
            }
        } finally {
            connection.close();
        }

        Thread.sleep(2000);
//        ArgumentCaptor<ApplicationEvent> captor = ArgumentCaptor.forClass(ApplicationEvent.class);

//        verify(publisherMock, times(1)).publishEvent(captor.capture());
//        assertThat((byte[]) captor.getValue().getSource(), is(key));
    }

    /**
     * @see DATAREDIS-425
     */
    @Test
    public void listenerShouldNotReactToDeleteEvents() throws InterruptedException {

        byte[] key = ("to-delete:" + UUID.randomUUID().toString()).getBytes();

        RedisConnection connection = connectionFactory.getConnection();
        try {

            connection.setEx(key, 10, "foo".getBytes());
            Thread.sleep(2000);
            connection.del(key);
            Thread.sleep(2000);
        } finally {
            connection.close();
        }

        Thread.sleep(2000);
        verifyZeroInteractions(publisherMock);
    }
}
