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
 * Seo Jong Hwa        2016 . 6 . 28
 */

package com.kt.programk.cms;

import au.com.bytecode.opencsv.CSVReader;
import com.kt.programk.common.code.CategoryTopicType;
import com.kt.programk.common.code.CategoryType;
import com.kt.programk.common.code.EnabledType;
import com.kt.programk.common.domain.category.AimlCategory;
import com.kt.programk.common.domain.core.*;
import com.kt.programk.common.repository.category.AimlCategoryMapper;
import com.kt.programk.common.repository.core.*;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

/**
 * AIML CSV 파일 업로드
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context-root.xml"})
public class AimlUploadTest {
    /**
     * The Aiml category mapper.
     */
    @Autowired
    private AimlCategoryMapper aimlCategoryMapper;

    /**
     * The Aiml main mapper.
     */
    @Autowired
    private AimlMainMapper aimlMainMapper;

    /**
     * The Aiml test mapper.
     */
    @Autowired
    private AimlTestMapper aimlTestMapper;

    /**
     * The Aiml images mapper.
     */
    @Autowired
    private AimlImagesMapper aimlImagesMapper;

    /**
     * The Aiml recommend mapper.
     */
    @Autowired
    private AimlRecommendMapper aimlRecommendMapper;

    /**
     * The Aiml link mapper.
     */
    @Autowired
    private AimlLinkMapper aimlLinkMapper;

    /**
     * The Aiml reply mapper.
     */
    @Autowired
    private AimlReplyMapper aimlReplyMapper;

    /**
     * Test.
     *
     * @throws IOException the io exception
     */
    @Test
    public void test() throws IOException {
        CSVReader reader = new CSVReader(new FileReader("C:\\EEProject\\workspace\\programk-git\\programk-cms\\src\\main\\resources\\sample\\aiml.csv"));
        List<String[]> myEntries = reader.readAll();

        System.out.println(myEntries.size());

        int cpId = 60;

        HashMap<AimlMain, String> aimlMains = new HashMap<>();

        int count = 0;
        for (String arr[] : myEntries) {
            count++;
            //헤더
            if(count == 1) continue;

            //카테고리명
            String cateName = arr[0];
            //질문
            String input = arr[1];
            //검증샘플
            String test = arr[2];
            if(test != null){
                test = test.replaceAll("\n", "");
            }
            //답변
            String reply = arr[3];
            //이미지
            String image = arr[4];
            //that
            String that = arr[5];
            //추천질물
            String recommend = arr[6];
            if(recommend != null){
                recommend = recommend.replaceAll("\n", "");
            }
            //링크
            String link = arr[7];
            if(link != null){
                link = link.replaceAll("\n", "");
            }
            //추가답변
            String appendReply = arr[8];
            if(appendReply != null){
                appendReply.replaceAll("\n", "");
            }

            AimlMain aimlMain = createAimlMain(cpId, cateName, input, reply);
            createAimlTest(aimlMain, test);
            createAimlImage(aimlMain, image);
            createAimlRecommend(aimlMain, recommend);
            createAimlLink(aimlMain, link);
            createAimlReply(aimlMain, appendReply);

            if(that != null && !"".equals(that)) {
                aimlMains.put(aimlMain, that);
            }
        }

        //that을 생성한다.
        for( AimlMain key : aimlMains.keySet() ){
            System.out.println( String.format("키 : %s, 값 : %s", key, aimlMains.get(key)) );

            createAimlThat(key, aimlMains.get(key));
        }

    }

    /**
     * 추가 답변
     *
     * @param aimlMain    the aiml main
     * @param appendReply the append reply
     */
    private void createAimlReply(AimlMain aimlMain, String appendReply) {
        if (appendReply == null || "".equals(appendReply) || appendReply.length() == 0) {
            return;
        }

        String[] split = appendReply.split(";");

        for (int i = 0; i < split.length; i++) {
            AimlReply aimlReply = new AimlReply();
            aimlReply.setMainId(aimlMain.getId());
            aimlReply.setCateId(aimlMain.getCateId());
            aimlReply.setReplyInput(split[i]);

            aimlReplyMapper.insert(aimlReply);
        }
    }

    /**
     * 링크 생성
     *
     * @param aimlMain the aiml main
     * @param link     the link
     */
    private void createAimlLink(AimlMain aimlMain, String link) {
        if (link == null || "".equals(link) || link.length() == 0) {
            return;
        }
        String[] split = link.split(";");

        for (int i = 0; i < split.length; i++) {
            AimlLink aimlLink = new AimlLink();
            aimlLink.setMainId(aimlMain.getId());
            aimlLink.setCateId(aimlMain.getCateId());
            aimlLink.setUrl(split[i]);
            aimlLink.setTitle("");
            aimlLink.setComment("");

            aimlLinkMapper.insert(aimlLink);
        }
    }

    /**
     * 추천 질문 생성
     *
     * @param aimlMain  the aiml main
     * @param recommend the recommend
     */
    private void createAimlRecommend(AimlMain aimlMain, String recommend) {
        if (recommend == null || "".equals(recommend) || recommend.length() == 0) {
            return;
        }
        String[] split = recommend.split(";");

        for (int i = 0; i < split.length; i++) {
            AimlRecommend aimlRecommend = new AimlRecommend();
            aimlRecommend.setMainId(aimlMain.getId());
            aimlRecommend.setCateId(aimlMain.getCateId());
            aimlRecommend.setRecommendInput(split[i]);

            aimlRecommendMapper.insert(aimlRecommend);
        }

    }

    /**
     * 답변의 고유 아이를 넣는다.
     *
     * @param aimlMain the aiml main
     * @param that     the that
     */
    private void createAimlThat(AimlMain aimlMain, String that) {
        HashMap<String, Object> maps = new HashMap<>();
        maps.put("cateId", aimlMain.getCateId());
        maps.put("reply", that);
        maps.put("firstRecordIndex", 0);
        maps.put("recordCountPerPage",10);

        List<AimlMain> aimlMains = aimlMainMapper.selectListByReply(maps);

        if(aimlMains.size() > 0){
            aimlMain.setThatId(aimlMains.get(0).getId());
            aimlMainMapper.updateByPrimaryKeySelective(aimlMain);
        }

    }

    /**
     * 이미지 생성
     *
     * @param aimlMain the aiml main
     * @param image    the image
     */
    private void createAimlImage(AimlMain aimlMain, String image) {
        String trim;
        if(image == null || "".equals(image)){
            return;
        }else{
            trim = image.replaceAll(" ", "");
        }

        AimlImages images = new AimlImages();
        images.setMainId(aimlMain.getId());
        images.setCateId(aimlMain.getCateId());
        images.setTitle("");
        images.setUrl(trim);

        Assert.assertTrue(aimlImagesMapper.insert(images) == 1);
    }

    /**
     * 테스트 질문 생성
     *
     * @param aimlMain the aiml main
     * @param test     the test
     */
    private void createAimlTest(AimlMain aimlMain, String test) {
        AimlTest aimlTest = new AimlTest();
        aimlTest.setCateId(aimlMain.getCateId());
        aimlTest.setMainId(aimlMain.getId());

        String[] split = test.split(";");

        for(int i =0; i < split.length; i++){
            aimlTest.setTestInput(split[i]);
            int insert = aimlTestMapper.insert(aimlTest);
            Assert.assertTrue(insert == 1);
        }
    }

    /**
     * AIML 데이터를 생성한다.
     *
     * @param cpId     the cp id
     * @param cateName the cate name
     * @param input    the input
     * @param reply    the reply
     * @return the aiml main
     */
    private AimlMain createAimlMain(int cpId, String cateName, String input, String reply) {
        //카테고리가 없으면 생성한다.
        AimlCategory aimlCategory = new AimlCategory();
        aimlCategory.setCpId(cpId);
        aimlCategory.setName(cateName.trim());

        List<AimlCategory> aimlCategories = aimlCategoryMapper.selectListByName(aimlCategory);

        AimlMain main = new AimlMain();
        main.setInput(input);
        main.setReply(reply);
        main.setThatId(0);

        if (aimlCategories.size() == 0) {
            aimlCategory.setRestriction(CategoryType.USER.getValue());
            aimlCategory.setTopic(CategoryTopicType.YES.getValue());
            aimlCategory.setEnabled(EnabledType.ENABLE.getValue());
            aimlCategoryMapper.insert(aimlCategory);
            Assert.assertTrue(aimlCategory.getId() != 0);
            main.setCateId(aimlCategory.getId());
        } else {
            //첫번째 검색된 결과
            main.setCateId(aimlCategories.get(0).getId());
        }

        int insert = aimlMainMapper.insert(main);
        Assert.assertTrue(main.getId() > 0);

        return main;
    }
}

