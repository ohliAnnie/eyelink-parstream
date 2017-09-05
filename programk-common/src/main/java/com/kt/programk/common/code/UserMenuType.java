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
 *  Seo Jong Hwa 16. 8. 22 오후 5:03
 *
 *
 */

package com.kt.programk.common.code;

/**
 * CMS 사용자 메뉴 권한
 */
public enum UserMenuType {
    /**
     * menu type.
     */
    A000("1", "A000", "모니터링", "/listMonitoring", "icon1"),
    /**
     * A 100 user menu type.
     */
    A100("2", "A100", "모니터링", "", ""),
    /**
     * A 101 user menu type.
     */
    A101("3", "A101", "모니터링", "/listMonitoring", ""),
    /**
     * A 102 user menu type.
     */
    //A102("3", "A102", "작업공지", "/addNotice", ""),
    /**
     * B 000 user menu type.
     */
    B000("1", "B000", "CP 관리", "/listCp", "icon2"),
    /**
     * B 100 user menu type.
     */
    B100("2", "B100", "CP 관리", "", ""),
    /**
     * B 101 user menu type.
     */
    B101("3", "B101", "CP 관리", "listCp", ""),
    /**
     * C 000 user menu type.
     */
    C000("1", "C000", "사용자 관리", "/listCpUser", "icon3"),
    /**
     * C 100 user menu type.
     */
    C100("2", "C100", "사용자 관리", "", ""),
    /**
     * C 101 user menu type.
     */
    C101("3", "C101", "사용자 관리", "/listCpUser", ""),
    /**
     * D 000 user menu type.
     */
    D000("1", "D000", "콘텐츠 관리", "/listChatCategory", "icon4"),
    /**
     * D 100 user menu type.
     */
    D100("2", "D100", "대화 관리", "", ""),
    /**
     * D 101 user menu type.
     */
    D101("3", "D101", "카테고리 설정", "/listChatCategory", ""),
    /**
     * D 102 user menu type.
     */
    D102("3", "D102", "대화", "/listChat", ""),
    /**
     * D 200 user menu type.
     */
    D200("2", "D200", "전처리 관리", "", ""),
    /**
     * D 201 user menu type.
     */
    D201("3", "D201", "카테고리 설정", "/listSubsCategory", ""),
    /**
     * D 202 user menu type.
     */
    D202("3", "D202", "전처리", "/listSubs", ""),
    /**
     * D 300 user menu type.
     */
    D300("2", "D300", "Properties 관리", "", ""),
    /**
     * D 301 user menu type.
     */
    D301("3", "D301", "카테고리 설정", "/listPropCategory", ""),
    /**
     * D 302 user menu type.
     */
    D302("3", "D302", "Properties", "/listProp", ""),
    /**
     * D 400 user menu type.
     */
    D400("2", "D400", "Predicates 관리", "", ""),
    /**
     * D 401 user menu type.
     */
    D401("3", "D401", "카테고리 설정", "/listPredCategory", ""),
    /**
     * D 402 user menu type.
     */
    D402("3", "D402", "Predicates", "/listPred", ""),
    /**
     * E 000 user menu type.
     */
    E000("1", "E000", "통계", "/statPeriodMonth", "icon5"),
    /**
     * E 100 user menu type.
     */
    E100("2", "E100", "User 통계", "", ""),
    /**
     * E 101 user menu type.
     */
    E101("3", "E101", "기간별통계", "/statPeriodMonth", ""),
    /**
     * E 102 user menu type.
     */
    E102("3", "E102", "시간대별 통계", "/statPeriodTime", ""),
    /**
     * E 103 user menu type.
     */
    E103("3", "E103", "사용자별 통계", "/statPeriodUser", ""),
    /**
     * E 200 user menu type.
     */
    E200("2", "E200", "검색 순위 통계", "", ""),
    /**
     * E 201 user menu type.
     */
    E201("3", "E201", "카테고리 통계", "/statOrderCategory", ""),
    /**
     * E 202 user menu type.
     */
    E202("3", "E202", "대화 통계", "/statOrderInput", ""),
    /**
     * E 203 user menu type.
     */
    E203("3", "E203", "질문 통계", "/statOrderUserInput", ""),
    /**
     * F 000 user menu type.
     */
    F000("1", "F000", "로그 조회", "/listChatLog", "icon6"),
    /**
     * F 100 user menu type.
     */
    F100("2", "F100", "로그 조회", "", ""),
    /**
     * F 101 user menu type.
     */
    F101("3", "F101", "로그 조회", "/listChatLog", ""),
    /**
     * G 000 user menu type.
     */
    G000("1", "G000", "배포관리", "/deployHistory", "icon7"),
    /**
     * G 100 user menu type.
     */
    G100("2", "G100", "배포관리", "", ""),
    /**
     * G 101 user menu type.
     */
    G101("3", "G101", "히스토리", "/deployHistory", ""),
    /**
     * G 102 user menu type.
     */
    G102("3", "G102", "배포설정", "/deploySet", ""),
    /**
     * H 000 user menu type.
     */
    H000("1", "H000", "시뮬레이터", "/simulator", "icon8"),
    /**
     * H 100 user menu type.
     */
    H100("2", "H100", "시뮬레이터", "", ""),
    /**
     * H 101 user menu type.
     */
    H101("3", "H101", "시뮬레이터", "", "");

    /**
     * The Value.
     */
    private String depth;
    /**
     * The Value.
     */
    private String value;
    /**
     * The Label.
     */
    private String label;
    /**
     * The Url.
     */
    private String url;
    /**
     * The Icon.
     */
    private String icon;

    /**
     * Instantiates a new Enabled type.
     *
     * @param depth the depth
     * @param value the value
     * @param label the label
     * @param url   the url
     * @param icon  the icon
     */
    UserMenuType(String depth, String value, String label, String url, String icon) {
        this.depth = depth;
        this.value = value;
        this.label = label;
        this.url = url;
        this.icon = icon;
    }

    /**
     * Gets value.
     *
     * @return the value
     */
    public String getDepth() {
        return depth;
    }

    /**
     * Gets value.
     *
     * @return the value
     */
    public String getValue() {
        return value;
    }

    /**
     * Gets label.
     *
     * @return the label
     */
    public String getLabel() {
        return label;
    }

    /**
     * Gets url.
     *
     * @return the url
     */
    public String getUrl() {
        return url;
    }

    /**
     * Gets icon.
     *
     * @return the icon
     */
    public String getIcon() {
        return icon;
    }
}
