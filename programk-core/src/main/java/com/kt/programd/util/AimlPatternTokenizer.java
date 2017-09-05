package com.kt.programd.util;

import org.aitools.programd.util.StringKit;

import java.util.ArrayList;
import java.util.Arrays;


public class AimlPatternTokenizer {

    private static String DELIMITER = "/";
    private static String LEFT_PARENTHESIS = "\\{";
    private static String RIGHT_PARENTHESIS = "\\}";
    private static String OPT_MARKER = "OPT_MARKER";
    private static String EMPTY_STRING = "";

    // print all subsets of the characters in s
    public static void combString(String[] s, ArrayList<String> temp) {
        combString("", s, temp);
    }

    // print all subsets of the remaining elements, with given prefix 
    private static void combString(String prefix, String[] s, ArrayList<String> temp) {
        if (s.length > 0) {
            temp.add(prefix + " " + s[0]);
            combString(prefix + " " + s[0], Arrays.copyOfRange(s, 1, s.length), temp);
            combString(prefix, Arrays.copyOfRange(s, 1, s.length), temp);
        }
    }


    public static ArrayList<String> getPatterns(String input) {

        ArrayList<String> tokenizedInput = new ArrayList<String>();

        if (input == null || input.equalsIgnoreCase(EMPTY_STRING)) {
            tokenizedInput.add(null);
            return tokenizedInput;
        }

        ArrayList<String> patternTosplit = StringKit.wordSplitter(input);
        ArrayList<String> tokenizedPattern = new ArrayList<String>();

        for (int i = 0; i < patternTosplit.size(); i++) {
            if (patternTosplit.get(i).matches("^\\{.*?\\}$")) //token이 { }인 것을 찾는다.
            {
                tokenizedPattern.add(i + DELIMITER + patternTosplit.get(i).replaceAll(LEFT_PARENTHESIS, "").replaceAll(RIGHT_PARENTHESIS, ""));
                patternTosplit.set(i, OPT_MARKER);
            }
        }

        String[] tokenizedPatternArray = new String[tokenizedPattern.size()];
        tokenizedPattern.toArray(tokenizedPatternArray);

        ArrayList<String> result = new ArrayList<String>();
        combString(tokenizedPatternArray, result);

        result.add(EMPTY_STRING); //add empty string, 옵션이 모두 발생하지 않을 경우를 위해

        for (int i = 0; i < result.size(); i++) {
            ArrayList<String> tempRes = StringKit.wordSplitter(result.get(i));
            tokenizedInput.add(makeSub(tempRes, patternTosplit));
        }
        return tokenizedInput;
    }


    private static String makeSub(ArrayList<String> temp, ArrayList<String> ori) {
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < ori.size(); i++) {
            if (ori.get(i).equalsIgnoreCase(OPT_MARKER)) {
                sb.append(getSubstitution(temp, i)).append(" ");
            } else {
                sb.append(ori.get(i)).append(" ");
            }
        }
        return sb.toString().trim().replaceAll("[ ]+", " ");
    }

    private static String getSubstitution(ArrayList<String> temp, int index) {
        for (int i = 0; i < temp.size(); i++) {
            int markerIndex = temp.get(i).indexOf(DELIMITER);

            if (markerIndex > -1) {
                if (temp.get(i).substring(0, markerIndex).startsWith(String.valueOf(index))) {
                    String value = temp.get(i).substring(markerIndex + 1);
                    return value;
                }
            }
        }
        return "";
    }


    //For Test
    // read in N from command line, and print all subsets among N elements
    public static void main(String[] args) {

        String originalPattern = "ABC {TEST1} {TEST1-1} EDF {TEST2} EXQ ";
        System.out.println(getPatterns(originalPattern));
    }
}