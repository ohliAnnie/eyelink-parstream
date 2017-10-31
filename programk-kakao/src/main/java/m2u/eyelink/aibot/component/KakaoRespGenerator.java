package m2u.eyelink.aibot.component;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Component;

import m2u.eyelink.aibot.IConstants;
import m2u.eyelink.aibot.domain.Keyboard;
import m2u.eyelink.aibot.domain.Message;
import m2u.eyelink.aibot.domain.MessageButton;
import m2u.eyelink.aibot.domain.MessageOut;
import m2u.eyelink.aibot.domain.Photo;

@Component
public class KakaoRespGenerator {

	public Keyboard createKakaoKeyboard(List<String> buttons) {
		if (buttons != null && buttons.size() > 0 ){
			return new Keyboard(buttons);
		}
		return new Keyboard(IConstants.Type.Keyboard.TEXT);
	}

	public MessageOut programkToKakaoMessage(String response) {

		MessageOut result = new MessageOut();
		Message message = new Message();
		result.setMessage(message);
		
		response = response.substring(1, response.length() - 1 );
		
		JSONObject o = new JSONObject(response);
		
		// Text Message Content
		String  body = o.getString(IConstants.ProgramkFields.Out.BODY);
		message.setText(body);
		
		// Text Links (several links) -> Kakao can display only one message button
		JSONArray urlsArr = (JSONArray) o.get(IConstants.ProgramkFields.Out.URLS);
		Iterator<Object> urlIter = urlsArr.iterator();
		if ( urlIter.hasNext() ) {
			JSONObject p = (JSONObject)urlIter.next();
			message.setMessage_button(new MessageButton(p.getString("title"), p.getString("url")));
		}
			
		// Image URL (only one, but wrapped in an array)
		JSONArray imgArr = (JSONArray) o.get(IConstants.ProgramkFields.Out.IMAGE);
		if ( imgArr.length() > 0 ) {
			String imageUrl =  imgArr.getString(0);
			Photo photo = new Photo(imageUrl);
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
		return result;
	}

}
