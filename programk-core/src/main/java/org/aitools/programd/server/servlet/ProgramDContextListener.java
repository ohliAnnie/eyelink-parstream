/*
 * This program is copyright 2005 X-31 LLC.  It may not
 * be reproduced, distributed, or used without express
 * permission of the copyright holder.  All rights reserved.
 */

package org.aitools.programd.server.servlet;

import org.aitools.programd.Core;
import org.aitools.programd.util.URLTools;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.io.FileNotFoundException;
import java.net.URL;

/**
 * @author <a href="mailto:noel@x-31.com">Noel Bush</a>
 */
public class ProgramDContextListener implements ServletContextListener
{
    public static final String KEY_CORE = "core";
    
    public static final String PARAM_CORE_CONFIG = "programd-core-config";
    
    private ServletContext context = null;

    /**
     * @see javax.servlet.ServletContextListener#contextInitialized(javax.servlet.ServletContextEvent)
     */
    public void contextInitialized(ServletContextEvent sce)
    {
    	Object core = setupCore(sce.getServletContext()) ;
    	if(core !=null)
    		sce.getServletContext().setAttribute(KEY_CORE,(Core)core );
    	
    }

    /**
     * @see javax.servlet.ServletContextListener#contextDestroyed(javax.servlet.ServletContextEvent)
     */
    public void contextDestroyed(ServletContextEvent sce)
    {
        this.context = sce.getServletContext();
        if (this.context != null)
        {
        	/* ServletContext의 삭제 직전에 Core object의 shutdown() 
        	 * @author sspark 2012.10.22 (ss.park@kt.com)
        	 */
        	Object coreObj = this.context.getAttribute(KEY_CORE);
        	if(coreObj !=null)
        	{
        		Core core = (Core)coreObj;
        		if(core.getStatus() != Core.Status.SHUT_DOWN)
        			core.shutdown();
        		
        		this.context.removeAttribute(KEY_CORE);
        	}
        }
    }
    
    public static Core setupCore(ServletContext sce) 
    {
    	
    	ServletContext context = sce;

        context.log("Configuring Program D Core from servlet context listener.");
        
        // Check for the config parameter.
        String config = context.getInitParameter(PARAM_CORE_CONFIG);
        if (config == null || config.length() == 0)
        {
            context.log("No \"" + PARAM_CORE_CONFIG + "\" init-param specified for Program D.  Cannot continue.");
            return null;
        }
        
        // Create the base URL.
        URL baseURL = null;
        
        /**
         * @author sspark (ss.park@kt.com)
         * @author Seongsoo Park
         * @since  2012.09.05
         */
        try 
        {
        	//http://, file:/ 등의 url path로 기술 됨. 
        	//예)..file:/D:/program files/.../Dialog/
			//if (config.matches("^[a-z]+:/.*"))
            if (config.matches("^[a-z]+:.*")) {
                config = config.toLowerCase().replace("file:", "");
                baseURL = URLTools.createValidURL(config);
            }
            //Web application context 를 기준으로 path 를 기술
			//예:) WEB-INF/conf/core.xml -> {rootpath}/WEB-INF/conf/core.xml 으로 결정됨.
			else 
			{
				baseURL = URLTools.createValidURL(context.getRealPath("/") + config);
			}
		} 
        catch (FileNotFoundException e) 
        {
			context.log("Error when getting base URL!", e);
            return null;
		}

        /* Set up the Program D Core.
         * @author sspark 2012.08.29 (ss.park@kt.com)
         */
        //Core core = new Core(baseURL, URLTools.contextualize(baseURL, config));  //config = WEB-INF/conf/core.xml
        Core core = new Core(baseURL, baseURL);  //config = WEB-INF/conf/core.xml
		return core;
    }
    
}
