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

package org.aitools.programd;

import org.aitools.programd.parser.AIMLReaderK;
import org.aitools.programd.util.XMLKit;
import org.junit.Test;
import org.springframework.util.ResourceUtils;
import org.xml.sax.SAXException;

import javax.xml.parsers.SAXParser;
import java.io.IOException;

/**
 * Created by Administrator on 2016-07-14.
 */
public class SAXParserTest {
    @Test
    public void test() throws IOException, SAXException {
        System.out.println(ResourceUtils.getURL("classpath:schema/AIML.xsd"));
        SAXParser parser = XMLKit.getSAXParser(ResourceUtils.getURL("classpath:schema/AIML.xsd"), "AIML");
        AIMLReaderK reader = new AIMLReaderK("http://alicebot.org/2001/AIML-1.0.1");
        parser.parse(ResourceUtils.getURL("file:/var/AIML.aiml").toString(), reader);
    }
}
