package m2u.eyelink.aibot;

public interface IConstants {
	
	interface Charset {
		String DFLT_CHARSET = "utf-8";
	}
	
	interface Configs {
		String CONFIG = "ifconfig";
		String API_URL = "api.url";
		String TOKEN = "token";
	}
	
	interface Type {
		interface Message {
			String TEXT = "text";
			String PHOTO = "photo";
		}
		interface Keyboard {
			String TEXT = "text";
			String BUTTONS = "buttons";
		}
	}
	
	interface KakaoFields {
		interface In {
			String USER_KEY = "user_key";
			String TYPE = "type";
			String CONTENT = "content";
		}
		interface Out {
			interface Message {
				String TEXT = "text";
				String PHOTO = "photo";
				String MESSAGE_BUTTON = "message_button";
			}
			interface Keyboard {
				String TYPE = "type";
				String BUTTONS = "buttons";
			}
		}
	}
	
	interface ProgramkFields {
		interface In {
			String TOKEN = "token";
			String USER = "user";
			String CHAT = "chat";
		}
		interface Out {
			String BODY = "body";
			String URLS = "urls";
			String IMAGE = "image";
			String RESPONSES = "responses";
		}
	}
	
}
