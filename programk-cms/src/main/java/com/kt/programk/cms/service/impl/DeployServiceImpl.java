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

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kt.programk.cms.service.DeployService;
import com.kt.programk.common.db.domain.BotDTO;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.core.AimlRepository;
import com.kt.programk.common.domain.core.Bot;
import com.kt.programk.common.domain.deploy.DeployHistory;
import com.kt.programk.common.domain.deploy.DeployScheduler;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.repository.admin.CpMapper;
import com.kt.programk.common.repository.core.AimlRepositoryMapper;
import com.kt.programk.common.repository.core.BotMapper;
import com.kt.programk.common.repository.deploy.DeployHistoryMapper;
import com.kt.programk.common.repository.deploy.DeploySchedulerMapper;
import com.kt.programk.common.utils.DbExceptionUtil;

/**
 * Created by redpunk on 2016-06-20.
 */
@Service
public class DeployServiceImpl implements DeployService {
	/**
	 * The deployHistory mapper.
	 */
	@Autowired
	private DeployHistoryMapper deployHistoryMapper;

	/**
	 * The bot mapper.
	 */
	@Autowired
	private BotMapper botMapper;

	/**
	 * The deployScheduler mapper.
	 */
	@Autowired
	private DeploySchedulerMapper deploySchedulerMapper;

	/**
	 * The Cp mapper.
	 */
	@Autowired
	private CpMapper cpMapper;

	/**
	 * Actvie/Standby 변경
	 */
	@Autowired
	private AimlRepositoryMapper aimlRepositoryMapper;

	/**
	 * Count int.
	 *
	 * @param deployHistory
	 *            the deployHistory
	 * @return the int
	 */
	@Override
	public int countByHistory(DeployHistory deployHistory) throws ApplicationException {
		try {
			return deployHistoryMapper.countAll(deployHistory);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
		}
	}

	/**
	 * Count int.
	 *
	 * @param DeployScheduler
	 *            the deployScheduler
	 * @return the int
	 */
	@Override
	public int cleanLastBotDeploy(DeployScheduler deployScheduler) throws ApplicationException {
		try {
			return deploySchedulerMapper.cleanLastBotDeploy(deployScheduler);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
		}
	}

	/**
	 * Find History list.
	 *
	 * @param deployHistory
	 *            the deployHistory
	 * @param currentPageNo
	 *            the current page no
	 * @param recordCountPerPage
	 *            the record count per page
	 * @return the list
	 */
	@Override
	public List<DeployHistory> findListByHistory(DeployHistory deployHistory, int currentPageNo, int recordCountPerPage)
			throws ApplicationException {
		deployHistory.setRecordCountPerPage(recordCountPerPage);
		deployHistory.setFirstRecordIndex((currentPageNo - 1) * recordCountPerPage);

		try {
			return deployHistoryMapper.selectList(deployHistory);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
		}
	}

	/**
	 * Find by id History
	 *
	 * @param deployHistory
	 *            the deployHistory id
	 * @return the deployHistory
	 */
	@Override
	public DeployHistory findById(DeployHistory deployHistory) throws ApplicationException {
		try {
			return deployHistoryMapper.selectByPrimaryKey(deployHistory);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
		}
	}

	/**
	 * Find bot list.
	 *
	 * @param cpUser
	 *            the bot
	 * @return the list
	 */
	@Override
	public List<Bot> findListByBot(Bot bot) throws ApplicationException {
		try {
			return botMapper.selectList(bot);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
		}
	}

	/**
	 * Create int.
	 *
	 * @param DeployScheduler
	 *            the deployScheduler
	 * @return the int
	 * @throws ApplicationException
	 *             the application exception
	 */
	@Override
	public int create(DeployScheduler deployScheduler) throws ApplicationException, BizCheckedException {
		if (deployScheduler == null) {
			throw new BizCheckedException(BizErrCode.ERR_0007, "");
		}

		if (deployScheduler.getCpId() == 0) {
			throw new BizCheckedException(BizErrCode.ERR_0003, "CP ID");
		}

		try {
			return deploySchedulerMapper.insert(deployScheduler);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
		}
	}

	/**
	 * Modify by id int.
	 *
	 * @param Bot
	 *            the bot
	 * @return the int
	 * @throws ApplicationException
	 *             the application exception
	 */
	@Override
	@Transactional
	public int modify(DeployScheduler deployScheduler) throws ApplicationException, BizCheckedException {
		if (deployScheduler == null) {
			throw new BizCheckedException(BizErrCode.ERR_0007, "");
		}

		int count = 0;
		try {
			deployScheduler.setCompleted("C");
			deployScheduler.setGubun("BOT변경");
			count = deploySchedulerMapper.updateBySubLabelSelective(deployScheduler);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
		}

		// 예약취소 - 스케쥴러 등록
		deployScheduler.setDeployDate(new Date());
		deployScheduler.setCompleted("Y");
		deployScheduler.setGubun("BOT변경취소");
		create(deployScheduler);

		return count;
	}

	/**
	 * Modify by id int.
	 *
	 * @param Bot
	 *            the bot
	 * @return the int
	 * @throws ApplicationException
	 *             the application exception
	 */
	@Override
	@Transactional
	public int modifyByBot(Bot bot) throws ApplicationException, BizCheckedException {
		if (bot == null) {
			throw new BizCheckedException(BizErrCode.ERR_0007, "");
		}

		if (bot.getId() == 0) {
			throw new BizCheckedException(BizErrCode.ERR_0003, "BOT ID");
		}

		int count = 0;
		try {
			count = botMapper.updateByPrimaryKeySelective(bot);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
		}

		// Active인 경우만
		if ("Y".equals(bot.getActive())) {
			DeployScheduler deployScheduler = new DeployScheduler();
			deployScheduler.setDeployDate(new Date());
			deployScheduler.setCpId(bot.getCpId());
			deployScheduler.setCompleted("Y");
			deployScheduler.setDescription(bot.getDescription());
			deployScheduler.setUserId(bot.getUserId());
			deployScheduler.setGubun("BOT변경");
			deployScheduler.setSubLabel(bot.getSubLabel());
			deploySchedulerMapper.insert(deployScheduler);
		}

		// redis 세팅
		String token = "";
		Cp cp = new Cp();
		cp.setLabel(bot.getSubLabel().replace("-01", "").replace("-02", ""));
		Cp cpResult = cpMapper.selectByLable(cp);
		if (cpResult != null) {
			token = cpResult.getToken();
		}

		// Repository의 Active / Standby Cache 삭제
		BotDTO dto = new BotDTO();
		dto.setActive(bot.getActive());
		dto.setToken(token);
		dto.setSubLabel(bot.getSubLabel());

		AimlRepository repository = new AimlRepository();
		repository.setObjectKey(dto.getObjectKey());
		repository.setKey(dto.getKey());
		aimlRepositoryMapper.deleteByAll(repository);

		return count;
	}

	@Transactional
	private void createDeployHistory(DeployHistory deployHistory) throws ApplicationException, BizCheckedException {
		if (deployHistory == null) {
			throw new BizCheckedException(BizErrCode.ERR_0007, "");
		}

		try {
			deployHistoryMapper.insert(deployHistory);
		} catch (DataAccessException ex) {
			throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
		}
	}
}
