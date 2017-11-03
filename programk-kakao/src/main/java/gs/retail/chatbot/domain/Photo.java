package gs.retail.chatbot.domain;

import java.awt.image.BufferedImage;
import java.net.URL;

import javax.imageio.ImageIO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import gs.retail.chatbot.IConstants;

/**
 * 카카오톡 이미지
 * @author Kihyun
 * 이미지 권장 사이즈 : 720 x 630px
 * 지원 파일형식 및 권장 용량 : jpg, png /500KB
 */
public class Photo {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	private String url;
	private int width = IConstants.KakaoFields.Out.Photo.DFLT_WIDTH;
	private int height = IConstants.KakaoFields.Out.Photo.DFLT_HEIGHT;
	
	public Photo(String url) {
		this.url = url;
		setSize(url);
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
	private void setSize(String imgUrl) {
		try {
			URL url = new URL(imgUrl);
			BufferedImage img = ImageIO.read(url);
			final int w = img.getWidth();
			final int h = img.getHeight();
			final int dfltW = IConstants.KakaoFields.Out.Photo.DFLT_WIDTH;
			final int dfltH = IConstants.KakaoFields.Out.Photo.DFLT_HEIGHT;
			
			int finalWidth = 0;
			int finalHeight = 0;
			
			if ( w < dfltW && h < dfltH ) {
				finalWidth = w;
				finalHeight = h;
			} else if ( w > dfltW && h < dfltH ) {
				finalWidth = dfltW;
				finalHeight = (int)(((float) h / w) * finalWidth);
			} else if ( w < dfltW && h > dfltH ) {
				finalHeight = dfltH;
				finalWidth = (int)(((float) w / h) * finalHeight);
			} else {
				float wRatio = (float) w / dfltW;
				float hRatio = (float) h / dfltH;
				if ( wRatio > hRatio ) {
					finalWidth = dfltW;
					finalHeight = (int)(((float) h / w) * finalWidth);
				} else {
					finalHeight = dfltH;
					finalWidth = (int)(((float) w / h) * finalHeight);
				}
			}
			this.width = finalWidth;
			this.height = finalHeight;
		} catch (Throwable e) {
			logger.error(e.getMessage(), e);
		}
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
	
	public static void main(String[] args) {
		int a = 3;
		int b = 7;
		
		float result = (float)a/b;
		System.out.println(result);
	}
}
