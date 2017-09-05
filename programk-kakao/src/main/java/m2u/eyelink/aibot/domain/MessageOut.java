package m2u.eyelink.aibot.domain;

public class MessageOut {

	private Message message;
	private Keyboard keyboard;
	
	public Message getMessage() {
		return message;
	}
	public void setMessage(Message message) {
		this.message = message;
	}
	public Keyboard getKeyboard() {
		return keyboard;
	}
	public void setKeyboard(Keyboard keyboard) {
		this.keyboard = keyboard;
	}
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("MessageOut [message=");
		builder.append(message);
		builder.append(", keyboard=");
		builder.append(keyboard);
		builder.append("]");
		return builder.toString();
	}
}
