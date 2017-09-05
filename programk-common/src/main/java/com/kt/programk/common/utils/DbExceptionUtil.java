/*
 *  Copyright (c) 2016 KT, Inc.
 *  All right reserved.
 *  This software is the confidential and proprietary information of KT
 *  , Inc. You shall not disclose such Confidential Information and
 *  shall use it only in accordance with the terms of the license agreement
 *  you entered into with KT.
 *
 *  Revision History
 *  Author Date Description
 *  ------------------ -------------- ------------------
 *  Seo Jong Hwa 16. 8. 22 오후 5:35
 *
 *
 */

package com.kt.programk.common.utils;

import com.kt.programk.common.exception.CommonCode;
import com.kt.programk.common.exception.ErrorCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.*;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.jdbc.InvalidResultSetAccessException;

import java.sql.SQLException;

/**
 * 데이터베이스 에러 코드를 상수 코드로 변경
 */
public class DbExceptionUtil {

    /**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(DbExceptionUtil.class);

    /**
     * Db exception handler sql exception.
     *
     * @param ex the ex
     * @return the sql exception
     */
    public static ErrorCode parseException(DataAccessException ex) {

        if (ex instanceof BadSqlGrammarException) {
            SQLException se = ((BadSqlGrammarException) ex).getSQLException();
            LOG.debug("**************************************************");
            LOG.debug("** BadSqlGrammarException {} ", se.getErrorCode());
            LOG.debug("**************************************************");
            return CommonCode.BAD_SQL_GRAMMAR_EXCEPTION;
        } else if (ex instanceof InvalidResultSetAccessException) {
            SQLException se = ((InvalidResultSetAccessException) ex).getSQLException();
            LOG.debug("**************************************************");
            LOG.debug("** InvalidResultSetAccessException {} ", se.getErrorCode());
            LOG.debug("**************************************************");
            return CommonCode.INVALID_RESULT_SET_ACCESS_EXCEPTION;
        } else if (ex instanceof DuplicateKeyException) {
            LOG.debug("**************************************************");
            LOG.debug("** DuplicateKeyException {} ", ex.getMessage());
            LOG.debug("**************************************************");
            return CommonCode.DUPLICATE_KEY_EXCEPTION;
        } else if (ex instanceof DataIntegrityViolationException) {
            LOG.debug("**************************************************");
            LOG.debug("** DataIntegrityViolationException {} ", ex.getMessage());
            LOG.debug("**************************************************");
            return CommonCode.DATA_INTEGRITY_VIOLATION_EXCEPTION;
        } else if (ex instanceof DataAccessResourceFailureException) {
            LOG.debug("**************************************************");
            LOG.debug("** DataAccessResourceFailureException {} ", ex.getMessage());
            LOG.debug("**************************************************");
            return CommonCode.DATA_ACCESS_RESOURCE_FAILURE_EXCEPTION;
        } else if (ex instanceof CannotAcquireLockException) {
            LOG.debug("**************************************************");
            LOG.debug("** CannotAcquireLockException {} ", ex.getMessage());
            LOG.debug("**************************************************");
            return CommonCode.DATA_ACCESS_RESOURCE_FAILURE_EXCEPTION;
        } else if (ex instanceof DeadlockLoserDataAccessException) {
            LOG.debug("**************************************************");
            LOG.debug("** DeadlockLoserDataAccessException {} ", ex.getMessage());
            LOG.debug("**************************************************");
            return CommonCode.DEADLOCK_LOSER_DATA_ACCESS_EXCEPTION;
        } else if (ex instanceof CannotSerializeTransactionException) {
            LOG.debug("**************************************************");
            LOG.debug("** CannotSerializeTransactionException {} ", ex.getMessage());
            LOG.debug("**************************************************");
            return CommonCode.CANNOT_SERIALIZE_TRANSACTION_EXCEPTION;
        } else if (ex instanceof PermissionDeniedDataAccessException) {
            LOG.debug("**************************************************");
            LOG.debug("** PermissionDeniedDataAccessException {} ", ex.getMessage());
            LOG.debug("**************************************************");
            return CommonCode.PERMISSION_DENIED_DATA_ACCESS_EXCEPTION;
        } else {
            LOG.debug("**************************************************");
            LOG.debug("**Unknown Exception", ex);
            LOG.debug("**************************************************");
            return CommonCode.UNCATEGORIZED_SQL_EXCEPTION;
        }
    }
}
