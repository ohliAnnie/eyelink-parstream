package gs.retail.chatbot;

import java.io.IOException;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gs.retail.chatbot.component.Config;
import gs.retail.chatbot.component.HttpRequester;
import gs.retail.chatbot.domain.MessageIn;

/**
 * 카카오톡 연동 서비스
 * @author Kihyun
 */
@Service
public class InterfaceService {

	@Autowired
	private Config config;
	@Autowired
	private HttpRequester httpRequester;
	
	/**
	 * ProgramK에 질문메시지를 보내고 응답을 받는 서비스
	 * @param messageIn
	 * @return
	 * @throws IOException
	 */
	public String getResponse(MessageIn messageIn) throws IOException {

		String response = httpRequester.sendPostRequest(generateProgramkRequest(messageIn), config.getApiUrl());
		
		return response;
	}

	private String generateProgramkRequest(MessageIn messageIn) {
		
		JSONObject o = new JSONObject();
		o.put("token", config.getToken());
		o.put("user", messageIn.getUser_key());
		o.put("chat", messageIn.getContent());
		return o.toString();
	}

}
