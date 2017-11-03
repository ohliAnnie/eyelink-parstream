package gs.retail.chatbot.utils;

import java.util.Date;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import java.text.SimpleDateFormat;

public class DateUtils {

	public static final DateUtils instance =  new DateUtils();
	private final DateTimeFormatter formatter_19 = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss");
	private final String DEFAULT_FORMAT = "yyyy-MM-dd HH:mm:ss";
	
	public String getDefaultDttm(String format) {
		SimpleDateFormat sdf = (format != null ? new SimpleDateFormat(format) : new SimpleDateFormat(DEFAULT_FORMAT));
		return sdf.format(new Date(0));
	}
	public String getCurrentDttm(String format) {
		// any kind of format like ....yyyy-MM-dd HH:mm:ss 
		SimpleDateFormat sdf = (format != null ? new SimpleDateFormat(format) : new SimpleDateFormat(DEFAULT_FORMAT));
		return sdf.format(new Date());
	}
	
	public int daysPassed(String dttm, int days) {
		DateTime dt = DateTime.parse(dttm, formatter_19);
		DateTime dtc = DateTime.now();
		return dtc.compareTo(dt.plusDays(days));
	}
	
	/**
	 * 
	 * @param dttm
	 * @param minutes
	 * @return 1 : dttm이 minutes(분)이상 경과했을 경우,
	 * 		   0 : dttm이 정확히 minutes(분) 경과한 경우,
	 * 		  -1 : dttm이 아직 minutes(분)을 경과하지 않은 경우
	 */
	public int minutesPassed(String dttm, int minutes) {
		DateTime dt = DateTime.parse(dttm, formatter_19);
		DateTime dtc = DateTime.now();
		return dtc.compareTo(dt.plusMinutes(minutes));
	}
	
	public static void main(String[] args) {
//		System.out.println( DateUtils.instance.getDefaultDttm("yyyy-MM-dd HH:mm:ss") );
	}
	
}
