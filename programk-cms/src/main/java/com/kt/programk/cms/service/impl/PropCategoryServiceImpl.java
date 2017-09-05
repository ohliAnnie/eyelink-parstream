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

import com.kt.programk.cms.service.PropCategoryService;
import com.kt.programk.common.domain.category.PropCategory;
import com.kt.programk.common.domain.core.AimlProp;
import com.kt.programk.common.domain.deploy.DeployPropCategory;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.repository.category.PropCategoryMapper;
import com.kt.programk.common.repository.deploy.DeployPropCategoryMapper;
import com.kt.programk.common.utils.DbExceptionUtil;

/**
 * Created by Administrator on 2016-06-21.
 */
@Service
public class PropCategoryServiceImpl implements PropCategoryService {
	/**
     * The Prop category mapper.
     */
    @Autowired
    private PropCategoryMapper propCategoryMapper;
    
    /**
     * The Prop category deploy mapper.
     */
    @Autowired
    private DeployPropCategoryMapper deployPropCategoryMapper;
    
    /**
     * The prop Service.
     */
    @Autowired
    private PropServiceImpl propServiceImpl;
    
    /**
     * 전체 개수
     *
     * @return the int
     */
	@Override
	public int countAll(PropCategory propCategory) throws ApplicationException {
		try {
            return propCategoryMapper.countAll(propCategory);
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
	public int countByName(PropCategory propCategory)
			throws ApplicationException, BizCheckedException {
		if(propCategory.getName() == null || "".equals(propCategory.getName())){
            throw new BizCheckedException(BizErrCode.ERR_0003, "카테고리명");
        }
        
        try {
            return propCategoryMapper.countByName(propCategory);
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
	public List<PropCategory> findListAll(PropCategory propCategory, int currentPageNo, int recordCountPerPage)
			throws ApplicationException {
		propCategory.setRecordCountPerPage(recordCountPerPage);
		propCategory.setFirstRecordIndex((currentPageNo - 1) * recordCountPerPage);

        try {
            return propCategoryMapper.selectList(propCategory);
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
	public PropCategory findById(PropCategory propCategory) throws ApplicationException,
			BizCheckedException {
    	if(propCategory == null) {
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }

        try {
            return propCategoryMapper.selectByPrimaryKey(propCategory);
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
	public int create(PropCategory propCategory) throws ApplicationException,
			BizCheckedException {
    	if(propCategory == null) {
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }

        if(propCategory.getName() == null
                || "".equals(propCategory.getName())
                || propCategory.getName().length() > PropCategory.MAX_LENGTH_NAME){
            throw new BizCheckedException(BizErrCode.ERR_0006, "카테고리명");
        }

        if(propCategory.getRestriction() == null
                || "".equals(propCategory.getRestriction())
                || propCategory.getRestriction().length() > PropCategory.MAX_LENGTH_RESTRICTION){
            throw new BizCheckedException(BizErrCode.ERR_0006, "유형");
        }

        if(propCategory.getEnabled() == null
                || "".equals(propCategory.getEnabled())
                || propCategory.getEnabled().length() > PropCategory.MAX_LENGTH_ENABLED){
            throw new BizCheckedException(BizErrCode.ERR_0006, "사용여부");
        }
        
        int insert = 0;
        try {
        	insert = propCategoryMapper.insert(propCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        createDeploy(propCategory);
        
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
	public int modify(PropCategory propCategory) throws ApplicationException,
			BizCheckedException {
    	if(propCategory == null) {
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }

        if(propCategory.getName() == null
                || "".equals(propCategory.getName())
                || propCategory.getName().length() > PropCategory.MAX_LENGTH_NAME){
            throw new BizCheckedException(BizErrCode.ERR_0006, "카테고리명");
        }

        if(propCategory.getRestriction() == null
                || "".equals(propCategory.getRestriction())
                || propCategory.getRestriction().length() > PropCategory.MAX_LENGTH_RESTRICTION){
            throw new BizCheckedException(BizErrCode.ERR_0006, "유형");
        }

        if(propCategory.getEnabled() == null
                || "".equals(propCategory.getEnabled())
                || propCategory.getEnabled().length() > PropCategory.MAX_LENGTH_ENABLED){
            throw new BizCheckedException(BizErrCode.ERR_0006, "사용여부");
        }
        
        int insert = 0;
        try {
            insert = propCategoryMapper.updateByPrimaryKeySelective(propCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        createDeploy(propCategory);
        
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
	public int remove(PropCategory propCategory) throws ApplicationException,
			BizCheckedException {
    	if(propCategory.getId() == 0){
            throw new BizCheckedException(BizErrCode.ERR_0003, "ID");
        }
    	
    	AimlProp aimlProp = new AimlProp();
    	aimlProp.setCateId(propCategory.getId());
        
        int insert = 0;
        try {
            insert += propCategoryMapper.deleteByPrimaryKey(propCategory);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        //deploy 삭제
        propCategory.setCpId(0);
        propCategory.setDeploy("N");
        createDeploy(propCategory);
        
        //관련 prop 삭제
        propServiceImpl.remove(aimlProp);
        
        return insert;
	}
    
    /**
     * deploy.
     *
     * @param propCategory the propCategory
     * @return the int
     */
    @Transactional
    public void createDeploy(PropCategory propCategory) throws ApplicationException, BizCheckedException {   	
    	String deploy = propCategory.getDeploy();
    	
    	DeployPropCategory deployPropCategory = new DeployPropCategory();
    	deployPropCategory.setCpId(propCategory.getCpId());
    	deployPropCategory.setCateId(propCategory.getId());
    	
    	//공용 카테고리,사용여부(N) - cp 상관없이 해당 카테고리 모두 삭제
    	if("all".equals(propCategory.getRestriction()) && "N".equals(propCategory.getEnabled())){
    		try {   
    			deployPropCategory.setCpId(0);
    			deployPropCategoryMapper.deleteByPrimaryKey(deployPropCategory);
        	}catch (DataAccessException ex){
              throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        	}  
    	}else{
    		try {   
        		if("Y".equals(deploy)){
        			deployPropCategoryMapper.deleteByPrimaryKey(deployPropCategory);
        			deployPropCategoryMapper.insert(deployPropCategory);
            	}else{
            		deployPropCategoryMapper.deleteByPrimaryKey(deployPropCategory);
            	}
        	}catch (DataAccessException ex){
              throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        	}    	
    	}    	
    }
}
