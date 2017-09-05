

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
 * Seo Jong Hwa        2016 . 6 . 21
 */

package org.aitools.programd;

import org.junit.Test;
import org.springframework.util.ResourceUtils;

import java.io.FileNotFoundException;
import java.net.URL;

/**
 * Created by redpunk on 2016-05-27.
 */
public class ResourceUtilTest {
    @Test
    public void test() throws FileNotFoundException {
        URL url = ResourceUtils.getURL("classpath:conf/bots.xml");
        System.out.println(url);

        url = ResourceUtils.getURL("file:/C:\\EEProject\\workspaces\\programk-git\\programk-core\\lib\\log4j-1.2.13.jar");
        System.out.println(url);
    }

    @Test
    public void ascii(){
        System.out.println(Character.toString((char) 32));
    }
}
