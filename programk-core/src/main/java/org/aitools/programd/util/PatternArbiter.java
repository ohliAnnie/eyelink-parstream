/*
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version. You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */

package org.aitools.programd.util;

import com.kt.programd.util.AimlPatternTokenizer;
import org.apache.log4j.Logger;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.NoSuchElementException;
import java.util.StringTokenizer;
import java.util.regex.Pattern;


/**
 * Provides utility methods for pattern-oriented tasks.
 * 
 * @author <a href="mailto:noel@aitools.org">Noel Bush</a>
 * @since 4.1.3
 */
public class PatternArbiter
{   
	private static Logger logger = Logger.getLogger("programd");
	/*
	 * @author sspark, 2012.08.29 (ss.park@kt.com)
	 * edit AIML_PATTERN, NON_ALPHANUMERIC &  AIML.xsd(<xs:simpleType name="SimplePatternExpression"> ...</xs:simpleType>   
     *  The regular expression that defines AIML pattern syntax.   
     *  sspark 추가 : '가-힣\\+\\{\\}\\*_\\|\\(\\)'   
     */
    private static final Pattern SIMPLE_EXPRESSION_PATTERN = Pattern.compile("(\\*|_|\\{\\*\\}|\\{_\\}|[\\p{javaUpperCase}\\p{Digit}가-힣\\+\\{\\}\\|\\(\\)]+)( (\\*|_|\\{\\*\\}|\\{_\\}|[\\p{javaUpperCase}\\p{Digit}가-힣\\+\\{\\}\\|\\(\\)]+))*");
    
       /* 
     * The generic normalization regex that matches any nonalphanumeric. 
     */
    private static final Pattern NON_ALPHANUMERIC = Pattern.compile("[^\\p{javaUpperCase}\\p{javaLowerCase}\\p{javaWhitespace}\\p{Digit}가-힣 ]+");
    
    /* 조사,동사의 어미 등등 처리를 위함  */
    private static final String EXTRA_STRING = "([^ ]+)?";    
    
    private static final String EMPTY_STRING ="" ;
    
    private static final String SPACE =" " ;
    
    /**
     * Applies a generic set of normalizations to an input, to prepare it
     * for pattern matching.
     * 
     * @param string the input to normalize
     * @return the normalized input
     **/
    public static String genericallyNormalize(String string)
    {
    	try
    	{
    		return NON_ALPHANUMERIC.matcher(string).replaceAll(""); //sspark, " " -> ""으로 수정함.
    	}
    	catch (Exception e)
    	{
    		return string;
    	}
    }
    
    /**
     * Translates the given AIML pattern to a regular expression and
     * compiles it into a Pattern object.  Useful if you need to do a
     * ton of tests with a pattern.
     * 
     * @param pattern the pattern to compile
     * @param ignoreCase whether to ignore case in matching
     * @return the compiled pattern (translated to regex)
     *
     * @throws NotAnAIMLPatternException if the pattern is not a valid AIML
     *             pattern (conditioned by <code>ignoreCase</code>
     */
    public static Pattern compile(String pattern, boolean ignoreCase) throws Exception
    {
        /*
         * Check the pattern for validity. If it is invalid, an exception with a
         * helpful message will be thrown.
         */
        checkAIMLPattern(pattern);  //if error then throw NotAnAIMLPatternException()
        
        /**
         * @author sspark 2012.08.23  (ss.park@kt.com)
         * "ignoreCase=true" means Case_Insessitive...(?), so I correct this
         */
        pattern = pattern.trim().replaceAll("[ ]+", " ");  //모든 공백을 한개의 공백으로 조정
        pattern = pattern.replaceAll("\\+", EXTRA_STRING);  //'+' -> (.*?) 치환
        
        /*
         * aiml simple expression을 다중 처리하여 list로 변환함. 이를 '|'로서 구분하여 변환함.
         */
        ArrayList<String> patternList = AimlPatternTokenizer.getPatterns(pattern) ;
        StringBuilder sb = new StringBuilder();
        if(patternList.size() >1)
        {
	        for(String item: patternList) 
	        {
	        	if(!item.equalsIgnoreCase(EMPTY_STRING))
	        			sb.append("(").append(item).append(")").append("|");	
	        }
	        pattern = sb.deleteCharAt(sb.length()-1).toString() ;  //마지막 '|'를 제거
        }
        
        pattern = pattern.replaceAll("\\{", "(").replaceAll("\\}", ")?");  //sometoken{optionaltoken} -> sometoken(optionaltoken)?
        pattern = pattern.replaceAll("(\\*|_)", "[^ ]+( [^ ]+)*") ;  // '*' OR '_'를 치환
        
        return Pattern.compile(pattern,(ignoreCase ? Pattern.CASE_INSENSITIVE : 0));
    }
    
    /**
     * Decides whether a given pattern matches a given literal, in an isolated
     * context, according to the AIML pattern-matching specification.
     * 
     * Indicates whether the given literal is matched by the given pattern.
     * Note that the mechanism here is very simple: the AIML pattern is
     * converted into an equivalent regular expression, and a match test
     * is performed.  This appears to be much more reliable than an old
     * method that "manually" checked the match.
     * 
     * This method uses a generic normalization that removes all punctuation
     * from the input.
     * 
     * @param literal the literal string to check
     * @param pattern the pattern to try to match against it
     * @param ignoreCase whether or not to ignore case
     * @return <code>true</code> if <code>pattern</code> matches
     *         <code>literal</code>,<code>false</code> if not
     * @throws NotAnAIMLPatternException if the pattern is not a valid AIML
     *             pattern (conditioned by <code>ignoreCase</code>
     */
    public static boolean matches(String literal, String pattern, boolean ignoreCase) throws NotAnAIMLPatternException
    {
    	
    	/*
    	 * 상호 비교 대상인 두 String을 대문자로 변환 하여 비교한다.
    	 * 영어의 경우 대소문자의 차이를 두지 않는다. - sspark (ss.park@kt.com, 2012.11.05)
    	 */
    	Pattern regex =null;
    	try 
    	{
    		regex = compile(pattern.toUpperCase(), ignoreCase);
    	}
    	catch(Exception e)
    	{
    		throw new NotAnAIMLPatternException( e.getMessage() , pattern);
    	}
    	if (PatternArbiter.logger.isDebugEnabled())
        {
    		logger.debug("pattern: " + pattern + ", literal :" +literal );
        }
        return regex.matcher(genericallyNormalize(literal.toUpperCase())).matches();
    }
    
    /**
     * Determines whether a given string is a valid AIML pattern.
     * 
     * @param pattern the string to check
     * @throws NotAnAIMLPatternException with a helpful message if the pattern
     *             is not valid
     */
    public static void checkAIMLPattern(String pattern) throws NotAnAIMLPatternException
    {
    	if(pattern == null || pattern.equalsIgnoreCase(EMPTY_STRING) ) return ;
    	
        if (!SIMPLE_EXPRESSION_PATTERN.matcher(pattern).matches())
        {
            throw new NotAnAIMLPatternException("\"" + pattern + "\" does not match the definition of AIML pattern.", pattern);
        }
    }
    

    /**
     * For testing.
     * 
     * @param args not used
     */
    public static void main(String[] args)
    {
        BufferedReader console = new BufferedReader(new InputStreamReader(System.in));
        String literal = null;
        String pattern = null;
        boolean ignoreCase = false;
        boolean prediction = false;
        boolean matched;
        StringTokenizer tokenizer;

        int failures = 0;
        int successes = 0;

        console: while (true)
        {
            String theLine = null;
            try
            {
                theLine = console.readLine();
            }
            catch (IOException e)
            {
                System.out.println("Cannot read from console!");
                return;
            }
            if (theLine == null)
            {
                break;
            }
            if (theLine.toLowerCase().equals("exit"))
            {
                System.out.println("Exiting.");
                return;
            }
            if (!theLine.startsWith(";") && theLine.trim().length() > 0)
            {
                tokenizer = new StringTokenizer(theLine, "|");
                try
                {
                    literal = tokenizer.nextToken();
                    pattern = tokenizer.nextToken();
                    ignoreCase = tokenizer.nextToken().equals("y") ? true : false;
                    prediction = tokenizer.nextToken().equals("t") ? true : false;
                }
                catch (NoSuchElementException e)
                {
                    System.out.println("Improperly formatted input. Use: literal|PATTERN|(y/n)|(t/f)");
                    continue console;
                }

                long time = new Date().getTime();

                try
                {
                    matched = matches(literal, pattern, ignoreCase);
                }
                catch (NotAnAIMLPatternException e)
                {
                    System.out.println("Exception: " + e.getMessage());
                    matched = false;
                }
                time = new Date().getTime() - time;

                if (matched == prediction)
                {
                    successes++;
                    System.out.print("TEST PASSED] ");
                }
                else
                {
                    failures++;
                    System.out.print("TEST FAILED] ");
                }
                if (matched)
                {
                    System.out.print("match: " + literal + " | " + pattern + (ignoreCase ? " (ignoreCase)" : ""));
                }
                else
                {
                    System.out.print("no match: " + literal + " | " + pattern + (ignoreCase ? " (ignoreCase)" : ""));
                }
                System.out.println(" (" + time + " ms)");
            }
            else
            {
                System.out.println(theLine);
            }
        }
        System.out.println((successes + failures) + " tests: " + successes + " successes, " + failures + " failures");
    }
}