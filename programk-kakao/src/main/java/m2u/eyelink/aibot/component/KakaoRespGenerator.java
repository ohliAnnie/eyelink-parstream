package m2u.eyelink.aibot.component;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import m2u.eyelink.aibot.IConstants;
import m2u.eyelink.aibot.domain.Keyboard;
import m2u.eyelink.aibot.domain.Message;
import m2u.eyelink.aibot.domain.MessageButton;
import m2u.eyelink.aibot.domain.MessageOut;
import m2u.eyelink.aibot.domain.Photo;

@Component
public class KakaoRespGenerator {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	public Keyboard createKakaoKeyboard(List<String> buttons) {
		if (buttons != null && buttons.size() > 0 ){
			return new Keyboard(buttons);
		}
		return new Keyboard(IConstants.Type.Keyboard.TEXT);
	}

	public MessageOut programkToKakaoMessage(String response) {
		
		response = response.substring(1, response.length() - 1 );
		
		MessageOut result = new MessageOut();
		Message message = new Message();
		result.setMessage(message);
		
		JSONObject o = new JSONObject(response);
		
		// Text Message Content
		String  body = o.getString(IConstants.ProgramkFields.Out.BODY);
//		System.out.println("body : " + body);
		message.setText(body);
		
		// Text Links (several links) -> Kakao can display only one message button
		JSONArray urlsArr = (JSONArray) o.get(IConstants.ProgramkFields.Out.URLS);
		Iterator<Object> urlIter = urlsArr.iterator();
		if ( urlIter.hasNext() ) {
			JSONObject p = (JSONObject)urlIter.next();
			message.setMessage_button(new MessageButton(p.getString("title"), p.getString("url")));
//			System.out.println(message.getMessage_button().toString());
		}
			
		// Image Uri (only one, but wrapped in an array)
		JSONArray imgArr = (JSONArray) o.get(IConstants.ProgramkFields.Out.IMAGE);
		if ( imgArr.length() > 0 ) {
			String image =  imgArr.getString(0);
//			System.out.println("image: " + image);
			Photo photo = new Photo(image);
			message.setPhoto(photo);
		}
		
		// Next Recommended Questions -> Kakao buttons
		JSONArray respArr = (JSONArray) o.get(IConstants.ProgramkFields.Out.RESPONSES);
		Iterator<Object> respIter = respArr.iterator();
		final List<String> responses = new ArrayList<>();
		while ( respIter.hasNext() ) {
			responses.add((String)respIter.next());
		}
		if ( responses != null && responses.size() > 0 ) {
			Keyboard keyboard = new Keyboard(responses);
			result.setKeyboard(keyboard);
		}
		logger.debug("");
		
		return result;
	}

	// TODO : delete (for test)
	public static void main(String[] args) {
		
		String response = "[{\"body\":\"텍스트답변\",\"urls\":[{\"title\":\"텍스트링크1\",\"url\":\"http://www.naver.com/\",\"comment\":\"첫번째 텍스트 링크입니다\"}],\"image\":[\"https://www.google.co.kr/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png\"],\"image_alt_text\":[\"image대체텍스트라네요\"],\"responses\":[\"테스트 실패\",\"도움말\"],\"option1\":[],\"option2\":[],\"option3\":[],\"option4\":[],\"option5\":[]}]";
		MessageOut result = new KakaoRespGenerator().programkToKakaoMessage(response);
		
		System.out.println("=============================");
		System.out.println("parsing done ");
		System.out.println( new JSONObject(result).toString(4) );
	}
}
