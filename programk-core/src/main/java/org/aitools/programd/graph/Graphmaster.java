/*
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version. You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */

package org.aitools.programd.graph;

import com.google.gson.Gson;
import com.kt.programd.util.AimlPatternTokenizer;
import org.aitools.programd.Core;
import org.aitools.programd.CoreSettings;
import org.aitools.programd.bot.Bot;
import org.aitools.programd.processor.aiml.RandomProcessor;
import org.aitools.programd.util.DeveloperError;
import org.aitools.programd.util.StringKit;
import org.aitools.programd.util.XMLKit;
import org.apache.log4j.Logger;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.net.URL;
import java.util.*;
import java.util.regex.Pattern;

/**
 * <p>
 * The <code>Graphmaster</code> is the &quot;brain&quot; of a Program D bot.
 * It consists of a collection of nodes called <code>Nodemapper</code>s.
 * These <code>Nodemapper</code> s map the branches from each node. The
 * branches are either single words or wildcards.
 * </p>
 * <p>
 * The root of the <code>Graphmaster</code> is a <code>Nodemapper</code>
 * with many branches, one for each of the first words of all the patterns. The
 * number of leaf nodes in the graph is equal to the number of categories, and
 * each leaf node contains the &lt;template&gt; tag.
 * </p>
 *
 * @author Richard Wallace, Jon Baer
 * @author Thomas Ringate/Pedro Colla
 * @author <a href="mailto:noel@aitools.org">Noel Bush</a>
 * @author Eion Robb
 * @version 4.6
 */
public class Graphmaster {
    // Public access convenience constants.

    /**
     * A template marker.
     */
    public static final String TEMPLATE = "<TEMPLATE>";//"<template>";

    /**
     * A that marker.
     */
    public static final String THAT = "<THAT>"; //<that>";

    /**
     * A topic marker.
     */
    public static final String TOPIC = "<TOPIC>";//<topic>";

    /**
     * A botid marker.
     */
    public static final String BOTID = "<BOTID>";//<botid>";

    /**
     * A filename marker.
     */
    public static final String FILENAME = "<FILENAME>";//"<filename>";

    /**
     * The <code>*</code> wildcard.
     */
    public static final String ASTERISK = "*";

    /**
     * The <code>_</code> wildcard.
     */
    public static final String UNDERSCORE = "_";

    /**
     * A path separator.
     */
    public static final String PATH_SEPARATOR = ":";

    // Private convenience constants.

    /**
     * An empty string.
     */
    private static final String EMPTY_STRING = "";

    /**
     * The start of a marker.
     */
    private static final String MARKER_START = "<";

    /**
     * A space.
     */
    private static final String SPACE = " ";

    /**
     * Match states.
     */
    private static enum MatchState {
        /**
         * Trying to match the input part of the path.
         */
        IN_INPUT,

        /**
         * Trying to match the that part of the path.
         */
        IN_THAT,

        /**
         * Trying to match the topic part of the path.
         */
        IN_TOPIC,

        /**
         * Trying to match the botid part of the path.
         */
        IN_BOTID
    }

    // Instance variables.

    /**
     * The Core with which this Graphmaster is associated.
     */
    protected Core core;

    /**
     * The logger.
     */
    private Logger logger = Logger.getLogger("programd");

    /**
     * The match logger.
     */
    private Logger matchLogger = Logger.getLogger("programd.matching");

    /**
     * The factory that will be used to create Nodemappers.
     */
    protected NodemapperFactory nodemapperFactory;

    /**
     * The root {@link NodemapperFactory} .
     */
    protected Nodemapper root;

    /**
     * A map of loaded file URLs to botids.
     */
    protected Map<URL, Set<String>> urlCatalog = new HashMap<URL, Set<String>>();

    /**
     * A map of KB URLs to &lt;BOTID&gt; nodes.
     */
    protected Map<URL, Set<Nodemapper>> botidNodes = new HashMap<URL, Set<Nodemapper>>();

    /**
     * The merge policy.
     */
    private CoreSettings.MergePolicy mergePolicy;

    /**
     * The separator string to use with the "append" merge policy.
     */
    private String mergeAppendSeparator;

    /**
     * Whether to note each merge.
     */
    private boolean noteEachMerge;

    /**
     * The AIML namespace URI in use.
     */
    private String aimlNamespaceURI;

    /**
     * How frequently to provide a category load count.
     */
    private int categoryLoadNotifyInterval;

    /**
     * The total number of categories read.
     */
    private int totalCategories = 0;

    /**
     * The total number of path-identical categories that have been encountered.
     */
    private int duplicateCategories = 0;

    /**
     * The response timeout.
     */
    protected int responseTimeout;

    /**
     * A count of Nodemappers.
     */
    protected int nodemapperCount = 1;

    /**
     * A running average of Nodemapper size.
     */
    protected float averageNodemapperSize;


    /*
     * @author sspark, 2012.08.29 (ss.park@kt.com)
     * AIML parsing하여 node를 생성시 각 노드의 token의 가능한 expression을 정의
     * 단, < >는 내부<BOTID>,<TEMPLATE>,<TOPIC>등 처리를 위해 허용함.
     */
    private static final Pattern NON_AIML_EXPRESSION_PATTERN = Pattern.compile("([^\\p{javaUpperCase}\\p{javaLowerCase}\\p{Digit}가-힣\\+\\{\\}\\*_\\|\\(\\) ]+)");

    /**
     * 디버깅용
     */
    private Gson gson = new Gson();

    //StringKit 에서 wordsplit()에서 실행
    //matching시에 input,that,topic에 대해서 실행
    public static String normalizeAIMLExpression(String string) {
        if (string == null || string.equalsIgnoreCase(EMPTY_STRING))
            return string;

        return NON_AIML_EXPRESSION_PATTERN.matcher(string).replaceAll(SPACE);
    }

    /**
     * Creates a new Graphmaster, reading settings from
     * the given Core.
     *
     * @param coreToUse the CoreSettings object from which to read settings
     */
    public Graphmaster(Core coreToUse) {
        this.core = coreToUse;
        CoreSettings settings = this.core.getSettings();
        this.nodemapperFactory = new NodemapperFactory(settings.getNodemapperImplementation());
        this.root = this.nodemapperFactory.getNodemapper();
        this.mergePolicy = settings.getMergePolicy();
        this.mergeAppendSeparator = settings.getMergeAppendSeparatorString();
        this.noteEachMerge = settings.mergeNoteEach();
        this.responseTimeout = settings.getResponseTimeout();
        this.categoryLoadNotifyInterval = settings.getCategoryLoadNotifyInterval();
        this.aimlNamespaceURI = settings.getAimlSchemaNamespaceUri().toString();
    }


    /**
     * Adds a new pattern-that-topic path to the <code>Graphmaster</code>
     * root.
     *
     * @param pattern &lt;pattern/&gt; path component
     * @param that    &lt;that/&gt; path component
     * @param topic   &lt;topic/&gt; path component
     * @param botid
     * @param source  the source of this path
     * @return <code>Nodemapper</code> which is the result of adding the path.
     */
    public Nodemapper add(String pattern, String that, String topic, String botid, URL source) {

    	/*
    	 * @author sspark(ss.park@kt.com, 2012.11.10)
    	 * <pattern>,<that>,<topic>에 포함된 Expression에 대해 Normalization 한다.
    	 * ','  ,  ':' 등의 기호가 ' '로 변환됨.	 */
        pattern = normalizeAIMLExpression(pattern);
        that = normalizeAIMLExpression(that);
        topic = normalizeAIMLExpression(topic);

        ArrayList<String> path = StringKit.wordSplit(pattern);
        path.add(THAT);
        path.addAll(StringKit.wordSplit(that));
        path.add(TOPIC);
        path.addAll(StringKit.wordSplit(topic));
        path.add(BOTID);
        path.add(botid);

        return add(path.listIterator(), this.root, source);
    }

    /**
     * Adds a new path to the <code>Graphmaster</code> at a given node.
     *
     * @param pathIterator an iterator over the List containing the elements of
     *                     the path
     * @param parent       the <code>Nodemapper</code> parent to which the child
     *                     should be appended
     * @param source       the source of the original path
     * @return <code>Nodemapper</code> which is the result of adding the node
     * @since 4.1.3
     */
    private Nodemapper add(ListIterator<String> pathIterator, Nodemapper parent, URL source) {
        // If there are no more words in the path, return the parent node
        if (!pathIterator.hasNext()) {
            parent.setTop();
            return parent;
        }
        // Otherwise, get the next word.
        String word = pathIterator.next();

        Nodemapper node;

        // If the parent contains this word, get the node with the word.
        if (parent.containsKey(word)) {
            node = (Nodemapper) parent.get(word);
        } else {
            // Otherwise create a new node with this word.
            node = this.nodemapperFactory.getNodemapper();
            this.nodemapperCount++;

            parent.put(word, node);
            node.setParent(parent);
        }
        // Associate <BOTID> nodes with their sources.
        if (word.equals(BOTID)) {
            Set<Nodemapper> nodes;
            if (this.botidNodes.containsKey(source)) {
                nodes = this.botidNodes.get(source);
            } else {
                nodes = new HashSet<Nodemapper>();
                this.botidNodes.put(source, nodes);
            }
            nodes.add(node);
        }
        // Return the result of adding the new node to the parent.
        return add(pathIterator, node, source);
    }

    /**
     * Removes a node, as well as many of its ancestors as have no descendants
     * other than this node or its ancestors.
     *
     * @param nodemapper the mapper for the node to remove
     */
    private void remove(Nodemapper nodemapper) {
        Nodemapper parent = nodemapper.getParent();
        if (parent != null) {
            parent.remove(nodemapper);
            if (parent.size() == 0) {
                if (parent != this.root) {
                    remove(parent);
                }
            }
        }
        nodemapper = null;
    }

    /**
     * <p>
     * Searches for a match in the <code>Graphmaster</code> to a given path.
     * </p>
     * <p>
     * This is a high-level prototype, used for external access. It is not
     * synchronized!
     * </p>
     *
     * @param input &lt;input/&gt; path component
     * @param that  &lt;that/&gt; path component
     * @param topic &lt;topic/&gt; path component
     * @param botid &lt;botid/&gt; path component
     * @return the resulting <code>Match</code> object
     * @throws org.aitools.programd.util.NoMatchException if no match was found
     * @see #match(Nodemapper, Nodemapper, java.util.List, String, StringBuilder,
     * org.aitools.programd.graph.Graphmaster.MatchState, long)
     */
    public Match match(String input, String that, String topic, String botid, List<Match> matches)
    //throws NoMatchException
    {
        // Compose the input path. Fill in asterisks for empty values.
        ArrayList<String> inputPath;

        // Input text part.
        if (input.length() > 0) {
            inputPath = StringKit.wordSplit(input);
        } else {
            inputPath = new ArrayList<String>();
            inputPath.add(ASTERISK);
        }

        // <that> marker.
        inputPath.add(THAT);

        // Input <that> part.
        if (that.length() > 0) {
            inputPath.addAll(StringKit.wordSplit(that));
        } else {
            inputPath.add(ASTERISK);
        }

        // <topic> marker.
        inputPath.add(TOPIC);

        // Input <topic> part.
        if (topic.length() > 0) {
            inputPath.addAll(StringKit.wordSplit(topic));
        } else {
            inputPath.add(ASTERISK);
        }

        // <botid> marker.
        inputPath.add(BOTID);

        // Input [directed to] botid.
        inputPath.add(botid);

        // Get the match, starting at the root, with an empty star and path,
        // starting in "in input" mode.
        Match match = match(this.root, this.root, inputPath, EMPTY_STRING, new StringBuilder(),
                MatchState.IN_INPUT, System.currentTimeMillis() + this.responseTimeout);

        /**
         * Trace S.J.H
         */
        if(match != null && matches != null) {
            matches.add(match);
        }
        return match;
        /* edit by sspark(2013.04)
        // Return it if not null; throw an exception if null.
        if (match != null)
        {
            return match;
        }
        // (otherwise...)
        throw new NoMatchException(input);
        */
    }


    /**
     * <p>
     * Searches for a match in the <code>Graphmaster</code> to a given path.
     * </p>
     * <p>
     * This is a low-level prototype, used for internal recursion.
     * </p>
     *
     * @param nodemapper      the nodemapper where we start matching
     * @param parent          the parent of the nodemapper where we start matching
     * @param input           the input path (possibly a sublist of the original)
     * @param wildcardContent contents absorbed by a wildcard
     * @param path            the path matched so far
     * @param matchState      state variable tracking which part of the path we're in
     * @param expiration      when this response process expires
     * @return the resulting <code>Match</code> object
     * @see #match(String, String, String, String)
     */
    @SuppressWarnings("boxing")
    private Match match(Nodemapper nodemapper, Nodemapper parent, List<String> input,
                        String wildcardContent, StringBuilder path, MatchState matchState, long expiration) {

        // Return null if expiration has been reached.
        if (System.currentTimeMillis() >= expiration) {
            //무한루프
            //return null;
        }

        // Halt matching if this node is higher than the length of the input.
        if (input.size() < nodemapper.getHeight()) {
            if (this.matchLogger.isDebugEnabled()) {
                this.matchLogger.debug(String.format("Halting match because input size %d < nodemapper height %d.%ninput: %s%nnodemapper: %s",
                        input.size(), nodemapper.getHeight(), input.toString(), nodemapper.toString()));
            }
            return null;
        }

        // The match object that will be returned.
        Match match;

        // If no more tokens in the input, see if this is a template.
        if (input.size() == 0) {
            // If so, the path
            // component is the botid.
            if (nodemapper.containsKey(TEMPLATE)) {
                match = new Match();
                match.setBotID(path.toString());
                match.setNodemapper(nodemapper);
                return match;
            }
            // (otherwise...)
            return null;
        }

        // Take the first word of the input as the head.
        String head = input.get(0).trim();

        // Take the rest as the tail.
        List<String> tail = input.subList(1, input.size());

        
        /*
         * @author Seongsoo Park (sspark)
         * @since  2012.09.05 
         * @author ss.park@kt.com
         * 
         * input token과 <pattern>의 각 토큰의 비교 순서
         * phase 1. _ 과 비교
         * phase 2. input의 토큰에 대해서 <pattern>내 _(underscore) or *(asterisk)이 아닌 토큰과 비교
         * phase 3. * 과 비교
         * 
         *  ** pattern의 토큰과 입력된  토큰 패턴 매칭이 먼저 이뤄져 Rule정의가 보다 정교 해짐
         *  ** 기존은 phsae 3 -> phase 1 -> phase 2이 두번째 순서였음.
         */
        
        
        
        /*
         * phase  UNDERSCORE. 
         * 
         * See if this nodemapper has a _ wildcard. _ comes first in the AIML
         * "alphabet".
         */
        if (nodemapper.containsKey(UNDERSCORE)) {
            // If so, construct a new path from the current path plus a _
            // wildcard.
            StringBuilder newPath = new StringBuilder();
            synchronized (newPath) {
                if (path.length() > 0) {
                    newPath.append(path);
                    newPath.append(' ');
                }
                newPath.append('_');
            }

            // Try to get a match with the tail and this new path, using the
            // head as the wildcard content.

            match = match((Nodemapper) nodemapper.get(UNDERSCORE), nodemapper, tail, head, newPath,
                    matchState, expiration);

            // If that did result in a match,
            if (match != null) {
                // capture and push the wildcard content appropriate to the
                // current
                // match state.
                switch (matchState) {
                    case IN_INPUT:
                        if (wildcardContent.length() > 0) {
                            match.pushInputWildcardContent(wildcardContent);
                        }
                        break;

                    case IN_THAT:
                        if (wildcardContent.length() > 0) {
                            match.pushThatWildcardContent(wildcardContent);
                        }
                        break;

                    case IN_TOPIC:
                        if (wildcardContent.length() > 0) {
                            match.pushTopicWildcardContent(wildcardContent);
                        }
                        break;

                    case IN_BOTID:
                        assert false;
                        break;
                }
                // ...and return this match.
                return match;
            }


        }
        /* phase UNDERSCORE -- end  */

        
        /* 
         * phase Normal TOKEN.
         * 
         * The nodemapper may have contained a _, but this led to no match. Or
         * it didn't contain a _ at all.
         */
        if (((NonOptimalNodemaster) nodemapper).containsKeyList(head)) {
            /*
             * Check now whether this head is a marker for the <that>, <topic>
             * or <botid> segments of the path. If it is, set the match state
             * variable accordingly.
             */
            if (head.startsWith(MARKER_START)) {
                if (head.equals(THAT)) {
                    matchState = MatchState.IN_THAT;
                } else if (head.equals(TOPIC)) {
                    matchState = MatchState.IN_TOPIC;
                } else if (head.equals(BOTID)) {
                    matchState = MatchState.IN_BOTID;
                }

                match = match((Nodemapper) nodemapper.get(head), nodemapper, tail, EMPTY_STRING,
                        new StringBuilder(), matchState, expiration);

                // If that did result in a match,
                if (match != null) {
                    // capture and push the star content appropriate to the
                    // *previous* match state.
                    switch (matchState) {
                        case IN_THAT:
                            if (wildcardContent.length() > 0) {
                                match.pushInputWildcardContent(wildcardContent);
                            }
                            // Remember the pattern segment of the matched path.
                            match.setPattern(path.toString());
                            break;

                        case IN_TOPIC:
                            if (wildcardContent.length() > 0) {
                                match.pushThatWildcardContent(wildcardContent);
                            }
                            // Remember the that segment of the matched path.
                            match.setThat(path.toString());
                            break;

                        case IN_BOTID:
                            if (wildcardContent.length() > 0) {
                                match.pushTopicWildcardContent(wildcardContent);
                            }
                            // Remember the topic segment of the matched path.
                            match.setTopic(path.toString());
                            break;

                        case IN_INPUT:
                            assert false;
                            break;
                    }
                    // ...and return this match.
                    return match;
                }
                //}
            }
            /*
             * In the case that the nodemapper contained the head, but the head
             * was not a marker, it must be that the head is a regular word. So
             * try to match the rest of the path.
             */
            else {
                // Construct a new path from the current path plus the head.
                StringBuilder newPath = new StringBuilder();
                synchronized (newPath) {
                    if (path.length() > 0) {
                        newPath.append(path);
                        newPath.append(' ');
                    }
                    newPath.append(head);
                }

                match = match((Nodemapper) (((NonOptimalNodemaster) nodemapper).getList(head)), nodemapper, tail, wildcardContent,
                        newPath, matchState, expiration);
                if (match != null) return match;


            }
        }
        /* phase TOKEN -- end  */
        
        
        /*
         * phase ASTERISK.
         * 
         * The nodemapper may have contained the head, but this led to no match.
         * Or it didn't contain the head at all. In any case, check to see if it
         * contains a * wildcard. * comes last in the AIML "alphabet".
         */
        if (nodemapper.containsKey(ASTERISK)) {
            // If so, construct a new path from the current path plus a *
            // wildcard.
            StringBuilder newPath = new StringBuilder();
            synchronized (newPath) {
                if (path.length() > 0) {
                    newPath.append(path);
                    newPath.append(' ');
                }
                newPath.append('*');
            }


            // Try to get a match with the tail and this new path, using the
            // head as the star.
            match = match((Nodemapper) nodemapper.get(ASTERISK), nodemapper, tail, head, newPath,
                    matchState, expiration);

            // If that did result in a match,
            if (match != null) {
                // capture and push the star content appropriate to the current
                // match state.
                switch (matchState) {
                    case IN_INPUT:
                        if (wildcardContent.length() > 0) {
                            match.pushInputWildcardContent(wildcardContent);
                        }
                        break;

                    case IN_THAT:
                        if (wildcardContent.length() > 0) {
                            match.pushThatWildcardContent(wildcardContent);
                        }
                        break;

                    case IN_TOPIC:
                        if (wildcardContent.length() > 0) {
                            match.pushTopicWildcardContent(wildcardContent);
                        }
                        break;

                    case IN_BOTID:
                        assert false;
                        break;
                }
                // ...and return this match.
                return match;
            }

        }
        /* phase ASTERISK -- end  */
        
        
        
        
        /*
         * The nodemapper has failed to match at all: it contains neither _, nor
         * the head, nor *. However, if it itself is a wildcard, then the match
         * continues to be valid and can proceed with the tail, the current
         * path, and the star content plus the head as the new star.
         */
        //if (nodemapper.equals(parent.get(ASTERISK)) || nodemapper.equals(parent.get(UNDERSCORE)))
        if (nodemapper.equals(parent.get(ASTERISK)) || nodemapper.equals(parent.get(UNDERSCORE))) {
            return match(nodemapper, parent, tail, wildcardContent + SPACE + head, path,
                    matchState, expiration);
        }

        /*
         * If we get here, we've hit a dead end; this null match will be passed
         * back up the recursive chain of matches, perhaps even hitting the
         * high-level match method (which will react by throwing a
         * NoMatchException), though this is assumed to be the rarest occurence.
         */
        return null;
    }

    /**
     * @param pattern  the category's pattern
     * @param that     the category's that
     * @param topic    the category's topic
     * @param template the category's template
     * @param botid    the bot id for whom to add the category
     * @param bot      the bot for whom the category is being added
     * @param source   the path from which the category comes
     * @author sspark (2012.11.01, ss.park@kt.com)
     * <pattern>나는 {옵션} 이다</pattern>
     * { } 옵션으로 된 category를 별도로 분리하여 category를 임의로 생성한다.
     */
    @SuppressWarnings("boxing")
    public void addCategory(String pattern, String that, String topic, String template,
                            String botid, Bot bot, URL source) {
    	/*
    	 * pattern이 Empty string인 경우 category node를 생성하지 않는다.
    	 */
        if (pattern.equalsIgnoreCase(EMPTY_STRING))
            return;


        //pattern의 옵션({}) 토큰을 찾아 list로 구성
        ArrayList<String> patternList = AimlPatternTokenizer.getPatterns(pattern);
        for (String patternItem : patternList) {
            if (!patternItem.equalsIgnoreCase(EMPTY_STRING)) {
                //that의 옵션({}) 토큰을 찾아 list로 구성
                ArrayList<String> thatList = AimlPatternTokenizer.getPatterns(that);
                for (String thatItem : thatList) {
                    //topic의 옵션({}) 토큰을 찾아 list로 구성
                    ArrayList<String> topicList = AimlPatternTokenizer.getPatterns(topic);
                    for (String topicItem : topicList) {
                        addCategorySub(patternItem, thatItem, topicItem, template, botid, bot, source);
                    }
                }
            }
        }
    }

    /**
     * Adds a new category to the Graphmaster.
     *
     * @param pattern  the category's pattern
     * @param that     the category's that
     * @param topic    the category's topic
     * @param template the category's template
     * @param botid    the bot id for whom to add the category
     * @param bot      the bot for whom the category is being added
     * @param source   the path from which the category comes
     *                 <p/>
     *                 == 원래의 addCategory()임. ==
     */
    @SuppressWarnings("boxing")
    public void addCategorySub(String pattern, String that, String topic, String template,
                               String botid, Bot bot, URL source) {
        // Make sure the path components are right.
        if (pattern == null || pattern.equals(EMPTY_STRING)) {
            pattern = ASTERISK;
        }
        if (that == null || pattern.equals(EMPTY_STRING)) {
            that = ASTERISK;
        }
        if (topic == null || pattern.equals(EMPTY_STRING)) {
            topic = ASTERISK;
        }

        if (this.totalCategories % this.categoryLoadNotifyInterval == 0 && this.totalCategories > 0) {
            this.logger.info(String.format("%,d categories loaded so far.", this.totalCategories));
        }

        Nodemapper node = add(pattern, that, topic, botid, source);
        String storedTemplate = (String) node.get(TEMPLATE);
        if (storedTemplate == null) {
            node.put(FILENAME, source.toExternalForm());
            bot.addToPathMap(source, node);
            node.put(TEMPLATE, template);
            this.totalCategories++;
        } else {
            /**
             * TODO
             * 동일한 pattern path인 경우 경고 처리.
             * @author sspark (ss.park@kt.com)
             * @author Seongsoo Park
             * @since 2012.09.07
             */
            this.logger.warn(String.format("path-identical category is \"%s\" in \"%s\"", pattern, source.toExternalForm()));
            /***/

            this.duplicateCategories++;
            switch (this.mergePolicy) {
                case SKIP:
                    if (this.noteEachMerge) {
                        this.logger.warn(String.format("Skipping path-identical category from \"%s\" which duplicates path of category from \"%s\": %s:%s:%s",
                                source.toExternalForm(), node.get(FILENAME), pattern, that, topic));
                    }
                    break;

                case OVERWRITE:
                    if (this.noteEachMerge) {
                        this.logger.warn(String.format("Overwriting path-identical category from \"%s\" with new category from \"%s\".  Path: %s:%s:%s",
                                node.get(Graphmaster.FILENAME), source.toExternalForm(), pattern, that, topic));
                    }
                    node.put(Graphmaster.FILENAME, source.toExternalForm());
                    node.put(Graphmaster.TEMPLATE, template);
                    break;

                case APPEND:
                    if (this.noteEachMerge) {
                        this.logger.warn(String.format("Appending template of category from \"%s\" to template of path-identical category from \"%s\": %s:%s:%s",
                                source.toExternalForm(), node.get(Graphmaster.FILENAME), pattern, that, topic));
                    }
                    node
                            .put(Graphmaster.FILENAME, node.get(Graphmaster.FILENAME) + ", "
                                    + source.toExternalForm());
                    node.put(Graphmaster.TEMPLATE, appendTemplate(storedTemplate, template));
                    break;

                case COMBINE:
                    if (this.noteEachMerge) {
                        this.logger.warn(String.format("Combining template of category from \"%s\" with template of path-identical category from \"%s\": %s:%s:%s",
                                source.toExternalForm(), node.get(Graphmaster.FILENAME), pattern, that, topic));
                    }
                    node
                            .put(Graphmaster.FILENAME, node.get(Graphmaster.FILENAME) + ", "
                                    + source.toExternalForm());
                    String combined = combineTemplates(storedTemplate, template);
                    node.put(Graphmaster.TEMPLATE, combined);
                    break;
            }
        }
    }

    /**
     * Removes all nodes associated with a given filename, and removes the file
     * from the list of loaded files.
     *
     * @param path the filename
     * @param bot  the bot for whom to remove the given path
     */
    public void unload(URL path, Bot bot) {
        Set<Nodemapper> nodemappers = bot.getLoadedFilesMap().get(path);

        /**
         * 2016.08.04
         * S.J.H
         * 이전에 실패했으면 nodemappers는 널이다.
         */
        if(nodemappers != null) {
            for (Nodemapper nodemapper : nodemappers) {
                remove(nodemapper);
                this.botidNodes.get(path).remove(nodemapper.getParent()); //sspark 활용되는 곳은 없음.
                this.totalCategories--;
            }
        }
        this.urlCatalog.get(path).remove(bot.getID());
        bot.getLoadedFilesMap().remove(path);
    }

    /**
     * Combines two template content strings into a single template, using a
     * random element so that either original template content string has an
     * equal chance of being processed. The order in which the templates are
     * supplied is important: the first one (<code>existingTemplate</code>)
     * is processed as though it has already been stored in the Graphmaster, and
     * hence might itself be the result of a previous <code>combine()</code>
     * operation. If this is the case, the in-memory representation of the
     * template will have a special attribute indicating this fact, which will
     * be used to &quot;balance&quot; the combine operation.
     *
     * @param existingTemplate the template with which the new template should
     *                         be combined
     * @param newTemplate      the template which should be combined with the
     *                         existing template
     * @return the combined result
     */
    public String combineTemplates(String existingTemplate, String newTemplate) {
        Document existingDoc;
        Element existingRoot;
        NodeList existingContent;

        Document newDoc;
        NodeList newContent;

        try {
            existingDoc = XMLKit.parseAsDocumentFragment(existingTemplate);
            existingRoot = existingDoc.getDocumentElement();
            existingContent = existingRoot.getChildNodes();

            newDoc = XMLKit.parseAsDocumentFragment(newTemplate);
            newContent = newDoc.getDocumentElement().getChildNodes();
        } catch (DeveloperError e) {
            synchronized (this.logger) {
                this.logger.warn("Problem with existing or new template when performing merge combine.");
                this.logger.warn("existing template: " + existingTemplate);
                this.logger.warn("new template: " + newTemplate);
                this.logger.warn("Existing template will be retained as-is.");
            }
            return existingTemplate;
        }
            
        /*
         * If the existing template has a random element as its root, we need to
         * check whether this was the result of a previous combine.
         */
        Node firstNode = existingContent.item(0);
        if (firstNode instanceof Element) {
            Element firstElement = (Element) firstNode;
            if (firstElement.getNodeName().equals(RandomProcessor.label)
                    && firstElement.hasAttribute("synthetic")) {
                Element newListItem = existingDoc.createElementNS(this.aimlNamespaceURI,
                        RandomProcessor.LI);
                int newContentSize = newContent.getLength();
                for (int index = 0; index < newContentSize; index++) {
                    newListItem.appendChild(existingDoc.importNode(newContent.item(index), true));
                }
                firstElement.appendChild(newListItem);
            }
            return XMLKit.renderXML(existingDoc.getChildNodes(), false);
        }
        Element listItemForExisting = existingDoc.createElementNS(this.aimlNamespaceURI,
                RandomProcessor.LI);
        int existingContentSize = existingContent.getLength();
        for (int index = 0; index < existingContentSize; index++) {
            Node child = existingContent.item(index);
            if (child != null) {
                listItemForExisting.appendChild(child.cloneNode(true));
                existingRoot.removeChild(child);
            }
        }

        Element listItemForNew = newDoc.createElementNS(this.aimlNamespaceURI, RandomProcessor.LI);
        int newContentSize = newContent.getLength();
        for (int index = 0; index < newContentSize; index++) {
            listItemForNew.appendChild(newContent.item(index).cloneNode(true));
        }

        Element newRandom = existingDoc.createElementNS(this.aimlNamespaceURI,
                RandomProcessor.label);
        newRandom.setAttribute("synthetic", "yes");
        newRandom.appendChild(listItemForExisting);
        newRandom.appendChild(existingDoc.importNode(listItemForNew, true));

        existingRoot.appendChild(newRandom);

        return XMLKit.renderXML(existingDoc.getChildNodes(), false);
    }

    /**
     * Appends the contents of one template to another.
     *
     * @param existingTemplate the template to which to append
     * @param newTemplate      the template whose content should be appended
     * @return the combined result
     */
    public String appendTemplate(String existingTemplate, String newTemplate) {
        Document existingDoc;
        Element existingRoot;

        Document newDoc;
        NodeList newContent;

        try {
            existingDoc = XMLKit.parseAsDocumentFragment(existingTemplate);
            existingRoot = existingDoc.getDocumentElement();

            newDoc = XMLKit.parseAsDocumentFragment(newTemplate);
            newContent = newDoc.getDocumentElement().getChildNodes();
        } catch (DeveloperError e) {
            synchronized (this.logger) {
                this.logger.warn("Problem with existing or new template when performing merge append.");
                this.logger.warn("existing template: " + existingTemplate);
                this.logger.warn("new template: " + newTemplate);
                this.logger.warn("Existing template will be retained as-is.");
            }
            return existingTemplate;
        }

        // Append whatever text is configured to be inserted between the
        // templates.
        if (this.mergeAppendSeparator != null) {
            existingRoot.appendChild(existingDoc.createTextNode(this.mergeAppendSeparator));
        }

        int newContentLength = newContent.getLength();
        for (int index = 0; index < newContentLength; index++) {
            Node newNode = existingDoc.importNode(newContent.item(index), true);
            existingRoot.appendChild(newNode);
        }
        return XMLKit.renderXML(existingDoc.getChildNodes(), false);
    }

    /**
     * Returns the number of categories presently loaded.
     *
     * @return the number of categories presently loaded
     */
    public int getCategoryCount() {
        return this.totalCategories;
    }

    /**
     * Returns a string reporting the current number of total categories
     *
     * @return a string reporting category information
     */
    @SuppressWarnings("boxing")
    public String getCategoryReport() {
        return String.format("%,d total categories currently loaded.", this.totalCategories);
    }

    /**
     * Returns the number of path-identical categories encountered.
     *
     * @return the number of path-identical categories encountered
     */
    public int getDuplicateCategoryCount() {
        return this.duplicateCategories;
    }

    /**
     * Returns the number of Nodemappers in the Graphmaster.
     *
     * @return the number of Nodemapper in the Graphmaster.
     */
    public int getNodemapperCount() {
        return this.nodemapperCount;
    }

    /**
     * Returns the average Nodemapper size.  Note that this method
     * actually performs the count when called.
     *
     * @return the average Nodemapper size
     */
    public double getAverageNodemapperSize() {
        /*
        List<Integer> sizes = this.root.getSizes();
        int sum = 0;
        for (int value : sizes)
        {
            sum += value;
        }
        return (float)sum / (float)sizes.size();
        */
        return this.root.getAverageSize();
    }

    /**
     * Returns whether or not the Graphmaster has already loaded the given URL.
     *
     * @param path
     * @return whether or not the Graphmaster has already loaded the given URL
     */
    public boolean hasAlreadyLoaded(URL path) {
        return this.urlCatalog.containsKey(path);
    }

    /**
     * Returns whether or not the Graphmaster has already loaded the given URL
     * for the given botid.
     */
    public boolean hasAlreadyLoadedForBot(URL path, String botid) {
        Set<String> botids = this.urlCatalog.get(path);
        if (botids == null) {
            return false;
        }
        return botids.contains(botid);
    }

    /**
     * Adds the given URL to the catalog of URLs loaded
     * for the given botid.  This should only be called
     * using a URL that has <i>not</i> previously been loaded
     * for another bot.
     *
     * @param path
     * @param botid
     * @throws IllegalArgumentException if the given path has already been loaded
     */
    public void addURL(URL path, String botid) {
        if (this.urlCatalog.containsKey(path)) {
            throw new IllegalArgumentException("Must not call addPath() using a URL already loaded.");
        }
        Set<String> botids = new HashSet<String>();
        botids.add(botid);
        this.urlCatalog.put(path, botids);
    }

    /**
     * Adds the given botid to the &lt;botid&gt; node
     * for all branches associated with the given URL.
     * This should only be called using a URL that <i>has</i>
     * previously been loaded for <i>another</i> bot.
     *
     * @param path
     * @param botid
     * @throws IllegalArgumentException if the given path has not already been loaded, or if it has been loaded for the same botid
     */
    public void addForBot(URL path, String botid) {
        if (!this.urlCatalog.containsKey(path)) {
            throw new IllegalArgumentException("Must not call addForBot() using a URL that has not already been loaded.");
        }
        if (this.urlCatalog.get(path).contains(botid)) {
            throw new IllegalArgumentException("Must not call addForBot() using a URL and botid that have already been associated.");
        }
        if (this.logger.isDebugEnabled()) {
            this.logger.debug(String.format("Adding botid \"%s\" to all paths associated with \"%s\".", botid, path));
        }
        
        /* @author sspark  (2012.11.01, ss.park@kt.com) , 기능상 문제 없음. 
        for (Nodemapper node : this.botidNodes.get(path))
        {
            // Hook up with the existing template.
            Object t = node.get(node.keySet().iterator().next());
            node.put(botid, t);
            this.totalCategories++;
        }
        */
        this.urlCatalog.get(path).add(botid);
    }

    /**
     * Returns an unmodifiable view of the url-to-botid catalog.
     *
     * @return an unmodifiable view of the url-to-botid catalog
     */
    public Map<URL, Set<String>> getURLCatalog() {
        return Collections.unmodifiableMap(this.urlCatalog);
    }

}