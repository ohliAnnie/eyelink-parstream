/*
 *  Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
package com.kt.programk.cms.service.impl;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.aitools.programd.util.AimlValidator;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kt.programk.cms.common.FileUtil;
import com.kt.programk.cms.common.StringUtil;
import com.kt.programk.cms.service.FileManageService;
import com.kt.programk.common.code.CategoryTopicType;
import com.kt.programk.common.code.CategoryType;
import com.kt.programk.common.code.EnabledType;
import com.kt.programk.common.domain.category.AimlCategory;
import com.kt.programk.common.domain.category.PredCategory;
import com.kt.programk.common.domain.category.PropCategory;
import com.kt.programk.common.domain.category.SubsCategory;
import com.kt.programk.common.domain.core.AimlImages;
import com.kt.programk.common.domain.core.AimlLink;
import com.kt.programk.common.domain.core.AimlMain;
import com.kt.programk.common.domain.core.AimlOption;
import com.kt.programk.common.domain.core.AimlPred;
import com.kt.programk.common.domain.core.AimlProp;
import com.kt.programk.common.domain.core.AimlRecommend;
import com.kt.programk.common.domain.core.AimlReply;
import com.kt.programk.common.domain.core.AimlSubs;
import com.kt.programk.common.domain.core.AimlTest;
import com.kt.programk.common.domain.deploy.DeployAimlCategory;
import com.kt.programk.common.domain.deploy.DeployPredCategory;
import com.kt.programk.common.domain.deploy.DeployPropCategory;
import com.kt.programk.common.domain.deploy.DeploySubsCategory;
import com.kt.programk.common.domain.stat.ChatLog;
import com.kt.programk.common.domain.stat.ChatLogProcess;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.repository.category.AimlCategoryMapper;
import com.kt.programk.common.repository.category.PredCategoryMapper;
import com.kt.programk.common.repository.category.PropCategoryMapper;
import com.kt.programk.common.repository.category.SubsCategoryMapper;
import com.kt.programk.common.repository.core.AimlImagesMapper;
import com.kt.programk.common.repository.core.AimlLinkMapper;
import com.kt.programk.common.repository.core.AimlMainMapper;
import com.kt.programk.common.repository.core.AimlOptionMapper;
import com.kt.programk.common.repository.core.AimlPredMapper;
import com.kt.programk.common.repository.core.AimlPropMapper;
import com.kt.programk.common.repository.core.AimlRecommendMapper;
import com.kt.programk.common.repository.core.AimlReplyMapper;
import com.kt.programk.common.repository.core.AimlSubsMapper;
import com.kt.programk.common.repository.core.AimlTestMapper;
import com.kt.programk.common.repository.deploy.DeployAimlCategoryMapper;
import com.kt.programk.common.repository.deploy.DeployPredCategoryMapper;
import com.kt.programk.common.repository.deploy.DeployPropCategoryMapper;
import com.kt.programk.common.repository.deploy.DeploySubsCategoryMapper;
import com.kt.programk.common.repository.stat.ChatLogMapper;
import com.kt.programk.common.repository.stat.ChatLogProcessMapper;
import com.kt.programk.common.utils.DbExceptionUtil;

import au.com.bytecode.opencsv.CSVReader;

/**
 * Created by redpunk on 2016-07-08.
 */
@Service
public class FileManageServiceImpl implements FileManageService {

	/**
	 * The constant LOG.
	 */
	private static final Logger LOG = LoggerFactory.getLogger(FileManageServiceImpl.class);

	/** fileUtils */
	@Resource(name = "fileUtil")
	private FileUtil fileUtil;

	/**
	 * The Aiml category mapper.
	 */
	@Autowired
	private AimlCategoryMapper aimlCategoryMapper;

	/**
	 * The Aiml main mapper.
	 */
	@Autowired
	private AimlMainMapper aimlMainMapper;

	/**
	 * The Aiml test mapper.
	 */
	@Autowired
	private AimlTestMapper aimlTestMapper;

	/**
	 * The Aiml images mapper.
	 */
	@Autowired
	private AimlImagesMapper aimlImagesMapper;

	/**
	 * The Aiml recommend mapper.
	 */
	@Autowired
	private AimlRecommendMapper aimlRecommendMapper;

	/**
	 * The Aiml link mapper.
	 */
	@Autowired
	private AimlLinkMapper aimlLinkMapper;

	/**
	 * The Aiml option mapper.
	 */
	@Autowired
	private AimlOptionMapper aimlOptionMapper;

	/**
	 * The Aiml reply mapper.
	 */
	@Autowired
	private AimlReplyMapper aimlReplyMapper;
	/**
	 * The Aiml pred mapper.
	 */
	@Autowired
	private AimlPredMapper aimlPredMapper;
	/**
	 * The Aiml prop mapper.
	 */
	@Autowired
	private AimlPropMapper aimlPropMapper;

	/**
	 * The Aiml subs mapper.
	 */
	@Autowired
	private AimlSubsMapper aimlSubsMapper;

	@Autowired
	private SubsCategoryMapper subsCategoryMapper;

	@Autowired
	private PredCategoryMapper predCategoryMapper;

	@Autowired
	private PropCategoryMapper propCategoryMapper;

	/**
	 * The deploy mapper.
	 */
	@Autowired
	private DeployAimlCategoryMapper deployAimlCategoryMapper;

	@Autowired
	private DeploySubsCategoryMapper deploySubsCategoryMapper;

	@Autowired
	private DeployPropCategoryMapper deployPropCategoryMapper;

	@Autowired
	private DeployPredCategoryMapper deployPredCategoryMapper;

	/**
	 * The stat mapper.
	 */
	@Autowired
	private ChatLogMapper chatLogMapper;

	@Autowired
	private ChatLogProcessMapper chatLogProcessMapper;

	/**
	 * Upload aiml.
	 *
	 * @param cpId
	 *            the cp id
	 * @param path
	 *            the path
	 */
	@Override
	public String uploadAiml(int cpId, String path) throws BizCheckedException, ApplicationException {
		if (cpId == 0) {
			throw new BizCheckedException(BizErrCode.ERR_0006, "cpId");
		}

		if (path == null || "".equals(path)) {
			throw new BizCheckedException(BizErrCode.ERR_0001, "path");
		}

		List<String[]> myEntries = readCsv(path);

		LOG.info("총 행개수 = " + myEntries.size());

		int count = 0;
		int resultCount = 0;
		int etcCount = 0;
		String message = "";
		Map<String, Integer> categoryMap = new HashMap<>();
		List<String[]> dataError = new ArrayList<String[]>();

		dataError.add(new String[] { "카테고리", "질문", "검증샘플", "답변", "이미지", "대체텍스트", "이전답변", "추천질문", "링크", "추가답변", "옵션1", "옵션2", "옵션3", "옵션4", "옵션5", "오류" });

		try {
			AimlCategory aimlCategory = new AimlCategory();
			aimlCategory.setCpId(cpId);
			aimlCategoryMapper.deleteAllNoLock(aimlCategory);

			for (String arr[] : myEntries) {
				count++;

				if (arr[0].trim().indexOf("SCDSA002") > -1) {
					count = myEntries.size();
					dataError.add(new String[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "등록 형식에 맞지 않습니다.(암호화 문서)" });
					break;
				}

				if (count != 1 && arr.length != 15) {
					dataError.add(new String[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "등록 형식에 맞지 않습니다." });
				}

				// 헤더
				if (count == 1 || arr.length != 15) {
					continue;
				}
				// 카테고리명
				String cateName = arr[0].trim();
				// 질문
				String input = arr[1].trim();
				// 검증샘플
				String test = arr[2].trim();
				// 답변
				String reply = arr[3].trim();
				// 이미지
				String image = arr[4].trim();
				// 대체텍스트
				String alt = arr[5].trim();
				// that
				String that = arr[6].trim();
				// 추천질물
				String recommend = arr[7].trim();
				// 링크
				String link = arr[8].trim();
				// 추가답변
				String appendReply = arr[9].trim();
				// 옵션1
				String option1 = arr[10].trim();
				// 옵션2
				String option2 = arr[11].trim();
				// 옵션3
				String option3 = arr[12].trim();
				// 옵션4
				String option4 = arr[13].trim();
				// 옵션5
				String option5 = arr[14].trim();
				// 옵션
				String option = option1 + ";" + option2 + ";" + option3 + ";" + option4 + ";" + option5;

				if ("".equals(cateName.trim())) {
					dataError.add(new String[] { cateName, input, test, reply, image, alt, that, recommend, link, appendReply, option1, option2, option3, option4, option5, "카테고리명이 없습니다." });
				} else {
					AimlMain aimlMain = createAimlMain(categoryMap, cpId, cateName, input, reply, that);
					if (aimlMain.getId() != 0) {
						try {
							createAimlTest(aimlMain, test);
						} catch (Exception e) {
							etcCount += 1;
							dataError.add(new String[] { cateName, input, test, reply, image, alt, that, recommend, link, appendReply, option1, option2, option3, option4, option5, "검증샘플 등록 형식에 맞지 않습니다." });
						}

						try {
							createAimlImage(aimlMain, image, alt);
						} catch (Exception e) {
							etcCount += 1;
							dataError.add(new String[] { cateName, input, test, reply, image, alt, that, recommend, link, appendReply, option1, option2, option3, option4, option5, "이미지 등록 형식에 맞지 않습니다." });
						}

						try {
							createAimlRecommend(aimlMain, recommend);
						} catch (Exception e) {
							etcCount += 1;
							dataError.add(new String[] { cateName, input, test, reply, image, alt, that, recommend, link, appendReply, option1, option2, option3, option4, option5, "추천질문 등록 형식에 맞지 않습니다." });
						}

						try {
							createAimlLink(aimlMain, link);
						} catch (Exception e) {
							etcCount += 1;
							dataError.add(new String[] { cateName, input, test, reply, image, alt, that, recommend, link, appendReply, option1, option2, option3, option4, option5, "링크 등록 형식에 맞지 않습니다." });
						}

						try {
							createAimlReply(aimlMain, appendReply);
						} catch (Exception e) {
							etcCount += 1;
							dataError.add(new String[] { cateName, input, test, reply, image, alt, that, recommend, link, appendReply, option1, option2, option3, option4, option5, "추가답변 등록 형식에 맞지 않습니다." });
						}

						try {
							createAimlOption(aimlMain, option);
						} catch (Exception e) {
							etcCount += 1;
							dataError.add(new String[] { cateName, input, test, reply, image, alt, that, recommend, link, appendReply, option1, option2, option3, option4, option5, "옵션 등록 형식에 맞지 않습니다." });
						}

						// that 확인
						if (that != null && !"".equals(that)) {
							if (aimlMain.getThatId() == 0) {
								etcCount += 1;
								dataError.add(new String[] { cateName, input, test, reply, image, alt, that, recommend, link, appendReply, option1, option2, option3, option4, option5, "이전답변(that)를 찾을수가 없습니다." });
							}
						}

						resultCount += 1;
					} else {
						dataError.add(new String[] { cateName, input, test, reply, image, alt, that, recommend, link, appendReply, option1, option2, option3, option4, option5, "중복된 데이터이거나 질문,답변 입력값이 유효하지 않습니다." });
					}
				}
			}

			// 오류
			fileUtil.createErrorFile(path, dataError);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()), ex);
		}

		LOG.info("총 대화 개수 = " + count);

		message = "총 " + (count - 1) + " 건이 완료 되었습니다.<br/>(성공 : " + resultCount + "건 / 실패 : " + (count - 1 - resultCount) + "건/ 기타오류 : " + etcCount + "건)";

		return message;
	}

	/**
	 * CSV 전체 파일을 읽는다.
	 * 
	 * @param path
	 * @return
	 * @throws BizCheckedException
	 */
	private List<String[]> readCsv(String path) throws BizCheckedException {
		BufferedReader fileReader = null;

		try {
			try {
				fileReader = new BufferedReader(new InputStreamReader(new FileInputStream(path), "euc-kr"));
			} catch (UnsupportedEncodingException e) {
				throw new BizCheckedException(BizErrCode.ERR_0006, path);
			}
		} catch (FileNotFoundException e) {
			throw new BizCheckedException(BizErrCode.ERR_0006, path);
		}

		CSVReader reader = new CSVReader(fileReader, ',');
		List<String[]> myEntries = null;
		try {
			myEntries = reader.readAll();
		} catch (IOException e) {
			throw new BizCheckedException(BizErrCode.ERR_0006, path);
		} finally {
			try {
				reader.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		return myEntries;
	}

	/**
	 * Upload subs.
	 *
	 * @param cpId
	 *            the cp id
	 * @param path
	 *            the path
	 */
	@Override
	public String uploadSubs(int cpId, String path) throws BizCheckedException, ApplicationException {
		if (cpId == 0) {
			throw new BizCheckedException(BizErrCode.ERR_0006, "cpId");
		}

		if (path == null || "".equals(path)) {
			throw new BizCheckedException(BizErrCode.ERR_0001, "path");
		}

		List<String[]> myEntries = readCsv(path);

		LOG.info("총 행개수 = " + myEntries.size());

		int count = 0;
		int resultCount = 0;
		String message = "";
		Map<String, Integer> categoryMap = new HashMap<>();
		List<String[]> dataError = new ArrayList<String[]>();

		dataError.add(new String[] { "카테고리", "대상 키워드", "정규화 키워드", "오류" });

		try {
			// 전체 파일 우선 삭제함
			AimlSubs subs = new AimlSubs();
			subs.setCpId(cpId);
			aimlSubsMapper.deleteAll(subs);
			SubsCategory subsCa = new SubsCategory();
			subsCa.setCpId(cpId);
			subsCategoryMapper.deleteAll(subsCa);

			for (String arr[] : myEntries) {
				count++;

				if (arr[0].trim().indexOf("SCDSA002") > -1) {
					count = myEntries.size();
					dataError.add(new String[] { null, null, null, "등록 형식에 맞지 않습니다.(암호화 문서)" });
					break;
				}

				if (count != 1 && arr.length != 3) {
					dataError.add(new String[] { null, null, null, "등록 형식에 맞지 않습니다." });
				}

				// 헤더
				if (count == 1 || arr.length != 3) {
					continue;
				}

				String categoryName = arr[0].trim();
				String find = arr[1].trim();
				String replace = arr[2].trim();

				if ("".equals(categoryName)) {
					dataError.add(new String[] { categoryName, find, replace, "카테고리명이 없습니다." });
				} else if ("".equals(find) || "".equals(replace)) {
					dataError.add(new String[] { categoryName, find, replace, "필수 항목을 모두 작성해 주세요." });
				} else if (StringUtil.isMatches(find) || StringUtil.isMatches(replace)) {
					dataError.add(new String[] { categoryName, find, replace, "<>\"\'& 특수문자는 사용 할 수 없습니다." });
				} else {
					if (!categoryMap.containsKey(categoryName)) {
						SubsCategory subsCategory = new SubsCategory();
						subsCategory.setCpId(cpId);
						subsCategory.setName(categoryName);
						subsCategory.setRestriction(CategoryType.USER.getValue());
						subsCategory.setEnabled(EnabledType.ENABLE.getValue());
						List<SubsCategory> subsCategories = subsCategoryMapper.selectListByName(subsCategory);
						if (subsCategories.size() > 0) {
							categoryMap.put(categoryName, subsCategories.get(subsCategories.size() - 1).getId());
						} else {
							try {
								subsCategoryMapper.insert(subsCategory);
								createSubsDeploy(subsCategory); // 배포설정
								categoryMap.put(categoryName, subsCategory.getId());
							} catch (DataAccessException ex) {
								throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()), ex);
							}
						}
					}

					AimlSubs aimlSubs = new AimlSubs();
					aimlSubs.setCateId(categoryMap.get(categoryName));
					aimlSubs.setFind(StringUtil.setReplaceSubs(find));
					aimlSubs.setReplace(replace);
					aimlSubs.setCpId(cpId);

					int result = aimlSubsMapper.countByFind(aimlSubs);
					if (result == 0) {
						try {
							resultCount += aimlSubsMapper.insert(aimlSubs);
						} catch (Exception e) {
							dataError.add(new String[] { categoryName, find, replace, e.getCause().getMessage() });
						}
					} else {
						dataError.add(new String[] { categoryName, find, replace, "중복된 데이터입니다." });
					}
				}
			}

			// 오류
			fileUtil.createErrorFile(path, dataError);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()), ex);
		}

		LOG.info("총 substitutions 개수 = " + count);

		message = "총 " + (count - 1) + " 건이 완료 되었습니다.<br/>(성공 : " + resultCount + "건 / 실패 : " + (count - 1 - resultCount) + "건)";

		return message;
	}

	/**
	 * Upload prop.
	 *
	 * @param cpId
	 *            the cp id
	 * @param path
	 *            the path
	 */
	@Override
	public String uploadProp(int cpId, String path) throws BizCheckedException, ApplicationException {
		if (cpId == 0) {
			throw new BizCheckedException(BizErrCode.ERR_0006, "cpId");
		}

		if (path == null || "".equals(path)) {
			throw new BizCheckedException(BizErrCode.ERR_0001, "path");
		}

		List<String[]> myEntries = readCsv(path);

		LOG.info("총 행개수 = " + myEntries.size());

		int count = 0;
		int resultCount = 0;
		String message = "";
		Map<String, Integer> categoryMap = new HashMap<>();
		List<String[]> dataError = new ArrayList<String[]>();

		dataError.add(new String[] { "카테고리", "이름", "값", "오류" });

		try {
			for (String arr[] : myEntries) {
				count++;

				if (arr[0].trim().indexOf("SCDSA002") > -1) {
					count = myEntries.size();
					dataError.add(new String[] { null, null, null, "등록 형식에 맞지 않습니다.(암호화 문서)" });
					break;
				}

				if (count != 1 && arr.length != 3) {
					dataError.add(new String[] { null, null, null, "등록 형식에 맞지 않습니다." });
				}

				// 헤더
				if (count == 1 || arr.length != 3) {
					continue;
				}

				String categoryName = arr[0].trim();
				String name = arr[1].trim();
				String val = arr[2].trim();

				if ("".equals(categoryName)) {
					dataError.add(new String[] { categoryName, name, val, "카테고리명이 없습니다." });
				} else if ("".equals(name) || "".equals(val)) {
					dataError.add(new String[] { categoryName, name, val, "필수 항목을 모두 작성해 주세요." });
				} else if (StringUtil.isMatches(name) || StringUtil.isMatches(val)) {
					dataError.add(new String[] { categoryName, name, val, "<>\"\'& 특수문자는 사용 할 수 없습니다." });
				} else {
					AimlProp aimlProp = new AimlProp();
					aimlProp.setName(name);
					aimlProp.setVal(val);
					aimlProp.setCpId(cpId);

					if (!categoryMap.containsKey(categoryName)) {
						PropCategory propCategory = new PropCategory();
						propCategory.setName(categoryName);
						propCategory.setCpId(cpId);
						propCategory.setEnabled(EnabledType.ENABLE.getValue());
						propCategory.setRestriction(CategoryType.USER.getValue());

						List<PropCategory> propCategories = propCategoryMapper.selectListByName(propCategory);
						if (propCategories.size() == 0) {
							propCategoryMapper.insert(propCategory);
							createPropDeploy(propCategory); // 배포설정
							aimlProp.setCateId(propCategory.getId());
							categoryMap.put(categoryName, propCategory.getId());
						} else {
							aimlProp.setCateId(propCategories.get(propCategories.size() - 1).getId());
							categoryMap.put(categoryName, propCategories.get(propCategories.size() - 1).getId());
						}
					} else {
						aimlProp.setCateId(categoryMap.get(categoryName));
					}

					int result = aimlPropMapper.countByName(aimlProp);
					if (result == 0) {
						try {
							resultCount += aimlPropMapper.insert(aimlProp);
						} catch (Exception e) {
							dataError.add(new String[] { categoryName, name, val, e.getCause().getMessage() });
						}
					} else {
						dataError.add(new String[] { categoryName, name, val, "중복된 데이터입니다." });
					}
				}
			}

			// 오류
			fileUtil.createErrorFile(path, dataError);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()), ex);
		}

		LOG.info("총 properties 개수 = " + count);

		message = "총 " + (count - 1) + " 건이 완료 되었습니다.<br/>(성공 : " + resultCount + "건 / 실패 : " + (count - 1 - resultCount) + "건)";

		return message;
	}

	/**
	 * Upload pred.
	 *
	 * @param cpId
	 *            the cp id
	 * @param path
	 *            the path
	 */
	@Override
	public String uploadPred(int cpId, String path) throws ApplicationException, BizCheckedException {
		if (cpId == 0) {
			throw new BizCheckedException(BizErrCode.ERR_0006, "cpId");
		}

		if (path == null || "".equals(path)) {
			throw new BizCheckedException(BizErrCode.ERR_0001, "path");
		}

		List<String[]> myEntries = readCsv(path);

		LOG.info("총 행개수 = " + myEntries.size());

		int count = 0;
		int resultCount = 0;
		String message = "";
		Map<String, Integer> categoryMap = new HashMap<>();
		List<String[]> dataError = new ArrayList<String[]>();

		dataError.add(new String[] { "카테고리", "이름(name)", "기본값(default)", "동작", "오류" });

		try {
			for (String arr[] : myEntries) {
				count++;

				if (arr[0].trim().indexOf("SCDSA002") > -1) {
					count = myEntries.size();
					dataError.add(new String[] { null, null, null, null, "등록 형식에 맞지 않습니다.(암호화 문서)" });
					break;
				}

				if (count != 1 && arr.length != 4) {
					dataError.add(new String[] { null, null, null, null, "등록 형식에 맞지 않습니다." });
				}

				// 헤더
				if (count == 1 || arr.length != 4) {
					continue;
				}

				String categoryName = arr[0].trim();
				String name = arr[1].trim();
				String basic = arr[2].trim();
				String val = arr[3].trim();

				if ("".equals(categoryName)) {
					dataError.add(new String[] { categoryName, name, basic, val, "카테고리명이 없습니다." });
				} else if ("".equals(name) || "".equals(basic) || "".equals(val)) {
					dataError.add(new String[] { categoryName, name, basic, val, "필수 항목을 모두 작성해 주세요." });
				} else if (StringUtil.isMatches(name) || StringUtil.isMatches(basic) || StringUtil.isMatches(val)) {
					dataError.add(new String[] { categoryName, name, basic, val, "<>\"\'& 특수문자는 사용 할 수 없습니다." });
				} else {
					AimlPred aimlPred = new AimlPred();
					aimlPred.setName(name);
					aimlPred.setBasic(basic);
					aimlPred.setVal(val);
					aimlPred.setCpId(cpId);

					if (!categoryMap.containsKey(categoryName)) {
						PredCategory predCategory = new PredCategory();
						predCategory.setName(categoryName);
						predCategory.setCpId(cpId);
						predCategory.setEnabled(EnabledType.ENABLE.getValue());
						predCategory.setRestriction(CategoryType.USER.getValue());

						List<PredCategory> predCategories = predCategoryMapper.selectListByName(predCategory);
						if (predCategories.size() == 0) {
							predCategoryMapper.insert(predCategory);
							createPredDeploy(predCategory); // 배포설정
							aimlPred.setCateId(predCategory.getId());
							categoryMap.put(categoryName, predCategory.getId());
						} else {
							aimlPred.setCateId(predCategories.get(predCategories.size() - 1).getId());
							categoryMap.put(categoryName, predCategories.get(predCategories.size() - 1).getId());
						}
					} else {
						aimlPred.setCateId(categoryMap.get(categoryName));
					}

					int result = aimlPredMapper.countByName(aimlPred);
					if (result == 0) {
						try {
							resultCount += aimlPredMapper.insert(aimlPred);
						} catch (Exception e) {
							dataError.add(new String[] { categoryName, name, basic, val, e.getCause().getMessage() });
						}
					} else {
						dataError.add(new String[] { categoryName, name, basic, val, "중복된 데이터입니다." });
					}
				}
			}

			// 오류
			fileUtil.createErrorFile(path, dataError);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()), ex);
		}

		LOG.info("총 predicates 개수 = " + count);

		message = "총 " + (count - 1) + " 건이 완료 되었습니다.<br/>(성공 : " + resultCount + "건 / 실패 : " + (count - 1 - resultCount) + "건)";

		return message;
	}

	/**
	 * Download aiml string.
	 *
	 * @param cpid
	 *            the cpid
	 * @return the string
	 */
	@Override
	public String downloadAiml(int cpid) {
		return null;
	}

	/**
	 * Download subs string.
	 *
	 * @param cpid
	 *            the cpid
	 * @return the string
	 */
	@Override
	public String downloadSubs(int cpid) {
		return null;
	}

	/**
	 * Download prop string.
	 *
	 * @param cpid
	 *            the cpid
	 * @return the string
	 */
	@Override
	public String downloadProp(int cpid) {
		return null;
	}

	/**
	 * Download pred string.
	 *
	 * @param cpid
	 *            the cpid
	 * @return the string
	 */
	@Override
	public String downloadPred(int cpid) {
		return null;
	}

	/**
	 * 추가 답변
	 *
	 * @param aimlMain
	 *            the aiml main
	 * @param appendReply
	 *            the append reply
	 */
	private void createAimlReply(AimlMain aimlMain, String appendReply) throws ApplicationException {
		if (appendReply == null || "".equals(appendReply)) {
			return;
		}

		String str = appendReply.replaceAll("\n", "");

		String[] split = str.split(";");

		try {
			for (int i = 0; i < split.length; i++) {
				AimlReply aimlReply = new AimlReply();
				aimlReply.setMainId(aimlMain.getId());
				aimlReply.setCateId(aimlMain.getCateId());
				aimlReply.setReplyInput(split[i]);

				aimlReplyMapper.insert(aimlReply);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 링크 생성
	 *
	 * @param aimlMain
	 *            the aiml main
	 * @param link
	 *            the link
	 */
	private void createAimlLink(AimlMain aimlMain, String link) throws ApplicationException {
		if (link == null || "".equals(link) || link.length() == 0) {
			return;
		}

		String[] rows = link.split("\n");

		try {
			for (int i = 0; i < rows.length; i++) {
				String[] split = rows[i].split(";");
				AimlLink aimlLink = new AimlLink();
				aimlLink.setMainId(aimlMain.getId());
				aimlLink.setCateId(aimlMain.getCateId());
				aimlLink.setUrl(split[2]);
				aimlLink.setTitle(split[0]);
				aimlLink.setComment(split[1]);
				aimlLinkMapper.insert(aimlLink);
			}
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()), ex);
		}
	}

	/**
	 * 추천 질문 생성
	 *
	 * @param aimlMain
	 *            the aiml main
	 * @param recommend
	 *            the recommend
	 */
	private void createAimlRecommend(AimlMain aimlMain, String recommend) throws ApplicationException {
		if (recommend == null || "".equals(recommend)) {
			return;
		}

		String str = recommend.replaceAll("\n", "");

		String[] split = str.split(";");

		int count = 0;
		try {
			for (int i = 0; i < split.length; i++) {
				AimlRecommend aimlRecommend = new AimlRecommend();
				aimlRecommend.setMainId(aimlMain.getId());
				aimlRecommend.setCateId(aimlMain.getCateId());
				aimlRecommend.setRecommendInput(split[i]);

				count += aimlRecommendMapper.insert(aimlRecommend);
			}
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()), ex);
		}

		LOG.info("총 추천답변 입력개수 = " + count);

	}

	/**
	 * 이미지 생성
	 *
	 * @param aimlMain
	 *            the aiml main
	 * @param image
	 *            the image
	 */
	private void createAimlImage(AimlMain aimlMain, String image, String alt) throws ApplicationException {
		String str;
		if (image == null || "".equals(image)) {
			return;
		} else {
			str = image.replaceAll(" ", "");
		}

		if (alt == null || "".equals(alt)) {
			throw new ApplicationException("대체텍스트 필요함");
		}

		String[] split = str.split(";");
		String[] alts = alt.split(";");
		int count = 0;

		try {
			for (int i = 0; i < split.length; i++) {
				AimlImages images = new AimlImages();
				images.setMainId(aimlMain.getId());
				images.setCateId(aimlMain.getCateId());
				images.setTitle("");
				images.setUrl(split[i]);
				images.setAlt(alts[i]);
				aimlImagesMapper.insert(images);
			}
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()), ex);
		}

		LOG.info("총 이미지 입력 개수 = " + count);
	}

	/**
	 * 테스트 질문 생성
	 *
	 * @param aimlMain
	 *            the aiml main
	 * @param test
	 *            the test
	 */
	private void createAimlTest(AimlMain aimlMain, String test) throws ApplicationException {
		if (test == null || "".equals(test)) {
			return;
		}

		String str = test.replaceAll("\n", "");

		AimlTest aimlTest = new AimlTest();
		aimlTest.setCateId(aimlMain.getCateId());
		aimlTest.setMainId(aimlMain.getId());

		String[] split = str.split(";");

		int count = 0;
		try {
			for (int i = 0; i < split.length; i++) {
				aimlTest.setTestInput(split[i]);
				count += aimlTestMapper.insert(aimlTest);
			}
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()), ex);
		}

		LOG.info("총 TEST 입력 개수 = " + count);
	}

	/**
	 * 옵션 생성
	 *
	 * @param aimlMain
	 *            the aiml main
	 * @param test
	 *            the test
	 */
	private void createAimlOption(AimlMain aimlMain, String option) throws ApplicationException {
		if (option == null || "".equals(option)) {
			return;
		}

		String str = option.replaceAll("\n", "");

		AimlOption aimlOption = new AimlOption();
		aimlOption.setCateId(aimlMain.getCateId());
		aimlOption.setMainId(aimlMain.getId());

		String[] split = str.split(";");

		int count = 0;
		try {
			for (int i = 0; i < split.length; i++) {
				if (!"".equals(split[i])) {
					aimlOption.setVal(split[i]);
					aimlOption.setSeq((i + 1));
					count += aimlOptionMapper.insert(aimlOption);
				}
			}
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()), ex);
		}

		LOG.info("총 TEST 입력 개수 = " + count);
	}

	/**
	 * AIML 데이터를 생성한다.
	 *
	 * @param categoryMap
	 * @param cpId
	 *            the cp id
	 * @param cateName
	 *            the cate name
	 * @param input
	 *            the input
	 * @param reply
	 *            the reply
	 * @return the aiml main
	 */
	private AimlMain createAimlMain(Map<String, Integer> categoryMap, int cpId, String cateName, String input, String reply, String that) throws ApplicationException {
		AimlMain main = new AimlMain();
		main.setInput(input);
		main.setReply(reply);
		main.setThatId(0);
		main.setCpId(cpId);

		try {
			// 카테고리가 없으면 생성한다.
			if (!categoryMap.containsKey(cateName)) {
				AimlCategory aimlCategory = new AimlCategory();
				aimlCategory.setCpId(cpId);
				aimlCategory.setName(cateName.trim());

				List<AimlCategory> aimlCategories = aimlCategoryMapper.selectListByName(aimlCategory);

				if (aimlCategories.size() == 0) {
					aimlCategory.setRestriction(CategoryType.USER.getValue());
					aimlCategory.setTopic(CategoryTopicType.NO.getValue());
					aimlCategory.setEnabled(EnabledType.ENABLE.getValue());
					aimlCategory.setUploadLock("N");
					aimlCategoryMapper.insert(aimlCategory);
					createAimlDeploy(aimlCategory); // 배포설정
					main.setCateId(aimlCategory.getId());
					categoryMap.put(cateName, aimlCategory.getId());
				} else {
					// 첫번째 검색된 결과
					main.setCateId(aimlCategories.get(aimlCategories.size() - 1).getId());
					categoryMap.put(cateName, aimlCategories.get(aimlCategories.size() - 1).getId());
				}

			} else {
				main.setCateId(categoryMap.get(cateName));
			}

			// that 조회
			if (that != null && !"".equals(that)) {
				HashMap<String, Object> maps = new HashMap<>();
				maps.put("cpId", cpId);
				maps.put("cateId", main.getCateId());
				maps.put("reply", that);
				maps.put("firstRecordIndex", 0);
				maps.put("recordCountPerPage", 10);

				List<AimlMain> aimlMains = aimlMainMapper.selectListByReply(maps);
				if (aimlMains.size() > 0) {
					main.setThatId(aimlMains.get(0).getId());
				}
			}

			if (!("".equals(main.getInput()) || "".equals(main.getReply()))) {
				if (AimlValidator.validPattern(main.getInput())) {
					// 질문이 정상 AIML 형식이라면 등록시도
					int result = aimlMainMapper.countByInput(main);
					if (result == 0) { // 질문 중복일 경우에 등록 안함
						aimlMainMapper.insert(main);
					}
				}
			}

		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()), ex);
		}

		return main;
	}

	/**
	 * aiml deploy.
	 *
	 * @param aimlCategory
	 *            the aimlCategory
	 * @return the int
	 */
	@Transactional
	private void createAimlDeploy(AimlCategory aimlCategory) {
		DeployAimlCategory deployAimlCategory = new DeployAimlCategory();
		deployAimlCategory.setCpId(aimlCategory.getCpId());
		deployAimlCategory.setCateId(aimlCategory.getId());

		try {
			deployAimlCategoryMapper.deleteByPrimaryKey(deployAimlCategory);
			deployAimlCategoryMapper.insert(deployAimlCategory);
		} catch (DataAccessException ex) {
			LOG.debug("배포설정 오류", ex);
		}
	}

	/**
	 * subs deploy.
	 *
	 * @param subsCategory
	 *            the subsCategory
	 * @return the int
	 */
	@Transactional
	private void createSubsDeploy(SubsCategory subsCategory) throws ApplicationException, BizCheckedException {
		DeploySubsCategory deploySubsCategory = new DeploySubsCategory();
		deploySubsCategory.setCpId(subsCategory.getCpId());
		deploySubsCategory.setCateId(subsCategory.getId());

		try {
			deploySubsCategoryMapper.deleteByPrimaryKey(deploySubsCategory);
			deploySubsCategoryMapper.insert(deploySubsCategory);
		} catch (DataAccessException ex) {
			LOG.debug("배포설정 오류", ex);
		}
	}

	/**
	 * prop deploy.
	 *
	 * @param propCategory
	 *            the propCategory
	 * @return the int
	 */
	@Transactional
	private void createPropDeploy(PropCategory propCategory) throws ApplicationException, BizCheckedException {
		DeployPropCategory deployPropCategory = new DeployPropCategory();
		deployPropCategory.setCpId(propCategory.getCpId());
		deployPropCategory.setCateId(propCategory.getId());

		try {
			deployPropCategoryMapper.deleteByPrimaryKey(deployPropCategory);
			deployPropCategoryMapper.insert(deployPropCategory);
		} catch (DataAccessException ex) {
			LOG.debug("배포설정 오류", ex);
		}
	}

	/**
	 * pred deploy.
	 *
	 * @param predCategory
	 *            the predCategory
	 * @return the int
	 */
	@Transactional
	private void createPredDeploy(PredCategory predCategory) throws ApplicationException, BizCheckedException {
		DeployPredCategory deployPredCategory = new DeployPredCategory();
		deployPredCategory.setCpId(predCategory.getCpId());
		deployPredCategory.setCateId(predCategory.getId());

		try {
			deployPredCategoryMapper.deleteByPrimaryKey(deployPredCategory);
			deployPredCategoryMapper.insert(deployPredCategory);
		} catch (DataAccessException ex) {
			LOG.debug("배포설정 오류", ex);
		}
	}

	@Override
	@Transactional
	public String uploadChatLog(String cpLabel, String path) throws ApplicationException, BizCheckedException {
		if (cpLabel == null || "".equals(cpLabel)) {
			throw new BizCheckedException(BizErrCode.ERR_0001, "cpLabel");
		}

		if (path == null || "".equals(path)) {
			throw new BizCheckedException(BizErrCode.ERR_0001, "path");
		}

		List<String[]> myEntries = readCsv(path);

		LOG.info("총 행개수 = " + myEntries.size());

		int count = 0;
		int resultCount = 0;
		int etcCount = 0;
		String message = "";
		List<String[]> dataError = new ArrayList<String[]>();

		dataError.add(new String[] { "질문", "카테고리", "대화", "답변", "사용자ID", "시간", "오류" });

		try {
			ChatLog chatLog = new ChatLog();
			chatLog.setCpLabel(cpLabel);

			for (String arr[] : myEntries) {
				count++;

				if (arr[0].trim().indexOf("SCDSA002") > -1) {
					count = myEntries.size();
					dataError.add(new String[] { null, null, null, null, null, null, "등록 형식에 맞지 않습니다.(암호화 문서)" });
					break;
				}

				if (count != 1 && arr.length != 6) {
					dataError.add(new String[] { null, null, null, null, null, null, "등록 형식에 맞지 않습니다." });
				}

				// 헤더
				if (count == 1 || arr.length != 6) {
					continue;
				}
				// 질문
				String userInput = arr[0].trim();
				// 카테고리
				String cateName = arr[1].trim();
				// 대화
				String input = arr[2].trim();
				// 답변
				String reply = arr[3].trim();
				// 사용자ID
				String userId = arr[4].trim();
				// 시간
				String logTime = arr[5].trim();

				try {
					chatLog.setUserInput(userInput);
					chatLog.setCateName(cateName);
					chatLog.setInput(input);
					chatLog.setReply(reply);
					chatLog.setUserId(userId);

					// 2016-12-08 09:36:03
					SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					Date created = formatter.parse(logTime);
					chatLog.setCreated(created);
					chatLogMapper.insert(chatLog);
				} catch (Exception e) {
					etcCount += 1;
					dataError.add(new String[] { userInput, cateName, input, reply, userId, logTime, "로그 형식에 맞지 않습니다." });
				}
				resultCount += 1;
			}

			// 오류
			fileUtil.createErrorFile(path, dataError);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()), ex);
		}

		LOG.info("총 대화 개수 = " + count);

		message = "총 " + (count - 1) + " 건이 완료 되었습니다.<br/>(성공 : " + resultCount + "건 / 실패 : " + (count - 1 - resultCount) + "건/ 기타오류 : " + etcCount + "건)";

		return message;
	}

	/**
	 * Log Process를 전체 갱신 한다.
	 * @param cpLabel
	 * @return
	 * @throws BizCheckedException
	 */
	public String updateChatLogProcessAll(String cpLabel) throws BizCheckedException {

		if (cpLabel == null || "".equals(cpLabel)) {
			throw new BizCheckedException(BizErrCode.ERR_0001, "cpLabel");
		}
		ChatLogProcess chatLogProcess = new ChatLogProcess();
		chatLogProcess.setCpLabel(cpLabel);
		int result = chatLogProcessMapper.insertNewUserInput(chatLogProcess);
		return String.valueOf(result);
	}
}