/*
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version. You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */

package org.aitools.programd.multiplexor;

import com.kt.programd.util.InputCombGenerator;
import org.aitools.programd.Core;
import org.aitools.programd.CoreSettings;
import org.aitools.programd.bot.Bot;
import org.aitools.programd.bot.Bots;
import org.aitools.programd.graph.Graphmaster;
import org.aitools.programd.graph.Match;
import org.aitools.programd.logging.ChatLogEvent;
import org.aitools.programd.parser.TemplateParser;
import org.aitools.programd.parser.TemplateParserException;
import org.aitools.programd.processor.ProcessorException;
import org.aitools.programd.util.DeveloperError;
import org.aitools.programd.util.InputNormalizer;
import org.apache.log4j.Logger;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * <p>
 * &quot;To multiplex&quot; means &quot;to select one from many inputs&quot;. A
 * <code>Multiplexor</code> multiplexes the clients of a bot and keeps track
 * of all their predicate values.
 * </p>
 * <p>
 * The following metaphor was supplied by Richard Wallace: The
 * <code>Multiplexor</code> controls a short &quot;carnival ride&quot; for
 * each user. The Multiplexor puts the client in his/her seat, hands him/her an
 * id card, and closes the door. The client gets one &quot;turn of the
 * crank&quot;. He/she enters his/her id, multiline query, and then receives the
 * reply. The door opens, the Multiplexor ushers him/her out, and seats the next
 * client.
 * </p>
 *
 * @author <a href="mailto:noel@aitools.org">Noel Bush</a>
 * @author Richard Wallace, Jon Baer
 * @author Thomas Ringate/Pedro Colla
 * @version 4.5
 * @since 4.1.3
 */
abstract public class Multiplexor {
    // Convenience constants.

    /**
     * The name of the <code>that</code> special predicate.
     */
    protected static final String THAT = "that";

    /**
     * The name of the <code>topic</code> special predicate.
     */
    protected static final String TOPIC = "topic";

    /**
     * The name of the <code>input</code> special predicate.
     */
    protected static final String INPUT = "input";

    /**
     * The name of the <code>star</code> special predicate.
     */
    protected static final String STAR = "star";

    /**
     * An empty string.
     */
    protected static final String EMPTY_STRING = "";

    /**
     * The word &quot;value&quot;.
     */
    protected static final String VALUE = "value";

    /**
     * An asterisk (used in String production)
     */
    protected static final String ASTERISK = "*";


    /* for debug */
    protected static final String DEBUG = "<DEBUG>";

    /**
     * The predicate empty default.
     */
    protected String predicateEmptyDefault;

    // Class variables.

    /**
     * The Core that owns this Multiplexor.
     */
    protected Core core;

    /**
     * The Graphmaster in use by the Core.
     */
    protected Graphmaster graphmaster;

    /**
     * The PredicateMaster in use by the Core.
     */
    protected AbstractPredicateMaster predicateMaster;

    /**
     * The Bots object that belongs to the Core.
     */
    protected Bots bots;

    /**
     * The general log where we will record some events.
     */
    protected static final Logger logger = Logger.getLogger("programd");

    /**
     * The log where match info will be recorded.
     */
    protected static final Logger matchLogger = Logger.getLogger("programd.matching");

    /**
     * The time that the Multiplexor started operation.
     */
    protected long startTime = System.currentTimeMillis();

    /**
     * A counter for tracking the number of responses produced.
     */
    protected long responseCount = 0;

    /**
     * The total response time.
     */
    protected long totalTime = 0;

    /**
     * A counter for tracking average response time.
     */
    protected float avgResponseTime = 0;


    /**
     * Constructs the Multiplexor, using some values taken from the Core
     * object's settings. Note that the {@link #predicateMaster} is <i>not</i>
     * initialized -- it must be {@link #attach}ed subsequently.
     *
     * @param owner the Core that owns this Multiplexor
     */
    public Multiplexor(Core owner) {
        this.core = owner;
        this.graphmaster = this.core.getGraphmaster();
        this.bots = this.core.getBots();
        CoreSettings coreSettings = this.core.getSettings();
        this.predicateEmptyDefault = coreSettings.getPredicateEmptyDefault();
    }

    /**
     * Attaches the given
     * {@link org.aitools.programd.multiplexor.PredicateMaster PredicateMaster}
     * to this <code>Multiplexor</code>.
     *
     * @param predicateMasterToAttach
     */
    public void attach(AbstractPredicateMaster predicateMasterToAttach) {
        this.predicateMaster = predicateMasterToAttach;
    }

    /**
     * Can do whatever initialization is needed for the particular multiplexor.
     */
    abstract public void initialize();

    /**
     * Returns the response to a non-internal input, without using a Responder.
     *
     * @param input  the &quot;non-internal&quot; (possibly multi-sentence,
     *               non-substituted) input
     * @param userid the userid for whom the response will be generated
     * @param botid  the botid from which to get the response
     * @return the response
     * <p/>
     * *******************************************
     * @author sspark 2012.09.03 (ss.park@kt.com)
     * for performance, delete 'synchronized'
     */
    public String getResponse(String input, String userid, String botid) {
        // Return the response (may be just EMPTY_STRING!)
        return getResponse(input, userid, botid, null);
    }

    /**
     * Trace S.J.H
     *
     * @param input
     * @param userid
     * @param botid
     * @return
     */
    public String getResponse(String input, String userid, String botid, List<Match> matches) {

        // Get the specified bot object.
        Bot bot = this.bots.getBot(botid);

        // Split sentences (after performing substitutions).
        //List<String> sentenceList = bot.sentenceSplit(bot.applyInputSubstitutions(input));
        List<String> sentenceList = bot.sentenceSplit(input);

        // Get the replies.
        List<String> replies = getReplies(sentenceList, userid, botid, matches);

        if (replies == null) {
            return null;
        }

        // Start by assuming an empty response.
        StringBuilder responseBuffer = new StringBuilder(EMPTY_STRING);

        // Append each reply to the response.
        for (String reply : replies) {
            responseBuffer.append(reply);
        }

        String response = responseBuffer.toString();

        //TODO 로그처리 주석 풀기
        //컴파일시에 주석처리 해제후 컴파일...
        //Log the response.
        logResponse(input, response, userid, botid);

        // Return the response (may be just EMPTY_STRING!)
        return response;
    }

    /**
     * <p>
     * Produces a response to an &quot;internal&quot; input sentence -- i.e., an
     * input that has been produced by a <code>srai</code>.
     * </p>
     * <p>
     * This method
     * takes an already-existing <code>TemplateParser</code>, <i>doesn't </i>
     * take a <code>Responder</code>, and assumes that the inputs have
     * already been normalized.
     * </p>
     *
     * @param input  the input sentence
     * @param userid the userid requesting the response
     * @param botid  the botid from which to get the response
     * @param parser the parser object to update when generating the response
     * @return the response
     */
    public String getInternalResponse(String input, String userid, String botid, TemplateParser parser) {
        return getInternalResponse(input, userid, botid, parser, null);
    }

    /**
     * Trace S.J.H
     *
     * @param input
     * @param userid
     * @param botid
     * @param parser
     * @return
     */
    public String getInternalResponse(String input, String userid, String botid, TemplateParser parser, List<Match> matches) {
        // Get the requested bot.
        Bot bot = this.bots.getBot(botid);

        // Ready the that and topic predicates for constructing the match path.
        List<String> thatSentences = bot.sentenceSplit(this.predicateMaster.get(THAT, 1, userid, botid));
        String that = InputNormalizer.patternFitIgnoreCase(thatSentences.get(thatSentences.size() - 1));

        if (that.equals(EMPTY_STRING) || that.equals(this.predicateEmptyDefault)) {
            that = ASTERISK;
        }

        String topic = InputNormalizer.patternFitIgnoreCase(this.predicateMaster.get(TOPIC, userid, botid));
        if (topic.equals(EMPTY_STRING) || topic.equals(this.predicateEmptyDefault)) {
            topic = ASTERISK;
        }

        return getMatchResult(input, that, topic, userid, botid, parser, matches);
    }

    /**
     * Gets the list of replies to some input sentences. Assumes that the
     * sentences have already had all necessary pre-processing and substitutions
     * performed.
     *
     * @param sentenceList the input sentences
     * @param userid       the userid requesting the replies
     * @param botid
     * @return the list of replies to the input sentences
     */
    @SuppressWarnings("boxing")
    private List<String> getReplies(List<String> sentenceList, String userid, String botid, List<Match> matches) {
        if (sentenceList == null) {
            return null;
        }

        // All replies will be assembled in this ArrayList.
        List<String> replies = Collections.checkedList(new ArrayList<String>(sentenceList.size()), String.class);

        // Get the requested bot.
        Bot bot = this.bots.getBot(botid);

        // Ready the that and topic predicates for constructing the match path.
        List<String> thatSentences = bot.sentenceSplit(this.predicateMaster.get(THAT, 1, userid, botid));
        String that = InputNormalizer.patternFitIgnoreCase(thatSentences.get(thatSentences.size() - 1));

        if (that.equals(EMPTY_STRING) || that.equals(this.predicateEmptyDefault)) {
            that = ASTERISK;
        }

        String topic = InputNormalizer.patternFitIgnoreCase(this.predicateMaster.get(TOPIC, userid, botid));
        if (topic.equals(EMPTY_STRING) || topic.equals(this.predicateEmptyDefault)) {
            topic = ASTERISK;
        }

        // We might use this to track matching statistics.
        long time = 0;

        // Mark the time just before matching starts.
        time = System.currentTimeMillis();

        // Get a reply for each sentence.
        // n-best의 결과를 쪼개어 실행
        // Multiplexor의 getResponse()함수 밖에서 처리 하는 것으로 한다.
        // aiml에 * 에 맵핑되는 응답으로 NOMATCH를 기술하고 응답값이 이것 일때 
        // 다음 n-best의 결과를 실행한다. 
        /*
        String reply ="";
        for (String sentence : sentenceList)
        {
        	List<String> nbestList = bot.nbestSplit(sentence);
        	for(String nbest : nbestList) 
        	{
	        	reply= getReply(nbest, that, topic, userid, botid) ;
	        	if(!reply.equalsIgnoreCase(EMPTY_STRING))
	        	{
	        		replies.add(reply);
	        		break;
	        	}
        	}
        	//if(replies.size() > 0) break;  //문장 splitter는 역할 수행 안함.
        }
        */

        // Get a reply for each sentence.
//        List<Match> matches = new ArrayList<>();
        for (String sentence : sentenceList) {
            replies.add(getReply(sentence, that, topic, userid, botid, matches));
        }

        // Increment the (static) response count.
        this.responseCount++;

        // Produce statistics about the response time.
        // Mark the time that processing is finished.
        time = System.currentTimeMillis() - time;

        // Calculate the average response time.
        this.totalTime += time;
        this.avgResponseTime = (float) this.totalTime / (float) this.responseCount;
        if (matchLogger.isDebugEnabled()) {
            matchLogger.debug(String.format("Response %d in %dms. (Average: %.2fms)",
                    this.responseCount, time, this.avgResponseTime));
        }

        // Invoke targeting if appropriate.
        /*
         * if (responseCount % TARGET_SKIP == 0) { if (USE_TARGETING) {
         * Graphmaster.checkpoint(); } }
         */

        // If no replies, return an empty string.
        if (replies.size() == 0) {
            replies.add(EMPTY_STRING);
        }
        
        /*
         * @author sspark(ss.park@kt.com, 2012.11.10) 
         * debug모드일 경우 기존 응답은 취소하고 <debug>의 실행 값을 리턴함.
         */
        if (this.core.getSettings().getDebugMode()) {
            replies.clear();
            String debug = this.predicateMaster.get(DEBUG, userid, botid);
            replies.add(debug);
            this.predicateMaster.set(DEBUG, EMPTY_STRING, userid, botid);
        }

        return replies;
    }

    /**
     * Gets a reply to an input. Assumes that the input has already had all
     * necessary substitutions and pre-processing performed, and that the input
     * is a single sentence.
     *
     * @param input  the input sentence
     * @param that   the input that value
     * @param topic  the input topic value
     * @param userid the userid requesting the reply
     * @param botid
     * @return the reply to the input sentence
     */
    private String getReply(String input, String that, String topic, String userid, String botid, List<Match> matches) {
    	
    	// Push the input onto the <input/> stack.
        this.predicateMaster.push(INPUT, input, userid, botid);

        // Create a new TemplateParser.
        TemplateParser parser;
        try {
            parser = new TemplateParser(input, userid, botid, this.core, matches);
        } catch (TemplateParserException e) {
            throw new DeveloperError("Error occurred while creating new TemplateParser.", e);
        }

        String reply = getMatchResult(input, that, topic, userid, botid, parser, matches);
        if (reply == null) {
            logger.error("getMatchReply generated a null reply!", new NullPointerException());
            return EMPTY_STRING;
        }

        // Push the reply onto the <that/> stack.
        this.predicateMaster.push(THAT, reply, userid, botid);

        return reply;
    }

    /**
     * Gets the match result from the Graphmaster.
     *
     * @param input  the input to match
     * @param that   the current that value
     * @param topic  the current topic value
     * @param userid the userid for whom to perform the match
     * @param botid  the botid for whom to perform the match
     * @param parser the parser to use
     * @return the match result
     */
    private String getMatchResult(String input, String that, String topic, String userid, String botid, TemplateParser parser, List<Match> matches) {

        // Show the input path.
        if (matchLogger.isDebugEnabled()) {
            matchLogger.debug(String.format("[INPUT (%s)] %s : %s : %s : %s",
                    userid, input, that, topic, botid));
        }

        Match match = null;

        //================================================================================================//
        /*
         * patternFitIgnoreCase(input)
	     * 띄어쓰기 list 생성후 ArrayList에 저장
	     * ArrayList에서 하나씩 선택(for 문)
	     * inputSubstition(input)
	     * usedList에서 동일한 것이 있는지 체크
	     * 없으면 match() 실행
	     * match == null or pattern&that&topic == "*" 인지를 체크
	     * usedList에 input을 저장함
	     * for 문 반복  
	     */

        //input= InputNormalizer.patternFitIgnoreCase(input) ;
        Bot bot = this.bots.getBot(botid);
        //자동 띄어 쓰기 옵션 사용하지 않을 경우

        if (!this.core.getSettings().getAutoWwordSpace()) {

        	input = InputNormalizer.patternFitIgnoreCase(bot.applyInputSubstitutions(input));
            match = this.graphmaster.match(input, that, topic, botid, matches);

        } else // 자동 띄어쓰기 옵션을 사용할 경우
        {

            ArrayList<String> cbInput = InputCombGenerator.getInputList(input);
            ArrayList<String> usedList = new ArrayList<String>();

            if (matchLogger.isDebugEnabled()) {
                matchLogger.debug(String.format("Candidtate input items:  \"%s\".", cbInput.toString()));
            }

            for (String item : cbInput) {
                if (matchLogger.isDebugEnabled()) {
                    matchLogger.debug(String.format("Candidtate item :  \"%s\".", item));
                }
                // performing substitutions
                // * getResponse 에서 처리하던 것을 이동
                item = InputNormalizer.patternFitIgnoreCase(bot.applyInputSubstitutions(item));

                boolean bUsed = false;
                for (String used : usedList) {
                    if (used.equalsIgnoreCase(item)) {
                        bUsed = true;
                        break;
                    }
                }

                if (bUsed) {
                    if (matchLogger.isDebugEnabled()) {
                        matchLogger.debug(String.format("Not new item, so move next item \"%s\".", item));
                    }
                    continue;
                }

                if (matchLogger.isDebugEnabled()) {
                    matchLogger.debug(String.format("MATCHING for item : \"%s\".", item));
                }

                //Search the Graph
                match = this.graphmaster.match(item, that, topic, botid, matches);

                if (match != null) {

                    if (!(match.getPattern().equals("*") && match.getThat().equals("*") && match.getTopic().equals("*"))) {
                        //matched!!
                        break;
                    }
                }
                //else //nomatch

                if (matchLogger.isDebugEnabled()) {
                    matchLogger.debug(String.format("NOMATCH for item : \"%s\".", item));
                }

                usedList.add(item);
            }
        }
        //================================================================================================//

        if (match == null) {
            logger.warn(String.format("[FINAL] No match found for input \"%s\".", input));
            return EMPTY_STRING;
        }

        if (matchLogger.isDebugEnabled()) {
            matchLogger.debug(String.format("[MATCHED] %s (\"%s\")",
                    match.getPath(), match.getFileName()));
        }

        ArrayList<String> stars = match.getInputStars();
        if (stars.size() > 0) {
            parser.setInputStars(stars);
        }

        stars = match.getThatStars();
        if (stars.size() > 0) {
            parser.setThatStars(stars);
        }

        stars = match.getTopicStars();
        if (stars.size() > 0) {
            parser.setTopicStars(stars);
        }

        String template = match.getTemplate();
        String reply = null;

        try {
            reply = parser.processResponse(template);
        } catch (ProcessorException e) {
            // Log the error message.
            Logger.getLogger("programd").error("Error while processing response: " + e.getExplanatoryMessage(), e);

            // Set response to empty string.
            return EMPTY_STRING;
        } catch (DeveloperError e) {
            // Log the error message.
            Logger.getLogger("programd").error("Error while processing response: " + e.getCause().getMessage(), e);

            // Set response to empty string.
            return EMPTY_STRING;
        }

        // Record activation, if targeting is in use.
        // Needs review in light of multi-bot update
        /*
         * if (USE_TARGETING) { Nodemapper matchNodemapper =
         * match.getNodemapper(); if (matchNodemapper == null) {
         * Trace.devinfo("Match nodemapper is null!"); } else { Set<Object>
         * activations = (Set<Object>)
         * matchNodemapper.get(Graphmaster.ACTIVATIONS); if (activations ==
         * null) { activations = new HashSet<Object>(); } String path =
         * match.getPath() + SPACE + Graphmaster.PATH_SEPARATOR + SPACE +
         * inputIgnoreCase + SPACE + Graphmaster.PATH_SEPARATOR + SPACE + that +
         * SPACE + Graphmaster.PATH_SEPARATOR + SPACE + topic + SPACE +
         * Graphmaster.PATH_SEPARATOR + SPACE + botid + SPACE +
         * Graphmaster.PATH_SEPARATOR + SPACE + reply; if
         * (!activations.contains(path)) { activations.add(path);
         * match.getNodemapper().put(Graphmaster.ACTIVATIONS, activations);
         * Graphmaster.activatedNode(match.getNodemapper()); } } }
         */
        return reply;
    }

    /**
     * Logs a response to the chat log.
     *
     * @param input    the input that produced the response
     * @param response the response
     * @param userid   the userid for whom the response was produced
     * @param botid    the botid that produced the response
     */
    private void logResponse(String input, String response, String userid, String botid) {
        logger.callAppenders(new ChatLogEvent(botid, userid, input, response));
    }

    /**
     * Returns the average response time.
     *
     * @return the average response time
     */
    public float averageResponseTime() {
        return this.avgResponseTime;
    }

    /**
     * Returns the number of queries per hour.
     *
     * @return the number of queries per hour
     */
    public float queriesPerHour() {
        return this.responseCount / ((System.currentTimeMillis() - this.startTime) / 3600000.00f);
    }

    /**
     * Saves a predicate for a given <code>userid</code>. This only applies
     * to Multiplexors that provide long-term storage (others may just do
     * nothing).
     *
     * @param name   predicate name
     * @param value  predicate value
     * @param userid user identifier
     * @param botid
     * @since 4.1.4
     */
    abstract public void savePredicate(String name, String value, String userid, String botid);

    /**
     * Loads a predicate into memory for a given <code>userid</code>. This
     * only applies to Multiplexors that provide long-term storage (others may
     * just do nothing).
     *
     * @param name   predicate name
     * @param userid user identifier
     * @param botid
     * @return the predicate value
     * @throws NoSuchPredicateException if there is no predicate with this name
     * @since 4.1.4
     */
    abstract public String loadPredicate(String name, String userid, String botid) throws NoSuchPredicateException;

    /**
     * Checks whether a given userid and password combination is valid.
     * Multiplexors for which this makes no sense should just return true.
     *
     * @param userid   the userid to check
     * @param botid
     * @param password the password to check
     * @return whether the userid and password combination is valid
     */
    abstract public boolean checkUser(String userid, String password, String botid);

    /**
     * Creates a new user entry, given a userid and password. Multiplexors for
     * which this makes no sense should just return true.
     *
     * @param userid   the userid to use
     * @param botid
     * @param password the password to assign
     * @throws DuplicateUserIDError if the given userid was already found in the
     *                              system
     */
    abstract public void createUser(String userid, String password, String botid) throws DuplicateUserIDError;

    /**
     * Changes the password associated with a userid. Multiplexors for which
     * this makes no sense should just return true.
     *
     * @param userid   the userid
     * @param botid
     * @param password the new password
     * @return whether the change was successful
     */
    abstract public boolean changePassword(String userid, String password, String botid);

    /**
     * Returns a count of known userids. This may be defined differently for
     * different multiplexors.
     *
     * @param botid the botid for which we want a count of known userids
     * @return a count of known userids
     */
    abstract public int useridCount(String botid);
}