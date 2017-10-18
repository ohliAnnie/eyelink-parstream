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
package com.kt.programk.common.utils;

import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.jasypt.exceptions.EncryptionOperationNotPossibleException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * The type Jdbc config.
 */
public class JdbcConfig {
	
	private static final Logger logger = LoggerFactory.getLogger(JdbcConfig.class);

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
		
		logger.debug("Trying to decrypt data. [{}]", encData);
		
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
//	private String decData(String encData) {
//		String rv = "";
//
//		// 설정암호화 여부
//		if (!useCrypt) {
//			rv = encData;
//			return rv;
//		}
//
//		// Symmetric Cipher
//		rv = ssoDb(JKTFCrypto.CIPHER_SEED_ALGO, encData);
//		if ("".equals(rv)) {
//			return "";
//		}
//
//		rv = ssoDb(JKTFCrypto.CIPHER_AES_128, encData);
//		if ("".equals(rv)) {
//			return "";
//		}
//
//		rv = ssoDb(JKTFCrypto.CIPHER_3DES_ALGO, encData);
//		if ("".equals(rv)) {
//			return "";
//		}
//
//		return rv;
//	}

	/**
	 * Sso db string.
	 *
	 * @param algo
	 *            the algo
	 * @param encData
	 *            the enc data
	 * @return the string
	 */
//	private String ssoDb(int algo, String encData) {
//		LOG.debug("==================== encData == " + encData);
//		JKTFSymmetricKey symmKey = null;
//
//		try {
//			symmKey = new JKTFSymmetricKey();
//		} catch (JKTFException e) {
//			LOG.info(e.getMessage());
//			return "";
//		}
//
//		LOG.debug("***** SSODB Algorithm : " + getAlgoName(algo) + " *****");
//
//		// Init SecretKey
//		symmKey.InitSecretKey();
//		if (symmKey.getErrorCode() < 0) {
//			LOG.info("InitSecretKey Failed : " + symmKey.getErrorCode());
//			return "";
//		}
//		LOG.debug("InitSecretKey - OK");
//
//		byte[] decdata = symmKey.DecryptData(encData);
//		if (symmKey.getErrorCode() < 0 || decdata == null) {
//			LOG.debug("DecryptData Failed : " + symmKey.getErrorCode());
//			return "";
//		}
//
//		LOG.debug("DecryptedData : " + new String(decdata) + " Length(byte) :" + decdata.length);
//		LOG.debug("DecryptData - OK");
//		LOG.debug("");
//
//		return new String(decdata);
//	}

	/**
	 * Gets algo name.
	 *
	 * @param algo
	 *            the algo
	 * @return the algo name
	 */
	public String getAlgoName(int algo) {
		switch (algo) {
		case 1:
			return "SEED";
		case 2:
			return "3DES";
		case 3:
			return "DES";
		case 4:
			return "AES128";
		case 256:
			return "SHA1";
		case 512:
			return "SHA256";
		default:
			return "Unknown";
		}
	}

}
