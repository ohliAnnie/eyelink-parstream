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

import com.kt.programk.cms.service.SubsCategoryService;
import com.kt.programk.common.domain.category.SubsCategory;
import com.kt.programk.common.domain.core.AimlSubs;
import com.kt.programk.common.domain.deploy.DeploySubsCategory;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.repository.category.SubsCategoryMapper;
import com.kt.programk.common.repository.deploy.DeploySubsCategoryMapper;
import com.kt.programk.common.utils.DbExceptionUtil;

/**
 * Created by Administrator on 2016-06-21.
 */
@Service
public class SubsCategoryServiceImpl implements SubsCategoryService {    
    /**
     * The Subs category mapper.
     */
    @Autowired
    private SubsCategoryMapper subsCategoryMapper;
    
    /**
     * The Subs category deploy mapper.
     */
    @Autowired
    private DeploySubsCategoryMapper deploySubsCategoryMapper;
    
    /**
     * The subs Service.
     */
    @Autowired
    private SubsServiceImpl subsServiceImpl;
    
    /**
     * 전체 개수
     *
     * @return the int
     */
	@Override
	public int countAll(SubsCategory subsCategory) throws ApplicationException {
		try {
            return subsCategoryMapper.countAll(subsCategory);
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
	public int countByName(SubsCategory subsCategory) throws ApplicationException, BizCheckedException {
		if(subsCategory.getName() == null || "".equals(subsCategory.getName())){
            throw new BizCheckedException(BizErrCode.ERR_0003, "카테고리명");
        }
        
        try {
            return subsCategoryMapper.countByName(subsCategory);
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
	public List<SubsCategory> findListAll(SubsCategory subsCategory, int currentPageNo, int recordCountPerPage) throws ApplicationException {
		subsCategory.setRecordCountPerPage(recordCountPerPage);
		subsCategory.setFirstRecordIndex((currentPageNo - 1) * recordCountPerPage);

        try {
            return subsCategoryMapper.selectList(subsCategory);
        }catch (DataAccessException ex) {
        	ex.printStackTrace();
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}

	/**
     * 상세 조회
     *
     * @param id the id
     * @return the Subs category
     */
	@Override
	public SubsCategory findById(SubsCategory subsCategory) throws ApplicationException, BizCheckedException {
    	if(subsCategory == null) {
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }

        try {
            return subsCategoryMapper.selectByPrimaryKey(subsCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}

	/**
     * 신규 생성
     *
     * @param subsCategory the subs category
     * @return the int
     */
    @Override
    @Transactional
	public int create(SubsCategory subsCategory) throws ApplicationException, BizCheckedException {
    	if(subsCategory == null) {
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }

        if(subsCategory.getName() == null
                || "".equals(subsCategory.getName())
                || subsCategory.getName().length() > SubsCategory.MAX_LENGTH_NAME){
            throw new BizCheckedException(BizErrCode.ERR_0006, "카테고리명");
        }

        if(subsCategory.getRestriction() == null
                || "".equals(subsCategory.getRestriction())
                || subsCategory.getRestriction().length() > SubsCategory.MAX_LENGTH_RESTRICTION){
            throw new BizCheckedException(BizErrCode.ERR_0006, "유형");
        }

        if(subsCategory.getEnabled() == null
                || "".equals(subsCategory.getEnabled())
                || subsCategory.getEnabled().length() > SubsCategory.MAX_LENGTH_ENABLED){
            throw new BizCheckedException(BizErrCode.ERR_0006, "사용여부");
        }
        
        int insert = 0;
        try {
        	insert = subsCategoryMapper.insert(subsCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        createDeploy(subsCategory);
        
        return insert;
	}

    /**
     * 수정
     *
     * @param subsCategory the subs category
     * @return the int
     */
    @Override
    @Transactional
	public int modify(SubsCategory subsCategory) throws ApplicationException, BizCheckedException {
    	if(subsCategory == null) {
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }

        if(subsCategory.getName() == null
                || "".equals(subsCategory.getName())
                || subsCategory.getName().length() > SubsCategory.MAX_LENGTH_NAME){
            throw new BizCheckedException(BizErrCode.ERR_0006, "카테고리명");
        }

        if(subsCategory.getRestriction() == null
                || "".equals(subsCategory.getRestriction())
                || subsCategory.getRestriction().length() > SubsCategory.MAX_LENGTH_RESTRICTION){
            throw new BizCheckedException(BizErrCode.ERR_0006, "유형");
        }

        if(subsCategory.getEnabled() == null
                || "".equals(subsCategory.getEnabled())
                || subsCategory.getEnabled().length() > SubsCategory.MAX_LENGTH_ENABLED){
            throw new BizCheckedException(BizErrCode.ERR_0006, "사용여부");
        }
        
        int insert = 0;
        try {
            insert = subsCategoryMapper.updateByPrimaryKeySelective(subsCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        createDeploy(subsCategory);
        
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
	public int remove(SubsCategory subsCategory) throws ApplicationException, BizCheckedException {
    	if(subsCategory.getId() == 0){
            throw new BizCheckedException(BizErrCode.ERR_0003, "ID");
        }
    	
    	AimlSubs aimlSubs = new AimlSubs();
    	aimlSubs.setCateId(subsCategory.getId());
        
        int insert = 0;
        try {
            insert += subsCategoryMapper.deleteByPrimaryKey(subsCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        //deploy 삭제
        subsCategory.setCpId(0);
        subsCategory.setDeploy("N");
        createDeploy(subsCategory);
        
        //관련 subs 삭제
        subsServiceImpl.remove(aimlSubs);
        
        return insert;
	}
    
    /**
     * deploy.
     *
     * @param subsCategory the subsCategory
     * @return the int
     */
    @Transactional
    public void createDeploy(SubsCategory subsCategory) throws ApplicationException, BizCheckedException {   	
    	String deploy = subsCategory.getDeploy();
    	
    	DeploySubsCategory deploySubsCategory = new DeploySubsCategory();
    	deploySubsCategory.setCpId(subsCategory.getCpId());
    	deploySubsCategory.setCateId(subsCategory.getId());    	
    	
    	//공용 카테고리,사용여부(N) - cp 상관없이 해당 카테고리 모두 삭제
    	if("all".equals(subsCategory.getRestriction()) && "N".equals(subsCategory.getEnabled())){
    		try {   
    			deploySubsCategory.setCpId(0);
    			deploySubsCategoryMapper.deleteByPrimaryKey(deploySubsCategory);
        	}catch (DataAccessException ex){
              throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        	}  
    	}else{
    		try {   
        		if("Y".equals(deploy)){
        			deploySubsCategoryMapper.deleteByPrimaryKey(deploySubsCategory);
        			deploySubsCategoryMapper.insert(deploySubsCategory);
            	}else{
            		deploySubsCategoryMapper.deleteByPrimaryKey(deploySubsCategory);
            	}
        	}catch (DataAccessException ex){
              throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        	}  
    	}
    }
}
