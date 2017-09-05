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

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kt.programk.cms.service.CpService;
import com.kt.programk.cms.service.VerifyDeployService;
import com.kt.programk.common.code.AimlFileType;
import com.kt.programk.common.code.BotFileActiveType;
import com.kt.programk.common.code.CategoryTopicType;
import com.kt.programk.common.code.CategoryType;
import com.kt.programk.common.code.EnabledType;
import com.kt.programk.common.domain.admin.AllowIp;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.domain.category.AimlCategory;
import com.kt.programk.common.domain.category.PredCategory;
import com.kt.programk.common.domain.category.PropCategory;
import com.kt.programk.common.domain.category.SubsCategory;
import com.kt.programk.common.domain.core.Bot;
import com.kt.programk.common.domain.core.BotFile;
import com.kt.programk.common.exception.ApplicationException;
import com.kt.programk.common.exception.BizCheckedException;
import com.kt.programk.common.exception.BizErrCode;
import com.kt.programk.common.exception.CommonCode;
import com.kt.programk.common.db.domain.AllowIpDTO;
import com.kt.programk.common.db.domain.BotDTO;
import com.kt.programk.common.data.repository.Repository;
import com.kt.programk.common.repository.admin.AllowIpMapper;
import com.kt.programk.common.repository.admin.CpMapper;
import com.kt.programk.common.repository.category.AimlCategoryMapper;
import com.kt.programk.common.repository.category.PredCategoryMapper;
import com.kt.programk.common.repository.category.PropCategoryMapper;
import com.kt.programk.common.repository.category.SubsCategoryMapper;
import com.kt.programk.common.repository.core.BotFileMapper;
import com.kt.programk.common.repository.core.BotMapper;
import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.common.utils.DbExceptionUtil;
import com.kt.programk.deploy.service.DeployService;

/**
 * CP 관리 서비스 구현
 */
@Service
public class CpServiceImpl implements CpService {	
    /**
     * The constant LOG.
     */
    public static final String ACTIVE_BOT = "-01";
    public static final String STANDBY_BOT = "-02";
    /**
     * The constant BOT_1_XML.
     */
    public static final String BOT_1_XML = ACTIVE_BOT + "-bot.aiml";
    /**
     * The constant BOT_2_XML.
     */
    public static final String BOT_2_XML = STANDBY_BOT + "-bot.aiml";
    /**
     * The constant SUBSTITUTIONS_1_XML.
     */
    public static final String SUBSTITUTIONS_1_XML = ACTIVE_BOT +"-substitutions.xml";
    /**
     * The constant SUBSTITUTIONS_1_XML1.
     */
    public static final String SUBSTITUTIONS_2_XML = STANDBY_BOT + "-substitutions.xml";

    /**
     * The constant PROPERTIES_1_XML.
     */
    public static final String PROPERTIES_1_XML = ACTIVE_BOT + "-properties.xml";
    /**
     * The constant PROPERTIES_2_XML.
     */
    public static final String PROPERTIES_2_XML = STANDBY_BOT + "-properties.xml";
    /**
     * The constant PREDICATES_1_XML.
     */
    public static final String PREDICATES_1_XML = ACTIVE_BOT + "-predicates.xml";
    /**
     * The constant PREDICATES_2_XML.
     */
    public static final String PREDICATES_2_XML = STANDBY_BOT + "-predicates.xml";
    /**
     * The constant CATEGORY_DEFAULT_NAME.
     */
    public static final String CATEGORY_DEFAULT_NAME = "기본값";

    /**
     * The Cp mapper.
     */
    @Autowired
    private CpMapper cpMapper;
    /**
     * The Bot mapper.
     */
    @Autowired
    private BotMapper botMapper;
    /**
     * The Bot file mapper.
     */
    @Autowired
    private BotFileMapper botFileMapper;

    /**
     * The Aiml category mapper.
     */
    @Autowired
    private AimlCategoryMapper aimlCategoryMapper;

    /**
     * The Subs category mapper.
     */
    @Autowired
    private SubsCategoryMapper subsCategoryMapper;

    /**
     * The Pred category mapper.
     */
    @Autowired
    private PredCategoryMapper predCategoryMapper;

    /**
     * The Prop category mapper.
     */
    @Autowired
    private PropCategoryMapper propCategoryMapper;
    
    /**
     * The AllowIp mapper.
     */
    @Autowired
    private AllowIpMapper allowipMapper;
    
    /**
     * The Config.
     */
    @Autowired
    private ConfigProperties config;
    
    /**
     * Actvie/Standby 변경
     */
    @Autowired
    private Repository botRepository;
    
    /**
     * Allow Ip 변경
     */
    @Autowired
    private Repository allowIpRepository;
    
    /** The VerifyDeploy service. */
    @Autowired
    private VerifyDeployService verifyDeployService;
    
    /** The deploy service. */
    @Autowired
    private DeployService deployService;


    /**
     * Count int.
     *
     * @param cp the cp
     * @return the int
     */
    @Override
    public int countAll(Cp cp) throws ApplicationException {
        try {
            return cpMapper.countByExample(cp);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        }
    }
    
    /**
     * Count int.
     *
     * @param cp the cp
     * @return the int
     */
    @Override
    public int countByLabel(Cp cp) throws ApplicationException {
        try {
            return cpMapper.countByLabel(cp);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        }
    }

    /**
     * Create int.
     *
     * @param cp the cp
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public int create(Cp cp) throws ApplicationException, BizCheckedException {
        if(cp == null){
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }

        if(cp.getLabel() == null
                || "".equals(cp.getLabel())
                || cp.getLabel().length() > Cp.MAX_LENGTH_LABEL
                || !(Pattern.matches("^[a-zA-Z0-9]*$", cp.getLabel()))){
            throw new BizCheckedException(BizErrCode.ERR_0006, "CP명");
        }
        
        if(cp.getUrl() == null
        		|| "".equals(cp.getUrl())
                || cp.getUrl().length() > Cp.MAX_LENGTH_URL){
            throw new BizCheckedException(BizErrCode.ERR_0006, "홈페이지 URL");
        }        
        
        if(cp.getHostIp() == null
                || "".equals(cp.getHostIp())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "호스트 IP");
        }
        
        if(cp.getDescription() != null && cp.getDescription().length() > Cp.MAX_LENGTH_DESCRIPTION){
            throw new BizCheckedException(BizErrCode.ERR_0006, "비고");
        }

        String uuid = UUID.randomUUID().toString().replace("-", "");
        cp.setToken(uuid);

        int insert = 0;
        try {
            insert = cpMapper.insert(cp);
        } catch (DataAccessException ex) {
            if (DbExceptionUtil.parseException(ex) == CommonCode.DUPLICATE_KEY_EXCEPTION) {
                throw new BizCheckedException(BizErrCode.ERR_0005, "CP명");
            } else {
                throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
            }
        }

        if (cp.getId() == 0) {
            throw new BizCheckedException(BizErrCode.ERR_0003, "ID");
        }
        
        createAllowIp(cp);	        
        createBot(cp);
        createAimlCategory(cp);
        createSubsCategory(cp);
        createPredCategory(cp);
        createPropCategory(cp);
        createBots(); //bots 파일

        return insert;
    }
    
    @Transactional
    private void createAllowIp(Cp cp) throws ApplicationException, BizCheckedException {   	
    	String hostIp = cp.getHostIp();
    	
    	try {   
    		if(hostIp != null){    			
    			AllowIp allowip = new AllowIp();
    			String[] tempArray = cp.getHostIp().split(",");
    			
    			allowip.setCpId(cp.getId());
    			allowipMapper.deleteByCpId(allowip);
    			
    			AllowIpDTO dto = new AllowIpDTO();
    			dto.setToken(cp.getToken());
          		allowIpRepository.deleteObj(dto);
    			
    			for(String temp : tempArray){
    				allowip.setCpId(cp.getId());
    				allowip.setHostIp(temp.trim());
    				allowip.setEnabled("Y");
    				allowipMapper.insert(allowip);
    			}
    		} 
    	}catch (DataAccessException ex){
          throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
    	}  
    }
    
    @Transactional
    private void createBot(Cp cp) throws ApplicationException, BizCheckedException {
        Bot botOne = new Bot();
        botOne.setActive(BotFileActiveType.ACTIVE.getValue());
        botOne.setSubLabel(cp.getLabel() + ACTIVE_BOT);
        botOne.setCpId(cp.getId());

        Bot botTwo = new Bot();
        botTwo.setActive(BotFileActiveType.STANDBY.getValue());
        botTwo.setSubLabel(cp.getLabel() + STANDBY_BOT);
        botTwo.setCpId(cp.getId());

        BotDTO dto = new BotDTO();        

        try{
            botMapper.insert(botOne);
            createBotFile(cp, botOne, BotFileActiveType.ACTIVE.getValue());
            dto.setActive(BotFileActiveType.ACTIVE.getValue());
            dto.setToken(cp.getToken());
            dto.setSubLabel(botOne.getSubLabel());
            botRepository.put(dto);
            
            botMapper.insert(botTwo);
            createBotFile(cp, botTwo, BotFileActiveType.STANDBY.getValue());
            dto.setActive(BotFileActiveType.STANDBY.getValue());
            dto.setToken(cp.getToken());
            dto.setSubLabel(botTwo.getSubLabel());
      		botRepository.put(dto);
            
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        }	
    }

    /**
     * Create prop category int.
     *
     * @param cp the cp
     * @return the int
     * @throws ApplicationException the application exception
     */
    private int createPropCategory(Cp cp) throws ApplicationException {
        PropCategory propCategory = new PropCategory();
        propCategory.setCpId(cp.getId());
        propCategory.setName(CATEGORY_DEFAULT_NAME);
        propCategory.setRestriction(CategoryType.USER.getValue());
        propCategory.setEnabled(EnabledType.ENABLE.getValue());

        try{
            return propCategoryMapper.insert(propCategory);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        }
    }

    /**
     * Create pred category int.
     *
     * @param cp the cp
     * @return the int
     * @throws ApplicationException the application exception
     */
    private int createPredCategory(Cp cp) throws ApplicationException {
        PredCategory predCategory = new PredCategory();
        predCategory.setCpId(cp.getId());
        predCategory.setName(CATEGORY_DEFAULT_NAME);
        predCategory.setRestriction(CategoryType.USER.getValue());
        predCategory.setEnabled(EnabledType.ENABLE.getValue());

        try{
            return predCategoryMapper.insert(predCategory);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex)));
        }
    }

    /**
     * Create subs category int.
     *
     * @param cp the cp
     * @return the int
     * @throws ApplicationException the application exception
     */
    private int createSubsCategory(Cp cp) throws ApplicationException {
        SubsCategory subsCategory = new SubsCategory();
        subsCategory.setCpId(cp.getId());
        subsCategory.setName(CATEGORY_DEFAULT_NAME);
        subsCategory.setRestriction(CategoryType.USER.getValue());
        subsCategory.setEnabled(EnabledType.ENABLE.getValue());

        int count = 0;

        try {
            count = subsCategoryMapper.insert(subsCategory);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }

        return count;
    }

    /**
     * Create aiml category int.
     *
     * @param cp the cp
     * @return the int
     * @throws ApplicationException the application exception
     */
    private int createAimlCategory(Cp cp) throws ApplicationException {
        AimlCategory aimlCategory = new AimlCategory();
        aimlCategory.setCpId(cp.getId());
        aimlCategory.setName(CATEGORY_DEFAULT_NAME);
        aimlCategory.setRestriction(CategoryType.USER.getValue());
        aimlCategory.setTopic(CategoryTopicType.NO.getValue());
        aimlCategory.setEnabled(EnabledType.ENABLE.getValue());

        int count = 0;

        try {
            count = aimlCategoryMapper.insert(aimlCategory);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }

        return count;
    }

    /**
     * 봇파일을 생성한다.
     *
     * @param cp the cp
     * @return int int
     * @throws ApplicationException the application exception
     */
    private int createBotFile(Cp cp, Bot bot, String active) throws ApplicationException, BizCheckedException {
        int count = 0;
        List<BotFile> botFiles = new ArrayList<>();

        BotFile aimlOne = new BotFile();
        aimlOne.setBotId(bot.getId());
        aimlOne.setFileName(cp.getLabel() + BOT_1_XML);
        aimlOne.setPath(config.getString("deploy.programk.path") + cp.getLabel());
        aimlOne.setFileType(AimlFileType.AIML.getValue());
        aimlOne.setLastLoaded(new Date());
        botFiles.add(aimlOne);

//        BotFile aimlTwo = new BotFile();
//        aimlOne.setBotId(bot.getId());
//        aimlTwo.setFileName(cp.getLabel() + BOT_2_XML);
//        aimlTwo.setPath(config.getString("deploy.programk.path") + cp.getLabel());
//        aimlTwo.setFileType(AimlFileType.AIML.getValue());
//        aimlTwo.setLastLoaded(new Date());
//        botFiles.add(aimlTwo);

        BotFile subsOne = new BotFile();
        subsOne.setBotId(bot.getId());
        subsOne.setFileName(cp.getLabel() + SUBSTITUTIONS_1_XML);
        subsOne.setPath(config.getString("deploy.programk.path")  + cp.getLabel());
        subsOne.setFileType(AimlFileType.SUBSTITUTIONS.getValue());
        subsOne.setLastLoaded(new Date());
        botFiles.add(subsOne);

//        BotFile subsTwo = new BotFile();
//        aimlOne.setBotId(bot.getId());
//        subsTwo.setFileName(cp.getLabel() + SUBSTITUTIONS_2_XML);
//        subsTwo.setPath(config.getString("deploy.programk.path")  + cp.getLabel());
//        subsTwo.setFileType(AimlFileType.SUBSTITUTIONS.getValue());
//        subsTwo.setLastLoaded(new Date());
//        botFiles.add(subsTwo);

        BotFile propOne = new BotFile();
        propOne.setBotId(bot.getId());
        propOne.setFileName(cp.getLabel() + PROPERTIES_1_XML);
        propOne.setPath(config.getString("deploy.programk.path")  + cp.getLabel());
        propOne.setFileType(AimlFileType.PROPERTIES.getValue());
        propOne.setLastLoaded(new Date());
        botFiles.add(propOne);

//        BotFile propTwo = new BotFile();
//        aimlOne.setBotId(bot.getId());
//        propTwo.setFileName(cp.getLabel() + PROPERTIES_2_XML);
//        propTwo.setPath(config.getString("deploy.programk.path") + cp.getLabel());
//        propTwo.setFileType(AimlFileType.PROPERTIES.getValue());
//        propTwo.setLastLoaded(new Date());
//        botFiles.add(propTwo);


        BotFile predOne = new BotFile();
        predOne.setBotId(bot.getId());
        predOne.setFileName(cp.getLabel() + PREDICATES_1_XML);
        predOne.setPath(config.getString("deploy.programk.path") + cp.getLabel());
        predOne.setFileType(AimlFileType.PREDICATES.getValue());
        predOne.setLastLoaded(new Date());
        botFiles.add(predOne);

//        BotFile predTwo = new BotFile();
//        aimlOne.setBotId(bot.getId());
//        predTwo.setFileName(cp.getLabel() + PREDICATES_2_XML);
//        predTwo.setPath(config.getString("deploy.programk.path") + cp.getLabel());
//        predTwo.setFileType(AimlFileType.PREDICATES.getValue());
//        predTwo.setLastLoaded(new Date());
//        botFiles.add(predTwo);

        if(BotFileActiveType.ACTIVE.getValue().equals(active)){
            aimlOne.setFileName(cp.getLabel() + BOT_1_XML);
            subsOne.setFileName(cp.getLabel() + SUBSTITUTIONS_1_XML);
            propOne.setFileName(cp.getLabel() + PROPERTIES_1_XML);
            predOne.setFileName(cp.getLabel() + PREDICATES_1_XML);
        }else{
            aimlOne.setFileName(cp.getLabel() + BOT_2_XML);
            subsOne.setFileName(cp.getLabel() + SUBSTITUTIONS_2_XML);
            propOne.setFileName(cp.getLabel() + PROPERTIES_2_XML);
            predOne.setFileName(cp.getLabel() + PREDICATES_2_XML);
        }

        try {
            for (BotFile botFile : botFiles) {
                count += botFileMapper.insert(botFile);
            }
        } catch (DataAccessException ex) {
            if (DbExceptionUtil.parseException(ex) == CommonCode.DUPLICATE_KEY_EXCEPTION) {
                throw new BizCheckedException(BizErrCode.ERR_0005, "fileName");
            } else {
                throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
            }
        }

        return count;
    }

    /**
     * Modify by id int.
     *
     * @param cp the cp
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    @Transactional
    public int modifyById(Cp cp) throws ApplicationException, BizCheckedException {
        if(cp == null){
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }

        if(cp.getUrl() == null
        		|| "".equals(cp.getUrl())
                || cp.getUrl().length() > Cp.MAX_LENGTH_URL){
            throw new BizCheckedException(BizErrCode.ERR_0006, "홈페이지 URL");
        }        
        
        if(cp.getHostIp() == null
                || "".equals(cp.getHostIp())){
            throw new BizCheckedException(BizErrCode.ERR_0006, "호스트 IP");
        }        
        
        if(cp.getDescription() != null && cp.getDescription().length() > Cp.MAX_LENGTH_DESCRIPTION){
            throw new BizCheckedException(BizErrCode.ERR_0006, "비고");
        } 

        if(cp.getId() == 0){
            throw new BizCheckedException(BizErrCode.ERR_0003, "ID");
        }

        int count = 0;
        try {
            count = cpMapper.updateByPrimaryKeySelective(cp);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        createAllowIp(cp);
        createBots(); //bots 파일
        
        return count;
    }
    
    /**
     * Modify by id int.
     *
     * @param cp the cp
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    public int modifyByEnabled(Cp cp) throws ApplicationException, BizCheckedException {
        if(cp == null){
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }     

        if(cp.getId() == 0){
            throw new BizCheckedException(BizErrCode.ERR_0003, "ID");
        }

        int count = 0;
        try {
            count = cpMapper.updateByPrimaryKeySelective(cp);
        } catch (DataAccessException ex) {
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
        
        return count;
    }

    /**
     * Find by id cp.
     *
     * @param id the id
     * @return the cp
     */
    @Override
    public Cp findById(int id) throws ApplicationException {
        Cp cp = new Cp();
        cp.setId(id);
        try {
            return cpMapper.selectByPrimaryKey(cp);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Find by label cp.
     *
     * @param label the label
     * @return the cp
     * @throws ApplicationException the application exception
     */
    @Override
    public Cp findByLabel(String label) throws ApplicationException, BizCheckedException {
        if (label == null) {
            throw new BizCheckedException(BizErrCode.ERR_0003, "CP명");
        }        
        
        try {
        	Cp cp = new Cp();
            cp.setLabel(label);
            return cpMapper.selectByLable(cp);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Find all list.
     *
     * @param cp                 the cp
     * @param currentPageNo      the current page no
     * @param recordCountPerPage the record count per page
     * @return the list
     */
    @Override
    public List<Cp> findListAll(Cp cp, int currentPageNo, int recordCountPerPage) throws ApplicationException {
        cp.setRecordCountPerPage(recordCountPerPage);
        cp.setFirstRecordIndex((currentPageNo - 1) * recordCountPerPage);
        
        try {
            return cpMapper.selectList(cp);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }
    
    /**
     * All list.
     *
     * @param cp                 the cp
     * @return the list
     */
    @Override
    public List<Cp> listAll(HttpSession session) throws ApplicationException {   
    	String cpGroup = "";
    	
    	//cp사용자일 경우만
    	CpUser userInfo = (CpUser) session.getAttribute("userInfo");
    	if("CPA".equals(userInfo.getAuth())){
    		cpGroup = userInfo.getCpGroup();
    	}
    	
        try {
        	Cp cp = new Cp();
        	cp.setCpGroup(cpGroup);
        	cp.setRecordCountPerPage(0);
        	cp.setFirstRecordIndex(0);
            return cpMapper.selectList(cp);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }

    /**
     * Remove int.
     *
     * @param cp the cp
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Override
    public int remove(Cp cp) throws ApplicationException, BizCheckedException {
        if(cp == null){
            throw new BizCheckedException(BizErrCode.ERR_0007, "");
        }

        if(cp.getId() == 0){
            throw new BizCheckedException(BizErrCode.ERR_0003, "ID");
        }

        try {
            return cpMapper.deleteByPrimaryKey(cp);
        }catch (DataAccessException ex){
            throw new ApplicationException(String.valueOf(DbExceptionUtil.parseException(ex).getNumber()));
        }
    }
    
    /**
     * bots.
     *
     * @param cp the cp
     * @return the int
     * @throws ApplicationException the application exception
     */
    @Transactional
    private void createBots() throws ApplicationException {
        //bots 파일 생성
        try {
        	verifyDeployService.deployBot();
		} catch (Exception e) {
			throw new ApplicationException("bots 파일 생성시 오류가 발생하였습니다. 오류:"+ e.getMessage());
		}
        
        //bots 리로드
        try {
			deployService.loadBots();
		} catch (Exception e) {
			throw new ApplicationException("bots 리로드시 오류가 발생하였습니다. 오류:"+ e.getMessage());
		}
    }
}
