package com.kt.programd.server.servlet;

import org.aitools.programd.Core;
import org.aitools.programd.bot.Bot;
import org.aitools.programd.bot.Bots;
import org.aitools.programd.util.DeveloperError;
import org.aitools.programd.util.XMLKit;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;


public class DialogServlet extends HttpServlet
{
    /** The Core object that will be used throughout. */
    protected Core core;
    
    private final String ANONYMOUS= "_ANONYMOUS_" ;
     
    /**
     * Gets the Core (should have already been initialized by a listener,
     * or whatever) and keeps a reference to it.
     *  
     * @see javax.servlet.GenericServlet#init()
     */
    @Override
    public void init()
    {
        this.core = (Core)getServletContext().getAttribute("core");
    }
    
    /**
     * Removes the reference to the Core, and removes it from the context
     * attributes.
     * 
     * @see javax.servlet.GenericServlet#destroy()
     */
    @Override
    public void destroy() 
    {
        getServletContext().removeAttribute("core");
        this.core = null;
    } 

    /**
     * Just passes to {@link #setupBot}.
     * @throws java.io.IOException
     * @throws ServletException
     * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
    	processDialog(req, resp, getBotId(req.getRequestURI()));
    }

    /**
     * Just passes to {@link #setupBot}.
     * @throws java.io.IOException
     * @throws ServletException
     * @see javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
        processDialog(req, resp, getBotId(req.getRequestURI()));
    }

    /**
     * Creates a {@link org.aitools.programd.bot.Bot Bot} object if necessary,
     * puts it in a session attribute, and forwards to a JSP page.
     *
     * @param req the request
     * @param resp the response
     * @throws ServletException
     * @throws java.io.IOException
     */
    protected void processDialog(HttpServletRequest req, HttpServletResponse resp, String BotId) throws ServletException, IOException
    {
        
        // Look for a userid.
        String userid = ANONYMOUS;
       
        // Get the bot parameter, if there is one.
        String botid = BotId;
  
        // We intend to wind up with some sort of Program D Bot object, one way or another.
        Bot programDBot = null;
        
        String command = new String(req.getParameter("command").getBytes("8859_1"),"utf-8"); 
        
        System.out.println("Command:" + command);
     
        boolean noBot = true;
        if (this.core != null)
        {
            Bots bots = this.core.getBots();
            if (bots != null && bots.getCount() > 0)
            {
            	try 
            	{
            		programDBot = bots.getBot(botid);
            		noBot = false;
            		//TODO
            		//입력된 boit아이디가 없을 경우 error 메시지 발생 or
            		//임의의 bot을 활용 하는 것이 나은지...
            	}
            	catch(DeveloperError e) 
            	{
            		programDBot = this.core.getBots().getABot();
                    if (programDBot != null)
                    {
                        botid = programDBot.getID();
                        noBot = false;
                    }
            	}
            }
        }
        if (noBot)
        {
        	renderMessage(new String[]{"Error: There are no instance"}, resp);
        }
             
        if (command != null && command.length() > 0)
        {
            renderMessage(XMLKit.filterViaHTMLTags(this.core.getResponse(command, userid, botid)), resp);
        }
    }
    
    protected void forward(String page, HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
        req.getRequestDispatcher(page).forward(req, resp);
    }
    

    private void renderMessage(String[] message, HttpServletResponse resp)
    {
    	StringBuffer strBuf = new StringBuffer();
    	
        for (int index = 0; index < message.length; index++)
        {
        	strBuf.append(XMLKit.filterWhitespace(message[index]));
        }
        
        resp.setContentType("text/html; charset=euc-kr");
  	    PrintWriter out = null;
  	    
	    try 
	    {
	    	out = resp.getWriter() ;
	    	out.write(strBuf.toString());
	    	out.flush();
	    	out.close();
	    } 
	    catch (IOException e) 
	    {
	    	e.printStackTrace();
	    }
    }

    private String getBotId(String requestURI) 
    {
    	return requestURI.replaceAll("/.+?/", "");
    }
    
}
