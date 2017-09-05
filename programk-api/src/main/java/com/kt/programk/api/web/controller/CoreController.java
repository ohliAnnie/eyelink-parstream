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

package com.kt.programk.api.web.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.kt.programk.api.web.service.CoreService;
import com.kt.programk.common.logs.CLogger;
import com.kt.programk.common.db.domain.NoticeDTO;
import com.kt.programk.common.utils.JodaDateUtil;
import com.kt.programk.common.wo.ProgramkRequest;
import com.kt.programk.common.wo.ProgramkResponse;
import com.kt.programk.common.wo.ProgramkTraceResponse;
import com.kt.programk.deploy.service.DeployService;
import org.aitools.programd.graph.Match;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * API 메인 컨트롤러
 */
@RestController
@RequestMapping("/v1")
public class CoreController {

	/**
	 * The constant LOG.
	 */
	private static final Logger LOG = LoggerFactory.getLogger(CoreController.class);

	/**
	 * 통계용 로그
	 */
	private static final Logger STAT_LOG = LoggerFactory.getLogger("STAT");

	/**
	 * JSON 변환 GsonBuilder를 사용해야 유니코드가 생성되지 않는다.
	 */
	private Gson gson = new GsonBuilder().disableHtmlEscaping().create();

	/**
	 * The Core service.
	 */
	@Autowired
	private CoreService coreService;

	/**
	 * The Deploy service.
	 */
	@Autowired
	private DeployService deployService;

	/**
	 * Run json programk response entity.
	 *
	 * @param botid
	 *            the botid
	 * @param programkRequest
	 *            the programk request
	 * @param request
	 *            the request
	 * @return string
	 */
	@RequestMapping(value = "/{botid}/talk", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String executeProgramk(//
			@PathVariable String botid, //
			@RequestBody ProgramkRequest programkRequest, //
			HttpServletRequest request//
	) {
		CLogger.functionStart("exeuteProgramK", botid);
		CLogger.debugForJson(programkRequest);

		NoticeDTO noticeDTO = coreService.serviceStatus();
		
		if (noticeDTO != null) {
			return gson.toJson(makeServiceStopMessage(noticeDTO));
		}
		coreService.validationCheck(programkRequest);
		coreService.validationHostIp(programkRequest.getToken(), request);
		
		String activeBotid = coreService.getActiveBotId(botid, programkRequest);
		
		CLogger.info("Active botid : " + activeBotid);
		
		deployService.isCoreRunningBot(activeBotid);

		// JSON 포맷에 맞지 않은 데이터 제거
		String escapeString = programkRequest.getChat();// .replaceAll("\"",
														// "&quot;");
		// 채팅에서 엔터 제거
		escapeString = escapeString.replaceAll("\n", " ").replaceAll("[|]", " ");
		// 태그 정보 제거
		escapeString = escapeString.replaceAll("<", " ").replaceAll(">", " ");

		List<ProgramkResponse> programkResponses = new ArrayList<>();
		String category = deployService.makeResponse(programkResponses, escapeString, programkRequest.getUser(), activeBotid, true, null);

		if (category != null && !"".equals(category)) {
			category = deployService.findLastCategory(category);
		}

		String response = gson.toJson(programkResponses);
		String sBody = null;

		// csv 포맷으로 저장할 때 쌍따옴표 제거
		sBody = response.replaceAll("\"", "'");

		/**
		 * 2016-09-26 S.J.H chat 공백 제거
		 */
		String chat = programkRequest.getChat();
		if (chat != null) {
			chat = chat.replaceAll("\n", " ");
		}
		chat = chat.replaceAll("\"", "'");

		String user = programkRequest.getUser();
		if (user != null) {
			user = user.replaceAll("\n", "");
		}
		/**
		 * 통계용 로그
		 */
		STAT_LOG.info("\"" + JodaDateUtil.getCurrentTime() + "\",\"" + chat + "\",\"" + user + "\",\"" + sBody + "\",\"" + category + "\",\"" + botid + "\"");

		response = replaceQuot(response);

		CLogger.debugForJson(programkResponses);
		CLogger.functionEnd();

		return response;
	}

	/**
	 * 서비스 작업 공지
	 *
	 * @param noticeDTO
	 * @return
	 */
	private List<ProgramkResponse> makeServiceStopMessage(NoticeDTO noticeDTO) {
		List<ProgramkResponse> programkResponses = new ArrayList<>();
		String dummy = "{\"body\":\"\",\"urls\":[],\"image\":[],\"responses\":[],\"option1\":[],\"option2\":[],\"option3\":[],\"option4\":[],\"option5\":[]}";
		ProgramkResponse programkResponse = gson.fromJson(dummy, ProgramkResponse.class);
		programkResponse.setBody(noticeDTO.getMessage());
		programkResponses.add(programkResponse);

		return programkResponses;
	}

	/**
	 * 검증용
	 *
	 * @param botid
	 *            the botid
	 * @param programkRequest
	 *            the programk request
	 * @param request
	 *            the request
	 * @return string
	 */
	@RequestMapping(value = "/verify/{botid}/talk", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String verifyProgramk(//
			@PathVariable String botid, //
			@RequestBody ProgramkRequest programkRequest, //
			HttpServletRequest request//
	) {
		CLogger.functionStart("Start verifyProgramk");
		CLogger.info("botid: " + botid);
		CLogger.info("token: " + programkRequest.getToken());
		CLogger.info("user: " + programkRequest.getUser());
		CLogger.info("chat: " + programkRequest.getChat());
		CLogger.info("host ip : " + request.getRemoteAddr());

		coreService.validationCheck(programkRequest);
		coreService.validationHostIp(programkRequest.getToken(), request);
		deployService.isCoreRunningBot(botid);

		// JSON 포맷에 맞지 않은 데이터 제거
		String escapeString = programkRequest.getChat();// .replaceAll("\"",
														// "&quot;");
		// 채팅에서 엔터 제거
		escapeString = escapeString.replaceAll("\n", " ").replaceAll("[|]", " ");
		// 태그 정보 제거
		escapeString = escapeString.replaceAll("<", " ").replaceAll(">", " ");

		List<ProgramkResponse> programkResponses = new ArrayList<>();
		String category = deployService.makeResponse(programkResponses, escapeString, programkRequest.getUser(), botid, true, null);

		if (category != null && !"".equals(category)) {
			category = deployService.findLastCategory(category);
		}

		CLogger.debugForJson(programkResponses);
		CLogger.functionEnd();

		HashMap<String, Object> map = new HashMap<>();
		map.put("data", programkResponses);
		map.put("id", category);

		String response = gson.toJson(map);
		response = replaceQuot(response);

		return response;
	}

	/**
	 * 테스트용 봇 - 실행할 봇을 사용자가 지정할 수 있다.
	 *
	 * @param botid
	 *            the botid
	 * @param programkRequest
	 *            the programk request
	 * @param request
	 *            the request
	 * @return string
	 */
	@RequestMapping(value = "/trace/{botid}/talk", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String executeTraceProgramk(//
			@PathVariable String botid, //
			@RequestBody ProgramkRequest programkRequest, //
			HttpServletRequest request//
	) {
		LOG.info("Start executeTraceProgramk");
		LOG.info("botid: " + botid);
		LOG.info("token: " + programkRequest.getToken());
		LOG.info("user: " + programkRequest.getUser());
		LOG.info("chat: " + programkRequest.getChat());
		LOG.info("host ip : " + request.getRemoteAddr());

		coreService.validationCheck(programkRequest);
		coreService.validationHostIp(programkRequest.getToken(), request);
		deployService.isCoreRunningBot(botid);

		List<Match> matches = new ArrayList<>();
		List<ProgramkResponse> programkResponses = new ArrayList<>();

		// JSON 포맷에 맞지 않은 데이터 제거
		String escapeString = programkRequest.getChat();// .replaceAll("\"",
														// "&quot;");
		// 채팅에서 엔터 제거
		escapeString = escapeString.replaceAll("\n", " ").replaceAll("[|]", " ");
		// 태그 정보 제거
		escapeString = escapeString.replaceAll("<", " ").replaceAll(">", " ");

		deployService.makeResponse(programkResponses, escapeString, programkRequest.getUser(), botid, true, matches);

		List<String> file = new ArrayList<>();
		List<String> path = new ArrayList<>();
		LOG.debug("============================================================================");
		for (int i = 0; i < matches.size(); i++) {
			LOG.debug(matches.get(i).getFileName());
			LOG.debug(matches.get(i).getPath());
			file.add(matches.get(i).getFileName());
			path.add(matches.get(i).getPath());
		}
		LOG.debug("============================================================================");
		// 전처리 결과를 확인하자.
		ProgramkTraceResponse programkTraceResponse = new ProgramkTraceResponse();
		programkTraceResponse.setPath(path);
		programkTraceResponse.setFile(file);
		programkTraceResponse.setProgramkResponses(programkResponses);
		programkTraceResponse.setInput(deployService.getSubs(escapeString, botid));

		String response = gson.toJson(programkTraceResponse);
		response = replaceQuot(response);
		return response;
	}

	/**
	 * 쌍따옴표를 JSON 포맷에 맞게 변환한다.
	 *
	 * @param response
	 * @return
	 */
	private String replaceQuot(String response) {
		return response.replaceAll("&quot;", "\\\\\"");
	}
}
