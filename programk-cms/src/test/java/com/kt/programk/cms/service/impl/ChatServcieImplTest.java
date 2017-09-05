/*
 * Copyright (c) 2016 KT, Inc.
 * All right reserved.
 * This software is the confidential and proprietary information of KT
 * , Inc. You shall not disclose such Confidential Information and
 * shall use it only in accordance with the terms of the license agreement
 * you entered into with KT.
 *
 * Revision History
 * Author              Date                  Description
 * ------------------   --------------       ------------------
 * Seo Jong Hwa        2016 . 6 . 22
 */

package com.kt.programk.cms.service.impl;

import com.kt.programk.cms.service.ChatServcie;
import com.kt.programk.common.code.CategoryTopicType;
import com.kt.programk.common.code.CategoryType;
import com.kt.programk.common.domain.admin.Cp;
import com.kt.programk.common.domain.category.AimlCategory;
import com.kt.programk.common.domain.core.*;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:servlet-context.xml"})
public class ChatServcieImplTest {
    @Autowired
    private ChatServcie chatServcie;

    @Test
    public void selectTest() throws Exception {
        chatServcie.selectTest(60, "AutoBot-01", "redpunk");
    }

    @Test
    public void testCountAll() throws Exception {
    	AimlMain aimlMain = new AimlMain();
        chatServcie.countAll(aimlMain);
    }

    @Test
    public void testCountByCpId() throws Exception {
        chatServcie.countByCpId(10);
    }

    @Test
    public void testCountByCateName() throws Exception {
        chatServcie.countByCateName("TEST");
    }

    @Test
    public void testCreate() throws Exception {
        String reply = "Test case #05.<html:br/>\n" +
                "       <think><set name=\"test\">Test passed.</set></think>\n" +
                "       <get name=\"test\"/>\n" +
                "       <think><set name=\"test\">Test failed.</set></think>";
        //CP 정보
        Cp cp = new Cp();
        cp.setId(44);
        cp.setLabel("TestBot");

        AimlCategory aimlCategory = new AimlCategory();
        aimlCategory.setId(15);
        aimlCategory.setCpId(44);
        aimlCategory.setName("기본값");
        aimlCategory.setRestriction(CategoryType.USER.getValue());
        aimlCategory.setTopic(CategoryTopicType.NO.getValue());

        AimlMain aimlMain = new AimlMain();
        aimlMain.setCateId(15);
        aimlMain.setInput("TESTALTER");
        aimlMain.setReply(reply);
        aimlMain.setImageUrl(null);

        Assert.assertEquals(chatServcie.create(aimlMain), 1);
        Assert.assertTrue(aimlMain.getId() > 1000000000);

        AimlImages aimlImages = new AimlImages();
        aimlImages.setCateId(aimlMain.getCateId());
        aimlImages.setMainId(aimlMain.getId());
        aimlImages.setTitle("요금제 정보");
        aimlImages.setUrl("http://m.product.olleh.com/mDic/productDetail.do?ItemCode=1105");

        chatServcie.addImage(aimlMain);

        List<AimlLink> aimlLinkList = new ArrayList<>();

        AimlLink one = new AimlLink();
        one.setCateId(aimlMain.getCateId());
        one.setMainId(aimlMain.getId());
        one.setTitle("올레닷컴메인");
        one.setUrl("https//m.olleh.com");

        AimlLink two = new AimlLink();
        two.setCateId(aimlMain.getCateId());
        two.setMainId(aimlMain.getId());
        two.setTitle("가입");
        two.setUrl("https//m.olleh.com");

        AimlLink three = new AimlLink();
        three.setCateId(aimlMain.getCateId());
        three.setMainId(aimlMain.getId());
        three.setTitle("해지");
        three.setUrl("https//m.olleh.com");

        aimlLinkList.add(one);
        aimlLinkList.add(two);
        aimlLinkList.add(three);

        Assert.assertEquals(chatServcie.addLink(aimlLinkList), 3);

        AimlTest aimlTest = new AimlTest();
        aimlTest.setCateId(aimlMain.getCateId());
        aimlTest.setMainId(aimlMain.getId());
        aimlTest.setTestInput("한글 인식이 잘 되나요?");  

        chatServcie.addTest(aimlMain);

        AimlRecommend aimlRecommend = new AimlRecommend();
        aimlRecommend.setCateId(aimlMain.getCateId());
        aimlRecommend.setMainId(aimlMain.getId());
        aimlRecommend.setRecommendInput("다음은 무엇을 해야 하나요");

        chatServcie.addRecommend(aimlMain);
    }
}