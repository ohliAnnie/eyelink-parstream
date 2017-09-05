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
 *  Seo Jong Hwa 16. 8. 22 오후 5:11
 *
 *
 */

package com.kt.programk.common.domain;

/**
 * 페이징에 필요한 정보를 보유.
 */
public class PagingExample {

    /**
     * 선택한 페이지 번호.
     */
    private Integer recordCountPerPage = 20;

    /**
     * 현재 페이지 번호
     */
    private Integer currentPageNo = 1;

    /**
     * 첫번째 레코드.
     */
    private Integer firstRecordIndex = 0;

    /**
     * 페이징을 피하고 싶을 경우
     */
    private boolean isNotPaging;


    // - [ interface  methods ] -------------------------------------
    // - [ protected methods ] --------------------------------------
    // - [ public methods ] -----------------------------------------
    // - [ private methods ] ----------------------------------------
    // - [ static methods ] -----------------------------------------

    /**
     * Gets the record count per page.
     *
     * @return the record count per page
     */
// - [ getter/setter methods ] ----------------------------------
    public Integer getRecordCountPerPage() {
        return recordCountPerPage;
    }

    /**
     * Sets the record count per page.
     *
     * @param recordCountPerPage the new record count per page
     */
    public void setRecordCountPerPage(Integer recordCountPerPage) {
        this.recordCountPerPage = recordCountPerPage;
    }

    /**
     * Gets the first record index.
     *
     * @return the first record index
     */
    public Integer getFirstRecordIndex() {
        return firstRecordIndex;
    }

    /**
     * Sets the first record index.
     *
     * @param firstRecordIndex the new first record index
     */
    public void setFirstRecordIndex(Integer firstRecordIndex) {
        this.firstRecordIndex = firstRecordIndex;
    }

    /**
     * Is not paging boolean.
     *
     * @return the boolean
     */
    public boolean isNotPaging() {
        return isNotPaging;
    }

    /**
     * Sets not paging.
     *
     * @param isNotPaging the is not paging
     */
    public void setNotPaging(boolean isNotPaging) {
        this.isNotPaging = isNotPaging;
    }

    /**
     * Gets current page no.
     *
     * @return the current page no
     */
    public Integer getCurrentPageNo() {
        return currentPageNo;
    }

    /**
     * Sets current page no.
     *
     * @param currentPageNo the current page no
     */
    public void setCurrentPageNo(Integer currentPageNo) {
        this.currentPageNo = currentPageNo;
    }


    // - [ main methods ] -------------------------------------------
}
