import com.kt.programk.common.utils.JodaDateUtil;
import org.joda.time.DateTime;
import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.junit.Test;

/**
 * Created by Administrator on 2016-08-11.
 */
public class TimeTest {

    @Test
    public void test(){
        //현재 시간을 구하자
        System.out.println(JodaDateUtil.getMinusHours(1, "yyyy-MM-dd HH"));
        System.out.println(JodaDateUtil.getMinusHours(0, "yyyy-MM-dd HH"));
    }


    @Test
    public void testMonth(){
        //해당 월의 시작일과 종료일을 구하자
        DateTimeFormatter formatterFecha = DateTimeFormat.forPattern("yyyy-MM-dd");

        DateTime primerDiaDelMes = new DateTime().dayOfMonth().withMinimumValue();
        String desde = new LocalDate(primerDiaDelMes).toString(formatterFecha);
        System.out.println(desde);

        DateTime ultimoDiaDelMes = new DateTime().dayOfMonth().withMaximumValue();
        String hasta = new LocalDate(ultimoDiaDelMes).toString(formatterFecha);

        System.out.println(hasta);

        System.out.println(JodaDateUtil.getMinusDays(1, "yyyy-MM-dd" + " 00:00:00"));
    }

}
