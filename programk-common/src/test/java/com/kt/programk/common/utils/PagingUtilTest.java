/*
 * 플러스 검색 version 1.0
 * Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 * This is a proprietary software of kt corp, and you may not use this file except in
 * compliance with license agreement with kt corp. Any redistribution or use of this
 * software, with or without modification shall be strictly prohibited without prior written
 * approval of kt corp, and the copyright notice above does not evidence any actual or
 * intended publication of such software.
 *
 *  Revision History
 *  Author Date Description
 *  ------------------ -------------- ------------------
 *  Seo Jong Hwa 16. 8. 23 오후 4:44
 */

package com.kt.programk.common.utils;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by Administrator on 2016-08-23.
 */
public class PagingUtilTest {
    @Test
    public void invoke() throws Exception {
        PagingUtil pagingUtil = new PagingUtil(2, 10000).invoke();

        System.out.println("전체 개수 : " + pagingUtil.getTotalPageCount());

        for(int i = 1; i <= pagingUtil.getTotalCount(); i++){
            PagingUtil page = new PagingUtil(i, 100).invoke();
            System.out.print(page.getStartRow() - 1);
            System.out.println("," + page.getEndRow());
        }
    }

}