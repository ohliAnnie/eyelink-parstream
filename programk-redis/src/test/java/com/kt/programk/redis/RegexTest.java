package com.kt.programk.redis;

import org.junit.Test;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Administrator on 2016-08-10.
 */
public class RegexTest {
    /**
     * 봇아이디를 찾는다.
     */
    @Test
    public void test1() {
        String message = "PREDICATE_AutoBot_preludio_0000_33";

        String str = message.replace("PREDICATE_", "");
        str = "AutoBot_preludio_0000_33";
        System.out.println("Org : " + str);

        String botRegex = "(?>(^.*?)_).*";
        Pattern pattern = Pattern.compile(botRegex);
        Matcher matcher = pattern.matcher(str);

        String botId = null;
        if (matcher.matches()) {
            botId = matcher.group(1);
            System.out.println("botid : " + botId);
        }else{
            System.out.println("not found");
        }

        String userId = null;

        if(botId != null){
            System.out.println("userid : " + str.replace(botId + "_", ""));
        }
    }

    /**
     * 봇아이디중에서 -01,-2를 제거한 문자를 찾는다.
     */
    @Test
    public void test2() {
        String message = "Auto_Bot-01";

        System.out.println("Org : " + message);

        String botRegex = "(?>(^.*?)-(01|02))";
        Pattern pattern = Pattern.compile(botRegex);
        Matcher matcher = pattern.matcher(message);

        String botId = null;
        if (matcher.matches()) {
            botId = matcher.group(1);
            System.out.println("botid : " + botId);
        }
    }

    @Test
    public void test3() {
        String message = "플러스 검색 INTRO NAME 홍길동 OLLEHID";

        System.out.println("원본 : " + message);

        String botRegex = "(플러스 검색 INTRO NAME).*";
        Pattern pattern = Pattern.compile(botRegex);
        Matcher matcher = pattern.matcher(message);

        if (matcher.matches()) {
            System.out.println("찾은 문자 : " + matcher.group(1));
        }else{
            System.out.println("Not Found");
        }
    }
}
