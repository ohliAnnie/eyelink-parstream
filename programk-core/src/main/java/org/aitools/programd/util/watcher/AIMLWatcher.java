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
 * Seo Jong Hwa        2016 . 7 . 1
 */

/*
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version. You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */

package org.aitools.programd.util.watcher;

import org.aitools.programd.Core;
import org.aitools.programd.util.URLTools;
import org.apache.log4j.Logger;

import java.io.IOException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Watches a set of AIML files. Any file changes will be loaded automatically.
 *
 * @author Jon Baer
 * @author <a href="mailto:noel@aitools.org">Noel Bush</a>
 * @version 4.6
 */
public class AIMLWatcher extends AbstractWatcher {

    /**
     * Creates a new AIMLWatcher using the given Graphmaster
     *
     * @param coreToUse the Core to use
     */
    public AIMLWatcher(Core coreToUse) {
        super(coreToUse);
    }

    /**
     * Reloads AIML from a given path.
     *
     * @param path the path to reload
     */
    @Override
    protected void reload(URL path) {
        this.logger.info(String.format("AIMLWatcher reloading \"%s\".", path));
        this.core.reload(path);
    }

}