package m2u.eyelink.aibot.component;

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
	// TODO : session에 저장된 사용자 정보를 주기적으로 청소해줄 필요가 있음 (auth.days 주기로 하면 될 듯, ehcache 사용)
//	private final Map<String, UserAuth> session = new HashMap<>();
	
	private CacheManager cacheManager;
	private Cache<String, UserAuth> cache;
//	private final Configuration xmlConfig = new XmlConfiguration(getClass().getClassLoader().getResource("ehcache.xml"));

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
	public static void main(String[] args) throws InterruptedException {
		UserAuth ua = null;
		UserAuthManager uam = new UserAuthManager();
		
		String key1 = "1";
		
		System.out.println("Put user1");
		uam.cache.put(key1, new UserAuth("user1"));
		ua = uam.cache.get(key1);
		System.out.println(ua.toString());
//		System.out.println("Sleeping 5 seconds.");
//		Thread.sleep(5000);
		ua = uam.cache.get(key1);
		System.out.println(ua.toString());
//		System.out.println("Sleeping 11 seconds.");
//		Thread.sleep(11000);
//		ua = uam.cache.get(key1);
//		System.out.println(ua.toString());
		uam.cache.put("1", new UserAuth("1"));
		uam.cache.put("2", new UserAuth("2"));
		uam.cache.put("3", new UserAuth("3"));
		
		if ( uam.cache.get("1") == null ) System.out.println("1 is null");
		if ( uam.cache.get("2") == null ) System.out.println("2 is null");
		if ( uam.cache.get("3") == null ) System.out.println("3 is null");
	}
	
	public UserAuth authenticateUser(MessageIn messageIn) {
		if ( cache == null ) {
			initCache();
		}
			
		final String userKey = messageIn.getUser_key();
//		UserAuth userAuth = session.get(userKey);
		UserAuth userAuth = cache.get(userKey);

		if (!isAuthenticated(userKey)) {
			
			if (!isAuthProcessing(userKey)) {
				logger.debug("Starting new authentication process for user {}", userKey);
				userAuth = new UserAuth(userKey);
//				session.put(userKey, userAuth);
				cache.put(userKey, userAuth);
//				messageIn = new MessageIn(messageIn.getUser_key(), messageIn.getType(),
//						config.getConfigs().get(IConstants.Configs.Keys.AUTH_FAIL));
			} else {

				int userAuthStatus = userAuth.getStatus();

				logger.debug("Continuing authentication process for user {} with status code {}", userKey,
						userAuthStatus);

				switch (userAuthStatus) {
				case 1:
					logger.debug("Setting username. {}", messageIn.getContent());
					userAuth.setUserName(messageIn.getContent());
					break;
				case 2:
					logger.debug("Setting empId. {}", messageIn.getContent());
					userAuth.setEmpId(messageIn.getContent());

					String authResult = callGSAuth(userAuth);

					if (userKey.equals(authResult)) {
						// 성공일 경우 마지막 인증 시간 업데이트
						logger.debug("Successful authentication process for user {}", userKey);
						userAuth.setLastAuthDttm(DateUtils.instance.getCurrentDttm(null));
						userAuth.setStatus(authStatusDone);
						updateLastAuthDttm(userAuth);
					} else {
						// 실패일 경우
						logger.debug("Failed authentication process for user {}", userKey);
						userAuth.setStatus(0);
//						messageIn = new MessageIn(messageIn.getUser_key(), messageIn.getType(),
//								config.getConfigs().get(IConstants.Configs.Keys.AUTH_FAIL));
					}
					break;
				default:
					break;
				}
			}
		}
		return userAuth;
	}

	private boolean isAuthenticated(String user_key) {

		logger.info("Check if this user is authenticated. user:{}", user_key);

		UserAuth ua = new UserAuth(user_key);
		UserAuth selected = userAuthMapper.select(ua);

		logger.info("사용자 조회: {}", selected);

		if (selected == null) {
			logger.info("새 사용자 추가");
			String currentDttm = DateUtils.instance.getCurrentDttm(IConstants.DateFormat.DTTM_19);
			ua.setLastAuthDttm(currentDttm);
			ua.setLastTalkDttm(currentDttm);
			userAuthMapper.insert(ua);
			return false;
		}

		// 마지막 인증 후 일주일 단위 인증
		if (hasPastAuthPeriod(selected)) {
			// 마지막 대화 시간 검사
			if (hasPastDelayPeriod(selected)) {
				return false;
			}
		}
		return true;
	}

	private boolean hasPastDelayPeriod(UserAuth ua) {

		logger.debug("마지막 대화 시간 검증...");

		int delayMinutes = Integer.valueOf(config.getConfigs().get(IConstants.Configs.Keys.AUTH_DELAY));
		if (DateUtils.instance.minutuesPassed(ua.getLastTalkDttm(), delayMinutes) > 0) {
			logger.debug("마지막 대화 이후 {}분 이상 경과함. {}", delayMinutes, ua.getLastTalkDttm());
			return true;
		}
		logger.debug("마지막 대화 이후 {}분 이내임. {}", delayMinutes, ua.getLastTalkDttm());
		return false;
	}

	private boolean hasPastAuthPeriod(UserAuth ua) {

		logger.debug("마지막 인증일 검증...");

		int delayDays = Integer.valueOf(config.getConfigs().get(IConstants.Configs.Keys.AUTH_DAYS));

//		if (DateUtils.instance.daysPassed(ua.getLastAuthDttm(), delayDays) > 0) {
////			logger.debug("마지막 인증 후 {}일 이상 경과함. 마지막 인증 일시 : {}", delayDays, ua.getLastAuthDttm());
//			return true;
//		}
		// for testing...
		if (DateUtils.instance.minutuesPassed(ua.getLastAuthDttm(), 2) > 0) {
			logger.debug("마지막 인증 후 2분 이상 경과함. {}", ua.getLastAuthDttm());
			return true;
		}
		logger.debug("마지막 인증 후 {}일 이내임. 마지막 인증 일시 : {}", delayDays, ua.getLastAuthDttm());
		return false;
	}

	public void checkLastTalkDttmAndUpdate(UserAuth userAuth, String userKey) {
		// session을 이용하여 최소 10분에 한 번만 insert
//		String sessionAuthKey = IConstants.Auth.USER + userKey;
//		userAuth = session.get(sessionAuthKey);
		
		String lastTalkDttm = DateUtils.instance.getCurrentDttm(null);
		userAuth.setLastTalkDttm(lastTalkDttm);

		int delayMinutes = Integer.valueOf(config.getConfigs().get(IConstants.Configs.Keys.AUTH_DELAY));

		if (userAuth.getStatus() == authStatusDone
				&& (DateUtils.instance.minutuesPassed(lastTalkDttm, delayMinutes) > 0)) {
			logger.debug("Setting new last talk dttm for user : {}", userKey);
			updateLastTalkDttm(userAuth);
		}
	}

	private String callGSAuth(UserAuth ua) {
		// TODO : GS 사용자 인증 API 호출 및 결과 return
		logger.debug("Calling GS User Auth API with user info. {}", ua);
		
		return ua.getUserKey();
	}

	private boolean isAuthProcessing(String authKey) {
		
		logger.debug("Checking auth process status.....");
		
//		UserAuth authProcessing = session.get(authKey);
		UserAuth authProcessing = cache.get(authKey);
		
		if ( authProcessing != null && (authProcessing.getStatus() < authStatusDone ) ) {
			logger.debug("Authentication is still in process for {}", authKey);
			authProcessing.setStatus( authProcessing.getStatus() + 1);
			return true;
		}
		logger.debug("Authentication is not in process for {}", authKey);
		return false;
	}
	
	private int updateLastAuthDttm(UserAuth ua) {
		logger.debug("Updating last auth dttm for user : {}", ua);
		String currentDttm = DateUtils.instance.getCurrentDttm(IConstants.DateFormat.DTTM_19);
		ua.setLastAuthDttm(currentDttm);
		return userAuthMapper.update(ua);
	}

	private int updateLastTalkDttm(UserAuth ua) {
		logger.debug("Updating last talk dttm for user : {}", ua);
		String currentDttm = DateUtils.instance.getCurrentDttm(IConstants.DateFormat.DTTM_19);
		ua.setLastTalkDttm(currentDttm);
		return userAuthMapper.update(ua);
	}

}
