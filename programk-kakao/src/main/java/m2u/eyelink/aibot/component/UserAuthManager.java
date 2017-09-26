package m2u.eyelink.aibot.component;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import m2u.eyelink.aibot.IConstants;
import m2u.eyelink.aibot.custom.kt.config.Config;
import m2u.eyelink.aibot.domain.MessageIn;
import m2u.eyelink.aibot.domain.UserAuth;
import m2u.eyelink.aibot.mapper.UserAuthMapper;
import m2u.eyelink.aibot.utils.DateUtils;

@Component
public class UserAuthManager {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private Config config;
	@Autowired
	UserAuthMapper userAuthMapper;

	// TODO : session에 저장된 사용자 정보를 주기적으로 청소해줄 필요가 있음 (auth.days 주기로 하면 될 듯, ehcache 사용)
	private final Map<String, UserAuth> session = new HashMap<>();
	private final int authStatusDone = 4;

	public UserAuth authenticateUser(MessageIn messageIn) {

		final String userKey = messageIn.getUser_key();
		String sessionAuthKey = IConstants.Auth.USER + userKey;
		UserAuth userAuth = session.get(sessionAuthKey);

		if (!isAuthenticated(userKey)) {
			
			if (!isAuthProcessing(sessionAuthKey)) {
				logger.debug("Starting new authentication process for user {}", userKey);
				userAuth = new UserAuth(userKey);
				session.put(sessionAuthKey, userAuth);
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

				case 3:
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

	public boolean isAuthenticated(String user_key) {

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
		// TODO : uncomment below...
		// if ( DateUtils.instance.daysPassed(ua.getLastAuthDttm(), delayDays) > 0 ) {
		// return true;
		// }
		// TODO : delete....testing...
		if (DateUtils.instance.minutuesPassed(ua.getLastAuthDttm(), 2) > 0) {
			logger.debug("마지막 인증 후 2분 이상 경과함. {}", ua.getLastAuthDttm());
			return true;
		}
		logger.debug("마지막 인증 후 2분 이내임. {}", ua.getLastAuthDttm());
		return false;
	}

	public void checkLastTalkDttmAndUpdate(UserAuth userAuth, String userKey) {
		// session을 이용하여 최소 10분에 한 번만 insert
		String sessionAuthKey = IConstants.Auth.USER + userKey;
		userAuth = session.get(sessionAuthKey);
		if (userAuth == null) {
			logger.debug("UserAuth from session is NULL !!!!");
			userAuth = new UserAuth(userKey);
		}
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
		
		UserAuth authProcessing = session.get(authKey);
		
		if ( authProcessing != null && (authProcessing.getStatus() < authStatusDone ) ) {
			logger.debug("Authentication is still in process for {}", authKey);
			authProcessing.setStatus( authProcessing.getStatus() + 1);
			return true;
		}
		logger.debug("Authentication is not in process for {}", authKey);
		return false;
	}
	
	public int updateLastAuthDttm(UserAuth ua) {
		logger.debug("Updating last auth dttm for user : {}", ua);
		String currentDttm = DateUtils.instance.getCurrentDttm(IConstants.DateFormat.DTTM_19);
		ua.setLastAuthDttm(currentDttm);
		return userAuthMapper.update(ua);
	}

	public int updateLastTalkDttm(UserAuth ua) {
		logger.debug("Updating last talk dttm for user : {}", ua);
		String currentDttm = DateUtils.instance.getCurrentDttm(IConstants.DateFormat.DTTM_19);
		ua.setLastTalkDttm(currentDttm);
		return userAuthMapper.update(ua);
	}

}
