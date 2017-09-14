package m2u.eyelink.aibot;

public interface IConstants {
	
	interface Charset {
		String DFLT_CHARSET = "utf-8";
	}
	
	interface Configs {
		String CONFIG = "config";
		interface Keys {
			String API_URL = "api.url";	// AIBOT Core API 대화 URL
			String TOKEN = "token";	// 생성한 CP의 토큰
			String AUTH_FAIL = "auth.fail";	// 인증 실패시 사용자 메시지를 대체할 메시지(CMS에서 대화로 등록해서 내용을 변경할 수 있도록)
		}
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
