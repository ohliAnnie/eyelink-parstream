package m2u.eyelink.aibot.domain;

public class Message {

	private String text;
	private Photo photo;
	private MessageButton message_button;
	
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public Photo getPhoto() {
		return photo;
	}
	public void setPhoto(Photo photo) {
		this.photo = photo;
	}
	public MessageButton getMessage_button() {
		return message_button;
	}
	public void setMessage_button(MessageButton message_button) {
		this.message_button = message_button;
	}
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("Message [text=");
		builder.append(text);
		builder.append(", photo=");
		builder.append(photo);
		builder.append(", message_button=");
		builder.append(message_button);
		builder.append("]");
		return builder.toString();
	}
	
}
