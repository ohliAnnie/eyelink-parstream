package org.aitools.programd;

import org.aitools.programd.util.AimlValidator;
import org.junit.Test;

public class VaildatePatternTest {

	@Test
	public void patternTest01() throws Exception {
		String originalPattern = "ABC {TEST1} {TEST1-1} EDF {TEST2} EXQ ";
		originalPattern = "{*} 데이터+{*} 알림+ {*}";
		try {
			AimlValidator.validPattern(originalPattern);
		} catch (Exception e) {
			System.out.println("검증오류 발생!!");
			throw e;
		}
	}
}
