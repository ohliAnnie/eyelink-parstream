/*
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version. You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */

package org.aitools.programd.processor.botconfiguration;

import org.aitools.programd.Core;
import org.aitools.programd.parser.BotsConfigurationFileParser;
import org.aitools.programd.processor.ProcessorException;
import org.aitools.programd.util.FileManager;
import org.aitools.programd.util.URLTools;
import org.w3c.dom.Element;

import java.net.URL;

/**
 */
public class PropertiesProcessor extends BotConfigurationElementProcessor {
    /**
     * The label (as required by the registration scheme).
     */
    public static final String label = "properties";

    /**
     * Creates a new PropertiesProcessor using the given Core.
     *
     * @param coreToUse the Core object to use
     */
    public PropertiesProcessor(Core coreToUse) {
        super(coreToUse);
    }

    /**
     * @see BotConfigurationElementProcessor#process(org.w3c.dom.Element,
     * org.aitools.programd.parser.BotsConfigurationFileParser)
     */
    @Override
    public String process(Element element, BotsConfigurationFileParser parser) throws ProcessorException {
        // Does it have an href attribute?
        if (element.hasAttribute(HREF)) {
            parser.verifyAndProcess(element.getAttribute(HREF));
        } else {
            parser.evaluate(element.getChildNodes());
        }

        /**
         * 2016-05-17
         * S.J.H
         * substitutions 태그도 watch 감시 항목에 넣자
         */
        if ("properties".equals(element.getNodeName()) && "".equals(element.getAttribute("href"))) {
            URL path = URLTools.contextualize(FileManager.getWorkingDirectory(), element.getOwnerDocument().getDocumentURI());
            //Bot에 substitutions 파일 위치를 지정한다.
            parser.getCore().getBot(parser.getCurrentBot().getID()).setPropertiesFiles(path);

            // Add it to the AIMLWatcher, if active.
            if (parser.getCore().getSettings().useWatcher()) {
                parser.getCore().getPropertiesWatcher().addWatchFile(path);
            }
        }
        return EMPTY_STRING;
    }
}