package gs.retail.chatbot.domain;

public class UserAuth {

	/**
	 * 카카오톡 사용자 키
	 */
	private String userKey;
	
	/**
	 * 마지막 인증 일시
	 */
	private String lastAuthDttm;
	/**
	 * 마지막 대화 일시
	 */
	private String lastTalkDttm;
	
	/**
	 * 사용자 명
	 */
	private String userName;
	/**
	 * 점원번호
	 */
	private String empId;
	/**
	 * 인증 상태
	 */
	private int status = 0;
	/**
	 * Default Constructor
	 */
	public UserAuth() {}
	
	/**
	 * UserAuth 생성자
	 * @param user_key
	 */
	public UserAuth(String user_key) {
		this.userKey = user_key;
	}
	/**
	 * Gets user key
	 * 
	 * @return userKey
	 */
	public String getUserKey() {
		return userKey;
	}

	/**
	 * Sets user key
	 * 
	 * @return userKey
	 */
	public void setUserKey(String userKey) {
		this.userKey = userKey;
	}
	
	/**
	 * Gets last auth dttm
	 * 
	 * @return lastAuthDttm
	 */
	public String getLastAuthDttm() {
		return lastAuthDttm;
	}
	/**
	 * Sets last auth dttm
	 * 
	 * @return lastAuthDttm
	 */
	public void setLastAuthDttm(String lastAuthDttm) {
		this.lastAuthDttm = lastAuthDttm;
	}
	
	/**
	 * Gets last talk dttm
	 * 
	 * @return lastTalkDttm
	 */
	public String getLastTalkDttm() {
		return lastTalkDttm;
	}
	/**
	 * Sets last talk dttm
	 * 
	 * @return lastTalkDttm
	 */
	public void setLastTalkDttm(String lastTalkDttm) {
		this.lastTalkDttm = lastTalkDttm;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getEmpId() {
		return empId;
	}
	public void setEmpId(String empId) {
		this.empId = empId;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("UserAuth [userKey=");
		builder.append(userKey);
		builder.append(", lastAuthDttm=");
		builder.append(lastAuthDttm);
		builder.append(", lastTalkDttm=");
		builder.append(lastTalkDttm);
		builder.append(", userName=");
		builder.append(userName);
		builder.append(", empId=");
		builder.append(empId);
		builder.append(", status=");
		builder.append(status);
		builder.append("]");
		return builder.toString();
	}
}
