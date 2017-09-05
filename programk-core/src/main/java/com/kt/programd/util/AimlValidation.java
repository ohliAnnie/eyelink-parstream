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
 * Seo Jong Hwa        2016 . 7 . 14
 */

package com.kt.programd.util;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import org.aitools.programd.parser.AIMLReaderK;
import org.aitools.programd.util.XMLKit;
import org.springframework.util.ResourceUtils;
import org.xml.sax.SAXException;

import javax.xml.parsers.SAXParser;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

/**
 * AIML Category가 이상이 없는지 검증
 */
public class AimlValidation {

    /**
     * 에러가 발생하면 예외를 발생시킨다.
     * @param categoryBody
     * @return
     * @throws IOException
     * @throws TemplateException
     * @throws SAXException
     */
    public boolean isValid(String categoryBody) throws IOException, TemplateException, SAXException {

        if(categoryBody == null || "".equals(categoryBody)){
            return false;
        }

        StringBuffer buffer = new StringBuffer();
        buffer.append(categoryBody + "\n");

        Map<String, Object> data = new HashMap<>();
        data.put("data", buffer.toString());

        Configuration cfg = new Configuration();
        cfg.setClassForTemplateLoading(this.getClass(), "/templates/");

        StringWriter stringWriter = new StringWriter();

        Template template = cfg.getTemplate("aiml.ftl");
        template.process(data, stringWriter);
        String str = stringWriter.toString();

        InputStream is = new ByteArrayInputStream(str.getBytes());

        SAXParser parser = XMLKit.getSAXParser(ResourceUtils.getURL("classpath:schema/AIML.xsd"), "AIML");
        AIMLReaderK reader = new AIMLReaderK("http://alicebot.org/2001/AIML-1.0.1");
        parser.parse(is, reader);


        return true;
    }
}
