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

/*
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version. You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */

package org.aitools.programd.parser;

import org.aitools.programd.bot.Bot;
import org.aitools.programd.graph.Graphmaster;
import org.aitools.programd.util.XMLKit;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;
import org.xml.sax.ext.DefaultHandler2;

import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 검증용 s.j.h
 */
public class AIMLReaderK extends DefaultHandler2
{
    private String defaultNamespaceURI;

//    private Graphmaster graphmaster;

    private URL path;

//    private String botid;
//
//    private Bot bot;

    /*
     * Constants used in multiple pattern delimeter.
     */

    /** The start of a tag marker. */
    private static final String MARKER_PATTERN_DELIMETER = "<PATTERN>";

    private static final String MATCHED_START_MARKER ="<think><set name =\"_matched\">" ;  //<template> 에서 <get name="_matched"/>로 조회
    private static final String MATCHED_END_MARKER ="</set></think>" ;

    /*
     * Constants used in parsing.
     */

    /** The start of a tag marker. */
    private static final String MARKER_START = "<";

    /** The end of a tag marker. */
    private static final String MARKER_END = ">";

    /** An empty string. */
    private static final String EMPTY_STRING = "";

    private static final String OPEN_TEMPLATE_START_TAG = "<template xmlns=\"";

    private static final String QUOTE_MARKER_END = "\">";

    /** A slash. */
    private static final String SLASH = "/";

    /** End of a template element. */
    private static final String TEMPLATE_END_TAG = "</template>";

    /** The system line separator. */
    protected static final String LINE_SEPARATOR = System.getProperty("line.separator");

    /** The string &quot;{@value}&quot;. */
    private static final String PATTERN = "pattern";

    /** The string &quot;{@value}&quot;. */
    private static final String BOT = "bot";

    /** The string &quot;{@value}&quot;. */
    private static final String THAT = "that";

    /** The string &quot;{@value}&quot;. */
    private static final String TOPIC = "topic";

    /** The string &quot;{@value}&quot;. */
    private static final String TEMPLATE = "template";

    /** The wildcard (&quot;*&quot;). */
    private static final String WILDCARD = "*";

    /** The string &quot;{@value}&quot;. */
    private static final String NAME = "name";

    /** The most recently collected &lt;pattern&gt;&lt;/pattern&gt; contents. */
    private StringBuilder patternBuffer;

    /** The most recently collected &lt;that&gt;&lt;/that&gt; contents. */
    private StringBuilder thatBuffer;

    /** The most recently collected &lt;template&gt;&lt;/template&gt; contents. */
    private StringBuilder templateBuffer;

    /** A pointer to the current buffer. */
    private StringBuilder currentBuffer;

    /** The finalized &lt;pattern&gt;&lt;/pattern&gt; contents. */
    private String pattern;

    /** The finalized &lt;that&gt;&lt;/that&gt; contents. */
    private String that;

    /** The finalized &lt;topic&gt;&lt;/topic&gt; contents. */
    private String topic;

    /** The finalized &lt;template&gt;&lt;/template&gt; contents. */
    private String template;

    /** The start of a template element. */
    private String templateStartTag;

    /**
     * Creates a new AIMLReader.
     *
     * @param defaultNamespaceURIToUse the namespace URI to use when none other
     *            is specified (?)
     */
    public AIMLReaderK(String defaultNamespaceURIToUse)
    {
        this.defaultNamespaceURI = defaultNamespaceURIToUse;
        this.templateStartTag = OPEN_TEMPLATE_START_TAG + defaultNamespaceURIToUse + QUOTE_MARKER_END;
        this.topic = WILDCARD;
    }

    /**
     * @see org.xml.sax.ContentHandler#characters(char[], int, int)
     */
    @Override
    public void characters(char[] ch, int start, int length)
    {
        if (this.currentBuffer != null)
        {
            this.currentBuffer.append(XMLKit.escapeXMLChars(ch, start, length));
        }
    }

    /**
     * @see DefaultHandler2#startCDATA()
     */
    @Override
    public void startCDATA()
    {
        assert this.currentBuffer != null : "Got CDATA start outside of a known element!";
        this.currentBuffer.append(XMLKit.CDATA_START);
    }

    /**
     * @see DefaultHandler2#endCDATA()
     */
    @Override
    public void endCDATA()
    {
        assert this.currentBuffer != null : "Got CDATA end outside of a known element!";
        this.currentBuffer.append(XMLKit.CDATA_END);
    }

    /**
     * @see org.xml.sax.ContentHandler#startElement(String,
     *      String, String, Attributes)
     */
    @Override
    public void startElement(String uri, String localName, String qName, Attributes attributes)
    {
        String elementName;
        if (localName.equals(EMPTY_STRING))
        {
            elementName = qName;
        }
        else
        {
            elementName = localName;
        }
        if (elementName.equals(PATTERN))
        {
            this.currentBuffer = this.patternBuffer = new StringBuilder();
        }
        else if (elementName.equals(BOT) && this.currentBuffer != null && this.currentBuffer == this.patternBuffer)
        {
            // Insert the value of the given bot predicate (no warning if doesn't exist!).
//            this.patternBuffer.append(this.bot.getPropertyValue(attributes.getValue(NAME)));
        }
        //that에서도 bot property를 사용하도록 허용함(by sspark, 2013.01.28)
        else if (elementName.equals(BOT) && this.currentBuffer != null && this.currentBuffer == this.thatBuffer)
        {
            // Insert the value of the given bot predicate (no warning if doesn't exist!).
//            this.thatBuffer.append(this.bot.getPropertyValue(attributes.getValue(NAME)));
        }
        else if (elementName.equals(THAT) && this.currentBuffer == null || this.currentBuffer != this.templateBuffer)
        {
            this.currentBuffer = this.thatBuffer = new StringBuilder();
        }
        else if (elementName.equals(TEMPLATE))
        {
            this.currentBuffer = this.templateBuffer = new StringBuilder();
        }
        else if (this.currentBuffer != null && this.currentBuffer == this.templateBuffer)
        {
            /* We don't want to parse the template into
             * some big memory structure, since it may never be used. So
             * we just reconstitute the XML text for later
             * processing.
             */
            this.templateBuffer.append(XMLKit.renderStartTag(elementName, attributes, !uri.equals(this.defaultNamespaceURI), uri));
        }
        else if (elementName.equals(TOPIC))
        {
            // We don't check that it's valid, because it's supposed to have been schema-validated already!
            this.topic = attributes.getValue(NAME);
        }
    }

    /**
     * @see org.xml.sax.ContentHandler#endElement(String,
     *      String, String)
     */
    @Override
    public void endElement(@SuppressWarnings("unused") String uri, String localName, String qName)
    {
        String elementName;
        if (localName.equals(EMPTY_STRING))
        {
            elementName = qName;
        }
        else
        {
            elementName = localName;
        }
        /**
         * pattern tag의 종료 시점을 찾기 위해서 "elementName.equals(PATTERN)" 조건을 추가함.
         * @author sspark (ss.park@kt.com)
         * @author Seongsoo Park
         * @since 2012.09.07
         */
        if (elementName.equals(PATTERN) && this.currentBuffer != null && this.currentBuffer == this.patternBuffer)
        {
            String patternExpr = botSubstitution(this.patternBuffer.toString());
        	if(this.pattern != null)
        		this.pattern += MARKER_PATTERN_DELIMETER + patternExpr;
        	else
        		this.pattern = patternExpr ;

            this.currentBuffer = null;
        }
        else if (this.currentBuffer != null && this.currentBuffer == this.thatBuffer)
        {
            this.that = botSubstitution(this.thatBuffer.toString());
            this.currentBuffer = null;
        }
        else if (elementName.equals(TEMPLATE))
        {
            // Whitespace-normalize the template contents.
            this.template = this.templateStartTag + this.templateBuffer.toString() + TEMPLATE_END_TAG;
            // Finally, deliver the newly defined category to the Graphmaster.
            //this.graphmaster.addCategory(this.pattern, this.that, this.topic, this.template, this.botid, this.bot, this.path);
//            addCategories(this.pattern, this.that, this.topic, this.template, this.botid, this.bot, this.path) ;
            // Reset the pattern, that and template.
            this.pattern = this.that = this.template = null;
            this.currentBuffer = this.patternBuffer = this.thatBuffer = this.templateBuffer = null;
        }
        else if (this.currentBuffer != null && this.currentBuffer == this.templateBuffer)
        {
            // See if we are ending an empty element.
            boolean makeClosingTag = true;

            // Get the template length (just once).
            int templateLength = this.templateBuffer.length();
            // If the last char of the template string is a '>',
            if (this.templateBuffer.substring(templateLength - 1).equals(MARKER_END))
            {
                // and if the next to last char is *not* a '/',
                if (!this.templateBuffer.substring(templateLength - 2, templateLength - 1).equals(SLASH))
                {
                    // then if the name of the last tag is the same as this one,
                    // this is an empty element.
                    int lastMarkerStart = this.templateBuffer.lastIndexOf(MARKER_START);
                    if (this.templateBuffer.indexOf(elementName, lastMarkerStart) == lastMarkerStart + 1)
                    {
                        // So just insert a '/' before the '>'.
                        this.templateBuffer.insert(templateLength - 1, '/');
                        makeClosingTag = false;
                    }
                }
            }
            // Otherwise, make a closing tag.
            if (makeClosingTag)
            {
                this.templateBuffer.append(MARKER_START);
                this.templateBuffer.append('/' + elementName);
                this.templateBuffer.append(MARKER_END);
            }
        }
        else if (elementName.equals(TOPIC))
        {
            this.topic = WILDCARD;
        }
    }

    /**
     * Creates new categories for multiple patterns.
     * @author sspark (2013.03.12 , ss.park@kt.com)
     *
     * @param untouchedPattern the category's patterns(multiple patterns)
     * @param that the category's that
     * @param topic the category's topic
     * @param template the category's template
     * @param botid the bot id for whom to add the category
     * @param bot the bot for whom the category is being added
     * @param source the path from which the category comes
     */
    private void addCategories(String untouchedPattern, String that, String topic, String template,
    		  String botid, Bot bot, URL source)
    {
    	int  matchedIndex  = 1 ;

    	String strMatchedIndex ="" ;
    	String indexedTemplate = "" ;

    	String patterns[] = untouchedPattern.split(MARKER_PATTERN_DELIMETER) ;
    	for(String patt : patterns )
    	{
    		strMatchedIndex = MATCHED_START_MARKER + matchedIndex++ + MATCHED_END_MARKER ;
    		indexedTemplate = this.templateStartTag + strMatchedIndex + template.replace(this.templateStartTag, "");
    	}
    }


    /**
     * @see org.xml.sax.helpers.DefaultHandler#error(SAXParseException)
     */
    @Override
    public void error(SAXParseException e) throws SAXException
    {
        throw e;
    }
    
    
    private String botSubstitution(String expression)
    {
    	
    	if(!expression.contains("$"))
    		return expression;
    	
 	   String patternTofind = "\\$[^ ]+" ;  // 
	  
 	   Pattern pattern =Pattern.compile(patternTofind);
 	   Matcher match = pattern.matcher(expression);
 	   String found, ret= expression;
 	   
 	   while(match.find()) 
 	   { 
 		   found = match.group();  
// 		   ret = ret.replace(found, this.bot.getPropertyValue(found.substring(1)));
 	   }
       
 	   return ret;
    	
    }
/**
    private String mergeProperties(String properties)
    {
    	
    	String[] splitedProperties = properties.split("\\|");
    	String result="";
    	
    	 //1. +가 있으면 지운다.
    	 //2. |로 합친다. 
    	 //3. )|(로 된 것들을 |으로 치환한다. 
    	 
    	boolean plusFlag = false; 
    	for(String property: splitedProperties)
    	{
    		if(property.contains("+"))
    		{
    			plusFlag=true;break;
    		}
    	}
    	return "";
    }
   */ 
}