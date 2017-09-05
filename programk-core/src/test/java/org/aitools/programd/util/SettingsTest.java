

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

package org.aitools.programd.util;

import org.aitools.programd.CoreSettings;
import org.junit.Test;

import java.net.URL;

public class SettingsTest {

    @Test
    public void testInitialize() throws Exception {
        Settings settingsTwo = new CoreSettings(new URL("file:/EEProject/workspaces/programk-git/programk-core/src/main/resources/conf/core.xml"));

        System.out.println(settingsTwo.path);
        System.out.println(settingsTwo.properties.getProperty("programd.schema-location.AIML", "../resources/schema/AIML.xsd"));
        System.out.println(URLTools.contextualize(settingsTwo.path, settingsTwo.properties.getProperty("programd.schema-location.AIML", "../resources/schema/AIML.xsd")));
    }
}