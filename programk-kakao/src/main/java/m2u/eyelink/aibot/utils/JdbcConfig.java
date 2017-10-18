/**
 * 암호화된 DB정보에 대해서 복호화 하는 클래스
 *
 * @Package : com.olleh.search.cms.config;
 * @FileName: JdbcConfig.java
 * @author : 성지훈
 * @version 1.0
 * <p>
 * << 개정이력 >>
 * <p>
 * 수정일                           수정자                                   수정내용
 * --------------- -------------   -----------------------
 * 2016.01.06         성지훈                                   최초작성
 * @since : 2016.01.06
 */
package m2u.eyelink.aibot.utils;

import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.jasypt.exceptions.EncryptionOperationNotPossibleException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * The type Jdbc config.
 */
public class JdbcConfig {
	private static final Logger LOG = LoggerFactory.getLogger(JdbcConfig.class);

	/**
	 * The Dec url.
	 */
	private String decUrl;
	/**
	 * The Dec username.
	 */
	private String decUsername;
	/**
	 * The Dec password.
	 */
	private String decPassword;

	/**
	 * 암호화 사용 여부
	 */
	private boolean useCrypt;

	/**
	 * Instantiates a new Jdbc config.
	 */
	public JdbcConfig() {
		super();
	}

	/**
	 * Gets dec url.
	 *
	 * @return the dec url
	 */
	public String getDecUrl() {
		return decUrl;
	}

	/**
	 * Sets dec url.
	 *
	 * @param decUrl
	 *            the dec url
	 */
	public void setDecUrl(String decUrl) {
		this.decUrl = decData(decUrl);
	}

	/**
	 * Gets dec username.
	 *
	 * @return the dec username
	 */
	public String getDecUsername() {
		return decUsername;
	}

	/**
	 * Sets dec username.
	 *
	 * @param decUsername
	 *            the dec username
	 */
	public void setDecUsername(String decUsername) {
		this.decUsername = decData(decUsername);
	}

	/**
	 * Gets dec password.
	 *
	 * @return the dec password
	 */
	public String getDecPassword() {
		return decPassword;
	}

	/**
	 * Sets dec password.
	 *
	 * @param decPassword
	 *            the dec password
	 */
	public void setDecPassword(String decPassword) {
		this.decPassword = decData(decPassword);
	}

	public boolean isUseCrypt() {
		return useCrypt;
	}

	public void setUseCrypt(String useCrypt) {
		if (useCrypt != null)
			this.useCrypt = Boolean.parseBoolean(useCrypt);
	}

	/**
	 * Dec data string.
	 *
	 * @param encData
	 *            the enc data
	 * @return the string
	 */
	private String decData(String encData) {
		String rv = "";

		// 설정암호화 여부
		if (!useCrypt) {
			rv = encData;
			return rv;
		}
		
		StandardPBEStringEncryptor enc = new StandardPBEStringEncryptor();
		enc.setAlgorithm("PBEWITHMD5ANDDES");
		enc.setPassword("key for encrypt passwd");
		try {
			rv = enc.decrypt(encData);
		} catch(EncryptionOperationNotPossibleException e) {
			rv = encData;
		}
		return rv;
	}
public static void main(String[] args) {
	StandardPBEStringEncryptor enc = new StandardPBEStringEncryptor();
	enc.setAlgorithm("PBEWITHMD5ANDDES");
	enc.setPassword("key for encrypt passwd");
	System.out.println( enc.encrypt("gs2017#") );
	System.out.println( enc.encrypt("qwer!@34") );
}
}
