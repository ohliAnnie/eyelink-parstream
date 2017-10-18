package m2u.eyelink.aibot.domain;

public class MessageIn {

	private String user_key;
	private String type;
	private String content;	// text message or media uri

	public MessageIn(){}
	
	public MessageIn(String user_key, String type, String content) {
		this.user_key = user_key;
		this.type = type;
		this.content = content;
	}

	public String getUser_key() {
		return user_key;
	}
	public String getType() {
		return type;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("Message [user_key=");
		builder.append(user_key);
		builder.append(", type=");
		builder.append(type);
		builder.append(", content=");
		builder.append(content);
		builder.append("]");
		return builder.toString();
	}
	
	
	
}
