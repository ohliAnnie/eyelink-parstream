package m2u.eyelink.aibot.domain;

public class Photo {

	private String url;
	private int width = 640;
	private int height = 480;
	
	public Photo(String url) {
		this.url = url;
	}
	public Photo(String url, int width, int height) {
		super();
		this.url = url;
		this.width = width;
		this.height = height;
	}
	public String getUrl() {
		return url;
	}
	public int getWidth() {
		return width;
	}
	public int getHeight() {
		return height;
	}
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("Photo [url=");
		builder.append(url);
		builder.append(", width=");
		builder.append(width);
		builder.append(", height=");
		builder.append(height);
		builder.append("]");
		return builder.toString();
	}
}
