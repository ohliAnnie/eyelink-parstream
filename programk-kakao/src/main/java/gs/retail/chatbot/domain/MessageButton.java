package gs.retail.chatbot.domain;

/**
 * 카카오톡 메시지버튼
 * @author Kihyun
 */
public class MessageButton {

	private String label;
	private String url;
	
	public MessageButton(String label, String url) {
		this.label = label;
		this.url = url;
	}
	
	public String getLabel() {
		return label;
	}
	public String getUrl() {
		return url;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("MessageButton [label=");
		builder.append(label);
		builder.append(", url=");
		builder.append(url);
		builder.append("]");
		return builder.toString();
	}
	
}
