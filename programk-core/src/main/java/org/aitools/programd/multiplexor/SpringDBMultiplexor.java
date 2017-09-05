package org.aitools.programd.multiplexor;

import com.kt.programk.common.domain.core.AimlPredicate;
import com.kt.programk.common.repository.core.AimlPredicateMapper;
import org.aitools.programd.Core;
import org.aitools.programd.CoreSettings;
import org.aitools.programd.util.DeveloperError;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Srping  + Mybatis를 이용한 데이터베이스에서 조회
 * 데이터 베이스 커넥션은 JBOSS에 의해 관리
 */
public class SpringDBMultiplexor extends Multiplexor {

    /**
     * The Db logger.
     */
    private Logger dbLogger;

    /**
     * The User cache for bots.
     */
    private Map<String, Map<String, String>> userCacheForBots = new HashMap<String, Map<String, String>>();

    /**
     * The constant ENC_UTF8.
     */
    private static final String ENC_UTF8 = "UTF-8";

    /**
     * 마이바티스 매퍼
     */
    @Autowired
    protected AimlPredicateMapper aimlPredicateMapper;
    /**
     * Constructs the Multiplexor, using some values taken from the Core
     * object's settings. Note that the {@link #predicateMaster} is <i>not</i>
     * initialized -- it must be {@link #attach}ed subsequently.
     *
     * @param owner the Core that owns this Multiplexor
     */
    public SpringDBMultiplexor(Core owner) {
        super(owner);
        this.dbLogger = Logger.getLogger("programd");
    }

    /**
     * Initialize.
     */
    @Override
    public void initialize() {
        CoreSettings coreSettings = this.core.getSettings();
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

         /*
         * URLEncoder conveniently escapes things that would otherwise be
         * problematic.
         */
        String encodedValue;
        try {
            encodedValue = URLEncoder.encode(value.trim(), ENC_UTF8);
        } catch (UnsupportedEncodingException e) {
            throw new DeveloperError("This platform does not support UTF-8!", e);
        }

        try {
            AimlPredicate aimlPredicate = new AimlPredicate();
            aimlPredicate.setBotid(PredicateMasterRedis.findBotid(botid));
            aimlPredicate.setUserid(userid);
            aimlPredicate.setName(name);
            aimlPredicate.setVal(value);

            List<AimlPredicate> aimlPredicates = aimlPredicateMapper.selectList(aimlPredicate);

            if (aimlPredicates.size() > 0) {
                aimlPredicate.setVal(encodedValue);
                aimlPredicateMapper.updateByPrimaryKeySelective(aimlPredicate);
            } else {
                aimlPredicateMapper.insert(aimlPredicate);
            }
        } catch (DataAccessException e) {
            this.dbLogger.error("Database error: " + e);
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

        String result = null;

        try {
            AimlPredicate aimlPredicate = new AimlPredicate();
            aimlPredicate.setBotid(PredicateMasterRedis.findBotid(botid));
            aimlPredicate.setUserid(userid);
            aimlPredicate.setName(name);

            List<AimlPredicate> aimlPredicates = aimlPredicateMapper.selectList(aimlPredicate);

            if (aimlPredicates.size() > 0) {
                result = aimlPredicates.get(aimlPredicates.size() - 1).getVal();
            }

        } catch (DataAccessException e) {
            this.dbLogger.error("Database error: " + e);
            throw new NoSuchPredicateException(name);
        }
        if (result == null) {
            throw new NoSuchPredicateException(name);
        }
        // If found, return it (don't forget to decode!).
        try {
            return URLDecoder.decode(result, ENC_UTF8);
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
        /**
         * TODO 사용자 정보는 별도로 관리 하지 않음
         */
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
        /**
         * TODO 사용자 정보는 별도로 관리 하지 않음
         */
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
        /**
         * TODO 사용자 정보는 별도로 관리 하지 않음
         */
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
        /**
         * TODO 사용자 정보는 별도로 관리 하지 않음
         */
        return 0;
    }
}
