/*
 *  Copyright (c) 2016 KT, Inc.
 *  All right reserved.
 *  This software is the confidential and proprietary information of KT
 *  , Inc. You shall not disclose such Confidential Information and
 *  shall use it only in accordance with the terms of the license agreement
 *  you entered into with KT.
 *
 *  Revision History
 *  Author Date Description
 *  ------------------ -------------- ------------------
 *  Seo Jong Hwa 16. 8. 19 오후 5:00
 *
 *
 */

package com.kt.programk.scheduler.process;

import java.util.Date;
import java.util.List;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import com.kt.programk.common.code.AimlFileType;
import com.kt.programk.common.code.BotFileActiveType;
import com.kt.programk.common.code.DeploySchedulerCompletedType;
import com.kt.programk.common.data.repository.db.BotRepository;
import com.kt.programk.common.db.domain.BotDTO;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.core.Bot;
import com.kt.programk.common.domain.deploy.DeployHistory;
import com.kt.programk.common.domain.deploy.DeployScheduler;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.logs.CLogger;
import com.kt.programk.common.service.BotDeployService;
import com.kt.programk.scheduler.cache.ChildrenCache;

/**
 * BOT변경 스케줄러 처리 \
 */
public class BotActiveChange implements Processor {
    /**
     * The constant LOGGER.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(BotActiveChange.class);

    /**
     * 매퍼 조회
     */
    private BotDeployService botDeployService;

    /**
     * Actvie/Standby 변경
     */
    private BotRepository botRepository;

    /**
     * The Children cache.
     */
    private ChildrenCache childrenCache;

    /**
     * 생성자
     * @param botDeployService
     * @param botRepository
     * @param childrenCache
     */
    public BotActiveChange(BotDeployService botDeployService, BotRepository botRepository, ChildrenCache childrenCache) {
        this.botDeployService = botDeployService;
        this.botRepository = botRepository;
        this.childrenCache = childrenCache;
    }

    /**
     * 메인 프로세서
     * @param exchange
     * @throws Exception
     */
    @Override
    public void process(Exchange exchange) throws ApplicationException {
        CLogger.functionStart("Start SearchDeployCompleted");

        DeployScheduler example = new DeployScheduler();
        example.setCompleted(DeploySchedulerCompletedType.NONCOMPLETED.getValue());
        example.setGubun("BOT변경");

        List<DeployScheduler> deploySchedulers = botDeployService.findListScheduler(example);

        //현재 시간
        Date now = new Date();

        for(DeployScheduler deployScheduler : deploySchedulers){
            Date deployDate = deployScheduler.getDeployDate();
            int compare = deployDate.compareTo(now);

            /**
             * 2016-08-11 배포 완료 여부와 상관업이 봇을 변경한다.
             */
            if(compare <= 0 && childrenCache.isNotExist(deployScheduler.getId())){
                CLogger.info(deployScheduler.getId() + " " + deployScheduler.getSubLabel() + "Active Start");
                childrenCache.add(deployScheduler.getId(), new Date());


                //CP_ID로 SUB_LABEL를 조회한다.
                List<Bot> bots = botDeployService.findListBotByCpId(deployScheduler.getCpId());

                if(bots.isEmpty()){
                    CLogger.error(deployScheduler.getCpId() + " bot not found!!!!!!");
                    botDeployService.updateFailScheduler(deployScheduler.getId(), deployScheduler.getCpId() + " bot not found!!!!!!");
                    continue;
                }

                //해당 CP의 인증 토큰을 구한다.
                Cp cp = botDeployService.findTokenByCpId(bots.get(0).getCpId());
                if(cp == null){
                    CLogger.error(deployScheduler.getCpId() + " token not found!!!!");
                    botDeployService.updateFailScheduler(deployScheduler.getId(), deployScheduler.getCpId() + " token not found!!!!");
                    continue;
                }

                if(deployScheduler.getSubLabel() == null || "".equals(deployScheduler.getSubLabel())){
                    CLogger.error("subLabel is null");
                    botDeployService.updateFailScheduler(deployScheduler.getId(), "subLabel is null");
                    continue;
                }

                //TODO 사용자가 지정한 봇을 액티브로 한다.
                for(Bot bot : bots){
                    if(bot.getSubLabel().equals(deployScheduler.getSubLabel())){
                        switchActive(bot, BotFileActiveType.ACTIVE.getValue(), cp.getToken(), bot.getSubLabel());
                    }else{
                        switchActive(bot, BotFileActiveType.STANDBY.getValue(), cp.getToken(), bot.getSubLabel());
                    }
                }

                //스케줄러 완료 처리
                botDeployService.updateSuccessScheduler(deployScheduler.getId());
                //히스토리 입력
                createHistory(deployScheduler);

            }else{
                CLogger.info(deployScheduler.getId() + "is not start");
            }

            childrenCache.remove(deployScheduler.getId());
            CLogger.functionEnd();
        }

    }

    /**
     * 이력을 남긴다.
     * @param deployScheduler
     * @throws ApplicationException
     */
    private void createHistory(DeployScheduler deployScheduler) throws ApplicationException {
        DeployHistory deployHistory = new DeployHistory();
        deployHistory.setSchedulerId(deployScheduler.getId());
        deployHistory.setFileName(deployScheduler.getSubLabel());
        deployHistory.setFileType(AimlFileType.BOT.getValue());
        deployHistory.setFileBody("");
        botDeployService.createHistory(deployHistory);
    }

    /**
     * 활성화 상태인가?
     * @param bot
     * @return
     */
    private boolean isActive(Bot bot) {
        return BotFileActiveType.ACTIVE.getValue().equals(bot.getActive());
    }

    /**
     * 데이터 베이스와 redis의 상태를 변경한다.
     * @param bot
     * @param value
     * @param token
     * @param subLabel
     * @throws ApplicationException
     */
    @Transactional
    private void switchActive(Bot bot, String value, String token, String subLabel) throws ApplicationException {
        bot.setActive(value);
        botDeployService.editBot(bot);
        BotDTO dto = new BotDTO();
        dto.setActive(value);
        dto.setToken(token);
        dto.setSubLabel(subLabel);
        botRepository.put(dto);
    }
}
