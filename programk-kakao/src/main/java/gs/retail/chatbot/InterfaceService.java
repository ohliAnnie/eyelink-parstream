package gs.retail.chatbot;

import java.io.IOException;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gs.retail.chatbot.component.Config;
import gs.retail.chatbot.component.HttpRequester;
import gs.retail.chatbot.domain.MessageIn;

@Service
public class InterfaceService {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private Config config;
	@Autowired
	private HttpRequester httpRequester;
	
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
