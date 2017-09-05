package org.aitools.programd.util;

import java.util.ArrayList;
import java.util.ListIterator;

import org.aitools.programd.graph.Graphmaster;
import org.aitools.programd.graph.NonOptimalNodemaster;
import org.apache.commons.lang.StringUtils;

import com.kt.programd.util.AimlPatternTokenizer;

public class AimlValidator {

	private static final String ASTERISK = "*";
	private static final String UNDERLINE = "_";

	private static String EMPTY_STRING = "";
	private static String REGEX_TEST_STRING = "TEST";

	/**
	 * AIML Pattern 검증
	 * 
	 * @param originalPattern
	 */
	public static boolean validPattern(String originalPattern) {
		boolean isPass = true;
		ArrayList<String> patternList = AimlPatternTokenizer.getPatterns(originalPattern);
		ArrayList<String> path = null;
		String pattern = null;
		String trancedPartten = null;
		try {
			for (String patternItem : patternList) {
				if (!patternItem.equalsIgnoreCase(EMPTY_STRING)) {

					if (StringUtils.isEmpty(patternItem)) {
						patternItem = ASTERISK;
					}
					patternItem = Graphmaster.normalizeAIMLExpression(patternItem);

					path = StringKit.wordSplit(patternItem);
					ListIterator<String> pathItor = path.listIterator();

					while (pathItor.hasNext()) {
						pattern = pathItor.next();
						trancedPartten = NonOptimalNodemaster.transform(pattern.toUpperCase().intern());
						if (trancedPartten.equalsIgnoreCase(ASTERISK) || trancedPartten.equalsIgnoreCase(UNDERLINE)) // Token
							continue;
						// AIML형식이 잘못되면 아래의 정규표현식 체크에서 오류발생
						REGEX_TEST_STRING.matches(trancedPartten);
					}
				}
			}
		} catch (Exception e) {
			isPass = false;
		}
		return isPass;
	}
}
