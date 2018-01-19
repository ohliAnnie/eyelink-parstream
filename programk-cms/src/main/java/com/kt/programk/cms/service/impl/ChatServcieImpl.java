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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.aitools.programd.graph.Match;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.Gson;
import com.kt.programk.cms.common.FileUtil;
import com.kt.programk.cms.service.ChatServcie;
import com.kt.programk.common.domain.core.AimlImages;
import com.kt.programk.common.domain.core.AimlLink;
import com.kt.programk.common.domain.core.AimlMain;
import com.kt.programk.common.domain.core.AimlOption;
import com.kt.programk.common.domain.core.AimlRecommend;
import com.kt.programk.common.domain.core.AimlReply;
import com.kt.programk.common.domain.core.AimlTest;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.exception.CommonCode;
import com.kt.programk.common.repository.core.AimlImagesMapper;
import com.kt.programk.common.repository.core.AimlLinkMapper;
import com.kt.programk.common.repository.core.AimlMainMapper;
import com.kt.programk.common.repository.core.AimlOptionMapper;
import com.kt.programk.common.repository.core.AimlRecommendMapper;
import com.kt.programk.common.repository.core.AimlReplyMapper;
import com.kt.programk.common.repository.core.AimlTestMapper;
import com.kt.programk.common.utils.DbExceptionUtil;
import com.kt.programk.common.wo.ProgramkResponse;
import com.kt.programk.deploy.service.DeployService;

/**
 * 대화 관리
 */
@Service
public class ChatServcieImpl implements ChatServcie {
	
    /**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(ChatServcieImpl.class);
    
	/** fileUtils */
    @Resource(name="fileUtil")
    private FileUtil fileUtil;

    /**
     * The Aiml main mapper.
     */
    @Autowired
    private AimlMainMapper aimlMainMapper;

    /**
     * The Aiml link mapper.
     */
    @Autowired
    private AimlLinkMapper aimlLinkMapper;

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
     * The Aiml reply mapper.
     */
    @Autowired
    private AimlReplyMapper aimlReplyMapper;

    /**
     * The Aiml test mapper.
     */
    @Autowired
    private AimlTestMapper aimlTestMapper;
    
    /**
     * The Aiml option mapper.
     */
    @Autowired
    private AimlOptionMapper aimlOptionMapper;
    
    /** The deploy service. */
    @Autowired
    private DeployService deployService;
    
    /** JSON 변환 */
    private Gson gson = new Gson();

    /**
     * Count all int.
     *
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    public int countAll(AimlMain aimlMain) throws ApplicationException {
        try {
            return aimlMainMapper.countAll(aimlMain);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Count by cp id int.
     *
     * @param cpId the cp id
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    public int countByCpId(int cpId) throws ApplicationException, BizCheckedException {
        if(cpId == 0){
            throw new BizCheckedException(BizErrCode.ERR_0006, "cpId");
        }
        try {
            return aimlMainMapper.countByCpId(cpId);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Count by cate name int.
     *
     * @param cateName the cate name
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    public int countByCateName(String cateName) throws ApplicationException, BizCheckedException {
        if(cateName == null || "".equals(cateName)){
            throw new BizCheckedException(BizErrCode.ERR_0006, "cateName");
        }

        try {
            return aimlMainMapper.countByCateName(cateName);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Count by topic id int.
     *
     * @param topicName the topic name
     * @return the int
     */
    @Override
    @Deprecated
    public int countByTopicId(String topicName) {
        return 0;
    }

    /**
     * Count by input int.
     *
     * @param input the input
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    public int countByInput(AimlMain aimlMain) throws ApplicationException{
        try {
            return aimlMainMapper.countByInput(aimlMain);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Count by reply int.
     *
     * @param reply the reply
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    public int countByReply(String reply) throws ApplicationException, BizCheckedException {
        if(reply == null || "".equals(reply)){
            throw new BizCheckedException(BizErrCode.ERR_0006, "reply");
        }

        try {
            return aimlMainMapper.countByReply(reply);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Find list all list.
     *
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     * @throws ApplicationException the application exception
     */
    @Override
    public List<AimlMain> findListAll(AimlMain aimlMain, int currentPageNo, int recordCountPerPage) throws ApplicationException {       
        aimlMain.setRecordCountPerPage(recordCountPerPage);
        aimlMain.setFirstRecordIndex((currentPageNo - 1) * recordCountPerPage);

        try {
            return aimlMainMapper.selectListAll(aimlMain);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }
    
    /**
     * Find list all list.
     *
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     * @throws ApplicationException the application exception
     */
    @Override
    public List<AimlMain> findDownloadListAll(AimlMain aimlMain, int currentPageNo, int recordCountPerPage) throws ApplicationException {       
        aimlMain.setRecordCountPerPage(recordCountPerPage);
        aimlMain.setFirstRecordIndex((currentPageNo - 1) * recordCountPerPage);

        try {
            return aimlMainMapper.selectDownloadListAll(aimlMain);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Find list by cp id list.
     *
     * @param cpId               the cp id
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     * @throws ApplicationException the application exception
     */
    @Override
    public List<AimlMain> findListByCpId(int cpId, int currentPageNo, int recordCountPerPage) throws ApplicationException, BizCheckedException {
        if(cpId == 0){
            throw new BizCheckedException(BizErrCode.ERR_0006, "cpId");
        }

        HashMap<String, Object> map = new HashMap<String, Object>();
        map.put("cpId", cpId);
        map.put("firstRecordIndex",(currentPageNo - 1) * recordCountPerPage);
        map.put("recordCountPerPage",recordCountPerPage);

        try {
            return aimlMainMapper.selectListByCpId(map);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Find list by cate name list.
     *
     * @param cateName           the cate name
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     * @throws ApplicationException the application exception
     */
    @Override
    public List<AimlMain> findListByCateName(String cateName, int currentPageNo, int recordCountPerPage) throws ApplicationException, BizCheckedException {
        if(cateName == null || "".equals(cateName)){
            throw new BizCheckedException(BizErrCode.ERR_0006, "cateName");
        }

        HashMap<String, Object> map = new HashMap<String, Object>();
        map.put("cateName", cateName);
        map.put("firstRecordIndex",(currentPageNo - 1) * recordCountPerPage);
        map.put("recordCountPerPage",recordCountPerPage);

        try {
            return aimlMainMapper.selectListByCateName(map);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Find list by topic id list.
     *
     * @param topicName          the topic name
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     */
    @Override
    @Deprecated
    public List<AimlMain> findListByTopicId(String topicName, int currentPageNo, int recordCountPerPage) {
        return null;
    }

    /**
     * Find list by input list.
     *
     * @param input              the input
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     * @throws ApplicationException the application exception
     */
    @Override
    public List<AimlMain> findListByInput(String input, int currentPageNo, int recordCountPerPage) throws ApplicationException, BizCheckedException {
        if(input == null || "".equals(input)){
            throw new BizCheckedException(BizErrCode.ERR_0006, "input");
        }

        HashMap<String, Object> map = new HashMap<String, Object>();
        map.put("input", input);
        map.put("firstRecordIndex",(currentPageNo - 1) * recordCountPerPage);
        map.put("recordCountPerPage",recordCountPerPage);

        try {
            return aimlMainMapper.selectListByCateName(map);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Find list by reply list.
     *
     * @param reply              the reply
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     * @throws ApplicationException the application exception
     */
    @Override
    public List<AimlMain> findListByReply(String reply, int currentPageNo, int recordCountPerPage) throws ApplicationException, BizCheckedException {
        if(reply == null || "".equals(reply)){
            throw new BizCheckedException(BizErrCode.ERR_0006, "reply");
        }

        HashMap<String, Object> map = new HashMap<String, Object>();
        map.put("reply", reply);
        map.put("firstRecordIndex",(currentPageNo - 1) * recordCountPerPage);
        map.put("recordCountPerPage",recordCountPerPage);

        try {
            return aimlMainMapper.selectListByCateName(map);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Create int.
     *
     * @param aimlMain the aiml main
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public int create(AimlMain aimlMain) throws ApplicationException, BizCheckedException {
        if(aimlMain == null) {
            throw new BizCheckedException(BizErrCode.ERR_0001, "aimlMain");
        }

        if(aimlMain.getCateId() == 0){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlMain.cateId");
        }

        if(aimlMain.getInput() == null
                || "".equals(aimlMain.getInput())
                || aimlMain.getInput().length() > AimlMain.MAX_LENGTH_INPUT){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlMain.input");
        }

        if(aimlMain.getReply() == null || "".equals(aimlMain.getReply())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlMain.reply");
        }
        
        int insert = 0;
        try {
        	insert = aimlMainMapper.insert(aimlMain);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        if (aimlMain.getId() == 0) {
            throw new BizCheckedException(BizErrCode.ERR_0003, "aimlMain.id");
        }
        
        addImage(aimlMain); //이미지
        addLink(aimlMain); //텍스트링크
        addRecommend(aimlMain); //추천질문        
        addReply(aimlMain); //추가답변
        addTest(aimlMain);//테스트 질문
        addOption(aimlMain);//옵션
        
        return insert;
    }

    /**
     * Create int.
     *
     * @param aimlMains the aiml mains
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public int create(List<AimlMain> aimlMains) throws ApplicationException, BizCheckedException {
        if(aimlMains == null){
            throw new ApplicationException(String.valueOf(CommonCode.COM_VALUE_VALIDATE_ERROR.getNumber()));
        }

        if(aimlMains.size() == 0){
            return 0;
        }

        int sum = 0;
        for(AimlMain aimlMain : aimlMains) {
            sum += create(aimlMain);
        }

        return sum;
    }

    /**
     * Modify int.
     *
     * @param aimlMain the aiml main
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public int modify(AimlMain aimlMain) throws ApplicationException, BizCheckedException {
        if(aimlMain == null) {
            throw new BizCheckedException(BizErrCode.ERR_0001, "aimlMain");
        }

        if(aimlMain.getId() == 0){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlMain.id");
        }

        if(aimlMain.getCateId() == 0){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlMain.cageId");
        }

        if(aimlMain.getInput() == null
                || "".equals(aimlMain.getInput())
                || aimlMain.getInput().length() > AimlMain.MAX_LENGTH_INPUT){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlMain.input");
        }

        if(aimlMain.getReply() == null || "".equals(aimlMain.getReply())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlMain.reply");
        }
        
        //기존 AIML 관련 내용을 삭제
        AimlMain oldAiml = aimlMainMapper.selectByPrimaryKey(aimlMain);
        if(oldAiml != null){
	        removeImages(oldAiml.getCateId(), aimlMain.getId());//이미지
	        removeLink(oldAiml.getCateId(), aimlMain.getId()); //텍스트링크
	        removeRecommend(oldAiml.getCateId(), aimlMain.getId()); //추천질문 
	        removeReply(oldAiml.getCateId(), aimlMain.getId()); //추가답변
	        removeTest(oldAiml.getCateId(), aimlMain.getId()); //테스트질문
	        removeOption(oldAiml.getCateId(), aimlMain.getId()); //옵션
        }
        
        int insert = 0;
        try{
        	insert = aimlMainMapper.updateByPrimaryKeySelective(aimlMain);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        addImage(aimlMain); //이미지
        addLink(aimlMain); //텍스트링크
        addRecommend(aimlMain); //추천질문        
        addReply(aimlMain); //추가답변
        addTest(aimlMain);//테스트 질문
        addOption(aimlMain);//옵션
        
        return insert;
    }

    /**
     * Remove int.
     *
     * @param cateId the cate id
     * @param id     the id
     * @return the int
     * @throws ApplicationException the application exception
     * @throws BizCheckedException
     */
    @Override
    @Transactional
    public int remove(AimlMain aimlMain) throws ApplicationException, BizCheckedException {
    	if(aimlMain.getCateId() == 0){
            throw new BizCheckedException(BizErrCode.ERR_0006, "cateId");
        }
    	
    	int insert = 0;
        try {
        	insert = aimlMainMapper.deleteByPrimaryKey(aimlMain);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        removeImages(aimlMain.getCateId(), aimlMain.getId());//이미지
        removeLink(aimlMain.getCateId(), aimlMain.getId()); //텍스트링크
        removeRecommend(aimlMain.getCateId(), aimlMain.getId()); //추천질문 
        removeReply(aimlMain.getCateId(), aimlMain.getId()); //추가답변
        removeTest(aimlMain.getCateId(), aimlMain.getId()); //테스트질문
        removeOption(aimlMain.getCateId(), aimlMain.getId()); //옵션
        
        return insert;
    }

    /**
     * Add link int.
     *
     * @param aimlLink the aiml link
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public void addLink(AimlMain aimlMain) throws ApplicationException, BizCheckedException {
        if(aimlMain == null){
            throw new BizCheckedException(BizErrCode.ERR_0001, "aimlMain");
        }
        
        //등록된 내용 삭제
        removeLink(aimlMain.getCateId(), aimlMain.getId());
        
        if(aimlMain.getLinkTitle() == null ||  "".equals(aimlMain.getLinkTitle())){       		
        }else{
        	if(aimlMain.getCateId() == 0){
                throw new BizCheckedException(BizErrCode.ERR_0006, "aimlLink.cateId");
            }

            if(aimlMain.getId() == 0){
                throw new BizCheckedException(BizErrCode.ERR_0006, "aimlLink.mainId");
            } 

            try {            	 
            	 String[] tempLinkTitle = aimlMain.getLinkTitle().split("&!&");
            	 String[] tempLinkComment = aimlMain.getLinkComment().split("&!&");
            	 String[] tempLinkUrl = aimlMain.getLinkUrl().split("&!&");
            	 
                 for (int i = 0; i < tempLinkTitle.length; i++) {
                	AimlLink aimlLink = new AimlLink();
                 	aimlLink.setCateId(aimlMain.getCateId());
                 	aimlLink.setMainId(aimlMain.getId());
                 	aimlLink.setTitle(tempLinkTitle[i].trim());
                 	
                 	if(tempLinkComment.length >= i+1){
                 		aimlLink.setComment(tempLinkComment[i].trim());
                 	}else{
                 		aimlLink.setComment("");
                 	}
                 	
                 	if(tempLinkUrl.length >= i+1){
                 		aimlLink.setUrl(tempLinkUrl[i].trim());
                 	}else{
                 		aimlLink.setUrl("");
                 	}
                 	
                 	aimlLinkMapper.insert(aimlLink);        	
     			}
            }catch (DataAccessException ex){
                throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
            }
        }
    }
    
    /**
     * Add link int.
     *
     * @param aimlLinks the aiml links
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public int addLink(List<AimlLink> aimlLinks) throws ApplicationException, BizCheckedException {
        if(aimlLinks == null){
            throw new BizCheckedException(BizErrCode.ERR_0001, "aimlLinks");
        }

        if(aimlLinks.size() == 0){
            return 0;
        }

        int sum = 0;
//        for(AimlLink aimlLink : aimlLinks) {
//            sum += addLink(aimlLink);
//        }
        return sum;
    }

    /**
     * Find list link list.
     *
     * @param cateId             the cate id
     * @param mainId             the main id
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     * @throws ApplicationException the application exception
     */
    @Override
    public List<AimlLink> findListLink(int cateId, int mainId) throws ApplicationException {
        AimlLink aimlLink = new AimlLink();
        aimlLink.setCateId(cateId);
        aimlLink.setMainId(mainId);

        try{
            return aimlLinkMapper.selectList(aimlLink);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Modify link int.
     *
     * @param aimlLink the aiml link
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public int modifyLink(AimlLink aimlLink) throws ApplicationException, BizCheckedException {
        if(aimlLink == null){
            throw new BizCheckedException(BizErrCode.ERR_0001, "aimlLink");
        }

        if(aimlLink.getTitle() == null
                || "".equals(aimlLink.getTitle())
                || aimlLink.getTitle().length() > AimlLink.MAX_LENGTH_TITLE){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlLink.title");
        }

        if(aimlLink.getUrl() == null
                || "".equals(aimlLink.getUrl())
                || aimlLink.getUrl().length() > AimlLink.MAX_LENGTH_URL){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlLink.url");
        }

        if(aimlLink.getComment() != null && aimlLink.getComment().length() > AimlLink.MAX_LENGTH_COMMENT){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlLink.comment");
        }

        try{
            return aimlLinkMapper.updateByPrimaryKeySelective(aimlLink);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Remove link int.
     *
     * @param id the id
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public int removeLink(int cateId, int mainId) throws ApplicationException {
        AimlLink aimlLink = new AimlLink();
        aimlLink.setCateId(cateId);
        aimlLink.setMainId(mainId);

        try{
            return aimlLinkMapper.deleteByPrimaryKey(aimlLink);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Add image int.
     *
     * @param aimlImages the aiml images
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    public void addImage(AimlMain aimlMain) throws ApplicationException, BizCheckedException {       
    	if(aimlMain == null){
            throw new BizCheckedException(BizErrCode.ERR_0001, "aimlMain");
        }
    	
    	//등록된 내용 삭제
    	removeImages(aimlMain.getCateId(), aimlMain.getId());
    	
    	if(aimlMain.getImageUrl() == null ||  "".equals(aimlMain.getImageUrl())){
    	}else{
            if(aimlMain.getCateId() == 0){
                throw new BizCheckedException(BizErrCode.ERR_0006, "aimlImages.cateId");
            }

            if(aimlMain.getId() == 0){
                throw new BizCheckedException(BizErrCode.ERR_0006, "aimlImages.mainId");
            } 

        	try {        		
//        		String[] tempImageUrl = aimlMain.getImageUrl().split(",");
//        		String[] tempImageAlt = aimlMain.getImageAlt().split(",");
//           	 
//                for (int i = 0; i < tempImageUrl.length; i++) {  
//                	AimlImages aimlImages = new AimlImages();
//                	aimlImages.setCateId(aimlMain.getCateId());
//                	aimlImages.setMainId(aimlMain.getId());
//                	aimlImages.setUrl(tempImageUrl[i].trim());
//                	aimlImages.setAlt(tempImageAlt[i].trim());
//                	aimlImagesMapper.insert(aimlImages);
//    			}
            	AimlImages aimlImages = new AimlImages();
            	aimlImages.setCateId(aimlMain.getCateId());
            	aimlImages.setMainId(aimlMain.getId());
            	aimlImages.setUrl(aimlMain.getImageUrl());
            	aimlImages.setAlt(aimlMain.getImageAlt());
            	aimlImagesMapper.insert(aimlImages);
            	
        	}catch (DataAccessException ex){
        		throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        	}
        }
    }

    /**
     * Find list images list.
     *
     * @param cateId             the cate id
     * @param mainId             the main id
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     * @throws ApplicationException the application exception
     */
    @Override
    public List<AimlImages> findListImages(int cateId, int mainId) throws ApplicationException {
        AimlImages aimlImages = new AimlImages();
        aimlImages.setCateId(cateId);
        aimlImages.setMainId(mainId);

        try{
            return aimlImagesMapper.selectList(aimlImages);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }
    
    /**
     * Remove images int.
     *
     * @param id the id
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public int removeImages(int cateId, int mainId) throws ApplicationException {
    	AimlImages aimlImages = new AimlImages();
    	aimlImages.setCateId(cateId);
    	aimlImages.setMainId(mainId);

        try{
            return aimlImagesMapper.deleteByPrimaryKey(aimlImages);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Add recommend int.
     *
     * @param aimlRecommend the aiml recommend
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public void addRecommend(AimlMain aimlMain) throws ApplicationException, BizCheckedException {
        if(aimlMain == null){
            throw new BizCheckedException(BizErrCode.ERR_0001, "aimlMain");
        }
        
        //등록된 내용 삭제
        removeRecommend(aimlMain.getCateId(), aimlMain.getId());
        
        if(aimlMain.getRecommendInput() == null ||  "".equals(aimlMain.getRecommendInput())){
        }else{
        	if(aimlMain.getCateId() == 0){
                throw new BizCheckedException(BizErrCode.ERR_0006, "aimlRecommend.cateId");
            }

            if(aimlMain.getId() == 0){
                throw new BizCheckedException(BizErrCode.ERR_0006, "aimlRecommend.mainId");
            }

            if(aimlMain.getRecommendInput() == null ||  "".equals(aimlMain.getRecommendInput())){
                throw new BizCheckedException(BizErrCode.ERR_0006, "aimlRecommend.recommendInput");
            }
            
            try {            	
            	String[] tempRecommendInput = aimlMain.getRecommendInput().split("&!&");
            	
                for (int i = 0; i < tempRecommendInput.length; i++) {
                	AimlRecommend aimlRecommend = new AimlRecommend();
                	aimlRecommend.setCateId(aimlMain.getCateId());
                	aimlRecommend.setMainId(aimlMain.getId());
                	aimlRecommend.setRecommendInput(tempRecommendInput[i].trim());
                	aimlRecommendMapper.insert(aimlRecommend);  	
    			}
            }catch (DataAccessException ex){
                throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
            }
        }
    }

    /**
     * Find list recommend list.
     *
     * @param cateId             the cate id
     * @param mainId             the main id
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public List<AimlRecommend> findListRecommend(int cateId, int mainId) throws ApplicationException {
        AimlRecommend aimlRecommend = new AimlRecommend();
        aimlRecommend.setMainId(mainId);
        aimlRecommend.setCateId(cateId);

        try{
            return aimlRecommendMapper.selectList(aimlRecommend);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Modify recommend int.
     *
     * @param aimlRecommend the aiml recommend
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    public int modifyRecommend(AimlRecommend aimlRecommend) throws ApplicationException, BizCheckedException {
        if(aimlRecommend == null){
            throw new BizCheckedException(BizErrCode.ERR_0001, "aimlRecommend");
        }

        try {
            return aimlRecommendMapper.updateByPrimaryKeySelective(aimlRecommend);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Remove recommend int.
     *
     * @param cateId the cate id
     * @param mainId the main id
     * @param id     the id
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    public int removeRecommend(int cateId, int mainId) throws ApplicationException {
        AimlRecommend aimlRecommend = new AimlRecommend();
        aimlRecommend.setCateId(cateId);
        aimlRecommend.setMainId(mainId);

        try {
            return aimlRecommendMapper.deleteByPrimaryKey(aimlRecommend);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }
    

    /**
     * Add test int.
     *
     * @param aimlMain the aimlMain
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public void addTest(AimlMain aimlMain) throws ApplicationException, BizCheckedException {
        if(aimlMain == null){
            throw new BizCheckedException(BizErrCode.ERR_0001, "aimlMain");
        }
        
        //등록된 내용 삭제
        removeTest(aimlMain.getCateId(), aimlMain.getId());
        
        if(aimlMain.getTestInput() == null ||  "".equals(aimlMain.getTestInput())){
        }else{
        	if(aimlMain.getCateId() == 0){
                throw new BizCheckedException(BizErrCode.ERR_0006, "aimlTest.cateId");
            }

            if(aimlMain.getId() == 0){
                throw new BizCheckedException(BizErrCode.ERR_0006, "aimlTest.mainId");
            }
            
            try {            	
            	String[] tempTestInput = aimlMain.getTestInput().split("&!&");
           	 
                for (int i = 0; i < tempTestInput.length; i++) {   
                	AimlTest aimlTest = new AimlTest();
               		aimlTest.setCateId(aimlMain.getCateId());
               		aimlTest.setMainId(aimlMain.getId());
               		aimlTest.setTestInput(tempTestInput[i].trim());
                	aimlTestMapper.insert(aimlTest);    	
    			}
            }catch (DataAccessException ex){
                throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
            }
        }
    } 
    
    /**
     * Find list test list.
     *
     * @param cateId             the cate id
     * @param mainId             the main id
     * @return the list
     * @throws ApplicationException the application exception
     */
    @Override
    public List<AimlTest> findListTest(int cateId, int mainId) throws ApplicationException {
        AimlTest aimlTest = new AimlTest();
        aimlTest.setCateId(cateId);
        aimlTest.setMainId(mainId);
        
        try{
            return aimlTestMapper.selectList(aimlTest);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }
    
    /**
     * Remove test int.
     *
     * @param cateId the cate id
     * @param mainId the main id
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    public int removeTest(int cateId, int mainId) throws ApplicationException {
    	 AimlTest aimlTest = new AimlTest();
         aimlTest.setMainId(mainId);
         aimlTest.setCateId(cateId);

        try {
            return aimlTestMapper.deleteByPrimaryKey(aimlTest);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }
    
    /**
     * Add option int.
     *
     * @param aimlMain the aimlMain
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public void addOption(AimlMain aimlMain) throws ApplicationException, BizCheckedException {
        if(aimlMain == null){
            throw new BizCheckedException(BizErrCode.ERR_0001, "aimlMain");
        }
        
        //등록된 내용 삭제
        removeOption(aimlMain.getCateId(), aimlMain.getId());
        
        if(aimlMain.getOptionInput() == null ||  "".equals(aimlMain.getOptionInput())){
        }else{
        	if(aimlMain.getCateId() == 0){
                throw new BizCheckedException(BizErrCode.ERR_0006, "aimlOption.cateId");
            }

            if(aimlMain.getId() == 0){
                throw new BizCheckedException(BizErrCode.ERR_0006, "aimlOption.mainId");
            }
            
            try {            	
            	String[] tempOptionInput = aimlMain.getOptionInput();
           	 
                for (int i = 0; i < tempOptionInput.length; i++) {  
                	if(!"".equals(tempOptionInput[i].trim())){
                		AimlOption aimlOption = new AimlOption();
                   		aimlOption.setCateId(aimlMain.getCateId());
                   		aimlOption.setMainId(aimlMain.getId());
                   		aimlOption.setVal(tempOptionInput[i].trim());
                   		aimlOption.setSeq((i+1));
                    	aimlOptionMapper.insert(aimlOption);   
                	}	
    			}
            }catch (DataAccessException ex){
                throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
            }
        }
    }
    
    /**
     * Find list option list.
     *
     * @param cateId             the cate id
     * @param mainId             the main id
     * @return the list
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public List<AimlOption> findListOption(int cateId, int mainId) throws ApplicationException {
        AimlOption aimlOption = new AimlOption();
        aimlOption.setMainId(mainId);
        aimlOption.setCateId(cateId);

        try{
            return aimlOptionMapper.selectList(aimlOption);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }
    
    /**
     * Remove reply int.
     *
     * @param cateId the cate id
     * @param mainId the main id
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    public int removeOption(int cateId, int mainId) throws ApplicationException {
    	 AimlOption aimlOption = new AimlOption();
         aimlOption.setMainId(mainId);
         aimlOption.setCateId(cateId);

        try {
            return aimlOptionMapper.deleteByPrimaryKey(aimlOption);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }
    
    /**
     * Add reply int.
     *
     * @param aimlMain the aimlMain
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public void addReply(AimlMain aimlMain) throws ApplicationException, BizCheckedException {
        if(aimlMain == null){
            throw new BizCheckedException(BizErrCode.ERR_0001, "aimlMain");
        }
        
        //등록된 내용 삭제
        removeReply(aimlMain.getCateId(), aimlMain.getId());
        
        if(aimlMain.getReplyInput() == null ||  "".equals(aimlMain.getReplyInput())){
        }else{
        	if(aimlMain.getCateId() == 0){
                throw new BizCheckedException(BizErrCode.ERR_0006, "aimlReply.cateId");
            }

            if(aimlMain.getId() == 0){
                throw new BizCheckedException(BizErrCode.ERR_0006, "aimlReply.mainId");
            }
            
            try {            	
            	String[] tempReplyInput = aimlMain.getReplyInput().split("&!&");
           	 
                for (int i = 0; i < tempReplyInput.length; i++) {   
                	AimlReply aimlReply = new AimlReply();
               		aimlReply.setCateId(aimlMain.getCateId());
               		aimlReply.setMainId(aimlMain.getId());
               		aimlReply.setReplyInput(tempReplyInput[i].trim());
                	aimlReplyMapper.insert(aimlReply);    	
    			}
            }catch (DataAccessException ex){
                throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
            }
        }
    }
    
    /**
     * Find list reply list.
     *
     * @param cateId             the cate id
     * @param mainId             the main id
     * @return the list
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public List<AimlReply> findListReply(int cateId, int mainId) throws ApplicationException {
        AimlReply aimlReply = new AimlReply();
        aimlReply.setMainId(mainId);
        aimlReply.setCateId(cateId);

        try{
            return aimlReplyMapper.selectList(aimlReply);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }
    
    /**
     * Remove reply int.
     *
     * @param cateId the cate id
     * @param mainId the main id
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    public int removeReply(int cateId, int mainId) throws ApplicationException {
    	 AimlReply aimlReply = new AimlReply();
         aimlReply.setMainId(mainId);
         aimlReply.setCateId(cateId);

        try {
            return aimlReplyMapper.deleteByPrimaryKey(aimlReply);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }   
    
    /**
     * Find by id aimlMain.
     *
     * @param id the id
     * @return the aimlMain
     */
    @Override
    public AimlMain findById(int id) throws ApplicationException {
    	AimlMain aimlMain = new AimlMain();
    	aimlMain.setId(id);
        
        try {
            return aimlMainMapper.selectByPrimaryKey(aimlMain);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }
    
    /**
     * select by test.
     *
     * @param subLabel
     * @param userId
     * @return int
     */
	@Override
    public String selectTest(int cpId, String subLabel, String userId) throws ApplicationException, BizCheckedException {
    	if(cpId == 0){
            throw new BizCheckedException(BizErrCode.ERR_0006, "cpId");
        }
    	
    	if(subLabel == null || "".equals(subLabel)){
            throw new BizCheckedException(BizErrCode.ERR_0006, "subLabel");
        }

    	if(userId == null || "".equals(userId)){
            throw new BizCheckedException(BizErrCode.ERR_0006, "userId");
        }
    	
    	LOG.info("파라미터 = " + cpId +","+ subLabel +","+ userId);
    	
    	List<AimlTest> result = aimlTestMapper.selectListByCpId(cpId);
    	List<String[]> dataError = new ArrayList<String[]>();
    	String message = "";
    	int count = 0;
    	
    	dataError.add(new String[] { "대화ID", "질문", "검증샘플", "결과 대화ID", "결과 답변", "대화 결과", "전처리 결과" });
    	
    	LOG.info("총 행개수 = " + result.size());
    	
    	try {
            JSONParser jsonParser = new JSONParser();

    		for (AimlTest aimlTest : result) {
    			List<Match> matches = new ArrayList<>();
    			List<ProgramkResponse> programkResponses = new ArrayList<>();
    			StringBuilder matchesBuilder = new StringBuilder();
    			
    			LOG.info("입력 데이터 = " + aimlTest.getTestInput() +","+ userId +","+ subLabel);
    			
    			String main = deployService.makeResponse(programkResponses, aimlTest.getTestInput(), userId, subLabel, true, matches);
    			String subs = deployService.getSubs(aimlTest.getTestInput(), subLabel);
    			String sBody = null;
    			String input = "";
    			
    			if(main == ""){
    				dataError.add(new String[] { Integer.toString(aimlTest.getId()), aimlTest.getInput(), aimlTest.getTestInput(), "", "", "", "" });
    			}
    			
    			LOG.info("출력 카테고리 데이터 = " + main);
    			LOG.info("출력 결과 데이터 = " + gson.toJson(programkResponses));
    			
    			for (int i = 0; i < matches.size(); i++) {
    				matchesBuilder.append(",");
    				matchesBuilder.append(matches.get(i).getPath());
    	        }
    			
    			if (programkResponses != null) {
    	            sBody = gson.toJson(programkResponses);
    	            
    	            try {
    	            	JSONArray jsonObject = (JSONArray) jsonParser.parse(sBody);
    	            	
    	            	for (Object object : jsonObject) {
    	            		JSONObject aJson = (JSONObject) object;
    	            		input = aJson.get("body").toString();
						}
					} catch (Exception e) {
						input = sBody;
					}
    	        }
    			
    			if (main != null && !"".equals(main)) {
    				if(main.indexOf(Integer.toString(aimlTest.getId())) < 0){
    					dataError.add(new String[] { Integer.toString(aimlTest.getId()), aimlTest.getInput(), aimlTest.getTestInput(), main, input, matchesBuilder.toString(), subs });
    				}else{
    					count ++;
    				}
    	        }   	        
			}    		
		} catch (DataAccessException ex){
            throw new ApplicationException("오류 : "+ ex.getMessage());
        }
    	
    	fileUtil.createErrorFile("/"+subLabel+"-"+userId+".csv", dataError);
    	
    	message = "총 "+ result.size() +" 건이 검증 완료 되었습니다.<br/>(성공 : "+ count +"건 / 실패 : "+ (result.size()-count) +"건)";
        
    	return message;
    }
}
