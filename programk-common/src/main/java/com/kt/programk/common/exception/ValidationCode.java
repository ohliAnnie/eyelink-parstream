/*
 * Copyright (c) 2016 KT, Inc.
 * All right reserved.
 * This software is the confidential and proprietary information of KT
 * , Inc. You shall not disclose such Confidential Information and
 * shall use it only in accordance with the terms of the license agreement
 * you entered into with KT.
 *
 * Revision History
 * Author              Date                  Description
 * ------------------   --------------       ------------------
 * Seo Jong Hwa        2016 . 6 . 21
 */

package com.kt.programk.common.exception;

/**
 * 데이터 유효성 검증 오류 코드
 */
public enum ValidationCode implements ErrorCode {
    /**
     * 필수 항목입니다.
     */
    VALID_REQUIRED(10000),
    /**
     * 항목을 수정하세요.
     */
    VALID_REMOTE(10001),
    /**
     * 유효하지 않은 E-MAIL주소입니다.
     */
    VALID_EMAIL(10002),
    /**
     * 유효하지 않은 URL입니다.
     */
    VALID_URL(10003),
    /**
     * 올바른 날짜를 입력하세요.
     */
    VALID_DATE(10004),
    /**
     * 올바른 날짜(ISO)를 입력하세요.
     */
    VALID_DATEISO(10005),
    /**
     * 유효한 숫자가 아닙니다
     */
    VALID_NUMBER(10006),
    /**
     * 숫자만 입력 가능합니다.
     */
    VALID_DIGITS(10007),
    /**
     * 신용카드 번호가 바르지 않습니다.
     */
    VALID_CREDITCARD(10008),
    /**
     * 같은 값을 다시 입력하세요.
     */
    VALID_EQUALTO(10009),
    /**
     * 올바른 확장자가 아닙니다
     */
    VALID_EXTENSION(10010),
    /**
     * {0}자를 넘을 수 없습니다.
     */
    VALID_MAXLENGTH(10012),
    /**
     * {0}자 이상 입력하세요..
     */
    VALID_MINLENGTH(10103),
    /**
     * 문자 길이가 {0} 에서 {1} 사이의 값을 입력하세요.
     */
    VALID_RANGELENGTH(10014),
    /**
     * {0} 에서 {1} 사이의 값을 입력하세요.
     */
    VALID_RANGE(10015),
    /**
     * {0} 이하의 값을 입력하세요.
     */
    VALID_MAX(10016),
    /**
     * {0} 이상의 값을 입력하세요.
     */
    VALID_MIN(10017);

    /**
     * The Number.
     */
    private final int number;

    /**
     * Instantiates a new Validation code.
     *
     * @param number the number
     */
    private ValidationCode(int number) {
        this.number = number;
    }

    @Override
    public int getNumber() {
        return number;
    }

}
