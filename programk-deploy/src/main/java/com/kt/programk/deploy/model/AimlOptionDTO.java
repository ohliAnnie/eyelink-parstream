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
 *  Seo Jong Hwa 16. 8. 23 오후 2:02
 */

package com.kt.programk.deploy.model;

/**
 * Created by Administrator on 2016-07-19.
 */
public class AimlOptionDTO {
    /**
     * The Val.
     */
    private String val;
    /**
     * The Seq.
     */
    private int seq;

    /**
     * Gets val.
     *
     * @return the val
     */
    public String getVal() {
        return val;
    }

    /**
     * Sets val.
     *
     * @param val the val
     */
    public void setVal(String val) {
        this.val = val;
    }

    /**
     * Gets seq.
     *
     * @return the seq
     */
    public int getSeq() {
        return seq;
    }

    /**
     * Sets seq.
     *
     * @param seq the seq
     */
    public void setSeq(int seq) {
        this.seq = seq;
    }
}
