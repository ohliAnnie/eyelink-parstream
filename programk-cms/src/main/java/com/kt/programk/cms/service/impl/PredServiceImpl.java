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

import com.kt.programk.cms.service.PredService;
import com.kt.programk.common.domain.core.AimlPred;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.exception.CommonCode;
import com.kt.programk.common.repository.core.AimlPredMapper;
import com.kt.programk.common.utils.DbExceptionUtil;

/**
 * Created by Administrator on 2016-06-21.
 */
@Service
public class PredServiceImpl implements PredService {
    
    /**
     * The aimlPred mapper.
     */
    @Autowired
    private AimlPredMapper aimlPredMapper;
    
    /**
     * 전체 개수
     *
     * @return the int
     */
	@Override
	public int countAll(AimlPred aimlPred) throws ApplicationException {
		try {
            return aimlPredMapper.countAll(aimlPred);
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
	public int countByName(AimlPred aimlPred) throws ApplicationException {
		try {
            return aimlPredMapper.countByName(aimlPred);
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
	public List<AimlPred> findListAll(AimlPred aimlPred, int currentPageNo,
		int recordCountPerPage) throws ApplicationException {
		aimlPred.setRecordCountPerPage(recordCountPerPage);
		aimlPred.setFirstRecordIndex((currentPageNo - 1) * recordCountPerPage);

        try {
            return aimlPredMapper.selectList(aimlPred);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}

	/**
     * 상세 조회
     *
     * @param AimlPred aimlPred
     * @return the AimlPred
     */
	@Override
	public AimlPred findByCateId(AimlPred aimlPred)
			throws ApplicationException, BizCheckedException {
		if(aimlPred.getCateId() == 0){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlPred.cateId");
        }
		
		if(aimlPred.getName() == null
                || "".equals(aimlPred.getName())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlPred.name");
        }

        try {
            return aimlPredMapper.selectByPrimaryKey(aimlPred);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}

	/**
     * 신규 생성
     *
     * @param AimlPred aimlPred
     * @return the int
     */
    @Override
    @Transactional
	public int create(AimlPred aimlPred) throws ApplicationException,
			BizCheckedException {
    	if(aimlPred == null) {
            throw new BizCheckedException(BizErrCode.ERR_0001, "aimlPred");
        }

        if(aimlPred.getName() == null
                || "".equals(aimlPred.getName())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlPred.name");
        }
        
        if(aimlPred.getBasic() == null
                || "".equals(aimlPred.getBasic())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlPred.basic");
        }

        if(aimlPred.getVal() == null
                || "".equals(aimlPred.getVal())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlPred.val");
        }
        
        String[] tempNameArray = aimlPred.getName().split("&!&");
    	String[] tempBasicArray = aimlPred.getBasic().split("&!&");
    	String[] tempValArray = aimlPred.getVal().split("&!&");
    	
    	int insert = 0;
    	for (int i = 0; i < tempNameArray.length; i++) {
    		aimlPred.setName(tempNameArray[i].trim());
    		aimlPred.setBasic(tempBasicArray[i].trim());
    		aimlPred.setVal(tempValArray[i].trim());
			
    		int result = aimlPredMapper.countByName(aimlPred);
    		if(result == 0){
    			try {
    				insert += aimlPredMapper.insert(aimlPred);	
    	        }catch (DataAccessException ex) {
    	        	TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
    	        	
    	        	if (DbExceptionUtil.parseException(ex) == CommonCode.DUPLICATE_KEY_EXCEPTION) {
    	        		throw new BizCheckedException(BizErrCode.ERR_0005, "`"+ aimlPred.getName() + "` 이름");
    	            } else {
    	                throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
    	            }
    	        }
    		}else{
    			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
    			
    			throw new BizCheckedException(BizErrCode.ERR_0005, "`"+ aimlPred.getName() + "` 이름");
    		}
		} 
    	
        return insert;
	}

    /**
     * 수정
     *
     * @param AimlPred aimlPred
     * @return the int
     */
    @Override
	public int modify(AimlPred aimlPred) throws ApplicationException,
			BizCheckedException {
    	if(aimlPred == null) {
            throw new BizCheckedException(BizErrCode.ERR_0001, "aimlPred");
        }

        if(aimlPred.getName() == null
                || "".equals(aimlPred.getName())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlPred.name");
        }

        if(aimlPred.getBasic() == null
                || "".equals(aimlPred.getBasic())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlPred.basic");
        }

        if(aimlPred.getVal() == null
                || "".equals(aimlPred.getVal())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlPred.val");
        }
        
        int insert = 0;
        try {
        	insert = aimlPredMapper.updateByPrimaryKeySelective(aimlPred);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        return insert;
	}

    /**
     * 삭제.
     *
     * @param AimlPred aimlPred
     * @return the int
     */
    @Override
	public int remove(AimlPred aimlPred) throws ApplicationException,
			BizCheckedException {
    	if(aimlPred.getCateId() == 0){
            throw new BizCheckedException(BizErrCode.ERR_0006, "cateId");
        }
        
        int insert = 0;
        try {
            insert = aimlPredMapper.deleteByPrimaryKey(aimlPred);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        return insert;
	}

}
