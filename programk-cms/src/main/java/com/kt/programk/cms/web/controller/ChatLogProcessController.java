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

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.kt.programk.cms.common.FileUtil;
import com.kt.programk.cms.common.StringUtil;
import com.kt.programk.cms.service.ChatLogProcessService;
import com.kt.programk.cms.service.CpService;
import com.kt.programk.cms.service.impl.FileManageServiceImpl;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.domain.stat.ChatLogProcess;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.PagingUtil;

/**
 * 로그 컨트롤러
 *
 */
@Controller
public class ChatLogProcessController {
	/**
	 * The constant LOG.
	 */
	private static final Logger LOG = LoggerFactory.getLogger(ChatLogProcessController.class);

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

	/** The cp service. */
	@Autowired
	private ChatLogProcessService chatLogProcessService;

	/**
	 * 로그 조회.
	 *
	 * @param ChatLog
	 *            the chatLog
	 * @param map
	 *            the map
	 * @param session
	 *            the session
	 * @throws ApplicationException
	 * @ the exception
	 */
	@RequestMapping(value = "/listChatLogProcess", method = RequestMethod.GET)
	public void listChatLogProcess(@ModelAttribute ChatLogProcess chatLogProcess, ModelMap map, HttpSession session, HttpServletRequest request) throws ApplicationException {
		LOG.debug("/listChatLogProcess");

		session.setAttribute("menuCode", "F102");

		List<Cp> resultCp = cpService.listAll(session);
		map.put("result", resultCp);

		// cp관리자 초기 선택값
		CpUser userInfo = (CpUser) session.getAttribute("userInfo");
		if ("CPA".equals(userInfo.getAuth())) {
			if (chatLogProcess.getCpLabel() == null || chatLogProcess.getCpLabel() == "") {
				chatLogProcess.setCpLabel(resultCp.get(0).getLabel());
			}
		}

		String searchSDate = request.getParameter("searchSDate");
		String searchEDate = request.getParameter("searchEDate");

		Map<String, Object> search = new HashMap<String, Object>();
		search.put("cpLabel", chatLogProcess.getCpLabel());
		search.put("searchSDate", searchSDate);
		search.put("searchEDate", searchEDate);
		search.put("userInput", chatLogProcess.getUserInput());
		search.put("type", chatLogProcess.getType());
		map.put("search", search);

		if (chatLogProcess.getCpLabel() != null) {
			if (searchSDate != null && searchEDate != null && "".equals(searchSDate) == false && "".equals(searchEDate) == false) {
				chatLogProcess.setSdate(searchSDate + " 00:00:00");
				chatLogProcess.setEdate(searchEDate + " 23:59:59");
			}

			int currentPageNo = chatLogProcess.getCurrentPageNo();
			int recordCountPerPage = chatLogProcess.getRecordCountPerPage();
			int countAll = chatLogProcessService.countAll(chatLogProcess);

			List<ChatLogProcess> result = chatLogProcessService.findListAll(chatLogProcess, currentPageNo, recordCountPerPage);
			map.put("results", result);

			PagingUtil pagingUtil = new PagingUtil(currentPageNo, countAll);
			map.put("paging", pagingUtil.invoke());
		}
	}

	/**
	 * 대화 로그 업로드.
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/uploadChatLog", method = RequestMethod.POST)
	@ResponseBody
	public Object uploadChatLog(MultipartHttpServletRequest request) {
		LOG.debug("/uploadChatLog");

		String status = "";
		String message = "";
		String filename = "";
		int lastIndex = 0;

		try {
			List<Map<String, Object>> result = fileUtil.uploadFileInfo(request);
			if ("0".equals(result.get(0).get("status"))) {
				String cpLabel = request.getParameter("cpLabel");
				String filePath = (String) result.get(0).get("filePath");

				lastIndex = filePath.lastIndexOf("/");
				filename = filePath.substring(lastIndex + 1);

				try {
					message = fileManageService.uploadChatLog(cpLabel, filePath);
				} catch (Exception e) {
					status = "FAIL";
					message = "업로드시 오류가 발생하였습니다.";
				}
			} else {
				status = "FAIL";
				message = (String) result.get(0).get("status");
			}
		} catch (Exception e) {
			status = "FAIL";
			message = "업로드시 오류가 발생하였습니다.";
		}

		HashMap<String, Object> vo = new HashMap<String, Object>();
		vo.put("status", status);
		vo.put("message", message);
		vo.put("filename", filename);

		return vo;
	}

	/**
	 * 질문 패턴 신규데이터 반영
	 * 
	 * @param cpLabel
	 * @return
	 */
	@RequestMapping(value = "/updateLogProcessAll", method = RequestMethod.POST)
	@ResponseBody
	public Object updateLogProcessAll(//
			@RequestParam(value = "cpLabel", required = true) String cpLabel//
			, @RequestParam(value = "date", required = true) String date//
	) {//
		LOG.debug("/updateLogProcessAll");

		String status = "OK";
		String message = "반영완료.";

		try {
			chatLogProcessService.updateChatLogProcessAll(cpLabel, date);
		} catch (Exception e) {
			status = "FAIL";
			message = "질문 패턴반영중 오류가 발생하였습니다.";
		}

		HashMap<String, Object> vo = new HashMap<String, Object>();
		vo.put("status", status);
		vo.put("message", message);

		return vo;
	}

	/**
	 * 다운로드.
	 *
	 * @param ChatLog
	 *            the chatLog
	 * @param map
	 *            the map
	 * @param request
	 *            the request
	 * @throws Exception
	 * @ the exception
	 */
	@RequestMapping(value = "/downloadChatLogProcess", method = RequestMethod.GET)
	public ResponseEntity<String> downloadChatLogProcess(@ModelAttribute ChatLogProcess chatLogProcess, HttpServletRequest request) {
		LOG.debug("/downloadChatLogProcess");

		String searchSDate = request.getParameter("searchSDate");
		String searchEDate = request.getParameter("searchEDate");

		StringBuilder theBuilder = new StringBuilder();
		StringBuilder dataBuilder = new StringBuilder();
		SimpleDateFormat dataFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		dataBuilder.append("질문" + "," + "카테고리" + "," + "대화" + "," + "답변" + "," + "요청수" + "," + "상태" + "," + "시작일" + "," + "종료일" + "\n");

		if (chatLogProcess.getCpLabel() != null) {
			if (searchSDate != null && searchEDate != null && "".equals(searchSDate) == false && "".equals(searchEDate) == false) {
				chatLogProcess.setSdate(searchSDate + " 00:00:00");
				chatLogProcess.setEdate(searchEDate + " 23:59:59");
			}

			try {
				List<ChatLogProcess> result = chatLogProcessService.findListAll(chatLogProcess, 0, 0);
				for (ChatLogProcess chatLogProcess2 : result) {
					theBuilder.append(StringUtil.setReplaceCsv(chatLogProcess2.getUserInput()));
					theBuilder.append(",");
					theBuilder.append(StringUtil.setReplaceCsv(chatLogProcess2.getCateName()));
					theBuilder.append(",");
					theBuilder.append(StringUtil.setReplaceCsv(chatLogProcess2.getInput()));
					theBuilder.append(",");
					theBuilder.append(StringUtil.setReplaceCsv(chatLogProcess2.getReply()));
					theBuilder.append(",");
					theBuilder.append(StringUtil.setReplaceCsv(String.valueOf(chatLogProcess2.getCount())));
					theBuilder.append(",");
					if ("E".equals(chatLogProcess2.getType())) {
						theBuilder.append("완료");
					} else if ("P".equals(chatLogProcess2.getType())) {
						theBuilder.append("검토");
					} else {
						theBuilder.append("신규");
					}
					theBuilder.append(",");
					theBuilder.append(dataFormat.format(chatLogProcess2.getMdate()));
					theBuilder.append(",");
					theBuilder.append(dataFormat.format(chatLogProcess2.getXdate()));
					theBuilder.append("\n");
				}

				dataBuilder.append(theBuilder.toString());

			} catch (Exception e) {
				theBuilder = null;
			}
		}

		HttpHeaders header = new HttpHeaders();
		header.add("Content-Type", "text/csv; charset=MS949");
		header.add("Content-Disposition", "attachment; filename=\"" + "chatLogProcess.csv" + "\"");

		return new ResponseEntity<String>(dataBuilder.toString(), header, HttpStatus.OK);
	}

	/**
	 * 로그 상세 조회.
	 *
	 * @param ChatLogProcess
	 *            the chatLogProcess
	 * @param map
	 *            the map
	 * @param request
	 *            the request @ the exception
	 */
	@RequestMapping(value = "/detailChatLogProcess", method = RequestMethod.POST)
	@ResponseBody
	public Object detailChatLogProcess(@ModelAttribute ChatLogProcess chatLogProcess, ModelMap map, HttpServletRequest request) throws ApplicationException {
		LOG.debug("/detailChatLogProcess");

		String status = "";
		String message = "";

		HashMap<String, String> vo = new HashMap<String, String>();

		try {
			ChatLogProcess result = chatLogProcessService.selectChatLog(chatLogProcess);

			vo.put("userInput", result.getUserInput());
			vo.put("cateName", result.getCateName());
			vo.put("input", result.getInput());
			vo.put("reply", result.getReply());

		} catch (Exception e) {
			status = "FAIL";
			message = e.getMessage();
		}

		vo.put("statis", status);
		vo.put("message", message);

		return vo;
	}

	/**
	 * 검토 데이터 설정 및 조회
	 *
	 * @param ChatLogProcess
	 *            the chatLogProcess
	 * @param map
	 *            the map
	 * @param request
	 *            the request @ the exception
	 */
	@RequestMapping(value = "/updateChatLogProcess", method = RequestMethod.POST)
	@ResponseBody
	public Object updateChatLogProcess(@ModelAttribute ChatLogProcess chatLogProcess, ModelMap map, HttpServletRequest request) throws ApplicationException {
		LOG.debug("/updateChatLogProcess");

		String status = "";
		String message = "";

		int id = chatLogProcess.getId();
		String type = chatLogProcess.getType();

		HashMap<String, String> vo = new HashMap<String, String>();

		try {
			if (id > 0 && ("S".equals(type) || "P".equals(type) || "E".equals(type))) {
				// update chatlog data
				chatLogProcessService.updateTypeByPrimaryKeySelective(chatLogProcess);
			}
			// 최근 항목 조회
			ChatLogProcess result = chatLogProcessService.selectNewChatLogProcess(chatLogProcess);
			String resultid = String.valueOf(result.getId());
			String userInput = result.getUserInput();
			String cateName = result.getCateName();
			String input = result.getInput();
			String reply = result.getReply();

			vo.put("id", resultid);
			vo.put("userInput", userInput);
			vo.put("cateName", cateName);
			vo.put("input", input);
			vo.put("reply", reply);

		} catch (Exception e) {
			status = "FAIL";
			message = e.getMessage();
		}

		vo.put("status", status);
		vo.put("message", message);

		return vo;
	}

	/**
	 * 검토 데이터 다수 업데이트 ( 체크박스를 통한 설정 )
	 *
	 * @param ChatLogProcess
	 *            the chatLogProcess
	 * @param map
	 *            the map
	 * @param request
	 *            the request @ the exception
	 */
	@RequestMapping(value = "/updateMultiChatLogProcess", method = RequestMethod.POST)
	@ResponseBody
	public Object updateMultiChatLogProcess(@ModelAttribute ChatLogProcess chatLogProcess, ModelMap map, HttpServletRequest request) throws ApplicationException {
		LOG.debug("/updateMultiChatLogProcess");

		String status = "";
		String message = "";

		String ids = request.getParameter("ids");
		String type = chatLogProcess.getType();

		HashMap<String, String> vo = new HashMap<String, String>();

		try {
			String[] idArray = ids.split(",");

			for (String id : idArray) {

				int i = Integer.parseInt(id);

				if (i > 0 && ("S".equals(type) || "P".equals(type) || "E".equals(type))) {
					chatLogProcess.setId(i);
					chatLogProcessService.updateTypeByPrimaryKeySelective(chatLogProcess);
				}
			}

		} catch (Exception e) {
			status = "FAIL";
			message = e.getMessage();
		}

		vo.put("status", status);
		vo.put("message", message);

		return vo;
	}
}
