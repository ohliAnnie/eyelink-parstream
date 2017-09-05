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

/**
 * 페이징처리를 위한 유틸리티
 */
public class PagingUtil {
    /**
     * 한페이지당 리스트 개수
     */
    public final int PAGESIZE = 20;
    /**
     * 페이징 그룹 개수
     */
    public final int PAGEGROUP = 10;


    /**
     * The Page num.
     */
    private int pageNum;
    /**
     * The Total count.
     */
    private int totalCount;
    /**
     * The End row.
     */
    private int endRow;
    /**
     * The Start row.
     */
    private int startRow;
    /**
     * The End page.
     */
    private int endPage;
    /**
     * The Start page.
     */
    private int startPage;
    /**
     * The Total page.
     */
    private int totalPageCount;

    /**
     * Instantiates a new Paging util.
     *
     * @param pageNum the page num
     * @param totalCount the total count
     */
    public PagingUtil(int pageNum, int totalCount) {
        this.pageNum = pageNum;
        this.totalCount = totalCount;
    }

    /**
     * Gets end row.
     *
     * @return the end row
     */
    public int getEndRow() {
        return endRow;
    }

    /**
     * Gets start row.
     *
     * @return the start row
     */
    public int getStartRow() {
        return startRow;
    }
    
    /**
     * Gets end page.
     *
     * @return the end page
     */
    public int getEndPage() {
        return endPage;
    }
    
    /**
     * Gets start page.
     *
     * @return the start page
     */
    public int getStartPage() {
        return startPage;
    }  
    
    /**
     * Gets PAGESIZE.
     *
     * @return the PAGESIZE
     */
    public int getPAGESIZE() {
		return PAGESIZE;
	}
    
    /**
     * Gets PAGEGROUP.
     *
     * @return the PAGEGROUP
     */
	public int getPAGEGROUP() {
		return PAGEGROUP;
	}
	
	/**
     * Gets page num.
     *
     * @return the page num
     */
	public int getPageNum() {
		return pageNum;
	}
	
	/**
     * Gets total count.
     *
     * @return the total count
     */
	public int getTotalCount() {
		return totalCount;
	}

    /**
     * Invoke paging util.
     *
     * @return the paging util
     */
    public PagingUtil invoke() {
        // 페이지 갯수
        totalPageCount = totalCount / PAGESIZE;

        // 0으로 나눠 떨어지지 않을경우 페이지 갯수를 +1한다.
        if (totalCount % PAGESIZE != 0) {
            totalPageCount++;
        }

        // startPage or endPage
        startPage = (pageNum - 1) / PAGEGROUP * PAGEGROUP + 1;
        endPage = startPage + (PAGEGROUP - 1);

        if (endPage > totalPageCount) {
            endPage = totalPageCount;
        }

        // 마지막, 처음 rowNumber 선언 및 초기화
        endRow = PAGESIZE * pageNum;
        startRow = endRow - PAGESIZE + 1;
        return this;
    }

    public int getTotalPageCount() {
        return totalPageCount;
    }
}
