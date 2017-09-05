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
 * Seo Jong Hwa        2016 . 6 . 27
 */

package com.kt.programk.common.exception;

/**
 * 서비스 단에서 사용하는 공통 에러 규칙
 */
public enum BizErrCode implements ErrCodable{
    ERR_0001("ERR_0001", "%1은(는) 널 값이 허용되지 않습니다."),
    /**
     * %1은(는) 필수 입력 항목입니다.
     */
    ERR_0002("ERR_0002", "%1은(는) 필수 입력 항목입니다."),
    /**
     * %1은(는) 존재하지 않습니다.
     */
    ERR_0003("ERR_0003", "%1이(가) 존재하지 않습니다."),
    /**
     * %1이(가) 불일치합니다.
     */
    ERR_0004("ERR_0004", "%1이(가) 불일치합니다."),
    /**
     * Err 0004 programk biz err code.
     */
    ERR_0005("ERR_0005", "%1이(가) 중복된 데이터 입니다."),
    /**
     * Err 0005 programk biz err code.
     */
    ERR_0006("ERR_0006", "%1이(가) 유효하지 않은 값 입니다."),
    /**
     * Err 0007 programk biz err code.
     */
    ERR_0007("ERR_0007", "잘못된 접근입니다."),
    ;

    /**
     * The Err code.
     */
    private String errCode;
    /**
     * The Msg.
     */
    private String msg;

    /**
     * Gets err code.
     *
     * @return the err code
     */
    @Override
    public String getErrCode() {
        return this.errCode;
    }

    /**
     * Gets message.
     *
     * @param args the args
     * @return the message
     */
    @Override
    public String getMessage(String... args) {
        return ErrCodeUtil.parseMessage(this.msg, args);
    }

    /**
     * Instantiates a new Programk service error code.
     *
     * @param errCode the err code
     * @param msg     the msg
     */
    BizErrCode(String errCode, String msg) {
        this.errCode = errCode;
        this.msg = msg;
    }
}
