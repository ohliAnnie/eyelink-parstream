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
 * 시스템 공통 에러 규칙
 */
public enum CommonCode implements ErrorCode {
    /**
     * 부적합한/잘못된 열 이름 에러
     */
    BAD_SQL_GRAMMAR_EXCEPTION(10002),

    /**
     * SQL문장에서 변수를 잘못넣어 주었거나 해서 컬럼의 갯수가 안 맞을 때
     */
    INVALID_RESULT_SET_ACCESS_EXCEPTION(10003),

    /**
     * 중복된 키가 존재할 때
     */
    DUPLICATE_KEY_EXCEPTION(10004),

    /**
     * 삽입 또는 업데이트의 결과 데이터의 일관성을 유지할 수없는 경우
     */
    DATA_INTEGRITY_VIOLATION_EXCEPTION(10005),

    /**
     * 데이터 베이스 커넥션을 잃어 버렸을 때
     */
    DATA_ACCESS_RESOURCE_FAILURE_EXCEPTION(10006),

    /**
     * 락에 실패 했을 때
     */
    CANNOT_ACQUIRE_LOCK_EXCEPTION(10007),

    /**
     * 교착 상태가 발생 했을 때
     */
    DEADLOCK_LOSER_DATA_ACCESS_EXCEPTION(10008),

    /**
     * 트랜잭션 격리 수준이 SERIALIZABLE이면서 다른 트랜잭션의 완료를 기다리고있는 트랜잭션이 완료되지 않은 경우
     */
    CANNOT_SERIALIZE_TRANSACTION_EXCEPTION(10009),

    /**
     * 데이터 접근 권한이 없을 경우
     */
    PERMISSION_DENIED_DATA_ACCESS_EXCEPTION(10010),

    /**
     * 발생한 오류 코드가 SQL의 예외 클래스에 해당하지 않는 경우
     */
    UNCATEGORIZED_SQL_EXCEPTION(10011),

    /**
     * 알수 없는 오류
     */
    UNKNOWN_ERROR(20001),
    /**
     * 데이터베이스 쿼리 실행 오류
     */
    DATABASE_CONNECTION_ERROR(20002),
    /**
     * 데이터베이스 쿼리 실행 오류
     */
    DATABASE_EXECUTE_ERROR(20005),
    /**
     * HIve 쿼리 실행 오류
     */
    HIVE_EXECUTE_ERROR(20006),

    // ----------------------------------------------------------------------------------------------
    /**
     * The UTIL_PARER_ERROR : Date Format 에러 - DateUtil.convertUserDate
     */
    UTIL_DATEPARSER_ERROR(20007),

    /**
     * The UTIL_INPUTSTREAM_IO_ERROR : InputStream IO 에러 - FileUtil.getClasspathAsStream
     */
    UTIL_INPUTSTREAM_IO_ERROR(20008),

    /**
     * The UTIL_DECODING_ERROR : Decoding 에러 - FileUtil.uploadedFileName
     */
    UTIL_DECODING_ERROR(20009),

    /**
     * The UTIL_ENCODING_ERROR : Decoding 에러 - FileUtil.searchFileReader
     */
    UTIL_ENCODING_ERROR(20010),

    /**
     * The UTIL_FILE_DELETE_ERROR : File Delete 에러 - FileUtil.deleteFullPathFile
     */
    UTIL_FILE_DELETE_ERROR(20011),

    /**
     * The UTIL_FILE_FILENOTFOUND_ERROR : File 없음 에러 - FileUtil.deleteFullPathFile
     */
    UTIL_FILE_FILENOTFOUND_ERROR(20012),

    /**
     * The UTIL_VALIDATE_FIELD_ERROR : 필드 Vaild 에러 - FileUtil.validateRequiredField
     */
    UTIL_VALIDATE_FIELD_ERROR(20013),

    /**
     * The UTIL_FILE_CREATE_ERROR : File 생성 에러 - FileUtil.getFileLength
     */
    UTIL_FILE_CREATE_ERROR(20014),

    /**
     * The UTIL_FILE_CHANNEL_ERROR : File getChannel 에러 - FileUtil.getChannel
     */
    UTIL_FILE_CHANNEL_ERROR(20015),

    /**
     * The UTIL_FILE_READ_ERROR : File Read 에러 - FileUtil.copyDirectory
     */
    UTIL_FILE_READ_ERROR(20016),

    /**
     * The UTIL_FILE_WRITE_ERROR : File Read 에러 - FileUtil.createFile
     */
    UTIL_FILE_WRITE_ERROR(20017),

    /**
     * The UTIL_FILE_CLOSE_ERROR : File Close 에러 - FileUtil.copyFile
     */
    UTIL_FILE_CLOSE_ERROR(20018),

    /**
     * The UTIL_PATTEN_RESOURCE_ERROR : PAtten Resource 에러 - FileUtil.searchFileReader
     */
    UTIL_PATTEN_RESOURCE_ERROR(20019),

    /**
     * The UTIL_NET_GETIPNAME_ERROR : Network IP Get Name 에러 - FileUtil.parseAddress
     */
    UTIL_NET_GETIPNAME_ERROR(20020),

    /**
     * The UTIL_NET_COOKIEIP_ERROR : Network IP Cookie  에러
     */
    UTIL_NET_COOKIEIP_ERROR(20021),



    /**
     * The UTIL_URL_GETRESOURCE_ERROR : Url Get Resource 에러
     */
    UTIL_URL_GETRESOURCE_ERROR(20042),

    /**
     * The UTIL_URL_CONNECT_ERROR : Url Open Connect 에러
     */
    UTIL_URL_CONNECT_ERROR(20043),

    /**
     * The UTIL_URL_CREATE_ERROR : Url Create 에러
     */
    UTIL_URL_CREATE_ERROR(20044),

    /**
     * The UTIL_CONFIG_LOAD_ERROR : Config Load 에러
     */
    UTIL_CONFIG_LOAD_ERROR(20045),

    /**
     * The UTIL_MARSHALLING_JSON_ERROR : Object marshallingJson 에러
     */
    UTIL_MARSHALLING_JSON_ERROR(20046),

    /**
     * The COM_MAP_KEYNOTFOUNF_ERROR : Map Key Not Found 에러
     */
    COM_MAP_KEYNOTFOUNF_ERROR(20047),

    /**
     * The COM_DB_CLOSE_ERROR : DB Close 에러
     */
    COM_DB_CLOSE_ERROR(20048),

    /**
     * The SCHEDULE_JOB_ERROR : schedule job 에러
     */
    SCHEDULE_JOB_ERROR(20049),

    /**
     * The SCHEDULE_JOB_EXE_ERROR : schedule job execution 에러
     */
    SCHEDULE_JOB_EXE_ERROR(20050),

    /**
     * The SCHEDULE_JOB_DELETE_ERROR : schedule job delete 에러
     */
    SCHEDULE_JOB_DELETE_ERROR(20051),

    /**
     * The SCHEDULE_JOB_TRIGGER_ERROR : schedule job trigger 에러
     */
    SCHEDULE_JOB_TRIGGER_ERROR(20052),

    /**
     * The THIRD_PROCEED_ERROR : third proceed  에러
     */
    THIRD_PROCEED_ERROR(20053),

    /**
     * The COM_VALUE_VALIDATE_ERROR : Value Validate 에러
     */
    COM_VALUE_VALIDATE_ERROR(20039),

    END_ERROR(30000);
    /**
     * The Number.
     */
    private final int number;

    /**
     * Instantiates a new Common code.
     *
     * @param number the number
     */
    private CommonCode(int number) {
        this.number = number;
    }

    @Override
    public int getNumber() {
        return number;
    }
}
