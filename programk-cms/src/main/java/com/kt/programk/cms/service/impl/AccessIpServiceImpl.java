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

import com.kt.programk.cms.service.AccessIpService;
import com.kt.programk.common.domain.admin.AccessIp;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.repository.admin.AccessIpMapper;
import com.kt.programk.common.utils.DbExceptionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;

import java.util.List;

/**
 * Created by redpunk on 2016-06-20.
 */
public class AccessIpServiceImpl implements AccessIpService {
    /**
     * The Access ip mapper.
     */
    @Autowired
    private AccessIpMapper accessIpMapper;

    /**
     * Count int.
     *
     * @param accessIp the access ip
     * @return the int
     */
    @Override
    public int count(AccessIp accessIp) {
        return accessIpMapper.countExample(accessIp);
    }

    /**
     * Create int.
     *
     * @param accessIp the access ip
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    public int create(AccessIp accessIp) throws ApplicationException, BizCheckedException {
        if (accessIp == null) {
            throw new BizCheckedException(BizErrCode.ERR_0001, "accessIP");
        }

        if (accessIp.getHostIp() == null
                || "".equals(accessIp.getHostIp())
                || accessIp.getHostIp().length() > AccessIp.MAX_LENGTH_HOST_IP) {
            throw new BizCheckedException(BizErrCode.ERR_0006, "accessIp.hostIp");
        }

        if (accessIp.getUserId() == null
                || "".equals(accessIp.getUserId())
                || accessIp.getUserId().length() > AccessIp.MAX_LENGTH_USER_ID) {
            throw new BizCheckedException(BizErrCode.ERR_0006, "accessIp.userId");
        }

        if (accessIp.getEnabled() == null
                || "".equals(accessIp.getEnabled())
                || accessIp.getEnabled().length() > AccessIp.MAX_LENGTH_ENABLED) {
            throw new BizCheckedException(BizErrCode.ERR_0006, "accessIp.enabled");
        }

        try {
            return accessIpMapper.insert(accessIp);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Modify by id int.
     *
     * @param accessIp the access ip
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    public int modifyById(AccessIp accessIp) throws ApplicationException, BizCheckedException {
        if (accessIp == null) {
            throw new BizCheckedException(BizErrCode.ERR_0001, "accessIP");
        }

        if (accessIp.getHostIp() == null
                || "".equals(accessIp.getHostIp())
                || accessIp.getHostIp().length() > AccessIp.MAX_LENGTH_HOST_IP) {
            throw new BizCheckedException(BizErrCode.ERR_0006, "accessIp.hostIp");
        }

        if (accessIp.getUserId() == null
                || "".equals(accessIp.getUserId())
                || accessIp.getUserId().length() > AccessIp.MAX_LENGTH_USER_ID) {
            throw new BizCheckedException(BizErrCode.ERR_0006, "accessIp.userId");
        }

        if (accessIp.getEnabled() == null
                || "".equals(accessIp.getEnabled())
                || accessIp.getEnabled().length() > AccessIp.MAX_LENGTH_ENABLED) {
            throw new BizCheckedException(BizErrCode.ERR_0006, "accessIp.enabled");
        }

        try {
            return accessIpMapper.updateByPrimaryKeySelective(accessIp);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Find by id access ip.
     *
     * @param id the id
     * @return the access ip
     * @throws ApplicationException the application exception
     */
    @Override
    public AccessIp findById(int id) throws ApplicationException, BizCheckedException {
        if (id == 0) {
            throw new BizCheckedException(BizErrCode.ERR_0006, "id");
        }

        AccessIp accessIp = new AccessIp();
        accessIp.setId(id);
        try {
            return accessIpMapper.selectByPrimaryKey(accessIp);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Find all list.
     *
     * @param accessIp           the access ip
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     */
    @Override
    public List<AccessIp> findListAll(AccessIp accessIp, int currentPageNo, int recordCountPerPage) throws ApplicationException {
    	accessIp.setRecordCountPerPage(recordCountPerPage);
        accessIp.setFirstRecordIndex((currentPageNo - 1) * recordCountPerPage);

        try {
            return accessIpMapper.selectList(accessIp);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Remove int.
     *
     * @param accessIp the access ip
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    public int remove(AccessIp accessIp) throws ApplicationException, BizCheckedException {
        if (accessIp == null) {
            throw new BizCheckedException(BizErrCode.ERR_0001, "accessIP");
        }

        if (accessIp.getId() == 0) {
            throw new BizCheckedException(BizErrCode.ERR_0001, "accessIp.id");
        }

        try {
            return accessIpMapper.deleteByPrimaryKey(accessIp);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }
}
