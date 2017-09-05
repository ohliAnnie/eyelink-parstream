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
import org.aitools.programd.processor.ProcessorException;

import java.net.URL;


/**
 * The type Substitutions watcher.
 */
public class PropertiesWatcher extends AbstractWatcher{

    /**
     * Creates a new AIMLWatcher using the given Graphmaster
     *
     * @param coreToUse the Core to use
     */
    public PropertiesWatcher(Core coreToUse) {
        super(coreToUse);
    }

    /**
     * Reloads AIML from a given path.
     *
     * @param path the path to reload
     */
    protected void reload(URL path) {
        this.logger.info(String.format("PropertiesWatcher reloading \"%s\".", path));
        this.core.reLoadProperties(path);
    }
}