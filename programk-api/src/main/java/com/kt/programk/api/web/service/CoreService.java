/*
 * Copyright (c) 2016 KT, Inc.
 * All right reserved.
 * This software is the confidential and proprietary information of KT
 * , Inc. You shall not disclose such Confidential Information and
 * shall use it only in accordance with the terms of the license agreement
 * you entered into with KT.
 *
 * Revision History
 * Author Date Description
 *  ------------------ -------------- ------------------
 * Seo Jong Hwa 16. 8. 21 오전 12:42
 */

package com.kt.programk.api.web.service;

import com.kt.programk.api.exception.*;
import com.kt.programk.common.code.BotFileActiveType;
import com.kt.programk.common.code.StagingUserMenuType;
import com.kt.programk.common.data.repository.db.AllowIpRepository;
import com.kt.programk.common.data.repository.db.BotRepository;
import com.kt.programk.common.data.repository.db.NoticeRepository;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.ApplicationRuntimeException;
import com.kt.programk.common.exception.DatabaseRuntimeException;
import com.kt.programk.common.exception.UnauthorizedException;
import com.kt.programk.common.db.domain.AllowIpDTO;
import com.kt.programk.common.db.domain.BotDTO;
import com.kt.programk.common.db.domain.NoticeDTO;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.wo.ProgramkRequest;
import org.aitools.programd.Core;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 파라메터 검증 및 봇 상태 확인
 */
@Service
public class CoreService {
    /**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(CoreService.class);
    /**
     * 카테고리 아이디 패턴(로그에 저장할 패턴)
     */
    public static final String CATEGORY_PATTERN = "[|][0-9a-zA-Z]{10}$";

    /**
     * Srai인 경우 여러개 올수있으므로 제거해야 한다.
     */
    public static final String CATEGORY_SRAI_PATTERN = "[|][0-9a-zA-Z]{10}";
    /**
     * 템플릿 패턴
     */
    public static final String TEMPLATE_PATTERN = "(?>\\{\\{.*?\\}\\})";

    /**
     * The Core.
     */
    @Autowired
    @Qualifier("core")
    private Core core;

    /**
     * 접근 가능한 IP인지
     */
    @Autowired
    private AllowIpRepository allowIpRepository;

    /**
     * The Config.
     */
    @Autowired
    private ConfigProperties config;
    
    /**
     * Active인 봇 검사
     */
    @Autowired
    private BotRepository botRepository;

    /**
     * 서비스 상태 확인
     */
    @Autowired
    private NoticeRepository noticeRepository;

    /**
     * 해당 서비스에서 Active인 봇을 가져온다.
     *
     * @param botid           the botid
     * @param programkRequest the programk request
     * @return active bot id
     */
    public String getActiveBotId(String botid, @RequestBody ProgramkRequest programkRequest) {
        BotDTO botDTO = new BotDTO();
        botDTO.setToken(programkRequest.getToken());
        List<BotDTO> objects = botRepository.getObjects(botid, botDTO);

        if (objects.size() == 0) {
            throw new NotFoundServiceException(botid + " is not service");
        }

        String activeBotid = "";

        for (BotDTO bot : objects) {
            if (BotFileActiveType.ACTIVE.getValue().equals(bot.getActive())) {
                activeBotid = bot.getSubLabel();
            }
        }

        if ("".equals(activeBotid)) {
            throw new NotFoundActiveBotException(programkRequest.getToken() + " is not found active botid");
        }
        return activeBotid;
    }

    /**
     * 접근 권한 확인
     *
     * @param token   the token
     * @param request the request
     */
    public void validationHostIp(String token, HttpServletRequest request) {

        AllowIpDTO allowIpDTO = new AllowIpDTO();
        String ipAddress = request.getHeader("X-FORWARDED-FOR");

        if (ipAddress == null) {
            ipAddress = request.getRemoteAddr();
        }

        LOG.info("===============================================================");
        LOG.info("Client IP is " + ipAddress);
        LOG.info("===============================================================");
        allowIpDTO.setIp(ipAddress);
        allowIpDTO.setToken(token);

        try {
            if (allowIpRepository.get(allowIpDTO) == null) {
                throw new UnauthorizedException(ipAddress + " is invalid");
            }
       	
        } catch (ApplicationException e) {
            throw new DatabaseRuntimeException("인증 권한 조회 중 실패가 발생하였습니다.");
        }
    }

    /**
     * 입력값 검증
     *
     * @param programkRequest the programk request
     */
    public void validationCheck(@RequestBody ProgramkRequest programkRequest) {
        if (programkRequest.getUser() == null || programkRequest.getUser().length() == 0) {
            throw new NotFoundUserException("user is null or user.length is zero");
        } else if (programkRequest.getChat() == null || programkRequest.getChat().length() == 0) {
            throw new NotFoundChatException("chat is null or chat.length is zero");
        } else if (programkRequest.getToken() == null || programkRequest.getToken().length() == 0) {
            throw new NotFoundTokenException("token is null or token.length is zero");
        }
    }

    /**
     * 서비스가 정상인지 확인한다.
     * 서비스가 작업 중이면 공지 내용을 리턴한다.
     *
     * @return
     */
    public NoticeDTO serviceStatus(){
        NoticeDTO dto = new NoticeDTO();
        dto.setActive("Y");

        NoticeDTO noticeDTO = null;
        try {
       		noticeDTO = noticeRepository.get(dto);
        } catch (ApplicationException e) {
            LOG.error("repository server error", e);
            throw new ApplicationRuntimeException(e);
        }

        return noticeDTO;
    }
}
