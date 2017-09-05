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
 * Seo Jong Hwa        2016 . 7 . 5
 */

package com.kt.programk.api;

import com.google.gson.Gson;
import com.kt.programk.common.wo.ProgramkResponse;
import com.kt.programk.common.wo.Urls;
import com.kt.programk.deploy.model.AimlLinkDTO;
import com.kt.programk.deploy.model.AimlRecommendDTO;
import com.kt.programk.deploy.model.AimlTemplate;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Administrator on 2016-07-05.
 */
public class RegexTest {
    private Gson gson = new Gson();

    @Test
    public void test(){
        String str = "{{\"image\":{\"title\":\"\",\"url\":\"http://m.product.olleh.com/storage/item/112/images/112_m_20150521132919.png\"},\"urls\":[{\"title\":\"\",\"url\":\"http://m.product.olleh.com/storage/item/112/images/112_m_20150521132919.png\"}],\"mpattterns\":[{\"replyInput\":\"입력예시\"}],\"recommends\":[{\"input\":\"소액결제\"}]}}안녕하세요. 고객님!\n" +
                "대화를 주고 받는 플러스 검색입니다.\n" +
                "원하는 것을 바로 입력하시거나 아래 메뉴에서 선택해주세요..1000000055";

        String tempStr = str;

        List<String> resultList = new ArrayList<>();

        Pattern regex = Pattern.compile("\\{\\{.*\\}\\}");
        Matcher regexMatcher = regex.matcher(str);

        while((regexMatcher.find())){
            resultList.add(regexMatcher.group());
        }

        List<AimlTemplate> aimlTemplates = new ArrayList<>();
        List<ProgramkResponse> programkResponses = new ArrayList<>();

        for(String data : resultList){
            String temp = data.substring(1, data.length()-1);
            aimlTemplates.add(gson.fromJson(temp, AimlTemplate.class));
        }


        for(AimlTemplate aimlTemplate : aimlTemplates){
            ArrayList<String> images = new ArrayList<>();
            ArrayList<Urls> urls = new ArrayList<>();
            ArrayList<String> responses = new ArrayList<>();

            if(aimlTemplate.getImage() != null && aimlTemplate.getImage().getUrl() != null && !"".equals(aimlTemplate.getImage().getUrl())){
                images.add(aimlTemplate.getImage().getUrl());
            }

            if(aimlTemplate.getUrls().size() > 0){
                for(AimlLinkDTO aimlLinkDTO : aimlTemplate.getUrls()){
                    if(aimlLinkDTO.getUrl() != null && !"".equals(aimlLinkDTO.getUrl())){
                        Urls url = new Urls();
                        url.setTitle(aimlLinkDTO.getTitle());
                        url.setUrl(aimlLinkDTO.getUrl());
                        urls.add(url);
                    }
                }
            }

            if(aimlTemplate.getRecommends() != null){
                for(AimlRecommendDTO aimlRecommendDTO : aimlTemplate.getRecommends()){
                    if(aimlRecommendDTO.getInput() != null && !"".equals(aimlRecommendDTO.getInput())){
                        responses.add(aimlRecommendDTO.getInput());
                    }
                }
            }

            ProgramkResponse response = new ProgramkResponse();
            tempStr = tempStr.replaceAll(regex.pattern(), "");
            tempStr = tempStr.replaceAll("[.][0-9]{10}$", "");
            response.setBody(tempStr);
            response.setImage(images.toArray(new String[0]));
            response.setResponses(responses.toArray(new String[0]));
            response.setUrls(urls.toArray(new Urls[0]));

            programkResponses.add(response);
        }

        System.out.println(gson.toJson(programkResponses));
    }
}
