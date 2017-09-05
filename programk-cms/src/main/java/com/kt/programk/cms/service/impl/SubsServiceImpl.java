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

import com.kt.programk.cms.common.StringUtil;
import com.kt.programk.cms.service.SubsService;
import com.kt.programk.common.domain.core.AimlSubs;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.exception.CommonCode;
import com.kt.programk.common.repository.core.AimlSubsMapper;
import com.kt.programk.common.utils.DbExceptionUtil;

/**
 * Created by Administrator on 2016-06-21.
 */
@Service
public class SubsServiceImpl implements SubsService {
    
    /**
     * The aimlSubs mapper.
     */
    @Autowired
    private AimlSubsMapper aimlSubsMapper;    

    /**
     * 전체 개수
     *
     * @return the int
     */
	@Override
	public int countAll(AimlSubs aimlSubs) throws ApplicationException {
		try {
            return aimlSubsMapper.countAll(aimlSubs);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
	}
	
    /**
     * 대상키워드 개수
     *
     * @return the int
     */
	@Override
	public int countByFind(AimlSubs aimlSubs) throws ApplicationException {
		try {
            return aimlSubsMapper.countByFind(aimlSubs);
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
	public List<AimlSubs> findListAll(AimlSubs aimlSubs, int currentPageNo,
			int recordCountPerPage) throws ApplicationException {
		aimlSubs.setRecordCountPerPage(recordCountPerPage);
		aimlSubs.setFirstRecordIndex((currentPageNo - 1) * recordCountPerPage);

        try {
            return aimlSubsMapper.selectList(aimlSubs);
        }catch (DataAccessException ex) {
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
	public AimlSubs findByCateId(AimlSubs aimlSubs) throws ApplicationException,
			BizCheckedException {
		if(aimlSubs.getCateId() == 0){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlSubs.cateId");
        }
		
		if(aimlSubs.getFind() == null
                || "".equals(aimlSubs.getFind())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlSubs.find");
        }

        try {
            return aimlSubsMapper.selectByPrimaryKey(aimlSubs);
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
	public int create(AimlSubs aimlSubs) throws ApplicationException,
			BizCheckedException {
    	if(aimlSubs == null) {
            throw new BizCheckedException(BizErrCode.ERR_0001, "aimlSubs");
        }

        if(aimlSubs.getFind() == null
                || "".equals(aimlSubs.getFind())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlSubs.find");
        }

        if(aimlSubs.getReplace() == null
                || "".equals(aimlSubs.getReplace())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlSubs.replace");
        }
        
        String[] tempFindArray = aimlSubs.getFind().split("&!&");
    	String[] tempReplaceArray = aimlSubs.getReplace().split("&!&");
    	
    	int insert = 0;
    	for (int i = 0; i < tempFindArray.length; i++) {
    		aimlSubs.setFind(StringUtil.setReplaceSubs(tempFindArray[i].trim()));
    		aimlSubs.setReplace(tempReplaceArray[i].trim());
    		
    		int result = aimlSubsMapper.countByFind(aimlSubs);
    		if(result == 0){
    			try {
    				insert += aimlSubsMapper.insert(aimlSubs);	
    	        }catch (DataAccessException ex) {
    	        	TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
    	        	
    	        	if (DbExceptionUtil.parseException(ex) == CommonCode.DUPLICATE_KEY_EXCEPTION) {
    	                throw new BizCheckedException(BizErrCode.ERR_0005, "`"+ aimlSubs.getFind() + "` 대상 키워드");
    	            } else {
    	                throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
    	            }
    	        }
    		}else{
    			TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
    			
    			throw new BizCheckedException(BizErrCode.ERR_0005, "`"+ aimlSubs.getFind() + "` 대상 키워드");
    		}			
		} 
    	
        return insert;
	}

    /**
     * 수정
     *
     * @param subsCategory the subs category
     * @return the int
     */
    @Override
	public int modify(AimlSubs aimlSubs) throws ApplicationException,
			BizCheckedException {
    	if(aimlSubs == null) {
            throw new BizCheckedException(BizErrCode.ERR_0001, "aimlSubs");
        }

        if(aimlSubs.getFind() == null
                || "".equals(aimlSubs.getFind())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlSubs.find");
        }

        if(aimlSubs.getReplace() == null
                || "".equals(aimlSubs.getReplace())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "aimlSubs.replace");
        }
        
        int insert = 0;
        try {
        	insert = aimlSubsMapper.updateByPrimaryKeySelective(aimlSubs);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        return insert;
	}

    /**
     * 삭제.
     *
     * @param id the id
     * @return the int
     */
    @Override
	public int remove(AimlSubs aimlSubs) throws ApplicationException,
			BizCheckedException {
    	if(aimlSubs.getCateId() == 0){
            throw new BizCheckedException(BizErrCode.ERR_0006, "cateId");
        }
        
        int insert = 0;
        try {
            insert = aimlSubsMapper.deleteByPrimaryKey(aimlSubs);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        return insert;
	}
    
    /**
     * 삭제.
     *
     * @param id the id
     * @return the int
     */
    @Override
	public int removeAll(AimlSubs aimlSubs) throws ApplicationException,
			BizCheckedException {
        int delete = 0;
        try {
        	delete = aimlSubsMapper.deleteAll(aimlSubs);
        }catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        return delete;
	}
}
