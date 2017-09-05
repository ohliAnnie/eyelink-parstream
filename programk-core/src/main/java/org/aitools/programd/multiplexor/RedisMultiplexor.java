package org.aitools.programd.multiplexor;

import com.google.gson.Gson;
import org.aitools.programd.Core;
import org.aitools.programd.CoreSettings;
import org.aitools.programd.util.DeveloperError;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.exceptions.JedisException;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

/**
 * Created by Administrator on 2016-05-04.
 */
public class RedisMultiplexor extends Multiplexor {
    /**
     * The constant redisHost.
     */
    private static final String redisHost = "localhost";
    /**
     * The constant redisPort.
     */
    private static final Integer redisPort = 6379;

    /**
     * The constant pool.
     */
    private static JedisPool pool = null;

    /**
     * The constant ENC_UTF8.
     */
    private static final String ENC_UTF8 = "UTF-8";

    /**
     * The Gson.
     */
    private Gson gson = new Gson();

    /**
     * Constructs the Multiplexor, using some values taken from the Core
     * object's settings. Note that the {@link #predicateMaster} is <i>not</i>
     * initialized -- it must be {@link #attach}ed subsequently.
     *
     * @param owner the Core that owns this Multiplexor
     */
    public RedisMultiplexor(Core owner) {
        super(owner);
    }

    /**
     * Initialize.
     */
    @Override
    public void initialize() {
        CoreSettings coreSettings = this.core.getSettings();
        pool = new JedisPool(redisHost, redisPort);
    }

    /**
     * Save predicate.
     *
     * @param name   the name
     * @param value  the value
     * @param userid the userid
     * @param botid  the botid
     */
    @Override
    public void savePredicate(String name, String value, String userid, String botid) {
        String encodedValue;
        try {
            encodedValue = URLEncoder.encode(value.trim(), ENC_UTF8);
        } catch (UnsupportedEncodingException e) {
            throw new DeveloperError("This platform does not support UTF-8!", e);
        }

        String key = botid + "_" + userid  + "_" + name;

        Jedis jedis = pool.getResource();

        try {
            //save to redis
            jedis.set(key, encodedValue);

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
     * Load predicate string.
     *
     * @param name   the name
     * @param userid the userid
     * @param botid  the botid
     * @return the string
     * @throws NoSuchPredicateException the no such predicate exception
     */
    @Override
    public String loadPredicate(String name, String userid, String botid) throws NoSuchPredicateException {
        String key = botid + "_" + userid  + "_" + name;

        Jedis jedis = pool.getResource();

        String object = null;
        try {
           object = jedis.get(key);

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

        if (object == null) {
            throw new NoSuchPredicateException(name);
        }

        // If found, return it (don't forget to decode!).
        try {
            return URLDecoder.decode(object, ENC_UTF8);
        } catch (UnsupportedEncodingException e) {
            throw new DeveloperError("This platform does not support UTF-8!", e);
        }
    }

    /**
     * Check user boolean.
     *
     * @param userid   the userid
     * @param password the password
     * @param botid    the botid
     * @return the boolean
     */
    @Override
    public boolean checkUser(String userid, String password, String botid) {
        return false;
    }

    /**
     * Create user.
     *
     * @param userid   the userid
     * @param password the password
     * @param botid    the botid
     * @throws DuplicateUserIDError the duplicate user id error
     */
    @Override
    public void createUser(String userid, String password, String botid) throws DuplicateUserIDError {

    }

    /**
     * Change password boolean.
     *
     * @param userid   the userid
     * @param password the password
     * @param botid    the botid
     * @return the boolean
     */
    @Override
    public boolean changePassword(String userid, String password, String botid) {
        return false;
    }

    /**
     * Userid count int.
     *
     * @param botid the botid
     * @return the int
     */
    @Override
    public int useridCount(String botid) {
        return 0;
    }
}
