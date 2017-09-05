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

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kt.programk.cms.service.ChatCategoryService;
import com.kt.programk.common.domain.category.AimlCategory;
import com.kt.programk.common.domain.core.AimlMain;
import com.kt.programk.common.domain.deploy.DeployAimlCategory;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.repository.category.AimlCategoryMapper;
import com.kt.programk.common.repository.deploy.DeployAimlCategoryMapper;
import com.kt.programk.common.utils.DbExceptionUtil;

/**
 * 대화 카테고리 관리
 */
@Service
public class ChatCategoryServiceImpl implements ChatCategoryService {
	/**
     * The Aiml category mapper.
     */
    @Autowired
    private AimlCategoryMapper aimlCategoryMapper;
    
    /**
     * The Aiml category deploy mapper.
     */
    @Autowired
    private DeployAimlCategoryMapper deployAimlCategoryMapper;
    
    /** The chat service. */
    @Autowired
    private ChatServcieImpl chatServcieImpl;

    /**
     * 전체 개수
     *
     * @return the int
     */
    @Override
    public int countAll(AimlCategory aimlCategory) throws ApplicationException {
        try {
            return aimlCategoryMapper.countAll(aimlCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * CP별 전체 개수
     *
     * @param cpId the cp id
     * @return the int
     */
    @Override
    public int countByCpId(int cpId) throws ApplicationException, BizCheckedException {
        if(cpId == 0){
            throw new BizCheckedException(BizErrCode.ERR_0003, "CP ID");
        }

        AimlCategory aimlCategory = new AimlCategory();
        aimlCategory.setCpId(cpId);
        try {
            return aimlCategoryMapper.countByCpId(aimlCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }
    
    /**
     * 카테고리명 조회 개수
     *
     * @param name the name
     * @return the aiml category
     */
    @Override
    public int countByName(AimlCategory aimlCategory) throws ApplicationException, BizCheckedException {
        if(aimlCategory.getName() == null || "".equals(aimlCategory.getName())){
            throw new BizCheckedException(BizErrCode.ERR_0003, "카테고리명");
        }
        
        try {
            return aimlCategoryMapper.countByName(aimlCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * 전체 목록
     *
     * @param currentPageNo
     * @param recordCountPerPage
     * @return the list
     */
    @Override
    public List<AimlCategory> findListAll(AimlCategory aimlCategory, int currentPageNo, int recordCountPerPage) throws ApplicationException {
        aimlCategory.setRecordCountPerPage(recordCountPerPage);
        aimlCategory.setFirstRecordIndex((currentPageNo - 1) * recordCountPerPage);

        try {
            return aimlCategoryMapper.selectListAll(aimlCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * CP 별 전체 목록
     *
     * @param cpId               the cp id
     * @param currentPageNo
     * @param recordCountPerPage @return the list
     */
    @Override
    public List<AimlCategory> findListByCpId(int cpId, int currentPageNo, int recordCountPerPage) throws ApplicationException, BizCheckedException {
        if(cpId == 0){
            throw new BizCheckedException(BizErrCode.ERR_0003, "CP ID");
        }

        AimlCategory aimlCategory = new AimlCategory();
        aimlCategory.setRecordCountPerPage(recordCountPerPage);
        aimlCategory.setFirstRecordIndex((currentPageNo - 1) * recordCountPerPage);

        aimlCategory.setCpId(cpId);

        try {
            return aimlCategoryMapper.selectListByCpId(aimlCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * 상세 조회
     *
     * @param id the id
     * @return the aiml category
     */
    @Override
    public AimlCategory findById(AimlCategory aimlCategory) throws ApplicationException, BizCheckedException {
    	if(aimlCategory == null) {
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }

        try {
            return aimlCategoryMapper.selectByPrimaryKey(aimlCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * 신규 생성
     *
     * @param aimlCategory the aiml category
     * @return the int
     */
    @Override
    @Transactional
    public int create(AimlCategory aimlCategory) throws ApplicationException, BizCheckedException {
        if(aimlCategory == null) {
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }

        if(aimlCategory.getName() == null
                || "".equals(aimlCategory.getName())
                || aimlCategory.getName().length() > AimlCategory.MAX_LENGTH_NAME){
            throw new BizCheckedException(BizErrCode.ERR_0006, "카테고리명");
        }

        if(aimlCategory.getRestriction() == null
                || "".equals(aimlCategory.getRestriction())
                || aimlCategory.getRestriction().length() > AimlCategory.MAX_LENGTH_RESTRICTION){
            throw new BizCheckedException(BizErrCode.ERR_0006, "유형");
        }

        if(aimlCategory.getTopic() == null
                || "".equals(aimlCategory.getTopic())
                || aimlCategory.getTopic().length() > AimlCategory.MAX_LENGTH_TOPIC){
            throw new BizCheckedException(BizErrCode.ERR_0006, "토픽");
        }

        if(aimlCategory.getEnabled() == null
                || "".equals(aimlCategory.getEnabled())
                || aimlCategory.getEnabled().length() > AimlCategory.MAX_LENGTH_ENABLED){
            throw new BizCheckedException(BizErrCode.ERR_0006, "사용여부");
        }
        
        int insert = 0;
        try {
        	insert = aimlCategoryMapper.insert(aimlCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        createDeploy(aimlCategory);
        
        return insert;
    }

    /**
     * 수정
     *
     * @param aimlCategory the aiml category
     * @return the int
     */
    @Override
    @Transactional
    public int modify(AimlCategory aimlCategory) throws ApplicationException, BizCheckedException {
        if(aimlCategory == null) {
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }

        if(aimlCategory.getName() == null
                || "".equals(aimlCategory.getName())
                || aimlCategory.getName().length() > AimlCategory.MAX_LENGTH_NAME){
            throw new BizCheckedException(BizErrCode.ERR_0006, "카테고리명");
        }

        if(aimlCategory.getRestriction() == null
                || "".equals(aimlCategory.getRestriction())
                || aimlCategory.getRestriction().length() > AimlCategory.MAX_LENGTH_RESTRICTION){
            throw new BizCheckedException(BizErrCode.ERR_0006, "유형");
        }

        if(aimlCategory.getTopic() == null
                || "".equals(aimlCategory.getTopic())
                || aimlCategory.getTopic().length() > AimlCategory.MAX_LENGTH_TOPIC){
            throw new BizCheckedException(BizErrCode.ERR_0006, "토픽");
        }

        if(aimlCategory.getEnabled() == null
                || "".equals(aimlCategory.getEnabled())
                || aimlCategory.getEnabled().length() > AimlCategory.MAX_LENGTH_ENABLED){
            throw new BizCheckedException(BizErrCode.ERR_0006, "사용여부");
        }
        
        int insert = 0;
        try {
            insert = aimlCategoryMapper.updateByPrimaryKeySelective(aimlCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        createDeploy(aimlCategory);
        
        return insert;
    }

    /**
     * 삭제.
     *
     * @param id the id
     * @return the int
     */
    @Override
    @Transactional
    public int remove(AimlCategory aimlCategory) throws ApplicationException, BizCheckedException {
        if(aimlCategory.getId() == 0){
            throw new BizCheckedException(BizErrCode.ERR_0003, "ID");
        }
        
        AimlMain aimlMain = new AimlMain();
        aimlMain.setCateId(aimlCategory.getId());
        
        int insert = 0;
        try {
            insert += aimlCategoryMapper.deleteByPrimaryKey(aimlCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        //deploy 삭제
        aimlCategory.setCpId(0);
        aimlCategory.setDeploy("N"); 
        createDeploy(aimlCategory);
        
        //관련 대화 삭제
        chatServcieImpl.remove(aimlMain);
        
        return insert;
    }
    
    /**
     * deploy.
     *
     * @param aimlCategory the aimlCategory
     * @return the int
     */
    @Transactional
    public void createDeploy(AimlCategory aimlCategory) throws ApplicationException, BizCheckedException {   	
    	String deploy = aimlCategory.getDeploy();
    	
    	DeployAimlCategory deployAimlCategory = new DeployAimlCategory();
    	deployAimlCategory.setCpId(aimlCategory.getCpId());
    	deployAimlCategory.setCateId(aimlCategory.getId());
    	
    	//공용 카테고리,사용여부(N) - cp 상관없이 해당 카테고리 모두 삭제
    	if("all".equals(aimlCategory.getRestriction()) && "N".equals(aimlCategory.getEnabled())){
    		try {   
    			deployAimlCategory.setCpId(0);
    			deployAimlCategoryMapper.deleteByPrimaryKey(deployAimlCategory);
        	}catch (DataAccessException ex){
              throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        	}  
    	}else{
    		try {   
        		if("Y".equals(deploy)){
        			deployAimlCategoryMapper.deleteByPrimaryKey(deployAimlCategory);
        			deployAimlCategoryMapper.insert(deployAimlCategory);
            	}else{
            		deployAimlCategoryMapper.deleteByPrimaryKey(deployAimlCategory);
            	}
        	}catch (DataAccessException ex){
              throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        	}   
    	}
    }
}
