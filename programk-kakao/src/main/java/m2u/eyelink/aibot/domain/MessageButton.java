package m2u.eyelink.aibot.domain;

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
