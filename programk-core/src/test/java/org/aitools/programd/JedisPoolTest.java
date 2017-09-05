package org.aitools.programd;

import junit.framework.Assert;
import org.junit.Before;
import org.junit.Test;
import redis.clients.jedis.*;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by Administrator on 2016-05-19.
 */
public class JedisPoolTest {
    /**
     * The Pool.
     */

    /**
     * Sets up.
     */
    @Before
    public void setUp() {
//        JedisPool  pool = new JedisPool("127.0.0.1", 6379);
    }

    /**
     * Test subscribe.
     */
    @Test
    public void testSubscribe() {
        JedisPool  pool = new JedisPool("10.217.40.234", 6379);
        Jedis jedis = pool.getResource();
        jedis.psubscribe(new KeyExpiredListener(), "*");
    }

    /**
     * Test expire.
     */
    @Test
    public void testExpire() {
        JedisPool  pool = new JedisPool("10.217.40.234", 6379);
        Jedis jedis = pool.getResource();
        jedis.set("notify", "umq");
        jedis.expire("notify", 5);
    }

    /**
     * Test connection.
     */
    @Test
    public void testConnection() {
        JedisPool pool = new JedisPool("127.0.0.1", 6379);
        Assert.assertNotNull(pool);

        Jedis jedis = pool.getResource();
        jedis.set("abcd", "12344");
    }

    /**
     * Test cluseter connection.
     */
    @Test
    public void testCluseterConnection() {
        Set<HostAndPort> hosts = new HashSet<>();

        HostAndPort hostA = new HostAndPort("211.174.220.66", 7000);
        HostAndPort hostB = new HostAndPort("211.174.220.66", 7001);
        HostAndPort hostC = new HostAndPort("211.174.220.66", 7002);
        HostAndPort hostD = new HostAndPort("211.174.220.66", 7003);

        hosts.add(hostA);
        hosts.add(hostB);
        hosts.add(hostC);

        JedisCluster jedisCluster = new JedisCluster(hosts);

        long start;
        start = System.currentTimeMillis();
        int i = 0;
        jedisCluster.set("K:" + i, "V:" + start);
        jedisCluster.get("K:" + i);

//        for(int i = 0; i < 100; i++){
//            start = System.currentTimeMillis();
//            jedisCluster.set("K:" + i, "V:" + start);
//            jedisCluster.get("K:" + i);
//        }

    }
}

