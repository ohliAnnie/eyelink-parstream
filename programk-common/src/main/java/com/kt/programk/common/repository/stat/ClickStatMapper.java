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
 * Seo Jong Hwa        2016 . 7 . 12
 */

package com.kt.programk.common.repository.stat;

import com.kt.programk.common.domain.category.AimlCategory;
import com.kt.programk.common.domain.core.AimlMain;
import com.kt.programk.common.domain.core.AimlPredicate;
import com.kt.programk.common.domain.stat.ClickStat;
import org.apache.ibatis.annotations.Param;
import org.postgresql.util.PGInterval;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

/**
 * The interface Click stat mapper.
 */
@Repository(value = "clickStatMapper")
public interface ClickStatMapper {
    /**
     * user 통계  Count all int.
     *
     * @param clickStat the click stat
     * @return the int
     */
    public int countByPeriodUser(ClickStat clickStat);

    /**
     * user 통계 조회
     *
     * @param clickStat the click stat
     * @return list list
     */
    public List<ClickStat> selectListByPeriodMonth(ClickStat clickStat);

    /**
     * Select list by period day list.
     *
     * @param clickStat the click stat
     * @return the list
     */
    public List<ClickStat> selectListByPeriodDay(ClickStat clickStat);

    /**
     * Select list by period time list.
     *
     * @param clickStat the click stat
     * @return the list
     */
    public List<ClickStat> selectListByPeriodTime(ClickStat clickStat);

    /**
     * Select list by period user list.
     *
     * @param clickStat the click stat
     * @return the list
     */
    public List<ClickStat> selectListByPeriodUser(ClickStat clickStat);

    /**
     * 검색순위 통계 조회
     *
     * @param clickStat the click stat
     * @return list list
     */
    public List<ClickStat> selectListByOrderCategory(ClickStat clickStat);

    /**
     * Select list by order input list.
     *
     * @param clickStat the click stat
     * @return the list
     */
    public List<ClickStat> selectListByOrderInput(ClickStat clickStat);

    /**
     * Select list by order user input list.
     *
     * @param clickStat the click stat
     * @return the list
     */
    public List<ClickStat> selectListByOrderUserInput(ClickStat clickStat);

    /**
     * 목록 조회
     *
     * @return list list
     */
    public List<AimlCategory> selectCategoryNameByStat();

    /**
     * 추가
     *
     * @return list list
     */
    public List<AimlMain> selectAimlNameByStat();


    /**
     * 시간대별 통계 추가
     *
     * @param map the map
     * @return int int
     */
    public int insertTimeStat(HashMap<String, Object> map);

    /**
     * 일별 통계
     *
     * @param map the map
     * @return int int
     */
    public int insertDayStat(HashMap<String, Object> map);

    /**
     * 월별 통계
     *
     * @param map the map
     * @return int int
     */
    public int insertMonthStat(HashMap<String, Object> map);

    /**
     * 일별 - 사용자별 통게
     *
     * @param map the map
     * @return int int
     */
    public int insertUserStat(HashMap<String, Object> map);

    /**
     * 일별 카테고리 통게
     *
     * @param map the map
     * @return int int
     */
    public int insertCategoryStat(HashMap<String, Object> map);

    /**
     * 일별 대화 통게
     *
     * @param map the map
     * @return int int
     */
    public int insertChatStat(HashMap<String, Object> map);

    /**
     * 사용자 질문 통계
     *
     * @param map the map
     * @return int int
     */
    public int insertInputUserStat(HashMap<String, Object> map);

    /**
     * Delete chat log int.
     *
     * @param n the n
     * @return the int
     */
    public int deleteChatLog(@Param("n") PGInterval n);

    /**
     * 삭제될 데이터의 총 개수를 가져온다.
     *
     * @param n the n
     * @return the int
     */
    public int countAimlPredicate(@Param("n") PGInterval n);

    /**
     * 페이징을 이용해 데이터를 조회한다.
     *
     * @param n                  the n
     * @param firstRecordIndex   the first record index
     * @param recordCountPerPage the record count per page
     * @return the list
     */
    public List<AimlPredicate> selectListAimlPredicate(@Param("n") PGInterval n,
                                                       @Param("firstRecordIndex") int firstRecordIndex,
                                                       @Param("recordCountPerPage") int recordCountPerPage);

    /**
     * Delete aiml predicate int.
     *
     * @param n the n
     * @return the int
     */
    public int deleteAimlPredicate(@Param("n") PGInterval n);
}
