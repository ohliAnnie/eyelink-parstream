package m2u.eyelink.aibot.component;

import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.ehcache.Cache;
import org.ehcache.CacheManager;
import org.ehcache.config.builders.CacheConfigurationBuilder;
import org.ehcache.config.builders.CacheManagerBuilder;
import org.ehcache.config.builders.ResourcePoolsBuilder;
import org.ehcache.expiry.Duration;
import org.ehcache.expiry.Expirations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import m2u.eyelink.aibot.IConstants;
import m2u.eyelink.aibot.domain.MessageIn;
import m2u.eyelink.aibot.domain.UserAuth;
import m2u.eyelink.aibot.mapper.UserAuthMapper;
import m2u.eyelink.aibot.utils.DateUtils;

@Component
public class UserAuthManager {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	UserAuthMapper userAuthMapper;
	@Autowired
	private Config config;
	
	private final int authStatusDone = 4;
	
	private CacheManager cacheManager;
	private Cache<String, UserAuth> cache;

	private void initCache() {
		cacheManager = CacheManagerBuilder.newCacheManagerBuilder()
				.withCache(IConstants.Auth.CACHE_NAME,
						CacheConfigurationBuilder.newCacheConfigurationBuilder(
								String.class, UserAuth.class, ResourcePoolsBuilder.heap(
										Integer.valueOf(
												config.getConfigs()
												.get(IConstants.Configs.Keys.HEAP_SIZE))))
						.withExpiry(Expirations.timeToIdleExpiration(Duration.of(Integer.valueOf(config.getConfigs().get(IConstants.Configs.Keys.CACHE_TTI)), TimeUnit.MINUTES)))
						)
				.build();
		cacheManager.init();
		cache = cacheManager.getCache(IConstants.Auth.CACHE_NAME, String.class, UserAuth.class);
		
	}
	
	public UserAuth authenticateUser(MessageIn messageIn) {
		if ( cache == null ) {
			initCache();
		}
			
		final String userKey = messageIn.getUser_key();
		
		UserAuth userAuth = cache.get(userKey);
		if ( userAuth == null ) {
			logger.debug("No cache exists for user : {}", userKey);
			UserAuth ua = new UserAuth(userKey);
			UserAuth selected = userAuthMapper.select(ua);
			if (selected == null) {
				logger.debug("새 사용자 추가");
				String dfltDttm = DateUtils.instance.getDefaultDttm(IConstants.DateFormat.DTTM_19);
				ua.setLastAuthDttm(dfltDttm);
				ua.setLastTalkDttm(dfltDttm);
				userAuthMapper.insert(ua);
				selected = ua;
			}
			userAuth = selected;
		}
		
		if (!isAuthenticated(userAuth)) {
			
			if (!isAuthProcessing(userAuth)) {
				logger.debug("Starting new authentication process for user : {}", userKey);
				userAuth.setStatus(1);
				cache.put(userKey, userAuth);
			} else {

				int userAuthStatus = userAuth.getStatus() + 1;

				logger.debug("Continuing authentication process for user {} with status code {}", userKey,
						userAuthStatus);

				switch (userAuthStatus) {
				case 2:
					userAuth.setUserName(messageIn.getContent());
					userAuth.setStatus(2);
					
					messageIn.setContent(makeItSecret(userAuthStatus, messageIn.getContent()));
					break;
				case 3:
					userAuth.setEmpId(messageIn.getContent());
					messageIn.setContent(makeItSecret(userAuthStatus, messageIn.getContent()));
					
					String authResult = callGSAuth(userAuth);

					if (userKey.equals(authResult)) {
						// 성공일 경우 마지막 인증 시간 업데이트
						logger.debug("Successful authentication process for user : {}", userKey);
						userAuth.setLastAuthDttm(DateUtils.instance.getCurrentDttm(null));
						userAuth.setStatus(authStatusDone);
						updateLastAuthDttm(userAuth);
					} else {
						// 실패일 경우
						logger.debug("Failed authentication process for user : {}", userKey);
						userAuth.setStatus(1);
					}
					break;
				default:
					break;
				}
			}
		}else {
			userAuth.setStatus(authStatusDone);
		}
		return userAuth;
	}

	private boolean isAuthenticated(UserAuth userAuth) {

		logger.debug("Check if the user {} is authenticated.", userAuth.getUserKey());

		// 마지막 인증 후 일주일 단위 인증
		if (hasPastAuthPeriod(userAuth)) {
			// 마지막 대화 시간 검사
			if (hasPastDelayPeriod(userAuth)) {
				return false;
			}
		}
		return true;
	}

	private boolean isAuthProcessing(UserAuth userAuth) {
		
		logger.debug("Checking auth process status.....");
		
		int status = userAuth.getStatus();
		
		if ( status != authStatusDone && status != 0 ) {
			logger.debug("Authentication is still in process for user : {}", userAuth.getUserKey());
			return true;
		}
		logger.debug("Authentication is not in process for user : {}", userAuth.getUserKey());
		return false;
	}
	
	private boolean hasPastDelayPeriod(UserAuth userAuth) {

		logger.debug("마지막 대화 시간 검증...");

		int delayMinutes = Integer.valueOf(config.getConfigs().get(IConstants.Configs.Keys.AUTH_DELAY));
		if (DateUtils.instance.minutesPassed(userAuth.getLastTalkDttm(), delayMinutes) > 0) {
			logger.debug("마지막 대화 이후 {}분 이상 경과함. {}", delayMinutes, userAuth.getLastTalkDttm());
			return true;
		}
		logger.debug("마지막 대화 이후 {}분 이내임. {}", delayMinutes, userAuth.getLastTalkDttm());
		return false;
	}

	private boolean hasPastAuthPeriod(UserAuth userAuth) {

		logger.debug("마지막 인증일 검증...");

		int delayDays = Integer.valueOf(config.getConfigs().get(IConstants.Configs.Keys.AUTH_DAYS));

		if ( delayDays > 0 ) {
			if (DateUtils.instance.daysPassed(userAuth.getLastAuthDttm(), delayDays) > 0) {
				logger.debug("마지막 인증 후 {}일 이상 경과함. 마지막 인증 일시 : {}", delayDays, userAuth.getLastAuthDttm());
				return true;
			}
			logger.debug("마지막 인증 후 {}일 이내임. 마지막 인증 일시 : {}", delayDays, userAuth.getLastAuthDttm());
		} else {
			if (DateUtils.instance.minutesPassed(userAuth.getLastAuthDttm(), IConstants.Auth.Test.MINUTES) > 0) {
				logger.debug("마지막 인증 후 {}분 이상 경과함. 마지막 인증 일시 : {}", IConstants.Auth.Test.MINUTES, userAuth.getLastAuthDttm());
				return true;
			}
			logger.debug("마지막 인증 후 {}분 이내임. 마지막 인증 일시 : {}", IConstants.Auth.Test.MINUTES, userAuth.getLastAuthDttm());
		}
		return false;
	}

	public void checkUpdateLastTalkDttm(UserAuth userAuth) {
		
		String lastTalkDttm = DateUtils.instance.getCurrentDttm(null);

		if ( userAuth.getStatus() == authStatusDone ) {
			logger.debug("Setting new last talk dttm for user : {}", userAuth.getUserKey());
			userAuth.setLastTalkDttm(lastTalkDttm);
			updateLastTalkDttm(userAuth);
		}
	}

	private String callGSAuth(UserAuth userAuth) {

		logger.debug("Calling GS User Auth API for user : {}", userAuth.getUserKey());
		
		// TODO : GS 사용자 인증 API 호출 및 결과 return
		
		// Test logic
		if ( userAuth.getEmpId() == null || userAuth.getUserName() == null ) {
			return null;
		}
		//------------------------------------------
		// TODO : delete
		Random r = new Random();
		if ( r.nextBoolean() ) {
			System.out.println("Returning NULL !!!!! ");
			return null;
		}		
		return userAuth.getUserKey();
	}
	
	private int updateLastAuthDttm(UserAuth userAuth) {
		logger.debug("Updating last auth dttm for user : {}", userAuth);
		String currentDttm = DateUtils.instance.getCurrentDttm(IConstants.DateFormat.DTTM_19);
		userAuth.setLastAuthDttm(currentDttm);
		return userAuthMapper.update(userAuth);
	}

	private int updateLastTalkDttm(UserAuth userAuth) {
		logger.debug("Updating last talk dttm for user : {}", userAuth);
		String currentDttm = DateUtils.instance.getCurrentDttm(IConstants.DateFormat.DTTM_19);
		userAuth.setLastTalkDttm(currentDttm);
		return userAuthMapper.update(userAuth);
	}
	public void remove(String user_key) {
		cache.remove(user_key);
	}
	private String makeItSecret(int status, String content) {
		String show = null;
		String secret = null;
		if ( status == 2 ) {
			show = content.substring(0, 1);
			secret = content.substring(1).replaceAll(".", "*");
		}else if ( status == 3 ) {
			show = content.substring(0, 3);
			secret = content.substring(3).replaceAll(".", "*");
		}
		return show + secret;
	}
}
