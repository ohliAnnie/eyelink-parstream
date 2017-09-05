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
 * Seo Jong Hwa        2016 . 6 . 27
 */

package com.kt.programk.deploy;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.kt.programk.common.domain.core.*;
import com.kt.programk.deploy.model.*;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by redpunk on 2016-06-27.
 */
public class AimlMakeTest{
    private Gson gson = new GsonBuilder().disableHtmlEscaping().create();

    @Test
    public void makeAimlTest(){
        AimlMain main = new AimlMain();
        main.setCateId(15);
        main.setId(1000000009);
        main.setInput("요금");
        main.setReply("요금제 정보입니다.");
        main.setThatId(1000000008);

        AimlImagesDTO images = new AimlImagesDTO();
        images.setUrl("http://m.product.olleh.com/mDic/productDetail.do?ItemCode=1105");

        List<AimlLinkDTO> aimlLinkList = new ArrayList<>();

        AimlLinkDTO one = new AimlLinkDTO();
        one.setTitle("올레닷컴메인");
        one.setUrl("https//m.olleh.com");

        AimlLinkDTO two = new AimlLinkDTO();
        two.setTitle("가입");
        two.setUrl("https//m.olleh.com");

        AimlLinkDTO three = new AimlLinkDTO();
        three.setTitle("해지");
        three.setUrl("https//m.olleh.com");

        aimlLinkList.add(one);
        aimlLinkList.add(two);
        aimlLinkList.add(three);

        AimlTest aimlTest = new AimlTest();
        aimlTest.setCateId(main.getCateId());
        aimlTest.setMainId(main.getId());
        aimlTest.setTestInput("한글 인식이 잘 되나요?");

        AimlRecommendDTO aimlRecommendOne = new AimlRecommendDTO();
        aimlRecommendOne.setInput("다음은 무엇을 해야 하나요1");

        AimlRecommendDTO aimlRecommendTwo = new AimlRecommendDTO();
        aimlRecommendTwo.setInput("다음은 무엇을 해야 하나요2");
        List<AimlRecommendDTO> aimlRecommends = new ArrayList<>();
        aimlRecommends.add(aimlRecommendOne);
        aimlRecommends.add(aimlRecommendTwo);


        AimlReplyDTO aimlReplyOne = new AimlReplyDTO();
        aimlReplyOne.setReplyInput("추가답변입니다1.");

        AimlReplyDTO aimlReplyTwo = new AimlReplyDTO();
        aimlReplyTwo.setReplyInput("추가답변입니다2.");
        List<AimlReplyDTO> aimlReplies = new ArrayList<>();
        aimlReplies.add(aimlReplyOne);
        aimlReplies.add(aimlReplyTwo);

        StringBuffer aiml = new StringBuffer();
        aiml.append("<category>\n");
        aiml.append("<pattern>" + main.getInput() + "</pattern>\n");
        if(main.getThatId() != 0){
            aiml.append("<that>" + main.getThatId() + "</that>\n");
        }

        aiml.append("<template>\n");

        AimlTemplate template = new AimlTemplate();
        template.setImage(images);
        template.setMpatterns(aimlReplies);
        template.setUrls(aimlLinkList);
        template.setRecommends(aimlRecommends);

        aiml.append(gson.toJson(template)+main.getReply() + "." + main.getId() + "\n");

        aiml.append("</template>\n");
        aiml.append("</category>\n");

        System.out.println(aiml.toString());
    }

    /**
     * Test javascript.
     */
    @Test
    public void testJavascript(){
        String str = "<javascript>dddddddddddddddddddd</javascript>";

        Pattern regex = Pattern.compile("(?i)<javascript>");
        Matcher regexMatcher = regex.matcher(str);

        System.out.println(regexMatcher.find());
    }

    /**
     * url에 <input index="1"/> 이 있으면 치환해 준다.
     */
    @Test
    public void testEscape(){
        String str = "http://10.220.175.129/search/MSH/MSH_A00/select?k=<input index=\"2\"/>";

        System.out.println(replaceInput(str));
    }

    private String replaceInput(String src){
        if(src == null || "".equals(src)){
            return src;
        }

        String temp = src;

        Pattern regex = Pattern.compile("(?i)<input index=\"[0-9]{1,3}\".*?/>");
        Matcher regexMatcher = regex.matcher(src);

        while(regexMatcher.find()){
            String find = regexMatcher.group();
            temp = temp.replaceAll(find, find.replaceAll("\"","'"));
        }

        return temp;
    }
}
