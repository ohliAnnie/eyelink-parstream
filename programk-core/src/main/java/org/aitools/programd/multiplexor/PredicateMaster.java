/*
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version. You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */

package org.aitools.programd.multiplexor;

import org.aitools.programd.Core;
import org.aitools.programd.bot.Bot;
import org.aitools.programd.util.DeveloperError;
import org.aitools.programd.util.XMLKit;
import org.apache.log4j.Logger;

import java.util.ConcurrentModificationException;
import java.util.Iterator;
import java.util.Map;

/**
 * <p>
 * Maintains in-memory predicate values for userids. Every public set and get
 * method checks the size of the cache, and saves out part of it if it has
 * exceeded a configurable limit.
 * </p>
 * <p>
 * This currently has the defect that it doesn't choose intelligently which
 * userids' predicates to cache (it should do this for the ones who have not
 * been heard from the longest). The HashMap that contains the predicates (keyed
 * by userid) makes no guarantees about order. :-(
 * </p>
 *
 * @author <a href="mailto:noel@aitools.org">Noel Bush</a>
 * @since 4.1.4'
 */
public class PredicateMaster extends AbstractPredicateMaster {
    /**
     * The general Program D logger.
     */
    protected Logger logger;

    /**
     * Creates a new PredicateMaster with the given Core as its owner.
     *
     * @param coreOwner the Core that owns this PredicateMaster
     */
    public PredicateMaster(Core coreOwner) {
        super(coreOwner);
        this.logger = Logger.getLogger("programd");
    }

    /**
     * Sets a predicate <code>value</code> against a predicate
     * <code>name</code> for a given userid, and returns either the
     * <code>name</code> or the <code>value</code>, depending on the
     * predicate type.
     *
     * @param name   the predicate name
     * @param value  the predicate value
     * @param userid the userid
     * @param botid
     * @return the <code>name</code> or the <code>value</code>, depending
     * on the predicate type
     */
    @Override
    public String set(String name, String value, String userid, String botid) {
        // Get existing or new predicates map for userid.
        PredicateMap userPredicates = this.bots.getBot(botid).predicatesFor(userid);

        // Put the new value into the predicate.
        PredicateValue predicateValue = new PredicateValue(value);
        userPredicates.put(name, predicateValue);

        // Return the name or value.
        return nameOrValue(name, value, botid);
    }

    /**
     * Sets a <code>value</code> of an indexed predicate
     * <code>name</code> for a given <code>userid</code>, and returns
     * either the <code>name</code> or the <code>value</code>, depending on
     * the predicate type.
     *
     * @param name       the predicate name
     * @param index      the index at which to set the value
     * @param valueToSet the predicate value to set
     * @param userid     the userid
     * @param botid
     * @return the <code>name</code> or the <code>value</code>, depending
     * on the predicate type
     * <p/>
     * delete "synchronized"  @author sspark 2012.09.03 (ss.park@kt.com)
     */
    @Override
    public synchronized String set(String name, int index, String valueToSet, String userid, String botid) {
        // Get existing or new predicates map for userid.
        PredicateMap userPredicates = this.bots.getBot(botid).predicatesFor(userid);

        // Get, load or create the list of values.
        PredicateValue value = getLoadOrCreateMultivaluedPredicateValue(name, userPredicates, userid, botid);

        // Try to set the predicate value at the index.
        value.add(index, valueToSet);

        // Return the name or value.
        return nameOrValue(name, valueToSet, botid);
    }

    /**
     * Pushes a new <code>value</code> onto an indexed predicate <code>name</code>
     * for a given <code>userid</code>, and returns either the
     * <code>name</code> or the <code>value</code>, depending on the
     * predicate type.
     *
     * @param name     the predicate name
     * @param newValue the new predicate value
     * @param userid   the userid
     * @param botid
     * @return the <code>name</code> or the <code>value</code>, depending
     * on the predicate type
     * <p/>
     * delete "synchronized"   @author sspark 2012.09.03 (ss.park@kt.com)
     */
    @Override
    public synchronized String push(String name, String newValue, String userid, String botid) {
        // Get existing or new predicates map for userid.
        PredicateMap userPredicates = this.bots.getBot(botid).predicatesFor(userid);

        // Get, load or create the list of values.
        PredicateValue value = getLoadOrCreateMultivaluedPredicateValue(name, userPredicates, userid, botid);

        // Push the new value onto the indexed predicate list.
        value.push(XMLKit.removeMarkup(newValue));

        // Check the cache.
        //checkCacheAndSave(botid);
        // check the cache and remove
        checkCacheAndRemove();

        // Return the name or value.
        return nameOrValue(name, newValue, botid);
    }

    /**
     * Gets the predicate <code>value</code> associated with a
     * <code>name</code> for a given <code>userid</code>.
     *
     * @param name   the predicate name
     * @param userid the userid
     * @param botid
     * @return the <code>value</code> associated with the given
     * <code>name</code>, for the given <code>userid</code>
     * <p/>
     * delete "synchronized"  @author sspark 2012.09.03 (ss.park@kt.com)
     */
    @Override
    public synchronized String get(String name, String userid, String botid) {
        // Get existing or new predicates map for userid.
        PredicateMap userPredicates = this.bots.getBot(botid).predicatesFor(userid);

        // Try to get the predicate value from the cache.
        PredicateValue value;

        try {
            value = userPredicates.get(name);
        } catch (NoSuchPredicateException e) {
            String loadedValue;
            try {

                loadedValue = this.multiplexor.loadPredicate(name, userid, botid);

            } catch (NoSuchPredicateException ee) {
                // If not found, set and cache the best available default.
                loadedValue = bestAvailableDefault(name, botid);
            }

            // Cache it.
            userPredicates.put(name, new PredicateValue(loadedValue));

            // Return the loaded value.
            return loadedValue;
        }

        // Return the cached value.
        return value.getFirstValue();
    }

    /**
     * Gets the predicate <code>value</code> associated with a
     * <code>name</code> at a given <code>index</code> for a given
     * <code>userid</code>.
     *
     * @param name   the predicate name
     * @param index  the index
     * @param userid the userid
     * @param botid
     * @return the <code>value</code> associated with the given
     * <code>name</code> at the given <code>index</code>, for the
     * given <code>userid</code>
     * <p/>
     * delete "synchronized"  @author sspark 2012.09.03 (ss.park@kt.com)
     */
    @Override
    public synchronized String get(String name, int index, String userid, String botid) {
        // Get existing or new predicates map for userid.
        PredicateMap userPredicates = this.bots.getBot(botid).predicatesFor(userid);

        String result = null;

        // Get the list of values.
        PredicateValue value = null;

        try {
            value = getMultivaluedPredicateValue(name, userPredicates);
        } catch (NoSuchPredicateException e) {
            // No values cached; try loading.
            try {
                value = loadMultivaluedPredicateValue(name, userPredicates, userid, botid);
            } catch (NoSuchPredicateException ee) {
                // Still no list, so set and cache default.
                result = bestAvailableDefault(name, botid);
                userPredicates.put(name, result);
            }
        }

        if (value != null) {
            // The index may be invalid.
            try {
                // Get the value at index.
                result = value.get(index);
            } catch (IndexOutOfBoundsException e) {
                // Return the best available default.
                result = bestAvailableDefault(name, botid);
            }
        }

        // Return the value.
        return result;
    }

    /**
     * Checks the predicate cache, and saves out predicates if necessary.
     */
    private void checkCacheAndRemove() {

        cacheCount++;
        //this.logger.warn("Cache Count:" + cacheCount) ;
        if (cacheCount > this.cacheMax) {
            balanceCache();
            cacheCount = 0;
        }

    }

    /**
     * 현재 active 상태인 bot의 user의 predicate의 session time을 기준으로 cache에서 제거
     * 이때, core.xml의 환경 설정에 따라서 cache에서 제거되는 item들이 filesystem에 별도 저장 됨.
     */
    protected void balanceCache() {

        int saveItemCount = 0;
        Iterator<String> botItr = this.bots.keysIterator();
        while (botItr.hasNext()) {
            String botid = botItr.next();
            Bot bot = this.bots.getBot(botid);
            Map<String, PredicateMap> cache = bot.getPredicateCache();
            if (!cache.isEmpty()) {
                Iterator<String> userids = cache.keySet().iterator();

                while (userids.hasNext()) {
                    // Get a userid.
                    String userid = null;

                    try {
                        userid = userids.next();
                    } catch (ConcurrentModificationException e) {
                        throw new DeveloperError("Some problem with PredicateMaster design: ConcurrentModificationException in save() [1].", e);
                    }

                    // Get the cached predicates for this user.
                    PredicateMap userPredicates = cache.get(userid);

                    if ((System.currentTimeMillis() - userPredicates.getAccesstime()) > this.sessiontimeout) {
                        if (!this.useFilesystem) //remove from cache memory and do not save
                        {
                            try {
                                // Remove the userid from the cache.
                                userids.remove();
                                saveItemCount++;
                                //for debug
                                //this.logger.warn("Predicate map has been removed for :" + userid);

                            } catch (ConcurrentModificationException e) {
                                throw new DeveloperError("Some problem with PredicateMaster design: ConcurrentModificationException in save() [2].", e);
                            }
                        } else  //remove predicates from cache and save them to file system
                        {
                            for (String name : userPredicates.keySet()) {
                                try {
                                    PredicateValue value = userPredicates.get(name);
                                    saveItemCount = removeUserPredicate(saveItemCount, botid, userid, name, value);


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
                }

            }
            //for debug by sspark
            //this.logger.warn("The size of PredicateCacheMap(Bot:" + botid + ") is " + cache.size() + " and saveCount is  " + saveItemCount) ;
        }
    }
}