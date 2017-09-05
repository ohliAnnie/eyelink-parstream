/*
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version. You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */

package org.aitools.programd.bot;

import org.aitools.programd.CoreSettings;
import org.aitools.programd.graph.Nodemapper;
import org.aitools.programd.multiplexor.PredicateInfo;
import org.aitools.programd.multiplexor.PredicateMap;
import org.aitools.programd.processor.Processor;
import org.aitools.programd.util.InputNormalizer;
import org.aitools.programd.util.Substituter;

import java.net.URL;
import java.util.*;
import java.util.regex.Pattern;


/**
 * Handles all of the properties of a bot.
 *
 * @author <a href="mailto:noel@aitools.org">Noel Bush</a>
 * @author Eion Robb
 * @version 4.5
 * @since 4.1.5
 */
public class Bot {
    /**
     * 봇 식별자
     */
    private String id;

    /**
     * AIML 파일 위치를 기록하고 있다.
     */
    private Map<URL, Set<Nodemapper>> loadedFiles = new HashMap<URL, Set<Nodemapper>>();

    /**
     * substitutions 파일 위치
     */
    private URL substitutionsFiles;

    /**
     * predicates 파일 위치
     */
    private URL predicatesFiles;

    /**
     * properties 파일 위치
     */
    private URL propertiesFiles;

    /**
     * The bot's properties.
     */
    private Map<String, String> properties = Collections.checkedMap(new HashMap<String, String>(),
            String.class, String.class);

    /**
     * The bot's predicate infos.
     */
    private Map<String, PredicateInfo> predicatesInfo = Collections.checkedMap(
            new HashMap<String, PredicateInfo>(), String.class, PredicateInfo.class);

    /**
     * The bot's processor-specific substitution maps.
     */
    private Map<Class<? extends Processor>, LinkedHashMap<Pattern, String>> substitutionMaps = new HashMap<Class<? extends Processor>, LinkedHashMap<Pattern, String>>();

    /**
     * The bot's input substitution map.
     */
    private Map<Pattern, String> inputSubstitutions = Collections.checkedMap(
            new LinkedHashMap<Pattern, String>(), Pattern.class, String.class);

    /**
     * The bot's sentence splitter map.
     */
    private List<String> sentenceSplitters = Collections.checkedList(new ArrayList<String>(),
            String.class);


    /**
     * userid별로 predicates를 저장한다.
     */
    private Map<String, PredicateMap> predicateCache = Collections
            .synchronizedMap(new HashMap<String, PredicateMap>());

    //private Map<String, PredicateMap> predicateCache = new ConcurrentHashMap<String, PredicateMap>(300) ;  //initial 300

    //sspark   HashMap -> LinkedHashMap
    //private Map<String, PredicateMap> predicateCache = Collections
    //        .synchronizedMap(new LinkedHashMap<String, PredicateMap>(500 , 0.75f, true));


    /**
     * @author sspark 2012.09.04 (ss.park@kt.com)
     * Holds cached predicates , keyed by userid and default  
     * TODO change cache object
     * */
    //private LRUCacheMap<String, PredicateMap> predicateCache ;


    /** The page to use for this bot when communicating via the servlet interface. */


    /**
     * The page to use for this bot when communicating via the servlet interface.
     */
    private String servletPage = EMPTY_STRING;

    /**
     * The files containing test suites.
     */
    private List<URL> testSuites;

    /**
     * The directory where test reports are to be written.
     */
    private URL testReportDirectory;

    /**
     * The predicate empty default.
     */
    protected String predicateEmptyDefault;

    /**
     * An empty string.
     */
    private static final String EMPTY_STRING = "";

    /**
     * nbest splitter, by sspark(ss.park@kt.com)
     */
    private static final String NBEST_SPLITTER = ";";

    /**
     * Creates a new Bot with the given id. The bot's chat log is also set up.
     * A default servlet page is set.
     *
     * @param botID        the id to use for the new bot
     * @param coreSettings the core settings to use
     */
    public Bot(String botID, CoreSettings coreSettings) {
        this.id = botID;
        this.predicateEmptyDefault = coreSettings.getPredicateEmptyDefault();
    }

    /**
     * Returns the id of the bot.
     *
     * @return the id of the bot
     */
    public String getID() {
        return this.id;
    }

    /**
     * Returns a map of the files loaded by this bot.
     *
     * @return a map of the files loaded by this bot
     */
    public Map<URL, Set<Nodemapper>> getLoadedFilesMap() {
        return this.loadedFiles;
    }

    /**
     * Returns whether the bot has loaded the given file(name).
     *
     * @param filename the filename to check
     * @return whether the bot has loaded the given file(name)
     */
    public boolean hasLoaded(String filename) {
        return this.loadedFiles.containsKey(filename);
    }

    /**
     * Retrieves the value of a named bot property.
     *
     * @param name the name of the bot property to get
     * @return the value of the bot property
     */
    public String getPropertyValue(String name) {
        // Don't bother with empty property names.
        if (name.equals(EMPTY_STRING)) {
            return this.predicateEmptyDefault;
        }

        // Retrieve the contents of the property.
        String value = this.properties.get(name);
        if (value != null) {
            return value;
        }
        // (otherwise...)
        return this.predicateEmptyDefault;
    }

    /**
     * Sets the value of a bot property.
     *
     * @param name  the name of the bot predicate to set
     * @param value the value to set
     */
    public void setPropertyValue(String name, String value) {
        // Property name must not be empty.
        if (name.equals(EMPTY_STRING)) {
            return;
        }

        // Store the property.
        this.properties.put(name, value);
    }

    /**
     * Gets properties.
     *
     * @return the properties
     */
    public Map<String, String> getProperties() {
        return this.properties;
    }

    /**
     * Sets the bot's properties.
     *
     * @param map the properties to set.
     */
    public void setProperties(HashMap<String, String> map) {
        this.properties = map;
    }

    /**
     * Registers some information about a predicate in advance. Not required;
     * just used when it is necessary to specify a default value for a predicate
     * and/or specify its type as return-name-when-set.
     *
     * @param name              the name of the predicate
     * @param defaultValue      the default value (if any) for the predicate
     * @param returnNameWhenSet whether the predicate should return its name                          when set
     */
    public void addPredicateInfo(String name, String defaultValue, boolean returnNameWhenSet) {
        PredicateInfo info = new PredicateInfo(name, defaultValue, returnNameWhenSet);
        this.predicatesInfo.put(name, info);
    }

    /**
     * Returns the predicates info map.
     *
     * @return the predicates info map
     */
    public Map<String, PredicateInfo> getPredicatesInfo() {
        return this.predicatesInfo;
    }

    /**
     * Returns the predicate cache.
     *
     * @return the predicate cache
     */
    public Map<String, PredicateMap> getPredicateCache() {
        return this.predicateCache;
    }

    /**
     * Returns the map of predicates for a userid if it is cached, or a new map
     * if it is not cached.
     *
     * @param userid the userid
     * @return the map of predicates for the given userid
     */
    public PredicateMap predicatesFor(String userid) {
        PredicateMap userPredicates;

        // Find out if any predicates for this userid are cached.
        if (!this.predicateCache.containsKey(userid)) {
            // Create them if not.
            userPredicates = new PredicateMap();
            this.predicateCache.put(userid, userPredicates);
        } else {
            userPredicates = this.predicateCache.get(userid);
            assert userPredicates != null : "userPredicates is null!";
        }
        return userPredicates;
    }

    /**
     * Predicates for predicate map.
     *
     * @param boltId    the bolt id
     * @param userid    the userid
     * @param sessionId the session id
     * @return the predicate map
     */
    public PredicateMap predicatesFor(String boltId, String userid, String sessionId) {
        PredicateMap userPredicates;

        // Find out if any predicates for this userid are cached.
        if (!this.predicateCache.containsKey(userid)) {
            // Create them if not.
            userPredicates = new PredicateMap();
            this.predicateCache.put(userid, userPredicates);
        } else {
            userPredicates = this.predicateCache.get(userid);
            assert userPredicates != null : "userPredicates is null!";
        }
        return userPredicates;
    }

    /**
     * Adds a substitution to the indicated map. If the map does not yet exist,
     * it is created. The <code>find</code> parameter is stored in uppercase,
     * to do case-insensitive comparisons. The <code>replace</code> parameter
     * is stored as is.
     *
     * @param processor the processor with which the map is associated
     * @param find      the find-string part of the substitution
     * @param replace   the replace-string part of the substitution
     */
    public void addSubstitution(Class<? extends Processor> processor, Pattern find, String replace) {
        if (!this.substitutionMaps.containsKey(processor)) {
            this.substitutionMaps.put(processor, new LinkedHashMap<Pattern, String>());
        }
        this.substitutionMaps.get(processor).put(find, replace);
    }

    /**
     * Adds an input substitution. The <code>find</code> parameter is stored
     * in uppercase, to do case-insensitive comparisons. The
     * <code>replace</code> parameter is stored as is.
     *
     * @param find    the find-string part of the substitution
     * @param replace the replace-string part of the substitution
     */
    public void addInputSubstitution(Pattern find, String replace) {
        this.inputSubstitutions.put(find, replace);
    }

    /**
     * Adds a sentence splitter to the sentence splitters list.
     *
     * @param splitter the string on which to divide sentences
     */
    public void addSentenceSplitter(String splitter) {
        if (splitter != null) {
            this.sentenceSplitters.add(splitter);
        }
    }

    /**
     * Gets substitution map.
     *
     * @param processor the processor whose substitution map is desired
     * @return the substitution map associated with the given processor class.
     */
    public Map<Pattern, String> getSubstitutionMap(Class<? extends Processor> processor) {
        return this.substitutionMaps.get(processor);
    }

    /**
     * Gets sentence splitters.
     *
     * @return the sentence splitters
     */
    public List<String> getSentenceSplitters() {
        return this.sentenceSplitters;
    }

    /**
     * Splits the given input into sentences.
     *
     * @param input the input to split
     * @return the sentences of the input
     */
    public List<String> sentenceSplit(String input) {
        return InputNormalizer.sentenceSplit(this.sentenceSplitters, input);
    }


    /**
     * ASR로부터 전달된 n-best에 대해서 split
     *
     * @param input the nbest input to split
     * @return the sentences of the input
     * @author sspark (ss.park@kt.com), 2012.09.20
     */
    public List<String> nbestSplit(String input) {
        //TODO nbest splitter
        return InputNormalizer.nbestSplit(NBEST_SPLITTER, input);
    }

    /**
     * Applies input substitutions to the given input
     *
     * @param input the input to which to apply substitutions
     * @return the processed input
     */
    public String applyInputSubstitutions(String input) {
        return Substituter.applySubstitutions(this.inputSubstitutions, input);
    }

    /**
     * Gets test report directory.
     *
     * @return Returns the testReportDirectory.
     */
    public URL getTestReportDirectory() {
        return this.testReportDirectory;
    }

    /**
     * Sets test report directory.
     *
     * @param url The testReportDirectory to set.
     */
    public void setTestReportDirectory(URL url) {
        this.testReportDirectory = url;
    }

    /**
     * Gets test suites.
     *
     * @return Returns the list of test suite files.
     */
    public List<URL> getTestSuites() {
        return this.testSuites;
    }

    /**
     * Sets test suite pathspec.
     *
     * @param files The list of test suite files to set
     */
    public void setTestSuitePathspec(List<URL> files) {
        this.testSuites = files;
    }

    /**
     * Sets servlet page.
     *
     * @param page the servlet servletPage to user
     */
    public void setServletPage(String page) {
        this.servletPage = page;
    }

    /**
     * Gets servlet page.
     *
     * @return the servlet servletPage
     */
    public String getServletPage() {
        return this.servletPage;
    }

    /**
     * Adds a nodemapper to the path map.
     *
     * @param path       the path
     * @param nodemapper the mapper for the node to add
     */
    public void addToPathMap(URL path, Nodemapper nodemapper) {
        Set<Nodemapper> nodemappers = this.loadedFiles.get(path);
        if (nodemappers == null) {
            nodemappers = new HashSet<Nodemapper>();
            this.loadedFiles.put(path, nodemappers);
        }
        nodemappers.add(nodemapper);
    }

    /**
     * Gets input substitutions.
     *
     * @return the input substitutions
     */
    public Map<Pattern, String> getInputSubstitutions() {
        return inputSubstitutions;
    }

    /**
     * Sets substitutions files.
     *
     * @param substitutionsFiles the substitutions files
     */
    public void setSubstitutionsFiles(URL substitutionsFiles) {
        this.substitutionsFiles = substitutionsFiles;
    }


    /**
     * Gets substitutions files.
     *
     * @return the substitutions files
     */
    public URL getSubstitutionsFiles() {
        return substitutionsFiles;
    }

    /**
     * @return
     */
    public URL getPredicatesFiles() {
        return predicatesFiles;
    }

    /**
     * @param predicatesFiles
     */
    public void setPredicatesFiles(URL predicatesFiles) {
        this.predicatesFiles = predicatesFiles;
    }

    /**
     * @return
     */
    public URL getPropertiesFiles() {
        return propertiesFiles;
    }

    /**
     * @param propertiesFiles
     */
    public void setPropertiesFiles(URL propertiesFiles) {
        this.propertiesFiles = propertiesFiles;
    }
}