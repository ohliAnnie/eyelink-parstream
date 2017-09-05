

/*
 * Copyright (c) 2016 KT, Inc.
 * All right reserved.
 * This software is the confidential and proprietary information of KT
 * , Inc. You shall not disclose such Confidential Information and
 * shall use it only in accordance with the terms of the license agreement
 * you entered into with KT.
 *
 * Revision History
 * Author              Date                  Description
 * ------------------   --------------       ------------------
 * Seo Jong Hwa        2016 . 6 . 21
 */

package org.aitools.programd.redis;

import com.google.gson.Gson;
import org.aitools.programd.multiplexor.PredicateMap;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.exceptions.JedisException;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * 사용자의 predicateMap을 redis에서 조회
 */
public class MemoryCacheHandler {
    /**
     * The constant pool.
     */
    private JedisPool pool = null;

    /**
     * The Gson.x
     */
    private Gson gson = new Gson();

    /**
     * Instantiates a new Jedis connection pool.
     */
    public MemoryCacheHandler(JedisPool pool) {
        this.pool = pool;
    }

    /**
     * 사용자 아이디별로 PredicateMap맵을 redis에 저장
     *
     * @param botid        the bolt id
     * @param userid       the userid
     * @param predicateMap the predicate map
     */
    public void setPredicateMap(String botid, String userid, PredicateMap predicateMap) {
        String key = botid + "_" + userid;

        String json = gson.toJson(predicateMap);
        //System.out.println(json);

        Jedis jedis = pool.getResource();

        try {
            //save to redis
            jedis.set(key, json);

        } catch (JedisException e) {
            //if something wrong happen, return it back to the pool
            if (null != jedis) {
                pool.returnBrokenResource(jedis);
                jedis = null;
            }
        } finally {
            ///it's important to return the Jedis instance to the pool once you've finished using it
            if (null != jedis) {
                pool.returnResource(jedis);
            }
        }
    }


    /**
     * Gets predicate map.
     *
     * @param boltId the bolt id
     * @param userid the userid
     * @return the predicate map
     */
    public PredicateMap getPredicateMap(String boltId, String userid) {
        String key = boltId + "_" + userid;

        Jedis jedis = pool.getResource();

        PredicateMap object = null;
        try {
            //restore
            String json = jedis.get(key);
            if (json != null && !"".equals(json)) {
                object = gson.fromJson(json, PredicateMap.class);
            } else {
                //object = new PredicateMap();
                object = null;
            }

        } catch (JedisException e) {
            //if something wrong happen, return it back to the pool
            if (null != jedis) {
                pool.returnBrokenResource(jedis);
                jedis = null;
            }
        } finally {
            ///it's important to return the Jedis instance to the pool once you've finished using it
            if (null != jedis) {
                pool.returnResource(jedis);
            }
        }

        return object;
    }

    public void removePredicateMap(String boltId, String userid) {
        String key = boltId + "_" + userid;

        Jedis jedis = pool.getResource();

        try {
            //restore
            Long del = jedis.del(key);

        } catch (JedisException e) {
            //if something wrong happen, return it back to the pool
            if (null != jedis) {
                pool.returnBrokenResource(jedis);
                jedis = null;
            }
        } finally {
            ///it's important to return the Jedis instance to the pool once you've finished using it
            if (null != jedis) {
                pool.returnResource(jedis);
            }
        }
    }

    /**
     * Add sets.
     */
    private void addSets() {
        //let us first add some data in our redis server using Redis SET.
        String key = "members";
        String member1 = "Sedarius";
        String member2 = "Richard";
        String member3 = "Joe";

        //get a jedis connection jedis connection pool
        Jedis jedis = pool.getResource();
        try {
            //save to redis
            jedis.sadd(key, member1, member2, member3);

            //after saving the data, lets retrieve them to be sure that it has really added in redis
            Set<String> members = jedis.smembers(key);
            for (String member : members) {
                System.out.println(member);
            }
        } catch (JedisException e) {
            //if something wrong happen, return it back to the pool
            if (null != jedis) {
                pool.returnBrokenResource(jedis);
                jedis = null;
            }
        } finally {
            ///it's important to return the Jedis instance to the pool once you've finished using it
            if (null != jedis) {
                pool.returnResource(jedis);
            }
        }
    }

    /**
     * Add hash.
     */
    private void addHash() {
        //add some values in Redis HASH
        String key = "javapointers";
        Map<String, String> map = new HashMap<>();
        map.put("name", "Java Pointers");
        map.put("domain", "www.javapointers.com");
        map.put("description", "Learn how to program in Java");

        Jedis jedis = pool.getResource();
        try {
            //save to redis
            jedis.hmset(key, map);

            //after saving the data, lets retrieve them to be sure that it has really added in redis
            Map<String, String> retrieveMap = jedis.hgetAll(key);
            for (String keyMap : retrieveMap.keySet()) {
                System.out.println(keyMap + " " + retrieveMap.get(keyMap));
            }

        } catch (JedisException e) {
            //if something wrong happen, return it back to the pool
            if (null != jedis) {
                pool.returnBrokenResource(jedis);
                jedis = null;
            }
        } finally {
            ///it's important to return the Jedis instance to the pool once you've finished using it
            if (null != jedis) {
                pool.returnResource(jedis);
            }
        }
    }
}
