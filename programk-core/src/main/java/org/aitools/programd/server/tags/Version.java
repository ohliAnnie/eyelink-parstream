package org.aitools.programd.server.tags;

import org.aitools.programd.Core;

import javax.servlet.jsp.tagext.SimpleTagSupport;
import java.io.IOException;

/**
 * Provides the version of the engine via JSP.
 * 
 * @author <a href="mailto:noel@aitools.org">Noel Bush</a>
 */
public class Version extends SimpleTagSupport
{
    /**
     * @see javax.servlet.jsp.tagext.SimpleTagSupport#doTag()
     */
    @Override
    public void doTag() throws IOException
    {
        getJspContext().getOut().write(Core.VERSION + Core.BUILD);
    }
}
