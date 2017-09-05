/*
 *  Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
package com.kt.programk.cms.web.controller;

import com.kt.programk.common.utils.ConfigProperties;
import com.kt.programk.cms.domain.Sample;
import com.kt.programk.cms.web.object.SampleWO;
import com.kt.programk.cms.service.SampleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 샘플 컨트롤러
 */
@Controller
public class SampleController {

    /**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(SampleController.class);


    /**
     * CONFIG 파일 정보 .
     */

    @Autowired
    @Qualifier("config")
    private ConfigProperties config;

    /** The sample service. */
    @Autowired
    private SampleService sampleService;

    // - [ constructor methods ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // - [ interface methods ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // - [ protected methods ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // - [ public methods ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    /**
     * 샘플 상세 조회.
     *
     * @param sampleWO the sample wo
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/detailSample", method = RequestMethod.GET)
    public void detailSample(@ModelAttribute SampleWO sampleWO, ModelMap map, HttpServletRequest request)
    {

        Sample sample = new Sample();
        sample.setId(sampleWO.getId());


        Sample result = sampleService.findSample(sample);
        map.put("result", result);

        LOG.debug("/detailSample");
    }


    @RequestMapping(value = "/listSample", method = RequestMethod.GET)
    public void listSample(@ModelAttribute SampleWO sampleWO, ModelMap map, HttpServletRequest request)
    {

        List<Sample> result = sampleService.findListSample(sampleWO.getSample());
        map.put("results", result);

        LOG.debug("/listSample" );
    }


    /**
     * 샘플 등록 폼.
     *
     * @param map
     *            the map
     * @param request
     *            the request
     * @
     *             the exception
     */
    @RequestMapping(value = "/addSample", method = RequestMethod.GET)
    public void addSampleForm(@ModelAttribute SampleWO sampleWO, ModelMap map, HttpServletRequest request)
    {
        LOG.debug("/addSampleForm" );
    }

    /**
     * 샘플 등록.
     *
     * @param map
     *            the map
     * @param request
     *            the request
     * @
     *             the exception
     */
    @RequestMapping(value = "/addSample", method = RequestMethod.POST)
    public String addSample(@ModelAttribute SampleWO sampleWO, ModelMap map, HttpServletRequest request)  {
//        LOG.debug("/addSample " + JsonUtil.marshallingJsonWithPretty(sampleWO) );

        LOG.debug("==================" + sampleWO.getSample());

        sampleService.createSample(sampleWO.getSample());
        return "";
    }

    /**
     * 샘플 수정 폼.
     *
     * @param sampleWO the sample wo
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/editSample", method = RequestMethod.GET)
    public void editSampleForm(@ModelAttribute SampleWO sampleWO, ModelMap map, HttpServletRequest request)
    {
        LOG.debug("/editSample" );

        Sample sample = new Sample();
        sample.setId(sampleWO.getId());

        Sample result = sampleService.findSample(sample);
        map.put("result", result);
    }

    /**
     * 샘플 수정.
     *
     * @param sampleWO the sample wo
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/editSample", method = RequestMethod.POST)
    public void editSample(@ModelAttribute SampleWO sampleWO, ModelMap map, HttpServletRequest request)
    {
        LOG.debug("/editSample" );
        sampleService.modifySample(sampleWO.getSample());
    }


    /**
     * 사용자 유무 체크.
     *
     * @param sampleWO the sample wo
     * @param map the map
     * @param request the request
     * @return the string
     * @ the exception
     */
    @RequestMapping(value = "/isSample", method = RequestMethod.POST)
    @ResponseBody
    public String isSample(@ModelAttribute SampleWO sampleWO, ModelMap map, HttpServletRequest request)  {
        Sample result = sampleService.findSample(sampleWO.getSample());

        //사용자가 존재 할경우
        if (result != null) {
            sampleWO.setExist(true);;
        }

//        LOG.debug("/isSample " + JsonUtil.marshallingJson(sampleWO) );
//
//        return JsonUtil.marshallingJson(sampleWO);
        return "";
    }


    /**
     * 기타 샘플.
     *
     * @param sampleWO the sample wo
     * @param map the map
     * @param request the request
     * @ the exception
     */
    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public void test(@ModelAttribute SampleWO sampleWO, ModelMap map, HttpServletRequest request)
    {
        LOG.debug("/test" );
    }

    // - [ private methods ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // - [ static methods ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // - [ getter/setter methods ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // - [ main methods ] ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

}
