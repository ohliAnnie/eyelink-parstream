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
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.kt.programk.cms.service.PropService;
import com.kt.programk.common.domain.core.AimlProp;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.exception.CommonCode;
import com.kt.programk.common.repository.core.AimlPropMapper;
import com.kt.programk.common.utils.DbExceptionUtil;

/**
 * Created by Administrator on 2016-06-21.
 */
@Service
public class PropServiceImpl implements PropService {
    
    /**
     * The aimlProp mapper.
     */
    @Autowired
    private AimlPropMapper aimlPropMapper;

    /**
     * 전체 개수
     *
     * @return the int
     */
	@Override
	public int countAll(AimlProp aimlProp) throws ApplicationException {
		try {
            return aimlPropMapper.countAll(aimlProp);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}

    /**
     * 이름 개수
     *
     * @return the int
     */
	@Override
	public int countByName(AimlProp aimlProp) throws ApplicationException {
		try {
            return aimlPropMapper.countByName(aimlProp);
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
	public List<AimlProp> findListAll(AimlProp aimlProp, int currentPageNo,
			int recordCountPerPage) throws ApplicationException {
		aimlProp.setRecordCountPerPage(recordCountPerPage);
		aimlProp.setFirstRecordIndex((currentPageNo - 1) * recordCountPerPage);

        try {
            return aimlPropMapper.selectList(aimlProp);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}

	/**
     * 상세 조회
     *
     * @param AimlProp the aimlProp
     * @return the AimlProp
     */
	@Override
	public AimlProp findByCateId(AimlProp aimlProp)
			throws ApplicationException, BizCheckedException {
		if(aimlProp.getCateId() == 0){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlProp.cateId");
        }
		
		if(aimlProp.getName() == null
                || "".equals(aimlProp.getName())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlProp.name");
        }

        try {
            return aimlPropMapper.selectByPrimaryKey(aimlProp);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}

	/**
     * 신규 생성
     *
     * @param AimlProp the aimlProp
     * @return the int
     */
    @Override
    @Transactional
	public int create(AimlProp aimlProp) throws ApplicationException,
			BizCheckedException {
    	if(aimlProp == null) {
            throw new BizCheckedException(BizErrCode.ERR_0001, "aimlProp");
        }

        if(aimlProp.getName() == null
                || "".equals(aimlProp.getName())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlProp.name");
        }

        if(aimlProp.getVal() == null
                || "".equals(aimlProp.getVal())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlProp.val");
        }
        
        String[] tempNameArray = aimlProp.getName().split("&!&");
    	String[] tempValArray = aimlProp.getVal().split("&!&");
    	
    	int insert = 0;
    	for (int i = 0; i < tempNameArray.length; i++) {
    		aimlProp.setName(tempNameArray[i].trim());
    		aimlProp.setVal(tempValArray[i].trim());
			
    		int result = aimlPropMapper.countByName(aimlProp);
    		if(result == 0){
    			try {
    				insert += aimlPropMapper.insert(aimlProp);	
    	        }catch (DataAccessException ex) {
    	        	TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
    	        	
    	        	if (DbExceptionUtil.parseException(ex) == CommonCode.DUPLICATE_KEY_EXCEPTION) {
    	        		throw new BizCheckedException(BizErrCode.ERR_0005, "`"+ aimlProp.getName() + "` 이름");
    	            } else {
    	                throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
    	            }
    	        }
    		}else{
    			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
    			
    			throw new BizCheckedException(BizErrCode.ERR_0005, "`"+ aimlProp.getName() + "` 이름");
    		}			
		} 
    	
        return insert;
	}

    /**
     * 수정
     *
     * @param AimlProp the aimlProp
     * @return the int
     */
    @Override
	public int modify(AimlProp aimlProp) throws ApplicationException,
			BizCheckedException {
    	if(aimlProp == null) {
            throw new BizCheckedException(BizErrCode.ERR_0001, "aimlProp");
        }

        if(aimlProp.getName() == null
                || "".equals(aimlProp.getName())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlProp.name");
        }

        if(aimlProp.getVal() == null
                || "".equals(aimlProp.getVal())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlProp.val");
        }
        
        int insert = 0;
        try {
        	insert = aimlPropMapper.updateByPrimaryKeySelective(aimlProp);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        return insert;
	}

    /**
     * 삭제.
     *
     * @param AimlProp the aimlProp
     * @return the int
     */
    @Override
	public int remove(AimlProp aimlProp) throws ApplicationException,
			BizCheckedException {
    	if(aimlProp.getCateId() == 0){
            throw new BizCheckedException(BizErrCode.ERR_0006, "cateId");
        }
        
        int insert = 0;
        try {
            insert = aimlPropMapper.deleteByPrimaryKey(aimlProp);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        return insert;
	}

}
