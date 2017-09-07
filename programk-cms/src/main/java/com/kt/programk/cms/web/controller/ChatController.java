/*
 *  Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
package com.kt.programk.cms.web.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.aitools.programd.util.AimlValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.google.common.base.Strings;
import com.kt.programk.cms.common.FileUtil;
import com.kt.programk.cms.common.StringUtil;
import com.kt.programk.cms.service.ChatServcie;
import com.kt.programk.cms.service.CpService;
import com.kt.programk.cms.service.VerifyDeployService;
import com.kt.programk.cms.service.impl.FileManageServiceImpl;
import com.kt.programk.common.code.AimlTagType;
import com.kt.programk.common.code.HtmlColorType;
import com.kt.programk.common.code.HtmlTagType;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.domain.core.AimlImages;
import com.kt.programk.common.domain.core.AimlLink;
import com.kt.programk.common.domain.core.AimlMain;
import com.kt.programk.common.domain.core.AimlOption;
import com.kt.programk.common.domain.core.AimlRecommend;
import com.kt.programk.common.domain.core.AimlReply;
import com.kt.programk.common.domain.core.AimlTest;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.PagingUtil;
import com.kt.programk.deploy.model.AimlError;

/**
 * 대화 관리
 */
@Controller
public class ChatController {
	/**
	 * The constant LOG.
	 */
	private static final Logger LOG = LoggerFactory.getLogger(ChatController.class);

	/**
	 * CONFIG 파일 정보 .
	 */
	@Autowired
	@Qualifier("config")
	private ConfigProperties config;

	/** fileUtils */
	@Resource(name = "fileUtil")
	private FileUtil fileUtil;

	/** The fileManage service. */
	@Autowired
	private FileManageServiceImpl fileManageService;

	/** The cp service. */
	@Autowired
	private CpService cpService;

	/** The Chat service. */
	@Autowired
	private ChatServcie chatServcie;

	/** The VerifyDeploy service. */
	@Autowired
	private VerifyDeployService verifyDeployService;

	/**
	 * 대화 목록 조회.
	 *
	 * @param AimlMain
	 *            the aimlMain
	 * @param map
	 *            the map
	 * @param session
	 *            the session
	 * @throws ApplicationException
	 * @ the exception
	 */
	@RequestMapping(value = "/listChat", method = RequestMethod.GET)
	public void listChat(@ModelAttribute AimlMain aimlMain, ModelMap map, HttpSession session, HttpServletRequest request) throws ApplicationException {
		LOG.debug("/listChat");

		session.setAttribute("menuCode", "D102");

		List<Cp> resultCp = cpService.listAll(session);
		map.put("result", resultCp);

		// cp관리자 초기 선택값
		CpUser userInfo = (CpUser) session.getAttribute("userInfo");
		if ("CPA".equals(userInfo.getAuth())) {
			if (aimlMain.getCpId() == 0) {
				aimlMain.setCpId(resultCp.get(0).getId());
			}

			aimlMain.setUserAuth(userInfo.getAuth());
		}

		String searchType = request.getParameter("searchType");
		String searchKeyword = request.getParameter("searchKeyword");

		if (searchType != null) {
			if (searchType.equals("cateName")) {
				aimlMain.setCateName(searchKeyword);
			} else if (searchType.equals("input")) {
				aimlMain.setInput(searchKeyword);
			} else if (searchType.equals("reply")) {
				aimlMain.setReply(searchKeyword);
			} else if (searchType.equals("id")) {
				aimlMain.setId(Integer.parseInt(searchKeyword));
			} else if (searchType.equals("testInput")) {
				aimlMain.setTestInput(searchKeyword);
			}
		}

		Map<String, Object> search = new HashMap<String, Object>();
		search.put("cpId", aimlMain.getCpId());
		search.put("cateId", aimlMain.getCateId());
		search.put("searchType", searchType);
		search.put("searchKeyword", searchKeyword);
		map.put("search", search);

		int currentPageNo = aimlMain.getCurrentPageNo();
		int recordCountPerPage = aimlMain.getRecordCountPerPage();
		int countAll = chatServcie.countAll(aimlMain);

		List<AimlMain> result = chatServcie.findListAll(aimlMain, currentPageNo, recordCountPerPage);
		map.put("results", result);

		PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
		map.put("paging", pagingUtil.invoke());
	}

	/**
	 * 대화 상세 조회.
	 *
	 * @param AimlMain
	 *            the aimlMain
	 * @param map
	 *            the map
	 * @param request
	 *            the request
	 * @throws ApplicationException
	 * @ the exception
	 */
	@RequestMapping(value = "/detailChat", method = RequestMethod.GET)
	public void detailChat(@ModelAttribute AimlMain aimlMain, ModelMap map, HttpSession session) throws ApplicationException {
		LOG.debug("/detailChat");

		session.setAttribute("menuCode", "D102");

		int id = aimlMain.getId();

		AimlMain result = chatServcie.findById(id);
		List<AimlTest> aimlTest = null;
		List<AimlImages> aimlImages = null;
		List<AimlLink> aimlLink = null;
		List<AimlRecommend> aimlRecommend = null;
		List<AimlReply> aimlReply = null;
		List<AimlOption> aimlOption = null;
		AimlMain thatInput = null;

		if (result != null) {
			aimlTest = chatServcie.findListTest(result.getCateId(), id); // 테스트
																			// 질문
			aimlImages = chatServcie.findListImages(result.getCateId(), id); // 이미지
			aimlLink = chatServcie.findListLink(result.getCateId(), id); // 링크
			aimlRecommend = chatServcie.findListRecommend(result.getCateId(), id); // 추천질문
			aimlReply = chatServcie.findListReply(result.getCateId(), id); // 추가답변
			aimlOption = chatServcie.findListOption(result.getCateId(), id); // 옵션
			thatInput = chatServcie.findById(result.getThatId());// 이전답변
		}

		map.put("result", result);
		map.put("test", aimlTest);
		map.put("images", aimlImages);
		map.put("link", aimlLink);
		map.put("recommend", aimlRecommend);
		map.put("reply", aimlReply);
		map.put("option", aimlOption);
		map.put("thatInput", thatInput);
	}

	/**
	 * 대화 등록 폼.
	 *
	 * @param AimlMain
	 *            the aimlMain
	 * @param map
	 *            the map
	 * @param request
	 *            the request @ the exception
	 */
	@RequestMapping(value = "/addChat", method = RequestMethod.GET)
	public void addChatForm(@ModelAttribute AimlMain aimlMain, ModelMap map, HttpSession session) throws ApplicationException {
		LOG.debug("/addChatForm");

		session.setAttribute("menuCode", "D102");

		List<Cp> resultCp = cpService.listAll(session);
		map.put("result", resultCp);

		map.put("aimlTag", AimlTagType.values());
		map.put("htmlTag", HtmlTagType.values());
		map.put("htmlColor", HtmlColorType.values());
	}

	/**
	 * 대화 복사 폼.
	 *
	 * @param AimlMain
	 *            the aimlMain
	 * @param map
	 *            the map
	 * @param request
	 *            the request
	 * @throws ApplicationException
	 * @ the exception
	 */
	@RequestMapping(value = "/copyChat", method = RequestMethod.GET)
	public void copyChatForm(@ModelAttribute AimlMain aimlMain, ModelMap map, HttpSession session) throws ApplicationException {
		LOG.debug("/copyChatForm");

		session.setAttribute("menuCode", "D102");

		int id = aimlMain.getId();

		AimlMain result = chatServcie.findById(id);
		List<AimlTest> aimlTest = null;
		List<AimlImages> aimlImages = null;
		List<AimlLink> aimlLink = null;
		List<AimlRecommend> aimlRecommend = null;
		List<AimlReply> aimlReply = null;
		List<AimlOption> aimlOption = null;
		AimlMain thatInput = null;

		if (result != null) {
			aimlTest = chatServcie.findListTest(result.getCateId(), id); // 테스트
			aimlImages = chatServcie.findListImages(result.getCateId(), id); // 이미지
			aimlLink = chatServcie.findListLink(result.getCateId(), id); // 링크
			aimlRecommend = chatServcie.findListRecommend(result.getCateId(), id); // 추천질문
			aimlReply = chatServcie.findListReply(result.getCateId(), id); // 추가답변
			aimlOption = chatServcie.findListOption(result.getCateId(), id); // 옵션
			thatInput = chatServcie.findById(result.getThatId());// 이전답변
		}

		map.put("results", result);
		map.put("test", aimlTest);
		map.put("images", aimlImages);
		map.put("link", aimlLink);
		map.put("recommend", aimlRecommend);
		map.put("reply", aimlReply);
		map.put("option", aimlOption);
		map.put("thatInput", thatInput);

		map.put("aimlTag", AimlTagType.values());
		map.put("htmlTag", HtmlTagType.values());
		map.put("htmlColor", HtmlColorType.values());

		List<Cp> resultCp = cpService.listAll(session);
		map.put("result", resultCp);
	}

	/**
	 * 대화 등록.
	 *
	 * @param AimlMain
	 *            the aimlMain
	 * @param map
	 *            the map
	 * @param request
	 *            the request @ the exception
	 */
	@RequestMapping(value = "/addChat", method = RequestMethod.POST)
	@ResponseBody
	public Object addChat(@ModelAttribute AimlMain aimlMain, ModelMap map, HttpServletRequest request) throws ApplicationException {
		LOG.debug("/addChat");

		String status = "";
		String message = "";

		if (!Strings.isNullOrEmpty(aimlMain.getInput()))
			aimlMain.setInput(aimlMain.getInput().replaceAll("[<>\"']", " "));
		if (!Strings.isNullOrEmpty(aimlMain.getImageUrl()))
			aimlMain.setImageUrl(aimlMain.getImageUrl().replaceAll("[<>\"']", " "));
		if (!Strings.isNullOrEmpty(aimlMain.getImageAlt()))
			aimlMain.setImageAlt(aimlMain.getImageAlt().replaceAll("[<>\"']", " "));
		if (!Strings.isNullOrEmpty(aimlMain.getLinkUrl()))
			aimlMain.setLinkUrl(aimlMain.getLinkUrl().replaceAll("[<>\"']", " "));

		if (AimlValidator.validPattern(aimlMain.getInput())) {
			// 정상일경우
			int result = chatServcie.countByInput(aimlMain);
			if (result == 0) { // 질문 중복일 경우에 등록 안함
				try {
					chatServcie.create(aimlMain);
				} catch (Exception e) {
					status = "FAIL";
					message = e.getMessage();
				}
			} else {
				status = "FAIL";
				message = "중복된 데이터 입니다. 다시 확인하세요.";
			}
		} else {
			status = "FAIL";
			message = "잘못된 AIML 질문 형태입니다.";
		}

		HashMap<String, String> vo = new HashMap<String, String>();
		vo.put("status", status);
		vo.put("message", message);

		return vo;
	}

	/**
	 * 대화 수정 폼.
	 *
	 * @param AimlMain
	 *            the aimlMain
	 * @param map
	 *            the map
	 * @param request
	 *            the request
	 * @throws ApplicationException
	 * @ the exception
	 */
	@RequestMapping(value = "/editChat", method = RequestMethod.GET)
	public void editChatForm(@ModelAttribute AimlMain aimlMain, ModelMap map, HttpSession session) throws ApplicationException {
		LOG.debug("/editChatForm");

		session.setAttribute("menuCode", "D102");

		int id = aimlMain.getId();

		AimlMain result = chatServcie.findById(id);
		List<AimlTest> aimlTest = null;
		List<AimlImages> aimlImages = null;
		List<AimlLink> aimlLink = null;
		List<AimlRecommend> aimlRecommend = null;
		List<AimlReply> aimlReply = null;
		List<AimlOption> aimlOption = null;
		AimlMain thatInput = null;

		if (result != null) {
			aimlTest = chatServcie.findListTest(result.getCateId(), id); // 테스트
																			// 질문
			aimlImages = chatServcie.findListImages(result.getCateId(), id); // 이미지
			aimlLink = chatServcie.findListLink(result.getCateId(), id); // 링크
			aimlRecommend = chatServcie.findListRecommend(result.getCateId(), id); // 추천질문
			aimlReply = chatServcie.findListReply(result.getCateId(), id); // 추가답변
			aimlOption = chatServcie.findListOption(result.getCateId(), id); // 옵션
			thatInput = chatServcie.findById(result.getThatId());// 이전답변
		}

		map.put("results", result);
		map.put("test", aimlTest);
		map.put("images", aimlImages);
		map.put("link", aimlLink);
		map.put("recommend", aimlRecommend);
		map.put("reply", aimlReply);
		map.put("option", aimlOption);
		map.put("thatInput", thatInput);

		map.put("aimlTag", AimlTagType.values());
		map.put("htmlTag", HtmlTagType.values());
		map.put("htmlColor", HtmlColorType.values());

		List<Cp> resultCp = cpService.listAll(session);
		map.put("result", resultCp);
	}

	/**
	 * 대화 수정.
	 *
	 * @param AimlMain
	 *            the aimlMain
	 * @param map
	 *            the map
	 * @param request
	 *            the request @ the exception
	 */
	@RequestMapping(value = "/editChat", method = RequestMethod.POST)
	@ResponseBody
	public Object editChat(@ModelAttribute AimlMain aimlMain, ModelMap map, HttpServletRequest request) throws ApplicationException {
		LOG.debug("/editChat");

		String status = "";
		String message = "";
		
		if (!Strings.isNullOrEmpty(aimlMain.getInput()))
			aimlMain.setInput(aimlMain.getInput().replaceAll("[<>\"']", " "));
		if (!Strings.isNullOrEmpty(aimlMain.getImageUrl()))
			aimlMain.setImageUrl(aimlMain.getImageUrl().replaceAll("[<>\"']", " "));
		if (!Strings.isNullOrEmpty(aimlMain.getImageAlt()))
			aimlMain.setImageAlt(aimlMain.getImageAlt().replaceAll("[<>\"']", " "));
		if (!Strings.isNullOrEmpty(aimlMain.getLinkUrl()))
			aimlMain.setLinkUrl(aimlMain.getLinkUrl().replaceAll("[<>\"']", " "));

		if (AimlValidator.validPattern(aimlMain.getInput())) {
			// 정상일경우
			int result = chatServcie.countByInput(aimlMain);
			if (result == 0) { // 질문 중복일 경우에 등록 안함
				try {
					chatServcie.modify(aimlMain);
				} catch (Exception e) {
					status = "FAIL";
					message = e.getMessage();
				}
			} else {
				status = "FAIL";
				message = "중복된 데이터 입니다. 다시 확인하세요.";
			}
		} else {
			status = "FAIL";
			message = "잘못된 AIML 질문 형태입니다.";
		}

		HashMap<String, String> vo = new HashMap<String, String>();
		vo.put("status", status);
		vo.put("message", message);

		return vo;
	}

	/**
	 * 대화 삭제.
	 *
	 * @param AimlMain
	 *            the aimlMain
	 * @param map
	 *            the map
	 * @param request
	 *            the request
	 * @throws ApplicationException
	 * @ the exception
	 */
	@RequestMapping(value = "/deleteChat", method = RequestMethod.GET)
	@ResponseBody
	public Object deleteChat(@ModelAttribute AimlMain aimlMain, ModelMap map, HttpSession session) throws ApplicationException {
		LOG.debug("/deleteChat");

		session.setAttribute("menuCode", "D102");

		String status = "";
		String message = "";

		try {
			chatServcie.remove(aimlMain);
		} catch (Exception e) {
			status = "FAIL";
			message = e.getMessage();
		}

		HashMap<String, String> vo = new HashMap<String, String>();
		vo.put("status", status);
		vo.put("message", message);

		return vo;
	}

	/**
	 * 대화 검색 목록 조회.
	 *
	 * @param AimlMain
	 *            the aimlMain
	 * @param map
	 *            the map
	 * @param session
	 *            the session
	 * @throws ApplicationException
	 * @ the exception
	 */
	@RequestMapping(value = "/searchChat", method = RequestMethod.GET)
	public void searchChat(@ModelAttribute AimlMain aimlMain, ModelMap map, HttpServletRequest request) throws ApplicationException {
		LOG.debug("/searchChat");

		String inputId = request.getParameter("inputId");
		int currentPageNo = aimlMain.getCurrentPageNo();
		int recordCountPerPage = aimlMain.getRecordCountPerPage();
		int countAll = chatServcie.countAll(aimlMain);

		Map<String, Object> search = new HashMap<String, Object>();
		search.put("id", inputId);
		search.put("cpId", aimlMain.getCpId());
		search.put("input", aimlMain.getInput());
		map.put("search", search);

		List<AimlMain> result = chatServcie.findListAll(aimlMain, currentPageNo, recordCountPerPage);
		map.put("results", result);

		PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
		map.put("paging", pagingUtil.invoke());
	}

	/**
	 * 대화 업로드.
	 *
	 * @param AimlMain
	 *            the aimlMain
	 * @param map
	 *            the map
	 * @param request
	 *            the request
	 * @throws Exception
	 * @ the exception
	 */
	@RequestMapping(value = "/uploadChat", method = RequestMethod.POST)
	@ResponseBody
	public Object uploadChat(@ModelAttribute AimlMain aimlMain, ModelMap map, HttpSession session, MultipartHttpServletRequest request) throws ApplicationException {
		LOG.debug("/uploadChat");

		String status = "";
		String message = "";
		String filename = "";
		int lastIndex = 0;

		List<Map<String, Object>> result = null;
		try {
			result = fileUtil.uploadFileInfo(request);
		} catch (Exception e) {
			throw new ApplicationException("오류 : " + e.getMessage());
		}

		if ("0".equals(result.get(0).get("status"))) {
			String cpId = request.getParameter("cpId");
			String filePath = (String) result.get(0).get("filePath");

			lastIndex = filePath.lastIndexOf("/");
			filename = filePath.substring(lastIndex + 1);

			try {
				message = fileManageService.uploadAiml(Integer.parseInt(cpId), filePath);
			} catch (Exception e) {
				status = "FAIL";
				message = "업로드시 오류가 발생하였습니다.";
			}
		} else {
			status = "FAIL";
			message = (String) result.get(0).get("status");
		}

		HashMap<String, Object> vo = new HashMap<String, Object>();
		vo.put("status", status);
		vo.put("message", message);
		vo.put("filename", filename);

		return vo;
	}

	/**
	 * 대화 다운로드.
	 *
	 * @param AimlChat
	 *            the aimlChat
	 * @param map
	 *            the map
	 * @param request
	 *            the request
	 * @throws Exception
	 * @ the exception
	 */
	@RequestMapping(value = "/downloadChat", method = RequestMethod.GET)
	public ResponseEntity<String> downloadChat(@ModelAttribute AimlMain aimlMain, HttpServletRequest request) throws ApplicationException {
		LOG.debug("/downloadChat");

		String searchType = request.getParameter("searchType");
		String searchKeyword = request.getParameter("searchKeyword");

		if (searchType != null) {
			if (searchType.equals("cateName")) {
				aimlMain.setCateName(searchKeyword);
			} else if (searchType.equals("input")) {
				aimlMain.setInput(searchKeyword);
			} else if (searchType.equals("reply")) {
				aimlMain.setReply(searchKeyword);
			} else if (searchType.equals("id")) {
				aimlMain.setId(Integer.parseInt(searchKeyword));
			} else if (searchType.equals("testInput")) {
				aimlMain.setTestInput(searchKeyword);
			}
		}

		StringBuilder dataBuilder = new StringBuilder();
		StringBuilder theBuilder = new StringBuilder();

		List<AimlMain> result = chatServcie.findListAll(aimlMain, 0, 0);
		for (AimlMain aimlMain2 : result) {
			// 테스트 질문
			StringBuilder testBuilder = new StringBuilder();
			List<AimlTest> aimlTest = chatServcie.findListTest(aimlMain2.getCateId(), aimlMain2.getId());
			for (AimlTest aimlTest2 : aimlTest) {
				testBuilder.append(aimlTest2.getTestInput());
				testBuilder.append(";\n");
			}

			// 이미지
			StringBuilder imagesBuilder = new StringBuilder();
			// TODO : commented out for KakaoPlusFriend
//			StringBuilder altBuilder = new StringBuilder();
			List<AimlImages> aimlImages = chatServcie.findListImages(aimlMain2.getCateId(), aimlMain2.getId());
			for (AimlImages aimlImages2 : aimlImages) {
				imagesBuilder.append(aimlImages2.getUrl());
				imagesBuilder.append("\n");
//				altBuilder.append(aimlImages2.getAlt());
//				altBuilder.append("\n");
			}

			// 링크
			StringBuilder linkBuilder = new StringBuilder();
			List<AimlLink> aimlLink = chatServcie.findListLink(aimlMain2.getCateId(), aimlMain2.getId());
			for (AimlLink aimlLink2 : aimlLink) {
				linkBuilder.append(aimlLink2.getTitle() + ";" + aimlLink2.getComment() + ";" + aimlLink2.getUrl());
				linkBuilder.append(";\n");
			}

			// 추천질문
			StringBuilder recommendBuilder = new StringBuilder();
			List<AimlRecommend> aimlRecommend = chatServcie.findListRecommend(aimlMain2.getCateId(), aimlMain2.getId());
			for (AimlRecommend aimlRecommend2 : aimlRecommend) {
				recommendBuilder.append(aimlRecommend2.getRecommendInput());
				recommendBuilder.append(";\n");
			}

			// TODO : commented out for KakaoPlusFriend
//			// 추가답변
//			StringBuilder replyBuilder = new StringBuilder();
//			List<AimlReply> aimlReply = chatServcie.findListReply(aimlMain2.getCateId(), aimlMain2.getId());
//			for (AimlReply aimlReply2 : aimlReply) {
//				replyBuilder.append(aimlReply2.getReplyInput());
//				replyBuilder.append(";\n");
//			}
//
//			// 옵션
//			HashMap<Integer, String> resultOption = new HashMap<Integer, String>();
//			List<AimlOption> aimlOption = chatServcie.findListOption(aimlMain2.getCateId(), aimlMain2.getId());
//			for (AimlOption aimlOption2 : aimlOption) {
//				resultOption.put(aimlOption2.getSeq(), aimlOption2.getVal());
//			}
//
			theBuilder.append(StringUtil.setReplaceCsv(aimlMain2.getCateName()));
			theBuilder.append(",");
			theBuilder.append(StringUtil.setReplaceCsv(aimlMain2.getInput()));
			theBuilder.append(",");
			theBuilder.append(StringUtil.setReplaceCsv(testBuilder.toString()));
			theBuilder.append(",");
			theBuilder.append(StringUtil.setReplaceCsv(aimlMain2.getReply()));
			theBuilder.append(",");
			theBuilder.append(StringUtil.setReplaceCsv(imagesBuilder.toString()));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(altBuilder.toString()));
			theBuilder.append(",");
			theBuilder.append(StringUtil.setReplaceCsv(aimlMain2.getThatInput()));
			theBuilder.append(",");
			theBuilder.append(StringUtil.setReplaceCsv(recommendBuilder.toString()));
			theBuilder.append(",");
			theBuilder.append(StringUtil.setReplaceCsv(linkBuilder.toString()));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(replyBuilder.toString()));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(resultOption.get(1)).replace("null", ""));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(resultOption.get(2)).replace("null", ""));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(resultOption.get(3)).replace("null", ""));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(resultOption.get(4)).replace("null", ""));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(resultOption.get(5)).replace("null", ""));
			theBuilder.append("\n");
		}

//		dataBuilder.append("카테고리" + "," + "질문" + "," + "검증샘플" + "," + "답변" + "," + "이미지" + "," + "대체텍스트" + "," + "이전답변" + "," + "추천질문" + "," + "링크" + "," + "추가답변" + "," + "옵션1" + "," + "옵션2" + "," + "옵션3" + "," + "옵션4" + "," + "옵션5" + "\n");
		dataBuilder.append("카테고리" + "," + "질문" + "," + "검증샘플" + "," + "답변" + "," + "이미지" + "," + "이전답변" + "," + "추천질문" + "," + "링크" + "\n");
		dataBuilder.append(theBuilder.toString());

		HttpHeaders header = new HttpHeaders();
		header.add("Content-Type", "text/csv; charset=MS949");
		header.add("Content-Disposition", "attachment; filename=\"" + "chat.csv" + "\"");

		return new ResponseEntity<String>(dataBuilder.toString(), header, HttpStatus.OK);
	}

//	@RequestMapping(value = "/downloadChat", method = RequestMethod.GET)
//	public ResponseEntity<String> downloadChat(@ModelAttribute AimlMain aimlMain, HttpServletRequest request) throws ApplicationException {
//		LOG.debug("/downloadChat");
//
//		String searchType = request.getParameter("searchType");
//		String searchKeyword = request.getParameter("searchKeyword");
//
//		if (searchType != null) {
//			if (searchType.equals("cateName")) {
//				aimlMain.setCateName(searchKeyword);
//			} else if (searchType.equals("input")) {
//				aimlMain.setInput(searchKeyword);
//			} else if (searchType.equals("reply")) {
//				aimlMain.setReply(searchKeyword);
//			} else if (searchType.equals("id")) {
//				aimlMain.setId(Integer.parseInt(searchKeyword));
//			} else if (searchType.equals("testInput")) {
//				aimlMain.setTestInput(searchKeyword);
//			}
//		}
//
//		StringBuilder dataBuilder = new StringBuilder();
//		StringBuilder theBuilder = new StringBuilder();
//
//		List<AimlMain> result = chatServcie.findListAll(aimlMain, 0, 0);
//		for (AimlMain aimlMain2 : result) {
//			// 테스트 질문
//			StringBuilder testBuilder = new StringBuilder();
//			List<AimlTest> aimlTest = chatServcie.findListTest(aimlMain2.getCateId(), aimlMain2.getId());
//			for (AimlTest aimlTest2 : aimlTest) {
//				testBuilder.append(aimlTest2.getTestInput());
//				testBuilder.append(";\n");
//			}
//
//			// 이미지
//			StringBuilder imagesBuilder = new StringBuilder();
//			StringBuilder altBuilder = new StringBuilder();
//			List<AimlImages> aimlImages = chatServcie.findListImages(aimlMain2.getCateId(), aimlMain2.getId());
//			for (AimlImages aimlImages2 : aimlImages) {
//				imagesBuilder.append(aimlImages2.getUrl());
//				imagesBuilder.append("\n");
//				altBuilder.append(aimlImages2.getAlt());
//				altBuilder.append("\n");
//			}
//
//			// 링크
//			StringBuilder linkBuilder = new StringBuilder();
//			List<AimlLink> aimlLink = chatServcie.findListLink(aimlMain2.getCateId(), aimlMain2.getId());
//			for (AimlLink aimlLink2 : aimlLink) {
//				linkBuilder.append(aimlLink2.getTitle() + ";" + aimlLink2.getComment() + ";" + aimlLink2.getUrl());
//				linkBuilder.append(";\n");
//			}
//
//			// 추천질문
//			StringBuilder recommendBuilder = new StringBuilder();
//			List<AimlRecommend> aimlRecommend = chatServcie.findListRecommend(aimlMain2.getCateId(), aimlMain2.getId());
//			for (AimlRecommend aimlRecommend2 : aimlRecommend) {
//				recommendBuilder.append(aimlRecommend2.getRecommendInput());
//				recommendBuilder.append(";\n");
//			}
//
//			// 추가답변
//			StringBuilder replyBuilder = new StringBuilder();
//			List<AimlReply> aimlReply = chatServcie.findListReply(aimlMain2.getCateId(), aimlMain2.getId());
//			for (AimlReply aimlReply2 : aimlReply) {
//				replyBuilder.append(aimlReply2.getReplyInput());
//				replyBuilder.append(";\n");
//			}
//
//			// 옵션
//			HashMap<Integer, String> resultOption = new HashMap<Integer, String>();
//			List<AimlOption> aimlOption = chatServcie.findListOption(aimlMain2.getCateId(), aimlMain2.getId());
//			for (AimlOption aimlOption2 : aimlOption) {
//				resultOption.put(aimlOption2.getSeq(), aimlOption2.getVal());
//			}
//
//			theBuilder.append(StringUtil.setReplaceCsv(aimlMain2.getCateName()));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(aimlMain2.getInput()));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(testBuilder.toString()));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(aimlMain2.getReply()));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(imagesBuilder.toString()));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(altBuilder.toString()));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(aimlMain2.getThatInput()));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(recommendBuilder.toString()));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(linkBuilder.toString()));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(replyBuilder.toString()));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(resultOption.get(1)).replace("null", ""));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(resultOption.get(2)).replace("null", ""));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(resultOption.get(3)).replace("null", ""));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(resultOption.get(4)).replace("null", ""));
//			theBuilder.append(",");
//			theBuilder.append(StringUtil.setReplaceCsv(resultOption.get(5)).replace("null", ""));
//			theBuilder.append("\n");
//		}
//
//		dataBuilder.append("카테고리" + "," + "질문" + "," + "검증샘플" + "," + "답변" + "," + "이미지" + "," + "대체텍스트" + "," + "이전답변" + "," + "추천질문" + "," + "링크" + "," + "추가답변" + "," + "옵션1" + "," + "옵션2" + "," + "옵션3" + "," + "옵션4" + "," + "옵션5" + "\n");
//		dataBuilder.append(theBuilder.toString());
//
//		HttpHeaders header = new HttpHeaders();
//		header.add("Content-Type", "text/csv; charset=MS949");
//		header.add("Content-Disposition", "attachment; filename=\"" + "chat.csv" + "\"");
//
//		return new ResponseEntity<String>(dataBuilder.toString(), header, HttpStatus.OK);
//	}
	
	/**
	 * 대화 샘플 파일 다운로드.
	 *
	 * @param HttpServletRequest
	 *            the request
	 * @param HttpServletResponse
	 *            the response
	 * @throws Exception
	 * @ the exception
	 */
	@RequestMapping(value = "/downloadSampleChat", method = RequestMethod.GET)
	public void downloadSampleChat(HttpServletRequest request, HttpServletResponse response) throws ApplicationException {
		LOG.debug("/downloadSampleChat");

		try {
			fileUtil.downloadFile(request, response, "chatSample.csv");
		} catch (Exception e) {
			throw new ApplicationException("오류 : " + e.getMessage());
		}
	}

	/**
	 * 대화 오류 파일 다운로드.
	 *
	 * @param HttpServletRequest
	 *            the request
	 * @param HttpServletResponse
	 *            the response
	 * @throws Exception
	 * @ the exception
	 */
	@RequestMapping(value = "/downloadErrorChat", method = RequestMethod.POST)
	public void downloadErrorChat(HttpServletRequest request, HttpServletResponse response) throws ApplicationException {
		LOG.debug("/downloadErrorChat");

		String fileName = request.getParameter("filename");

		try {
			fileUtil.downloadFile(request, response, "error_" + fileName);
		} catch (Exception e) {
			throw new ApplicationException("오류 : " + e.getMessage());
		} finally {
			fileUtil.removeFile(fileName); // 업로드 파일 삭제
			fileUtil.removeFile("error_" + fileName);
		}
	}

	/**
	 * 대화 검증 배포.
	 *
	 * @param map
	 *            the map
	 * @param request
	 *            the request
	 * @throws Exception
	 * @ the exception
	 */
	@RequestMapping(value = "/testDeployChat", method = RequestMethod.GET)
	@ResponseBody
	public Object testDeployChat(HttpSession session, HttpServletRequest request) throws Exception {
		LOG.debug("/testDeployChat");

		String status = "";
		String message = "";

		CpUser userInfo = (CpUser) session.getAttribute("userInfo");

		String userId = userInfo.getUserId();
		String cpId = request.getParameter("cpId");
		String subLabel = request.getParameter("label") + "-01"; // 01로 고정

		try {
			List<AimlError> aimlErrors = verifyDeployService.delpoyAll(subLabel, Integer.parseInt(cpId), userId);
			if (!aimlErrors.isEmpty()) {
				StringBuilder errBuilder = new StringBuilder();
				for (AimlError aimlError : aimlErrors) {
					errBuilder.append("대화ID : ");
					errBuilder.append(aimlError.getMainId());
					errBuilder.append(",오류 : ");
					errBuilder.append(aimlError.getErrMsg());
					errBuilder.append("<br/>");
				}

				status = "FAIL";
				message = "배포중 오류가 발생하였습니다.<br/>" + errBuilder.toString();
			}
		} catch (Exception e) {
			status = "FAIL";
			message = "배포중 오류가 발생하였습니다.<br/>" + e.getMessage();
		}

		HashMap<String, Object> vo = new HashMap<String, Object>();
		vo.put("status", status);
		vo.put("message", message);

		return vo;
	}

	/**
	 * 대화 검증.
	 *
	 * @param map
	 *            the map
	 * @param request
	 *            the request
	 * @throws Exception
	 * @ the exception
	 */
	@RequestMapping(value = "/testChat", method = RequestMethod.GET)
	@ResponseBody
	public Object testChat(HttpSession session, HttpServletRequest request) throws Exception {
		LOG.debug("/testChat");

		String status = "";
		String message = "";

		CpUser userInfo = (CpUser) session.getAttribute("userInfo");

		String userId = userInfo.getUserId();
		String cpId = request.getParameter("cpId");
		String subLabel = request.getParameter("label") + "-01"; // 01로 고정
		String filename = subLabel + "-" + userId + ".csv";

		try {
			message = chatServcie.selectTest(Integer.parseInt(cpId), subLabel, userId);
		} catch (Exception e) {
			status = "FAIL";
			message = "검중중 오류가 발생하였습니다.<br/>" + e.getMessage();
		}

		HashMap<String, Object> vo = new HashMap<String, Object>();
		vo.put("status", status);
		vo.put("message", message);
		vo.put("filename", filename);

		return vo;
	}

	/**
	 * 대화 검증 파일 다운로드.
	 *
	 * @param HttpServletRequest
	 *            the request
	 * @param HttpServletResponse
	 *            the response
	 * @throws Exception
	 * @ the exception
	 */
	@RequestMapping(value = "/downloadErrorTest", method = RequestMethod.POST)
	public void downloadErrorTest(HttpServletRequest request, HttpServletResponse response) throws ApplicationException {
		LOG.debug("/downloadErrorTest");

		String fileName = request.getParameter("filename");

		try {
			fileUtil.downloadFile(request, response, "error_" + fileName);
		} catch (Exception e) {
			throw new ApplicationException("오류 : " + e.getMessage());
		} finally {
			fileUtil.removeFile("error_" + fileName);
		}
	}
}
