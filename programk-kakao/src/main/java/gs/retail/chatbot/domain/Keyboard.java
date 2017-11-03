package gs.retail.chatbot.domain;

import java.util.List;

import gs.retail.chatbot.IConstants;

public class Keyboard {

	private String type;
	private List<String> buttons;

	public Keyboard(String type) {
		this.type = type;
	}
	public Keyboard(List<String> buttons) {
		this.type = IConstants.Type.Keyboard.BUTTONS;
		this.buttons = buttons;
	}
	public String getType() {
		return type;
	}
	public List<String> getButtons() {
		return buttons;
	}
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("Keyboard [type=");
		builder.append(type);
		builder.append(", buttons=");
		builder.append(buttons);
		builder.append("]");
		return builder.toString();
	}
	
}
