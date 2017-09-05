package com.kt.programk.common.domain.core;

import com.kt.programk.common.domain.PagingExample;

/**
 * 확장 필드
 */
public class AimlOption extends PagingExample{
    /**
     * 고유 번호
     */
    private int id;
    /**
     * 카테고리 고유 번호
     */
    private int cateId;
    /**
     * 대화 고유 번호
     */
    private int mainId;
    /**
     * 값
     */
    private String val;
    /**
     * 번호
     */
    private int seq;

    /**
     * Gets id.
     *
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * Sets id.
     *
     * @param id the id
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Gets cate id.
     *
     * @return the cate id
     */
    public int getCateId() {
        return cateId;
    }

    /**
     * Sets cate id.
     *
     * @param cateId the cate id
     */
    public void setCateId(int cateId) {
        this.cateId = cateId;
    }

    /**
     * Gets main id.
     *
     * @return the main id
     */
    public int getMainId() {
        return mainId;
    }

    /**
     * Sets main id.
     *
     * @param mainId the main id
     */
    public void setMainId(int mainId) {
        this.mainId = mainId;
    }

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
