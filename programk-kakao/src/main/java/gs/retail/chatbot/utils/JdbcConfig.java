
package gs.retail.chatbot.utils;

import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.jasypt.exceptions.EncryptionOperationNotPossibleException;

/**
 * 암호화된 DB정보에 대해서 암복호화 하는 클래스
 * @author Kihyun
 */
public class JdbcConfig {

	private String decUrl;
	private String decUsername;
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

	public String getDecUrl() {
		return decUrl;
	}

	public void setDecUrl(String decUrl) {
		this.decUrl = decData(decUrl);
	}

	public String getDecUsername() {
		return decUsername;
	}

	public void setDecUsername(String decUsername) {
		this.decUsername = decData(decUsername);
	}

	public String getDecPassword() {
		return decPassword;
	}

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
	/**
	 * 변경된 패스워드 암호화를 위한 메인메서드
	 * @param args
	 */
	public static void main(String[] args) {
		StandardPBEStringEncryptor enc = new StandardPBEStringEncryptor();
		enc.setAlgorithm("PBEWITHMD5ANDDES");
		enc.setPassword("key for encrypt passwd");
		System.out.println(enc.encrypt(args[0]));
	}
}
