/*
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version. You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */

package org.aitools.programd.multiplexor;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.aitools.programd.Core;
import org.aitools.programd.util.XMLKit;
import org.apache.log4j.Logger;

import com.google.gson.Gson;
import com.kt.programk.common.data.repository.Repository;
import com.kt.programk.common.db.domain.PredicateDTO;
import com.kt.programk.common.exception.ApplicationException;

/**
 * S.J.H 1. redis에서 predicates를 조회한다. 2. 1에 없다면 데이터 베이스에서 조회한다.
 */
public class PredicateMasterRedis extends AbstractPredicateMaster {
	/**
	 * The general Program D logger.
	 */
	protected Logger logger;

	/**
	 * redis 연동 인터페이스
	 */
	private Repository predicateRepository;

	/**
	 * The Gson.
	 */
	private final Gson gson = new Gson();

	/**
	 * Creates a new PredicateMaster with the given Core as its owner.
	 *
	 * @param coreOwner
	 *            the Core that owns this PredicateMaster
	 * @param predicateRepository
	 *            the predicate repository
	 */
	public PredicateMasterRedis(Core coreOwner, Repository predicateRepository) {
		super(coreOwner);
		this.logger = Logger.getLogger("programd");
		this.predicateRepository = predicateRepository;
	}

	/**
	 * Sets a predicate <code>value</code> against a predicate <code>name</code>
	 * for a given userid, and returns either the <code>name</code> or the
	 * <code>value</code>, depending on the predicate type.
	 *
	 * @param name
	 *            the predicate name
	 * @param value
	 *            the predicate value
	 * @param userid
	 *            the userid
	 * @param botid
	 *            the botid
	 * @return the <code>name</code> or the <code>value</code>, depending on the
	 *         predicate type
	 */
	@Override
	public String set(String name, String value, String userid, String botid) {
		// Get existing or new predicates map for userid.
		PredicateMap userPredicates = null;
		try {
			userPredicates = getPredicateMap(userid, botid);
		} catch (ApplicationException e) {
			e.printStackTrace();
		}

		// Put the new value into the predicate.
		putUserPredicates(botid, userid, name, value, userPredicates);

		// Return the name or value.
		return nameOrValue(name, value, botid);
	}

	/**
	 * Sets a <code>value</code> of an indexed predicate <code>name</code> for a
	 * given <code>userid</code>, and returns either the <code>name</code> or
	 * the <code>value</code>, depending on the predicate type.
	 *
	 * @param name
	 *            the predicate name
	 * @param index
	 *            the index at which to set the value
	 * @param valueToSet
	 *            the predicate value to set
	 * @param userid
	 *            the userid
	 * @param botid
	 *            the botid
	 * @return the <code>name</code> or the <code>value</code>, depending on the
	 *         predicate type
	 *         <p/>
	 *         delete "synchronized" @author sspark 2012.09.03 (ss.park@kt.com)
	 */
	@Override
	public String set(String name, int index, String valueToSet, String userid, String botid) {
		// Get existing or new predicates map for userid.
		PredicateMap userPredicates = null;
		try {
			userPredicates = getPredicateMap(userid, botid);
		} catch (ApplicationException e) {
			e.printStackTrace();
		}

		// Get, load or create the list of values.
		PredicateValue value = getLoadOrCreateMultivaluedPredicateValue(name, userPredicates, userid, botid);

		// Try to set the predicate value at the index.
		value.add(index, valueToSet);

		// Return the name or value.
		return nameOrValue(name, valueToSet, botid);
	}

	/**
	 * Pushes a new <code>value</code> onto an indexed predicate
	 * <code>name</code> for a given <code>userid</code>, and returns either the
	 * <code>name</code> or the <code>value</code>, depending on the predicate
	 * type.
	 *
	 * @param name
	 *            the predicate name
	 * @param newValue
	 *            the new predicate value
	 * @param userid
	 *            the userid
	 * @param botid
	 *            the botid
	 * @return the <code>name</code> or the <code>value</code>, depending on the
	 *         predicate type
	 *         <p/>
	 *         delete "synchronized" @author sspark 2012.09.03 (ss.park@kt.com)
	 */
	@Override
	public String push(String name, String newValue, String userid, String botid) {
		// Get existing or new predicates map for userid.
		PredicateMap userPredicates = null;
		try {
			userPredicates = getPredicateMap(userid, botid);
		} catch (ApplicationException e) {
			e.printStackTrace();
		}

		// Get, load or create the list of values.
		PredicateValue value = getLoadOrCreateMultivaluedPredicateValue(name, userPredicates, userid, botid);

		// Push the new value onto the indexed predicate list.
		value.push(XMLKit.removeMarkup(newValue));

		/**
		 * 2015-05-26 S.J.H redis expire로 대체
		 */
		syncRedis(botid, userid, userPredicates);

		// Return the name or value.
		return nameOrValue(name, newValue, botid);
	}

	/**
	 * S.J.H 사용하지 않음 부모 클래스는 전체 캐시 개수를 500개로 제한 되어 있으나 메모리 캐시는 사용자 당 N개로 제한
	 *
	 * @param name
	 *            the name
	 * @param userid
	 *            the userid
	 * @param botid
	 *            the botid
	 * @param userPredicates
	 *            the user predicates
	 */
	private void checkCacheAndRemove(String name, String userid, String botid, PredicateMap userPredicates) {

		if ((System.currentTimeMillis() - userPredicates.getAccesstime()) > this.sessiontimeout) {
			try {
				balanceCache(userid, botid, userPredicates);
			} catch (NoSuchPredicateException e) {
				logger.error("balanceCache is error", e);
			}
		}
	}

	/**
	 * S.J.H 사용하지 않음 사용자의 오래된 predicate를 제거한다.
	 *
	 * @param userid
	 *            the userid
	 * @param botid
	 *            the botid
	 * @param userPredicates
	 *            the user predicates
	 * @throws NoSuchPredicateException
	 *             the no such predicate exception
	 */
	private void balanceCache(String userid, String botid, PredicateMap userPredicates)
			throws NoSuchPredicateException {
		int saveItemCount = 0;
		for (String name : userPredicates.keySet()) {
			PredicateValue value = userPredicates.get(name);
			saveItemCount = removeUserPredicate(saveItemCount, botid, userid, name, value);
		}

		logger.info("save database count is " + saveItemCount);
	}

	/**
	 * Gets the predicate <code>value</code> associated with a <code>name</code>
	 * for a given <code>userid</code>.
	 *
	 * @param name
	 *            the predicate name
	 * @param userid
	 *            the userid
	 * @param botid
	 *            the botid
	 * @return the <code>value</code> associated with the given
	 *         <code>name</code>, for the given <code>userid</code>
	 *         <p/>
	 *         delete "synchronized" @author sspark 2012.09.03 (ss.park@kt.com)
	 */
	@Override
	public String get(String name, String userid, String botid) {

		// Get existing or new predicates map for userid.
		PredicateMap userPredicates = null;
		try {
			userPredicates = getPredicateMap(userid, botid);
		} catch (ApplicationException e1) {
			e1.printStackTrace();
		}

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
			putUserPredicates(botid, userid, name, loadedValue, userPredicates);

			// Return the loaded value.
			return loadedValue;
		}

		// Return the cached value.
		return value.getFirstValue();
	}

	/**
	 * Gets the predicate <code>value</code> associated with a <code>name</code>
	 * at a given <code>index</code> for a given <code>userid</code>.
	 *
	 * @param name
	 *            the predicate name
	 * @param index
	 *            the index
	 * @param userid
	 *            the userid
	 * @param botid
	 *            the botid
	 * @return the <code>value</code> associated with the given
	 *         <code>name</code> at the given <code>index</code>, for the given
	 *         <code>userid</code>
	 *         <p/>
	 *         delete "synchronized" @author sspark 2012.09.03 (ss.park@kt.com)
	 */
	@Override
	public String get(String name, int index, String userid, String botid) {
		// Get existing or new predicates map for userid.
		PredicateMap userPredicates = null;
		try {
			userPredicates = getPredicateMap(userid, botid);
		} catch (ApplicationException e1) {
			e1.printStackTrace();
		}

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
				putUserPredicates(botid, userid, name, userPredicates, result);
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
	 * Gets predicate map.
	 *
	 * @param userid
	 *            the userid
	 * @param botid
	 *            the botid
	 * @return the predicate map
	 * @throws ApplicationException
	 */
	private PredicateMap getPredicateMap(String userid, String botid) throws ApplicationException {
		/**
		 * 2016.08.11 S.J.H synchronized 문제를 해결하기 위해 redis에서 조회
		 */
		PredicateDTO dto = new PredicateDTO();
		// botid에서 -01,-02 문자를 제거한다.
		dto.setBotid(findBotid(botid));
		dto.setUserid(userid);

		PredicateDTO predicateDTO = (PredicateDTO) predicateRepository.get(dto);
		PredicateMap redisMap = null;

		if (predicateDTO != null && predicateDTO.getPredicateMap() != null) {
			redisMap = gson.fromJson(predicateDTO.getPredicateMap(), PredicateMap.class);
		} else {
			redisMap = new PredicateMap();
		}
		/**
		 * 2016.11.04 preludio 사용자 계정을 predicate에 담도록 한다.
		 */
		redisMap.put("userid", userid);

		return redisMap;
	}

	/**
	 * S.J.H -01,-02 문자를 찾으면 제거해서 리턴하고 못찾으면 원래 문자를 리턴한다.
	 * 
	 * @param botid
	 * @return
	 */
	public static String findBotid(String botid) {
		String botRegex = "(?>(^.*?)-(01|02))";
		Pattern pattern = Pattern.compile(botRegex);
		Matcher matcher = pattern.matcher(botid);

		String removeString = null;
		if (matcher.matches()) {
			removeString = matcher.group(1);
			return removeString;
		} else {
			return botid;
		}
	}

	/**
	 * Put user predicates.
	 *
	 * @param botid
	 *            the botid
	 * @param userid
	 *            the userid
	 * @param name
	 *            the name
	 * @param value
	 *            the value
	 * @param userPredicates
	 *            the user predicates
	 */
	private void putUserPredicates(String botid, String userid, String name, String value,
			PredicateMap userPredicates) {
		userPredicates.put(name, new PredicateValue(value));
		syncRedis(botid, userid, userPredicates);
	}

	/**
	 * Put user predicates.
	 *
	 * @param botid
	 *            the botid
	 * @param userid
	 *            the userid
	 * @param name
	 *            the name
	 * @param userPredicates
	 *            the user predicates
	 * @param result
	 *            the result
	 */
	private void putUserPredicates(String botid, String userid, String name, PredicateMap userPredicates,
			String result) {
		userPredicates.put(name, result);
		syncRedis(botid, userid, userPredicates);
	}

	/**
	 * Put user predicates.
	 *
	 * @param botid
	 *            the botid
	 * @param userid
	 *            the userid
	 * @param name
	 *            the name
	 * @param userPredicates
	 *            the user predicates
	 * @param value
	 *            the value
	 */
	@Override
	protected void putUserPredicates(String botid, String userid, String name, PredicateMap userPredicates,
			PredicateValue value) {
		userPredicates.put(name, value);
		syncRedis(botid, userid, userPredicates);
	}

	/**
	 * Sync redis.
	 *
	 * @param botid
	 *            the botid
	 * @param userid
	 *            the userid
	 * @param userPredicates
	 *            the user predicates
	 */
	private void syncRedis(String botid, String userid, PredicateMap userPredicates) {
		PredicateDTO dto = new PredicateDTO();
		dto.setBotid(findBotid(botid));
		dto.setUserid(userid);
		dto.setPredicateMap(gson.toJson(userPredicates));
		int result = 2;
		int count = 0;
		// 응답이 2라면 키 중복으로 재시도
		while (result == 2) {
			result = predicateRepository.put(dto);
			if (result != 2)
				break;
			count++;
			if (count == 10){
				logger.warn("DuplicateKey!!! Fail");
				break;
			}
		}

	}
}