/*
 *  Copyright (c) {year} {comp}, Inc.
 *  * All right reserved.
 *  * http://www.unus.com
 *  * This software is the confidential and proprietary information of {comp}
 *  * , Inc. You shall not disclose such Confidential Information and
 *  * shall use it only in accordance with the terms of the license agreement
 *  * you entered into with {comp}.
 *  *
 *  * Revision History
 *  * Author              Date                  Description
 *  * ------------------   --------------       ------------------
 *  *  Seo Jong Hwa         15. 9. 7 오전 11:37
 *
 */

package com.kt.programk.common.utils;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.Days;
import org.joda.time.Period;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Created by Administrator on 2015-09-07.
 */
public class JodaDateUtil {

    /**
     * The constant utc.
     */
    final static DateTimeZone utc = DateTimeZone.forID("UTC");

    /**
     * 현재 날짜 조회
     *
     * @return string current day
     */
    static public String getCurrentDay() {
        DateTime dateTime = new DateTime(new Date());
        DateTimeFormatter dtf = DateTimeFormat.forPattern("yyyy-MM-dd");

        return dtf.print(dateTime);
    }

    /**
     * 리포트 생성시 발행일
     *
     * @return report current day
     */
    static public String getReportCurrentDay() {
        DateTime dateTime = new DateTime(new Date());
        return dateTime.getYear() + "년 " + dateTime.getMonthOfYear() + "월 " + dateTime.getDayOfMonth() + "일";
    }

    /**
     * 날짜를 스트링 형식으로 변환한다.
     *
     * @param date    the date
     * @param pattern the pattern
     * @return string string
     */
    static public String dateToString(Date date, String pattern) {
        if (date != null) {
            DateTime dateTime = new DateTime(date);
            DateTimeFormatter dtf = DateTimeFormat.forPattern(pattern);
            return dtf.print(dateTime);
        } else {
            return "";
        }
    }

    /**
     * 사용자가 입력한 형식에 맞는 현재 날짜 조회
     *
     * @param pattern the pattern
     * @return string current day
     */
    static public String getCurrentDay(String pattern) {
        DateTime dateTime = new DateTime(new Date());
        DateTimeFormatter dtf = DateTimeFormat.forPattern(pattern);

        return dtf.print(dateTime);
    }

    /**
     * 현재 날짜, 시간 조회
     *
     * @return string current time
     */
    static public String getCurrentTime() {
        DateTime dateTime = new DateTime(new Date());
        DateTimeFormatter dtf = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss");

        return dtf.print(dateTime);
    }

    /**
     * 사용자가 입력한 형식에 맞는 현재 날짜, 시간 조회
     *
     * @param pattern the pattern
     * @return string current time
     */
    static public String getCurrentTime(String pattern) {
        DateTime dateTime = new DateTime(new Date());
        DateTimeFormatter dtf = DateTimeFormat.forPattern(pattern);

        return dtf.print(dateTime);
    }

    /**
     * 현재 년월 조회
     *
     * @return string this month
     */
    static public String getThisMonth() {
        DateTime dateTime = new DateTime(new Date());
        DateTimeFormatter dtf = DateTimeFormat.forPattern("yyyy-MM");
        return dtf.print(dateTime);
    }

    /**
     * 현재 년 조회
     *
     * @return string this year
     */
    static public String getThisYear() {
        int year = DateTime.now().getYear();
        return String.valueOf(year);
    }

    /**
     * 현재 시간 조회
     *
     * @return string current hour
     */
    static public String getCurrentHour() {
        int hourOfDay = DateTime.now().getHourOfDay();
        return String.valueOf(hourOfDay);
    }

    /**
     * 입력 받은 날짜의 요일을 반환
     *
     * @param str "2010-11-26"
     * @return 금 string
     */
    static public String getDayOfWeek(String str) {
        DateTime parse = DateTime.parse(str);
        DateTimeFormatter dtf = DateTimeFormat.forPattern("E");
        return dtf.print(parse);
    }

    /**
     * 입력받은 일자의 요일 반환 - Locale 정보를 받아 해당하는 언어에 대해서 약어로 보여주거나 전체 요일 형태로 보여준다.
     *
     * @param str          "2014-09-10"
     * @param abbreviation the abbreviation
     * @param locale       the locale
     * @return string day of week
     */
    static public String getDayOfWeek(String str, Boolean abbreviation, Locale locale) {
        DateTime parse = DateTime.parse(str);

        String weekFormat = "E";
        if (abbreviation == false) {
            weekFormat = "EEEE";
        }
        DateTimeFormatter dtf = DateTimeFormat.forPattern(weekFormat).withLocale(locale);
        return dtf.print(parse);
    }

    /**
     * 입력받은 두 날짜 사이의 일자 계산
     *
     * @param start the start
     * @param end   the end
     * @return int days
     */
    static public int getDays(String start, String end) {
        DateTimeFormatter dtForm = DateTimeFormat.forPattern("yyyy-MM-dd");
        DateTime firstDate = dtForm.parseDateTime(start);
        DateTime secondDate = dtForm.parseDateTime(end);

        int days = Days.daysBetween(firstDate, secondDate).getDays();
        return days > 0 ? days + 1 : days;
    }

    /**
     * Gets days.
     *
     * @param start   the start
     * @param end     the end
     * @param pattern the pattern
     * @return the days
     */
    static public int getDays(String start, String end, String pattern) {
        DateTimeFormatter dtForm = DateTimeFormat.forPattern(pattern);
        DateTime firstDate = dtForm.parseDateTime(start);
        DateTime secondDate = dtForm.parseDateTime(end);

        int days = Days.daysBetween(firstDate, secondDate).getDays();
        return days > 0 ? days + 1 : days;
    }

    /**
     * 입력받은 두 날짜사이의 시간 계산
     *
     * @param start the start
     * @param end   the end
     * @return period times
     */
    static public Period getTimes(String start, String end) {
        DateTimeFormatter dtForm = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss");
        DateTime firstDate = dtForm.parseDateTime(start);
        DateTime secondDate = dtForm.parseDateTime(end);
        Period period = new Period(firstDate, secondDate);

        return period;
    }

    /**
     * Get times.
     *
     * @param start the start
     * @param end   the end
     * @return the period
     */
    static public Period getTimes(Date start, Date end) {
        DateTime firstDate = new DateTime(start);
        DateTime secondDate = new DateTime(end);
        Period period = new Period(firstDate, secondDate);

        return period;
    }

    /**
     * 입력 받은 두 일자가 같은지 검사
     *
     * @param millis  the millis
     * @param date    the date
     * @param pattern the pattern
     * @return boolean boolean
     */
    static public boolean equals(long millis, String date, String pattern) {
        DateTime now = new DateTime(millis);
        DateTimeFormatter dtForm = DateTimeFormat.forPattern(pattern);

        return date.equals(dtForm.print(now));
    }

    /**
     * 지금으로 부터 몇초전 시간을 구함
     *
     * @param seconds the seconds
     * @param pattern the pattern
     * @return string minus seconds
     */
    static public String getMinusSeconds(int seconds, String pattern) {
        DateTime dateTime = new DateTime(new Date());
        DateTime subtracted = dateTime.minusSeconds(seconds);
        return subtracted.toString(pattern);
    }

    /**
     * 지금으로 부터 몇초후 시간을 구함
     *
     * @param seconds the seconds
     * @param pattern the pattern
     * @return string plus seconds
     */
    static public String getPlusSeconds(int seconds, String pattern) {
        DateTime dateTime = new DateTime(new Date());
        DateTime subtracted = dateTime.plusSeconds(seconds);
        return subtracted.toString(pattern);
    }


    /**
     * 지금으로 부터 몇시간 전 시간을 구함
     *
     * @param hours   the hours
     * @param pattern the pattern
     * @return string minus hours
     */
    static public String getMinusHours(int hours, String pattern) {
        //DateTime dateTime = new DateTime(new Date(), utc);
        DateTime dateTime = new DateTime(new Date());
        DateTime subtracted = dateTime.minusHours(hours);
        return subtracted.toString(pattern);
    }

    /**
     * 지금으로 부터 몇시간 후 시간을 구함
     *
     * @param hours   the hours
     * @param pattern the pattern
     * @return string plus hours
     */
    static public String getPlusHours(int hours, String pattern) {
        DateTime dateTime = new DateTime(new Date());
        DateTime subtracted = dateTime.plusHours(hours);
        return subtracted.toString(pattern);
    }

    /**
     * 지금으로 부터 몇일 전 시간을 구함
     *
     * @param days    the days
     * @param pattern the pattern
     * @return string minus days
     */
    static public String getMinusDays(int days, String pattern) {
        DateTime dateTime = new DateTime(new Date());
        DateTime subtracted = dateTime.minusDays(days);
        return subtracted.toString(pattern);
    }

    /**
     * 주어진 날짜로 부터 몇일전 날짜를 구함
     *
     * @param date    the date
     * @param days    the days
     * @param pattern the pattern
     * @return minus days
     */
    static public String getMinusDays(String date, int days, String pattern) {
//        DateTime dateTime = new DateTime(date);
//        DateTime subtracted = dateTime.minusDays(days);
        DateTimeFormatter formatter = DateTimeFormat.forPattern(pattern);
        DateTime dateTime = formatter.parseDateTime(date);
        DateTime subtracted = dateTime.minusDays(days);
        return subtracted.toString(pattern);
    }

    /**
     * 지금으로 부터 몇일 후 시간을 구함
     *
     * @param days    the days
     * @param pattern the pattern
     * @return string plus days
     */
    static public String getPlusDays(int days, String pattern) {
        DateTime dateTime = new DateTime(new Date());
        DateTime subtracted = dateTime.plusDays(days);
        return subtracted.toString(pattern);
    }

    /**
     * 지금으로 부터 몇주전 주일을 구함
     *
     * @param weeks   the weeks
     * @param pattern the pattern
     * @return string minus weeks
     */
    static public String getMinusWeeks(int weeks, String pattern) {
        DateTime dateTime = new DateTime(new Date());
        DateTime subtracted = dateTime.minusWeeks(weeks);
        return subtracted.toString(pattern);
    }

    /**
     * 지금으로 부터 몇주 후 주일을 구함
     *
     * @param weeks   the weeks
     * @param pattern the pattern
     * @return string plus weeks
     */
    static public String getPlusWeeks(int weeks, String pattern) {
        DateTime dateTime = new DateTime(new Date());
        DateTime subtracted = dateTime.plusWeeks(weeks);
        return subtracted.toString(pattern);
    }

    /**
     * 지금으로 부터 몇개월전 시간을 구함
     *
     * @param months  the months
     * @param pattern the pattern
     * @return string minus months
     */
    static public String getMinusMonths(int months, String pattern) {
        DateTime dateTime = new DateTime(new Date());
        DateTime subtracted = dateTime.minusMonths(months);
        return subtracted.toString(pattern);
    }

    /**
     * 지금으로 부터 몇개월후 시간을 구함
     *
     * @param months  the months
     * @param pattern the pattern
     * @return string plus months
     */
    static public String getPlusMonths(int months, String pattern) {
        DateTime dateTime = new DateTime(new Date());
        DateTime subtracted = dateTime.plusMonths(months);
        return subtracted.toString(pattern);
    }

    /**
     * 지금으로 부터 몇년전 시간을 구함
     *
     * @param years   the years
     * @param pattern the pattern
     * @return string minus years
     */
    static public String getMinusYears(int years, String pattern) {
        DateTime dateTime = new DateTime(new Date());
        DateTime subtracted = dateTime.minusYears(years);
        return subtracted.toString(pattern);
    }

    /**
     * 지금으로 부터 몇년 후 시간을 구함
     *
     * @param years   the years
     * @param pattern the pattern
     * @return string plus years
     */
    static public String getPlusYears(int years, String pattern) {
        DateTime dateTime = new DateTime(new Date());
        DateTime subtracted = dateTime.plusMonths(years);
        return subtracted.toString(pattern);
    }

    /**
     * 밀리세컨드 시간을 년월일로 바꾼다.
     *
     * @param timestamp the timestamp
     * @return string
     */
    static public String convertMillisecondsToDay(long timestamp) {
        DateTime dateTime = new DateTime(timestamp);
        DateTimeFormatter dtf = DateTimeFormat.forPattern("yyyy-MM-dd");

        return dtf.print(dateTime);
    }

    /**
     * 년/월/일을 구한다.
     *
     * @param date the date
     * @return month day
     */
    static public String getMonthDay(String date) {
        DateTime dateTime = new DateTime(date);
//        DateTimeFormatter dtf = DateTimeFormat.forPattern(pattern);

        return dateTime.getYearOfCentury() + "년 " + dateTime.getMonthOfYear() + "월 " + dateTime.getDayOfMonth() + "일";
    }

    /**
     * 월/일을 구한다.
     *
     * @param date the date
     * @return day
     */
    static public String getDay(String date) {
        DateTime dateTime = new DateTime(date);
//        DateTimeFormatter dtf = DateTimeFormat.forPattern(pattern);

        return dateTime.getMonthOfYear() + "월 " + dateTime.getDayOfMonth() + "일";
    }

    /**
     * 지금으로 부터 몇일 후 시간을 밀리세컨드로 구한다.
     *
     * @param day
     * @param pattern
     * @return
     * @throws ParseException
     */
    static public long getMilliseconds(int day, String pattern) throws ParseException {
        String plusDays = JodaDateUtil.getPlusDays(day, pattern);
        SimpleDateFormat formatter = new SimpleDateFormat(pattern); // Month.Day.Year

        Date d = formatter.parse(plusDays);
        long timestamp = d.getTime();
        return timestamp;
    }
}
