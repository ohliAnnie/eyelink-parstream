package gs.retail.chatbot;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import gs.retail.chatbot.component.Config;
import gs.retail.chatbot.component.KakaoRespGenerator;
import gs.retail.chatbot.component.UserAuthManager;
import gs.retail.chatbot.domain.Friend;
import gs.retail.chatbot.domain.Keyboard;
import gs.retail.chatbot.domain.MessageIn;
import gs.retail.chatbot.domain.MessageOut;
import gs.retail.chatbot.domain.UserAuth;

/**
 * 카카오톡이 호출하는 인터페이스
 * @author Kihyun
 */
@Controller
public class InterfaceController {
	
	private final Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private Config config;
	@Autowired
	private InterfaceService is;
	@Autowired
	private KakaoRespGenerator kakaoRespGenerator;
	@Autowired
	private UserAuthManager uaManager;
	
	private Keyboard keyboard;
	
	/**
	 * 사용자가 채팅방에 최초로 들어오거나 재진입했을 때 호출되는 서비스
	 * <p>이용자가 최초로 채팅방에 들어올 때 기본으로 키보드 영역에 표시될 자동응답 명령어의 목록을 호출하는 API입니다.
	 * 챗팅방을 지우고 다시 재 진입시에도 호출됩니다. 다만 카카오 서버에서도 1분 동안 캐시가 저장되기 때문에 유저가 채팅방을 지우고 들어오는 행동을 반복하더라도 개발사 서버를 1분에 한번씩 호출하게 됩니다.
	 * <p>유저가 자동응답으로 메시지를 주고 받았을 경우는 마지막 메시지에 담겨있던 자동응답 명령어 목록이 표시됩니다. 다만 메시지에 저장된 자동응답 명령어는 10분간 유효합니다. 10분이 지난 다음에는 다시 Keyboard api를 호출하여 자동응답 목록을 초기화하게 됩니다
	 * @return
	 */
	@RequestMapping(value = "/keyboard", method = RequestMethod.GET)
	@ResponseBody
	public Keyboard getKeyboard() {
		
		logger.debug("Getting keyboard...");
		
		if ( keyboard == null ) {
			List<String> buttons = new ArrayList<>();
			keyboard = kakaoRespGenerator.createKakaoKeyboard(buttons);
		}
		return keyboard;
	}
	
	/**
	 * 사용자가 플러스 친구 대화방에서 메시지를 입력했을 때 호출되는 서비스
	 * @param messageIn
	 * @return
	 */
	@RequestMapping(value = "/message", method = RequestMethod.POST)
	@ResponseBody
	public MessageOut getMessage(@RequestBody MessageIn messageIn) {
		
		logger.info("Message received. user_key : {}", messageIn.getUser_key());
		
		MessageOut result = null;
		
		UserAuth userAuth = uaManager.authenticateUser(messageIn);
		
		if ( userAuth.getStatus() == 1 ) {
			messageIn.setContent(config.getConfigs().get(IConstants.Configs.Keys.AUTH_FAIL));
		}
		
		String response = null;
		try {
			logger.debug("messageIn: {}", messageIn);
			response = is.getResponse(messageIn);
			logger.debug("response : {}", response);
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}
		uaManager.checkUpdateLastTalkDttm(userAuth);
		
		if ( response != null ) {
			result = kakaoRespGenerator.programkToKakaoMessage(response);
		}
		return result;
	}

	/**
	 * 사용자가 플러스 친구를 추가했을 때 호출되는 서비스
	 * @param friend
	 */
	@RequestMapping(value = "/friend", method = RequestMethod.POST)
	@ResponseBody
	public void friendAdded(@RequestBody Friend friend) {
		
		logger.info("You have got a new friend. user_key : {}", friend.getUser_key());
	}
	
	/**
	 * 사용자가 플러스 친구를 차단했을 때 호출 되는 서비스
	 * @param user_key
	 */
	@RequestMapping(value = "/friend/{user_key}", method = RequestMethod.DELETE)
	@ResponseBody
	public void friendBlockedMe(@PathVariable("user_key")String user_key) {
		
		logger.info("A friend blocked you. user_key : {}", user_key);
		
		uaManager.remove(user_key);
	}
	
	/**
	 * 사용자가 대화방에서 나갔을 때 호출되는 서비스
	 * @param user_key
	 */
	@RequestMapping(value = "/chat_room/{user_key}", method = RequestMethod.DELETE)
	@ResponseBody
	public void friendLeftChatRoom(@PathVariable("user_key")String user_key) {
		
		logger.info("A friend left the chat room. user_key : {}", user_key);
		
		uaManager.remove(user_key);
	}
}
