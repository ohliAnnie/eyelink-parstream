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

import com.kt.programk.cms.service.CpUserService;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.exception.CommonCode;
import com.kt.programk.common.repository.admin.CpUserMapper;
import com.kt.programk.common.utils.DbExceptionUtil;

/**
 * Created by redpunk on 2016-06-20.
 */
@Service
public class CpUserServiceImpl implements CpUserService {
    /**
     * The Cp user mapper.
     */
    @Autowired
    private CpUserMapper cpUserMapper;


    /**
     * Count int.
     *
     * @param cpUser the cp user
     * @return the int
     */
    @Override
    public int countByCpId(CpUser cpUser) throws BizCheckedException, ApplicationException {
        if (cpUser == null) {
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }
        
        try {
        	if (cpUser.getCpId() == 0) {
        		return cpUserMapper.countAll(cpUser);
        	}else{
        		return cpUserMapper.countByCpId(cpUser);
        	}
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        }
    }

    /**
     * Create int.
     *
     * @param cpUser the cp user
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public int create(CpUser cpUser) throws ApplicationException, BizCheckedException {
        if (cpUser == null) {
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }
        
        if (cpUser.getUserId() == null || "".equals(cpUser.getUserId())) {
            throw new BizCheckedException(BizErrCode.ERR_0003, "ID");
        }
        
        String[] tempCpId = cpUser.getCpGroup().split(",");    
        if (tempCpId.length > 0) {
        	cpUser.setCpId(Integer.parseInt(tempCpId[0].trim()));
        }else{        	
        	throw new BizCheckedException(BizErrCode.ERR_0003, "CP ID");
        }  

        int count = 0;
        try {
            count = cpUserMapper.insert(cpUser);
        } catch (DataAccessException ex) {
            if (DbExceptionUtil.parseException(ex) == CommonCode.DUPLICATE_KEY_EXCEPTION) {
                throw new BizCheckedException(BizErrCode.ERR_0005, "ID");
            } else {
                throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
            }
        }
        
        if (cpUser.getId() == 0) {
            throw new BizCheckedException(BizErrCode.ERR_0003, "cpUser.id");
        }
        
        addCpGroup(cpUser); //cp그룹
        
        return count;
    }

    /**
     * Modify by id int.
     *
     * @param cpUser the cp user
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    public int modifyById(CpUser cpUser) throws ApplicationException, BizCheckedException {
        if (cpUser == null) {
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }
        
        if (cpUser.getUserId() == null || "".equals(cpUser.getUserId())) {
            throw new BizCheckedException(BizErrCode.ERR_0003, "ID");
        }
        
        if(cpUser.getCpGroup() != null){
        	String[] tempCpId = cpUser.getCpGroup().split(",");    
            if (tempCpId.length > 0) {
            	cpUser.setCpId(Integer.parseInt(tempCpId[0].trim()));
            }else{        	
            	throw new BizCheckedException(BizErrCode.ERR_0003, "CP ID");
            } 
        }               

        int count = 0;
        try {
        	count = cpUserMapper.updateByPrimaryKeySelective(cpUser);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        }
        
        if(cpUser.getCpGroup() != null){
        	addCpGroup(cpUser); //cp그룹
        }
        
        return count;
    }

    /**
     * Find by id cp user.
     *
     * @param userId the user id
     * @return the cp user
     */
    @Override
    public CpUser findByUserId(String userId) throws ApplicationException {
    	if (userId == null || "".equals(userId)) {
    		return null;
        }else{
        	CpUser cpUser = new CpUser();
            cpUser.setUserId(userId);
            
            try {
                return cpUserMapper.selectByPrimaryKey(cpUser);
            } catch (DataAccessException ex) {
                throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
            }
        }
    }
    
    /**
     * Find by id cp user.
     *
     * @param userId the user id
     * @return the cp user
     */
    @Override
    public CpUser findById(CpUser cpUser) throws ApplicationException {
        try {
            return cpUserMapper.selectByPrimaryKey(cpUser);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        }
    }

    /**
     * Find by name cp user.
     *
     * @param name the name
     * @return the cp user
     * @throws ApplicationException the application exception
     */
    @Override
    public CpUser findByName(String name) throws ApplicationException, BizCheckedException {
        if (name == null || "".equals(name)) {
            throw new BizCheckedException(BizErrCode.ERR_0003, "이름");
        }

        CpUser cpUser = new CpUser();
        cpUser.setName(name);
        try {
            return cpUserMapper.selectByName(cpUser);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        }
    }

    /**
     * Find all list.
     *
     * @param cpUser             the cp user
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     */
    @Override
    public List<CpUser> findListAll(CpUser cpUser, int currentPageNo, int recordCountPerPage) throws ApplicationException {
        cpUser.setRecordCountPerPage(recordCountPerPage);
        cpUser.setFirstRecordIndex((currentPageNo - 1) * recordCountPerPage);

        try {
        	if (cpUser.getCpId() == 0) {
        		return cpUserMapper.selectList(cpUser);
        	}else{
        		return cpUserMapper.selectListByCpId(cpUser);
        	}            
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        }
    }

    /**
     * Remove int.
     *
     * @param cpUser the cp user
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public int remove(CpUser cpUser) throws ApplicationException, BizCheckedException {
        if (cpUser == null) {
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }
        if (cpUser.getId() == 0) {
            throw new BizCheckedException(BizErrCode.ERR_0003, "ID");
        }

        int count = 0;
        try {
        	count = cpUserMapper.deleteByPrimaryKey(cpUser);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        }
        
        removeCpGroup(cpUser.getId()); //cp그룹 삭제
        
        return count; 
    }
    
    /**
     * Add cp group.
     *
     * @param cpUser the cp user
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Transactional
    public void addCpGroup(CpUser cpUser) throws ApplicationException, BizCheckedException {       
    	if(cpUser == null){
            throw new BizCheckedException(BizErrCode.ERR_0001, "cpUser");
        }
    	
    	//등록된 내용 삭제
    	removeCpGroup(cpUser.getId());
    	
    	try {        		
    		String[] tempCpId = cpUser.getCpGroup().split(",");       	 
            for (int i = 0; i < tempCpId.length; i++) {
            	cpUser.setCpId(Integer.parseInt(tempCpId[i].trim()));
            	cpUserMapper.insertByCpGroup(cpUser);    	
			}        		
    	}catch (DataAccessException ex){
    		throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
    	}
    }
    
    /**
     * Remove cp group.
     *
     * @param id the id
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Transactional
    public int removeCpGroup(int id) throws ApplicationException {
        try{
            return cpUserMapper.deleteByCpGroup(id);   
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }    
}
