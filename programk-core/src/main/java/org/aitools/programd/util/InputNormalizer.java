/*
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version. You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */

package org.aitools.programd.util;

import java.text.CharacterIterator;
import java.text.StringCharacterIterator;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.ListIterator;

/**
 * <code>InputNormalizer</code> replaces <code>Substituter</code> as the
 * utility class for performing various stages of <a
 * href="http://aitools.org/aiml/TR/2001/WD-aiml/#section-input-normalization">input
 * normalization </a>. Substitutions of other types are now handled
 * independently by their respective processors.
 * 
 * @since 4.1.3
 */
public class InputNormalizer
{
    // Convenience constants.

    /** An empty string. */
    private static final String EMPTY_STRING = "";

    /**
     * Splits an input into sentences, as defined by the
     * <code>sentenceSplitters</code>.
     * 
     * @param sentenceSplitters the sentence splitters to use
     * @param input the input to split
     * @return the input split into sentences
     */
    @SuppressWarnings("boxing")
    public static List<String> sentenceSplit(List<String> sentenceSplitters, String input)
    {
        if (input == null)
        {
            return null;
        }
        
        List<String> result = Collections.checkedList(new ArrayList<String>(), String.class);

        int inputLength = input.length();
        if (inputLength == 0)
        {
            result.add(EMPTY_STRING);
            return result;
        }

        // This will hold the indices of all splitters in the input.
        ArrayList<Integer> splitterIndices = new ArrayList<Integer>();

        // Iterate over all the splitters.
        for (String splitter : sentenceSplitters)
        {
            // Look for it in the input.
            int index = input.indexOf(splitter);

            // As long as it exists,
            while (index != -1)
            {
                // add its index to the list of indices.
                splitterIndices.add(new Integer(index));

                // and look for it again starting just after the discovered
                // index.
                index = input.indexOf(splitter, index + 1);
            }
        }
        if (splitterIndices.size() == 0)
        {
            result.add(input);
            return result;
        }

        // Sort the list of indices.
        Collections.sort(splitterIndices);

        // Iterate through the indices and remove (all previous of) consecutive
        // values.
        ListIterator<Integer> indices = splitterIndices.listIterator();
        int previousIndex = indices.next();
        while (indices.hasNext())
        {
            int nextIndex = indices.next();
            if (nextIndex == previousIndex + 1)
            {
                indices.previous();
                indices.previous();
                indices.remove();
            }
            previousIndex = nextIndex;
        }

        // Now iterate through the remaining indices and split sentences.
        indices = splitterIndices.listIterator();
        int startIndex = 0;
        int endIndex = inputLength - 1;
        while (indices.hasNext())
        {
            endIndex = indices.next();
            result.add(input.substring(startIndex, endIndex +1).trim());//@author sspark(ss.park@kt.com, 2012.11.14) from 'endIndex'에서 임시로 원복함
            startIndex = endIndex + 1;
            
        }

        // Add whatever remains.
        if (startIndex < inputLength - 1)
        {
            result.add(input.substring(startIndex).trim());
        }
        return result;
    }

    /**
     * <p>
     * Performs <a
     * href="http://aitools.org/aiml/TR/2001/WD-aiml/#section-pattern-fitting-normalizations">pattern-fitting
     * </a> normalization on an input.
     * </p>
     * <p>
     * This is best used to produce a caseless representation of the effective
     * match string when presenting match results to a user; however, if used
     * when actually performing the match it will result in the case of
     * wildcard-captured values being lost. Some amendment of the specification
     * is probably in order.
     * </p>
     * 
     * @param input the string to pattern-fit
     * @return the pattern-fitted input
     */
    public static String patternFit(String input)
    {
        // Remove all tags.
        input = XMLKit.removeMarkup(input);

        StringCharacterIterator iterator = new StringCharacterIterator(input);
        StringBuilder result = new StringBuilder(input.length());

        // Iterate over the input.
        for (char aChar = iterator.first(); aChar != CharacterIterator.DONE; aChar = iterator.next())
        {
            // Replace non-letters/digits with a space.
            if (!Character.isLetterOrDigit(aChar) && aChar != '*' && aChar != '_')
            {
                result.append(' ');
            }
            else
            {
                result.append(Character.toUpperCase(aChar));
            }
        }
        return result.toString();

    }

    /**
     * <p>
     * Performs a partial <a
     * href="http://aitools.org/aiml/TR/2001/WD-aiml/#section-pattern-fitting-normalizations">pattern-fitting
     * </a> normalization on an input -- partial because it does <i>not </i>
     * convert letters to uppercase.
     * </p>
     * <p>
     * This is used when sending patterns to the Graphmaster so that wildcard
     * contents can be captured and case retained. Some amendment of the
     * specification is probably in order.
     * </p>
     * 
     * @param input the string to pattern-fit
     * @return the pattern-fitted input
     */
    public static String patternFitIgnoreCase(String input)
    {
    	
        // Remove all tags.
        input = XMLKit.removeMarkup(input);

        StringCharacterIterator iterator = new StringCharacterIterator(input);
        StringBuilder result = new StringBuilder(input.length());

        // Iterate over the input.
        for (char aChar = iterator.first(); aChar != CharacterIterator.DONE; aChar = iterator.next())
        {
            // Replace non-letters/digits with a space.
            if (!Character.isLetterOrDigit(aChar))
            {
                result.append(' ');
            }
            else
            {
                result.append(Character.toUpperCase(aChar));
            }
        }
        /*
         * @author sspark(ss.park@kt.com, 2012.11.5) 
         * 특수 기호 등이  ' '으로 치환 되면서 '  '이 되는 등..이를 normalization한다.
         */
        return XMLKit.filterWhitespace(result.toString());   //sspark

    }
    
    
    
    /**
     * Splits an input into sentences, as defined by the
     * <code>nbestSplitter</code>.
     * 
     * @param nbestSplitter the splitter to use
     * @param input the nbest input to split
     * @return the input split into nbest sentences
     */
    @SuppressWarnings("boxing")
    public static List<String> nbestSplit(String nbestSplitter, String input)
    {
        if (input == null)
        {
            return null;
        }
        
        List<String> result = Collections.checkedList(new ArrayList<String>(), String.class);

        int inputLength = input.length();
        if (inputLength == 0)
        {
            result.add(EMPTY_STRING);
            return result;
        }

        // This will hold the indices of all splitters in the input.
        ArrayList<Integer> splitterIndices = new ArrayList<Integer>();

        // Iterate over all the splitters.
        // Look for it in the input.
        int index = input.indexOf(nbestSplitter);

        // As long as it exists,
        while (index != -1)
        {
            // add its index to the list of indices.
            splitterIndices.add(new Integer(index));

            // and look for it again starting just after the discovered
            // index.
            index = input.indexOf(nbestSplitter, index + 1);
        }
        if (splitterIndices.size() == 0)
        {
            result.add(input);
            return result;
        }

        // Sort the list of indices.
        Collections.sort(splitterIndices);

        // Iterate through the indices and remove (all previous of) consecutive
        // values.
        ListIterator<Integer> indices = splitterIndices.listIterator();
        int previousIndex = indices.next();
        while (indices.hasNext())
        {
            int nextIndex = indices.next();
            if (nextIndex == previousIndex + 1)
            {
                indices.previous();
                indices.previous();
                indices.remove();
            }
            previousIndex = nextIndex;
        }

        // Now iterate through the remaining indices and split sentences.
        indices = splitterIndices.listIterator();
        int startIndex = 0;
        int endIndex = inputLength - 1;
        while (indices.hasNext())
        {
            endIndex = indices.next();
            /*
             * @author sspark (ss.park@kt.com)
             * 문장의 splitter( ; 등)에 대해서 해당 splitter는 문장에서 제외 함.
             * n-best화 하는 기능 포함
             * 2012.09.20
             */
            result.add(input.substring(startIndex, endIndex).trim());
            startIndex = endIndex + 1;
        }

        // Add whatever remains.
        if (startIndex < inputLength - 1)
        {
            result.add(input.substring(startIndex).trim());
        }

        return result;
    }
    
    
    
}