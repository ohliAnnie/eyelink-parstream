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

import com.kt.programk.cms.service.PredCategoryService;
import com.kt.programk.common.domain.category.PredCategory;
import com.kt.programk.common.domain.core.AimlPred;
import com.kt.programk.common.domain.deploy.DeployPredCategory;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.repository.category.PredCategoryMapper;
import com.kt.programk.common.repository.deploy.DeployPredCategoryMapper;
import com.kt.programk.common.utils.DbExceptionUtil;

/**
 * Created by Administrator on 2016-06-21.
 */
@Service
public class PredCategoryServiceImpl implements PredCategoryService {	
    /**
     * The Pred category mapper.
     */
    @Autowired
    private PredCategoryMapper predCategoryMapper;
    
    /**
     * The Pred category deploy mapper.
     */
    @Autowired
    private DeployPredCategoryMapper deployPredCategoryMapper;
    
    /**
     * The pred Service.
     */
    @Autowired
    private PredServiceImpl predServiceImpl;

    /**
     * 전체 개수
     *
     * @return the int
     */
	@Override
	public int countAll(PredCategory predCategory) throws ApplicationException {
		try {
            return predCategoryMapper.countAll(predCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}

	/**
     * 카테고리명 조회 개수
     *
     * @param name the name
     * @return the subs category
     */
	@Override
	public int countByName(PredCategory predCategory)
			throws ApplicationException, BizCheckedException {
		if(predCategory.getName() == null || "".equals(predCategory.getName())){
            throw new BizCheckedException(BizErrCode.ERR_0003, "카테고리명");
        }
        
        try {
            return predCategoryMapper.countByName(predCategory);
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
	public List<PredCategory> findListAll(PredCategory predCategory, int currentPageNo, int recordCountPerPage)
			throws ApplicationException {
		predCategory.setRecordCountPerPage(recordCountPerPage);
		predCategory.setFirstRecordIndex((currentPageNo - 1) * recordCountPerPage);

        try {
            return predCategoryMapper.selectList(predCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}

	/**
     * 상세 조회
     *
     * @param id the id
     * @return the Prop category
     */
	@Override
	public PredCategory findById(PredCategory predCategory) throws ApplicationException,
			BizCheckedException {
		if(predCategory == null) {
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }

        try {
            return predCategoryMapper.selectByPrimaryKey(predCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}

	/**
     * 신규 생성
     *
     * @param propCategory the prop category
     * @return the int
     */
    @Override
    @Transactional
	public int create(PredCategory predCategory) throws ApplicationException,
			BizCheckedException {
    	if(predCategory == null) {
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }

        if(predCategory.getName() == null
                || "".equals(predCategory.getName())
                || predCategory.getName().length() > PredCategory.MAX_LENGTH_NAME){
            throw new BizCheckedException(BizErrCode.ERR_0006, "카테고리명");
        }

        if(predCategory.getRestriction() == null
                || "".equals(predCategory.getRestriction())
                || predCategory.getRestriction().length() > PredCategory.MAX_LENGTH_RESTRICTION){
            throw new BizCheckedException(BizErrCode.ERR_0006, "유형");
        }

        if(predCategory.getEnabled() == null
                || "".equals(predCategory.getEnabled())
                || predCategory.getEnabled().length() > PredCategory.MAX_LENGTH_ENABLED){
            throw new BizCheckedException(BizErrCode.ERR_0006, "사용여부");
        }
        
        int insert = 0;
        try {
        	insert = predCategoryMapper.insert(predCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        createDeploy(predCategory);
        
        return insert;
	}

    /**
     * 수정
     *
     * @param propCategory the prop category
     * @return the int
     */
    @Override
    @Transactional
	public int modify(PredCategory predCategory) throws ApplicationException,
			BizCheckedException {
    	if(predCategory == null) {
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }

        if(predCategory.getName() == null
                || "".equals(predCategory.getName())
                || predCategory.getName().length() > PredCategory.MAX_LENGTH_NAME){
            throw new BizCheckedException(BizErrCode.ERR_0006, "카테고리명");
        }

        if(predCategory.getRestriction() == null
                || "".equals(predCategory.getRestriction())
                || predCategory.getRestriction().length() > PredCategory.MAX_LENGTH_RESTRICTION){
            throw new BizCheckedException(BizErrCode.ERR_0006, "유형");
        }

        if(predCategory.getEnabled() == null
                || "".equals(predCategory.getEnabled())
                || predCategory.getEnabled().length() > PredCategory.MAX_LENGTH_ENABLED){
            throw new BizCheckedException(BizErrCode.ERR_0006, "사용여부");
        }
        
        int insert = 0;
        try {
            insert = predCategoryMapper.updateByPrimaryKeySelective(predCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        createDeploy(predCategory);
        
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
	public int remove(PredCategory predCategory) throws ApplicationException,
			BizCheckedException {
    	if(predCategory.getId() == 0){
            throw new BizCheckedException(BizErrCode.ERR_0003, "ID");
        }
    	
    	AimlPred aimlPred = new AimlPred();
    	aimlPred.setCateId(predCategory.getId());
        
        int insert = 0;
        try {
            insert += predCategoryMapper.deleteByPrimaryKey(predCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        //deploy 삭제
        predCategory.setCpId(0);
        predCategory.setDeploy("N"); 
        createDeploy(predCategory);
        
      	//관련 pred 삭제
        predServiceImpl.remove(aimlPred);
        
        return insert;
	}
    
    /**
     * deploy.
     *
     * @param predCategory the predCategory
     * @return the int
     */
    @Transactional
    public void createDeploy(PredCategory predCategory) throws ApplicationException, BizCheckedException {   	
    	String deploy = predCategory.getDeploy();
    	
    	DeployPredCategory deployPredCategory = new DeployPredCategory();
    	deployPredCategory.setCpId(predCategory.getCpId());
    	deployPredCategory.setCateId(predCategory.getId());
    	
    	//공용 카테고리,사용여부(N) - cp 상관없이 해당 카테고리 모두 삭제
    	if("all".equals(predCategory.getRestriction()) && "N".equals(predCategory.getEnabled())){
    		try {   
    			deployPredCategory.setCpId(0);
    			deployPredCategoryMapper.deleteByPrimaryKey(deployPredCategory);
        	}catch (DataAccessException ex){
              throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        	}  
    	}else{
    		try {   
        		if("Y".equals(deploy)){
        			deployPredCategoryMapper.deleteByPrimaryKey(deployPredCategory);
        			deployPredCategoryMapper.insert(deployPredCategory);
            	}else{
            		deployPredCategoryMapper.deleteByPrimaryKey(deployPredCategory);
            	}
        	}catch (DataAccessException ex){
              throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        	}    
    	}    		
    }
}
