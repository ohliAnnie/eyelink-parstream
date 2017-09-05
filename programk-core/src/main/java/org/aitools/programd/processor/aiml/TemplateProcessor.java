/*
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version. You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */

package org.aitools.programd.processor.aiml;

import org.aitools.programd.Core;
import org.aitools.programd.parser.TemplateParser;
import org.aitools.programd.processor.ProcessorException;
import org.aitools.programd.util.XMLKit;
import org.w3c.dom.Element;

/**
 * Handles a
 * <code><a href="http://aitools.org/aiml/TR/2001/WD-aiml/#section-think">template</a></code>
 * element.
 * 
 * @version 4.5
 * @author <a href="mailto:noel@aitools.org">Noel Bush</a>
 */
public class TemplateProcessor extends AIMLProcessor
{
    /** The label (as required by the registration scheme). */
    public static final String label = "template";

    /**
     * Creates a new TemplateProcessor using the given Core.
     * 
     * @param coreToUse the Core object to use
     */
    public TemplateProcessor(Core coreToUse)
    {
        super(coreToUse);
    }

    /**
     * @see AIMLProcessor#process(org.w3c.dom.Element, TemplateParser)
     */
    @Override
    public String process(Element element, TemplateParser parser) throws ProcessorException
    {
    	/*
    	 * @author sspark(ss.park@kt.com, 2012.11.03) 
    	 * <template>노드 결과값에 대해서 space normalization한다.(XMLKit.filterWhitespace)
    	 */
        return XMLKit.filterWhitespace(parser.evaluate(element.getChildNodes()));
    }
}