

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

package org.aitools.programd.multiplexor;

import org.aitools.programd.Core;
import org.aitools.programd.CoreSettings;
import org.aitools.programd.bot.Bot;
import org.aitools.programd.bot.Bots;
import org.aitools.programd.util.DeveloperError;
import org.apache.log4j.Logger;

import java.util.ArrayList;
import java.util.ConcurrentModificationException;
import java.util.Iterator;
import java.util.Map;

/**
 * 로컬 또는 메모리 캐시의 predicateMap을 관리하는 추상 클래스
 */
public abstract class AbstractPredicateMaster {
    /**
     * The Logger.
     */
    protected Logger logger;

    /**
     * userid 마다 가질수 있는 캐시 개수
     */
    protected int cacheMax;

    /**
     * The preferred minimum value for the cache (starts at half of
     * {@link #cacheMax}, may be adjusted).
     */
    protected int cacheMin;

    /**
     * A counter for tracking the number of predicate value cache operations.
     */
    protected static int cacheSize = 0;

    /**
     * The predicate empty default.
     */
    protected String predicateEmptyDefault;

    /**
     * The Core that owns this.
     */
    protected Core core;

    /**
     * 캐시에 데이터가 없을 경우 파일 또는 데이터 베이스에서 predicate를 조회
     */
    protected Multiplexor multiplexor;

    /**
     * The Bots object in use.
     */
    protected Bots bots;

    /**
     * Maximum index of indexed predicates.
     */
    public static final int MAX_INDEX = 5;

    /**
     * Default 90
     */
    protected long sessiontimeout;

    /**
     * The Use filesystem.
     */
    protected boolean useFilesystem;

    /**
     * The constant cacheCount.
     */
    protected static int cacheCount = 0;

    /**
     * Instantiates a new Abstract predicate master.
     *
     * @param coreOwner the core owner
     */
    public AbstractPredicateMaster(Core coreOwner) {
        this.core = coreOwner;
        this.bots = this.core.getBots();
        CoreSettings coreSettings = this.core.getSettings();
        this.multiplexor = this.core.getMultiplexor();
        this.predicateEmptyDefault = coreSettings.getPredicateEmptyDefault();
        this.cacheMax = coreSettings.getPredicateCacheMax();
        this.sessiontimeout = coreSettings.getCachetimeout();
        this.useFilesystem = coreSettings.getUseFilesystem();
        this.cacheMin = Math.max(this.cacheMax / 3, 1);
        this.logger = Logger.getLogger("programd");
    }

    /**
     * Set string.
     *
     * @param name   the name
     * @param value  the value
     * @param userid the userid
     * @param botid  the botid
     * @return string
     */
    public abstract String set(String name, String value, String userid, String botid);

    /**
     * Set string.
     *
     * @param name       the name
     * @param index      the index
     * @param valueToSet the value to set
     * @param userid     the userid
     * @param botid      the botid
     * @return string
     */
    public abstract String set(String name, int index, String valueToSet, String userid, String botid);

    /**
     * Push string.
     *
     * @param name     the name
     * @param newValue the new value
     * @param userid   the userid
     * @param botid    the botid
     * @return string
     */
    public abstract String push(String name, String newValue, String userid, String botid);

    /**
     * Get string.
     *
     * @param name   the name
     * @param userid the userid
     * @param botid  the botid
     * @return string
     */
    public abstract String get(String name, String userid, String botid);

    /**
     * Get string.
     *
     * @param name   the name
     * @param index  the index
     * @param userid the userid
     * @param botid  the botid
     * @return string
     */
    public abstract String get(String name, int index, String userid, String botid);

    /**
     * Returns, from the cache, an ArrayList of values assigned to a
     * <code>name</code> for a predicate for a <code>userid</code>. If the
     * <code>name</code> exists in a predicate for the <code>userid</code>
     * but it is not indexed, it is converted into an indexed value. If it does
     * not exist at all, a <code>NoSuchPredicateException</code> is thrown.
     *
     * @param name           the name of the predicate
     * @param userPredicates the existing map of predicates
     * @return a list of values assigned to a <code>name</code> for a predicate for a <code>userid</code>
     * @throws NoSuchPredicateException the no such predicate exception
     */
    protected static PredicateValue getMultivaluedPredicateValue(String name, PredicateMap userPredicates) throws NoSuchPredicateException {
        if (userPredicates.size() > 0 && userPredicates.containsKey(name)) {
            return userPredicates.get(name).becomeMultiValued();
        }
        // If the predicate is not found, throw an exception.
        throw new NoSuchPredicateException(name);

    }

    /**
     * 메모리 캐시 또는 파일에서 존재하지 않을때 메모리 캐시에서 조회한다.
     *
     * @param name           the predicate <code>name</code>
     * @param userPredicates the user predicates (must not be null!)
     * @param userid         the userid
     * @param botid          the botid
     * @return an ArrayList of values assigned to a <code>name</code> for a predicate for a <code>userid</code>
     * @throws NoSuchPredicateException the no such predicate exception
     * @throws NullPointerException     if <code>userPredicates</code> is null
     */
    protected PredicateValue loadMultivaluedPredicateValue(String name, PredicateMap userPredicates, String userid, String botid)
            throws NoSuchPredicateException, NullPointerException {
        // Prevent this from being called with a null predicates map.
        if (userPredicates == null) {
            throw new NullPointerException("Cannot call loadValueList with null userPredicates!");
        }

        // Try to load the predicate as an indexed predicate.
        int index = 1;
        String loadedValue;
        try {
            loadedValue = this.multiplexor.loadPredicate(name + '.' + index, userid, botid);
        } catch (NoSuchPredicateException e) {
            throw new NoSuchPredicateException(name);
        }

        // If this succeeded, get/create the new values list in the predicates.
        if (!userPredicates.containsKey(name)) {
            //sspark
            //don't exist in current cache, so create new predicate and insert with default value
            PredicateValue value = new PredicateValue(bestAvailableDefault(name, botid));
            putUserPredicates(botid, userid, name, userPredicates, value);
        }

        PredicateValue value = userPredicates.get(name);

        // Add the first value that was found.
        value.add(loadedValue);  //insert at index=0

        // Now load as many more as possible up to MAX_INDEX.
        try {
            // This will either hit the limit, or throw an exception.
            while (index <= MAX_INDEX) {
                index++;
                value.add(index, this.multiplexor.loadPredicate(name + '.' + index, userid, botid));
            }
        } catch (NoSuchPredicateException e) {
            // Do nothing if the exception is thrown; that's fine (there is at
            // least one).
        }

        return value;
    }

    /**
     * programd에서는 로컬 캐시에 저장, 메모리 캐시는 redis에 저장 하도록 오버라이드 해야함.
     *
     * @param botid
     * @param userid
     * @param name
     * @param userPredicates
     * @param value
     */
    protected void putUserPredicates(String botid, String userid, String name, PredicateMap userPredicates, PredicateValue value) {
        userPredicates.put(name, value);
    }

    /**
     * Returns a value list one way or another: first tries to get it from the
     * cache, then tries to load it from the ActiveMultiplexor; finally creates
     * a new one if the preceding failed.
     *
     * @param name           the predicate <code>name</code>
     * @param userPredicates the user predicates map
     * @param userid         the userid for which to return the value list
     * @param botid          the botid for which to return the value list
     * @return a multi-valued <code>PredicateValue</code> from <code>userPredicates</code> for <code>name</code> for <code>userid</code>
     */
    protected PredicateValue getLoadOrCreateMultivaluedPredicateValue(String name, PredicateMap userPredicates, String userid, String botid) {
        PredicateValue value;

        try {
            value = getMultivaluedPredicateValue(name, userPredicates);
        } catch (NoSuchPredicateException e) {
            // No list found in cache; try load.
            try {
                value = loadMultivaluedPredicateValue(name, userPredicates, userid, botid);
            } catch (NoSuchPredicateException ee) {
                // Still no list, so create new one.
                value = new PredicateValue(this.predicateEmptyDefault).becomeMultiValued();
                putUserPredicates(botid, userid, name, userPredicates, value);
            }
        }
        return value;
    }

    /**
     * Returns the best available default predicate <code>value</code> for a
     * predicate <code>name</code>
     *
     * @param name  the predicate name
     * @param botid the botid
     * @return the best available default predicate
     */
    protected String bestAvailableDefault(String name, String botid) {
        Map<String, PredicateInfo> predicatesInfo = this.bots.getBot(botid).getPredicatesInfo();

        // There may be an individual default defined.
        if (predicatesInfo.containsKey(name)) {
            return predicatesInfo.get(name).getDefaultValue();
        }
        // If not, return the global empty default.
        return this.predicateEmptyDefault;
    }

    /**
     * Returns the name or value of a predicate, depending on whether or not it
     * is &quot;return-name-when-set&quot;.
     *
     * @param name  the predicate name
     * @param value the predicate value
     * @param botid the botid
     * @return the appropriate result (name or value depending on predicate settings)
     */
    protected String nameOrValue(String name, String value, String botid) {
        Map<String, PredicateInfo> predicatesInfo = this.bots.getBot(botid).getPredicatesInfo();

        // Check if any info is known about this predicate.
        if (predicatesInfo.containsKey(name)) {
            // If so, find out whether to return its name or the value.
            if ((predicatesInfo.get(name)).returnNameWhenSet()) {
                return name;
            }
        }
        return value;
    }

    /**
     * Attempts to dump a given number of predicate values from the cache,
     * starting with the oldest userid first.
     * <p/>
     * <p/>
     * <p/>
     * TODO  2012.09.03  sspark (ss.park@kt.com)
     * - user의 predicate을 저장할 필요성 검토.
     * - user의 predicate의 관리 체계 방안 검토.
     * - user를 세션 기반 관리 및 세션 삭제시 user의 predicateMap도 삭제 등 고려
     *
     * @param botList  the bot list
     * @param minCount the min count
     * @return the int
     */
    protected int save(ArrayList<String> botList, int minCount) {
        int saveItemCount = 0;
        for (String botid : botList) {
            Bot bot = this.bots.getBot(botid);
            Map<String, PredicateMap> cache = bot.getPredicateCache();
            if (!cache.isEmpty()) {
                Iterator<String> userids = cache.keySet().iterator();

                while (userids.hasNext() && cache.size() >= minCount) {
                    // Get a userid.
                    String userid = null;

                    try {
                        userid = userids.next();
                    } catch (ConcurrentModificationException e) {
                        throw new DeveloperError("Some problem with PredicateMaster design: ConcurrentModificationException in save() [1].", e);
                    }

                    // Get the cached predicates for this user.
                    PredicateMap userPredicates = cache.get(userid);
                    // Iterate over all cached predicates and save them.
                    for (String name : userPredicates.keySet()) {
                        try {
                            PredicateValue value = userPredicates.get(name);

                            // Save single-valued predicates.
                            if (!value.isMultiValued()) {
                                String singleValue = value.getFirstValue();

                                // Do not save default values.
                                if (!singleValue.equals(bestAvailableDefault(name, botid))) {
                                    this.multiplexor.savePredicate(name, singleValue, userid, botid);
                                    saveItemCount++; //sspark
                                }
                            }
                            // Save indexed predicates.
                            else {
                                // Try to get this as an indexed predicate.
                                int valueCount = value.size();

                                for (int index = valueCount; --index > 0; ) {
                                    // Do not save default values.
                                    String aValue = value.get(index);
                                    if (!aValue.equals(bestAvailableDefault(name, botid))) {
                                        this.multiplexor.savePredicate(name + '.' + index, aValue, userid, botid);
                                        saveItemCount++;
                                    }
                                        /* Increment the saveCount regardless of whether the value is the default,
                                         * to avoid the reported bug http://bugs.aitools.org/view.php?id=9
	                                     */
                                }
                            }
                        } catch (NoSuchPredicateException e) {
                            throw new DeveloperError("Asked to store a predicate with no value!", new NullPointerException());
                        }
                    }
                    try {
                        // Remove the userid from the cache.
                        userids.remove();
                    } catch (ConcurrentModificationException e) {
                        throw new DeveloperError("Some problem with PredicateMaster design: ConcurrentModificationException in save() [2].", e);
                    }

                }

            }
            //for debug by sspark
            this.logger.info("The size of PredicateCacheMap(Bot:" + botid + ") is " + cache.size() + " and saveCount is  " + saveItemCount);
        }

        return saveItemCount;
    }

    /**
     * Checks the predicate cache, and saves out predicates if necessary.
     * 사용하지 않음
     * @param botid the botid
     */
    protected void checkCacheAndSave(String botid) {
        ArrayList<String> botList;
        Bot bot = this.bots.getBot(botid);
        int botCacheSize = bot.getPredicateCache().size();
        //bot의 cache의 수를 계산..cache는 userid 기반.
        if (botCacheSize > this.cacheMax) {
            botList = new ArrayList<String>();
            botList.add(botid);
            logger.warn("Cache Size: " + botCacheSize);
            save(botList, this.cacheMin);
        }

    }

    /**
     * 캐시에서 삭제하고 데이터 베이스에 저장
     * @param saveItemCount
     * @param botid
     * @param userid
     * @param name
     * @param value
     * @return
     */
    protected int removeUserPredicate(int saveItemCount, String botid, String userid, String name, PredicateValue value) {
        // Save single-valued predicates.
        if (!value.isMultiValued()) {
            String singleValue = value.getFirstValue();

            // Do not save default values.
            if (!singleValue.equals(bestAvailableDefault(name, botid))) {
                this.multiplexor.savePredicate(name, singleValue, userid, botid);
                saveItemCount++; //sspark
            }
        }
        // Save indexed predicates.
        else {
            // Try to get this as an indexed predicate.
            int valueCount = value.size();

            for (int index = valueCount; --index > 0; ) {
                // Do not save default values.
                String aValue = value.get(index);
                if (!aValue.equals(bestAvailableDefault(name, botid))) {
                    this.multiplexor.savePredicate(name + '.' + index, aValue, userid, botid);
                    saveItemCount++;
                }
                /* Increment the saveCount regardless of whether the value is the default,
                 * to avoid the reported bug http://bugs.aitools.org/view.php?id=9
                 */
            }
        }
        return saveItemCount;
    }

    /**
     * Dumps the entire cache.
     */
    public void saveAll() {

        if (!this.useFilesystem) return;

        this.logger.info("PredicateMaster saving all cached predicates. ");
        Iterator<String> botsIterator = this.bots.keysIterator();
        ArrayList<String> botList = new ArrayList<String>();

        while (botsIterator.hasNext()) {
            botList.add(botsIterator.next());
        }

        save(botList, -1);
    }
}
