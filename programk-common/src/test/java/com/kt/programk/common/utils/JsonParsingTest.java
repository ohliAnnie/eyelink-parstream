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
 * Seo Jong Hwa        2016 . 6 . 23
 */

package com.kt.programk.common.utils;

import java.util.HashMap;
import java.util.Map;

import org.junit.Test;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Created by Administrator on 2016-06-23.
 */
public class JsonParsingTest {

	/**
	 * JSON 변환 GsonBuilder를 사용해야 유니코드가 생성되지 않는다.
	 */
	private Gson gson = new GsonBuilder().disableHtmlEscaping().create();

	@Test
	public void testReg01() {
		String json = "{\"image\":\"http:\\/\\/m.olleh.com\\/image.png\",\"mpattern:[\"대화형 검색 안내\"]}\n"
				+ "요금제는 아래 화면에서 조회가 가능합니다.\n" + ".00002";

		Map<String, String> map = new HashMap<String, String>();
		String[] parts = json.replaceAll("^\\{|\\}$", "").split("\"?(:|,)(?![^\\{]*\\})\"?");
		for (int i = 0; i < parts.length - 1; i += 2)
			map.put(parts[i], parts[i + 1]);
		System.out.println(map.size() + " entries: " + map);
	}

	@Test
	public void testSrai() {
		String json = "{\"image\":\"http:\\/\\/m.olleh.com\\/image.png\"} kilkl {\"image\":\"http:\\/\\/m.olleh.com\\/image.png\"}Albert Einstein was a german physicist. nuiuiiyhhhh .000001\n";
	}

}
