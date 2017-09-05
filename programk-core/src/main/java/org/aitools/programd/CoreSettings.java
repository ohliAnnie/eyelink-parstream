/*
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version. You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */

package org.aitools.programd;

import org.aitools.programd.util.Settings;
import org.aitools.programd.util.URLTools;
import org.aitools.programd.util.UserError;
import org.springframework.util.ResourceUtils;

import java.io.FileNotFoundException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;

/**
 * Automatically generated from properties file, 2006-03-08T14:08:00.612-05:00
 */
public class CoreSettings extends Settings {
    /**
     * The namespace URI of AIML to use.
     */
    private URI aimlSchemaNamespaceUri;

    /**
     * The bot configuration startup file.
     */
    private URL startupFilePath;

    /**
     * What to do when a category is loaded whose pattern:that:topic path is identical to one already loaded (for the same bot).
     */
    private MergePolicy mergePolicy;

    /**
     * The possible values for MergePolicy.
     */
    public static enum MergePolicy {
        /**
         * Leave the currently loaded template in place and ignore the new one.
         */
        SKIP,

        /**
         * Overwrite the loaded template with the new one.
         */
        OVERWRITE,

        /**
         * Append the content of the new template to the currently loaded one.
         */
        APPEND,

        /**
         * Store the new template as well, so it will have an equal chance of being used as the currently loaded one.
         */
        COMBINE
    }

    /**
     * If the append merge policy is used, what text content (if any) should be inserted between the contents of the two templates?
     */
    private String mergeAppendSeparatorString;

    /**
     * Produce a note in the console/log for each merge?
     */
    private boolean mergeNoteEach;

    /**
     * The default value for undefined predicates.
     */
    private String predicateEmptyDefault;

    /**
     * The maximum allowable time (in milliseconds) to get a response.
     */
    private int responseTimeout;

    /**
     * How many categories will be loaded before a message is displayed?
     */
    private int categoryLoadNotifyInterval;

    /**
     * Whether or not to print a message as each file is loaded.
     */
    private boolean loadNotifyEachFile;

    /**
     * The input to match if an infinite loop is found.
     */
    private String infiniteLoopInput;

    /**
     * Which bot predicate contains the client's name?
     */
    private String clientNamePredicate;

    /**
     * Which bot predicate contains the bot's name?
     */
    private String botNamePredicate;

    /**
     * Print stack trace on uncaught exception?
     */
    private boolean onUncaughtExceptionsPrintStackTrace;

    /**
     * Execute contents of <system> elements?
     */
    private boolean osAccessAllowed;

    /**
     * Execute contents of <javascript> elements?
     */
    private boolean javascriptAllowed;

    /**
     * Where to write gossip entries.
     */
    private URL gossipPath;

    /**
     * The string to send when first connecting to the bot.
     */
    private String connectString;

    /**
     * The string to send after an inactivity timeout.
     */
    private String inactivityString;

    /**
     * The Nodemapper implementation to use.
     */
    private String nodemapperImplementation;

    /**
     * The Multiplexor implementation to use.
     */
    private String multiplexorImplementation;

    /**
     * The directory in which to save flat-file predicates (FFM only).
     */
    private URL multiplexorFfmDir;

    /**
     * Enable the heart?
     */
    private boolean heartEnabled;

    /**
     * The pulse rate for the heart (beats per minute).
     */
    private int heartPulserate;

    /**
     * The maximum size of the cache before writing to disk/database.
     */
    private int predicateCacheMax;

    /**
     * Use interactive command-line shell?
     */
    private boolean consoleUseShell;

    /**
     * Exit immediately upon startup?
     */
    private boolean exitImmediatelyOnStartup;

    /**
     * The location of the AIML schema (or a copy of it).
     */
    private URL schemaLocationAIML;

    /**
     * The location of the plugin schema (or a copy of it).
     */
    private URL schemaLocationPlugins;

    /**
     * The location of the test cases schema (or a copy of it).
     */
    private URL schemaLocationTestCases;

    /**
     * The directory in which to execute <system> commands.
     */
    private URL systemInterpreterDirectory;

    /**
     * The string to prepend to all <system> calls (platform-specific).
     */
    private String systemInterpreterPrefix;

    /**
     * The JavaScript interpreter (fully-qualified class name).
     */
    private String javascriptInterpreterClassname;

    /**
     * Enable the AIML Watcher?
     */
    private boolean useWatcher;

    /**
     * The delay period when checking changed AIML (milliseconds).
     */
    private int watcherTimer;

    /**
     * The URL of the database to use.
     */
    private String databaseUrl;

    /**
     * The database driver to use.
     */
    private String databaseDriver;

    /**
     * The maximum number of simultaneous connections to the database.
     */
    private int databaseConnections;

    /**
     * The username which with to access the database.
     */
    private String databaseUser;

    /**
     * The password for the database.
     */
    private String databasePassword;

    /**
     * Configuration file for plugins.
     */
    private URL confLocationPlugins;

    /**
     * for debug
     */
    private boolean debugmode;

    /**
     * for auto-word space
     */
    private boolean autowordspace;


    /**
     * for cache session timeout
     */
    private long cachetimeout;

    /**
     * for predicates cache savefile
     */
    private boolean usefilesystem;

    /**
     * Creates a <code>CoreSettings</code> using default property values.
     */
    public CoreSettings() {
        super();
    }

    /**
     * Creates a <code>CoreSettings</code> with the (XML-formatted) properties
     * located at the given path.
     *
     * @param propertiesPath the path to the configuration file
     */
    public CoreSettings(URL propertiesPath) {
        super(propertiesPath);
    }

    /**
     * Initializes the Settings with values from properties, or defaults.
     */
    @Override
    protected void initialize() throws FileNotFoundException {
        try {
            setAimlSchemaNamespaceUri(new URI(this.properties.getProperty("programd.aiml-schema.namespace-uri", "http://alicebot.org/2001/AIML-1.0.1")));
        } catch (URISyntaxException e) {
            throw new UserError(e);
        }

        setStartupFilePath(ResourceUtils.getURL(this.properties.getProperty("programd.startup-file-path", "bots.xml")));
        
        /*
         * What to do when a category is loaded whose pattern:that:topic path
         * is identical to one already loaded (for the same bot).
         * skip: Leave the currently loaded template in place and ignore the new one.
         * overwrite: Overwrite the loaded template with the new one.
         * append: Append the content of the new template to the currently loaded one.
         * combine: Store the new template as well, so it will have an equal chance
                   of being used as the currently loaded one.
                                 [enum(skip, overwrite, append, combine): overwrite]
        */
        String mergePolicyValue = this.properties.getProperty("programd.merge.policy", "overwrite");

        if (mergePolicyValue.equals("skip")) {
            this.mergePolicy = MergePolicy.SKIP;
        } else if (mergePolicyValue.equals("overwrite")) {
            this.mergePolicy = MergePolicy.OVERWRITE;
        } else if (mergePolicyValue.equals("append")) {
            this.mergePolicy = MergePolicy.APPEND;
        } else if (mergePolicyValue.equals("combine")) {
            this.mergePolicy = MergePolicy.COMBINE;
        }
         
	    /*
         * If the append merge policy is used, what text content (if any)
	     * should be inserted between the contents of the two templates?
	     * (The default value you see here is the hex code for a space.)  [String: &#x10;]
	     */
        setMergeAppendSeparatorString(this.properties.getProperty("programd.merge.append.separator-string", "&#x10;"));//' '

        setMergeNoteEach(Boolean.valueOf(this.properties.getProperty("programd.merge.note-each", "true")).booleanValue());

        /*
         * The default value for undefined predicates. [String: undefined]
         */
        setPredicateEmptyDefault(this.properties.getProperty("programd.predicate-empty-default", "")); //@author sspark(ss.park@kt.com, 2012.11.03) "undefined"-> ""
        
        /*
         * The maximum allowable time (in milliseconds) to get a response. [int: 1000]
         */
        try {
            setResponseTimeout(Integer.parseInt(this.properties.getProperty("programd.response-timeout", "1000")));
        } catch (NumberFormatException e) {
            setResponseTimeout(1000);
        }

        try {
            setCategoryLoadNotifyInterval(Integer.parseInt(this.properties.getProperty("programd.category-load-notify-interval", "5000")));
        } catch (NumberFormatException e) {
            setCategoryLoadNotifyInterval(5000);
        }

        setLoadNotifyEachFile(Boolean.valueOf(this.properties.getProperty("programd.load.notify-each-file", "true")).booleanValue());

        setInfiniteLoopInput(this.properties.getProperty("programd.infinite-loop-input", "INFINITE LOOP"));

        setClientNamePredicate(this.properties.getProperty("programd.client-name-predicate", "name"));

        setBotNamePredicate(this.properties.getProperty("programd.bot-name-predicate", "name"));

        setOnUncaughtExceptionsPrintStackTrace(Boolean.valueOf(this.properties.getProperty("programd.on-uncaught-exceptions.print-stack-trace", "false")).booleanValue());

        setOsAccessAllowed(Boolean.valueOf(this.properties.getProperty("programd.os-access-allowed", "false")).booleanValue());

        setJavascriptAllowed(Boolean.valueOf(this.properties.getProperty("programd.javascript-allowed", "false")).booleanValue());

        setGossipPath(URLTools.contextualize(this.path, this.properties.getProperty("programd.gossip.path", "../var/log/programd/gossip.txt")));

        setConnectString(this.properties.getProperty("programd.connect-string", "CONNECT"));

        setInactivityString(this.properties.getProperty("programd.inactivity-string", "INACTIVITY"));

        setNodemapperImplementation(this.properties.getProperty("programd.nodemapper-implementation", "org.aitools.programd.graph.NonOptimalNodemaster"));
        
        /*
         *    <!-- The Multiplexor implementation to use. [String: org.aitools.programd.multiplexor.FlatFileMultiplexor]
	   		  : Flat file 형태의 multiplexor만 지원함.(즉, predicate chache 등을 file형태로 관리) 	-->
    		  <entry key="programd.multiplexor-implementation">org.aitools.programd.multiplexor.FlatFileMultiplexor</entry>
    	      <!-- <entry key="programd.multiplexor-classname">org.aitools.programd.multiplexor.DBMultiplexor</entry> -->
        */
        setMultiplexorImplementation(this.properties.getProperty("programd.multiplexor-implementation", "org.aitools.programd.multiplexor.FlatFileMultiplexor"));

        setMultiplexorFfmDir(ResourceUtils.getURL(this.properties.getProperty("programd.multiplexor.ffm-dir", "../var/programd/ffm")));

        setCachetimeout(Integer.parseInt(this.properties.getProperty("programd.predicate-cache.timeout", "90")));

        setUseFilesystem(Boolean.valueOf(this.properties.getProperty("programd.predicate-cache.usefilesystem", "true")).booleanValue());

        setHeartEnabled(Boolean.valueOf(this.properties.getProperty("programd.heart.enabled", "false")).booleanValue());

        try {
            setHeartPulserate(Integer.parseInt(this.properties.getProperty("programd.heart.pulserate", "5")));
        } catch (NumberFormatException e) {
            setHeartPulserate(5);
        }

        try {
            /*
            <!-- The maximum size of the cache(user-based) of the each bot
            before writing to disk/database. [int: 100] -->
			<entry key="programd.predicate-cache.max">100</entry> 
        	*/
            setPredicateCacheMax(Integer.parseInt(this.properties.getProperty("programd.predicate-cache.max", "100")));
        } catch (NumberFormatException e) {
            setPredicateCacheMax(100);
        }

        setConsoleUseShell(Boolean.valueOf(this.properties.getProperty("programd.console.use-shell", "true")).booleanValue());

        setExitImmediatelyOnStartup(Boolean.valueOf(this.properties.getProperty("programd.exit-immediately-on-startup", "false")).booleanValue());

        setSchemaLocationAIML(ResourceUtils.getURL(this.properties.getProperty("programd.schema-location.AIML", "../resources/schema/AIML.xsd")));

        setSchemaLocationPlugins(ResourceUtils.getURL(this.properties.getProperty("programd.schema-location.plugins", "../resources/schema/plugins.xsd")));

        setSchemaLocationTestCases(ResourceUtils.getURL(this.properties.getProperty("programd.schema-location.test-cases", "../resources/schema/test-cases.xsd")));

        setSystemInterpreterDirectory(ResourceUtils.getURL(this.properties.getProperty("programd.system-interpreter.directory", "..")));

        setSystemInterpreterPrefix(this.properties.getProperty("programd.system-interpreter.prefix", ""));

        setJavascriptInterpreterClassname(this.properties.getProperty("programd.javascript-interpreter.classname", "org.aitools.programd.interpreter.RhinoInterpreter"));

        setUseWatcher(Boolean.valueOf(this.properties.getProperty("programd.use-watcher", "true")).booleanValue());

        try {
            setWatcherTimer(Integer.parseInt(this.properties.getProperty("programd.watcher.timer", "2000")));
        } catch (NumberFormatException e) {
            setWatcherTimer(2000);
        }

        /****************************************************************************
         * S.J.H 데이터베이스 접속 정보는 Spring 프레임워크에서 관리
         ***************************************************************************/
        /*
        <!--
    		DATABASE CONFIGURATION
             * This is only meaningful if you are using a database-enabled Multiplexor
             * and/or the database-based chat logging.
        -->
        <!-- Typical mySQL configuration -->
        
        <!-- The URL of the database to use. [String: jdbc:mysql:///programdbot] -->
        <entry key="programd.database.url">jdbc:mysql:///programdbot</entry>
        
        <!-- The database driver to use. [String: com.mysql.jdbc.Driver] -->
        <entry key="programd.database.driver">com.mysql.jdbc.Driver</entry>    
        
        <!-- The maximum number of simultaneous connections to the database. [int: 25] -->
        <entry key="programd.database.connections">25</entry>
        
        <!-- The username which with to access the database. [String: programd] -->
        <entry key="programd.database.user">programd</entry>
        
        <!-- The password for the database. [String: yourpassword] -->
        <entry key="programd.database.password">yourpassword</entry>
        
        */
        /*
        setDatabaseUrl(this.properties.getProperty("programd.database.url", "jdbc:mysql:///programdbot"));

        setDatabaseDriver(this.properties.getProperty("programd.database.driver", "com.mysql.jdbc.Driver"));

        try {
            setDatabaseConnections(Integer.parseInt(this.properties.getProperty("programd.database.connections", "25")));
        } catch (NumberFormatException e) {
            setDatabaseConnections(25);
        }
        */
        /*
        setDatabaseUser(this.properties.getProperty("programd.database.user", "programd"));

        setDatabasePassword(this.properties.getProperty("programd.database.password", "yourpassword"));
        */
        setConfLocationPlugins(ResourceUtils.getURL(this.properties.getProperty("programd.conf-location.plugins", "plugins.xml")));

        //sspark for debug
        setDebugMode((Boolean.valueOf(this.properties.getProperty("programd.debug-mode", "false")).booleanValue()));

        //sspark for 자동띄어쓰기 조절 기능
        setAutoWwordSpace((Boolean.valueOf(this.properties.getProperty("programd.auto-wordspace", "false")).booleanValue()));

    }

    /**
     * Gets aiml schema namespace uri.
     *
     * @return the value of aimlSchemaNamespaceUri
     */
    public URI getAimlSchemaNamespaceUri() {
        return this.aimlSchemaNamespaceUri;
    }

    /**
     * Gets startup file path.
     *
     * @return the value of startupFilePath
     */
    public URL getStartupFilePath() {
        return this.startupFilePath;
    }

    /**
     * Gets merge policy.
     *
     * @return the value of mergePolicy
     */
    public MergePolicy getMergePolicy() {
        return this.mergePolicy;
    }

    /**
     * Gets merge append separator string.
     *
     * @return the value of mergeAppendSeparatorString
     */
    public String getMergeAppendSeparatorString() {
        return this.mergeAppendSeparatorString;
    }

    /**
     * Merge note each boolean.
     *
     * @return the value of mergeNoteEach
     */
    public boolean mergeNoteEach() {
        return this.mergeNoteEach;
    }

    /**
     * Gets predicate empty default.
     *
     * @return the value of predicateEmptyDefault
     */
    public String getPredicateEmptyDefault() {
        return this.predicateEmptyDefault;
    }

    /**
     * Gets response timeout.
     *
     * @return the value of responseTimeout
     */
    public int getResponseTimeout() {
        return this.responseTimeout;
    }

    /**
     * Gets category load notify interval.
     *
     * @return the value of categoryLoadNotifyInterval
     */
    public int getCategoryLoadNotifyInterval() {
        return this.categoryLoadNotifyInterval;
    }

    /**
     * Load notify each file boolean.
     *
     * @return the value of loadNotifyEachFile
     */
    public boolean loadNotifyEachFile() {
        return this.loadNotifyEachFile;
    }

    /**
     * Gets infinite loop input.
     *
     * @return the value of infiniteLoopInput
     */
    public String getInfiniteLoopInput() {
        return this.infiniteLoopInput;
    }

    /**
     * Gets client name predicate.
     *
     * @return the value of clientNamePredicate
     */
    public String getClientNamePredicate() {
        return this.clientNamePredicate;
    }

    /**
     * Gets bot name predicate.
     *
     * @return the value of botNamePredicate
     */
    public String getBotNamePredicate() {
        return this.botNamePredicate;
    }

    /**
     * On uncaught exception print stack trace boolean.
     *
     * @return the value of onUncaughtExceptionsPrintStackTrace
     */
    public boolean onUncaughtExceptionsPrintStackTrace() {
        return this.onUncaughtExceptionsPrintStackTrace;
    }

    /**
     * Os access allowed boolean.
     *
     * @return the value of osAccessAllowed
     */
    public boolean osAccessAllowed() {
        return this.osAccessAllowed;
    }

    /**
     * Javascript allowed boolean.
     *
     * @return the value of javascriptAllowed
     */
    public boolean javascriptAllowed() {
        return this.javascriptAllowed;
    }

    /**
     * Gets gossip path.
     *
     * @return the value of gossipPath
     */
    public URL getGossipPath() {
        return this.gossipPath;
    }

    /**
     * Gets connect string.
     *
     * @return the value of connectString
     */
    public String getConnectString() {
        return this.connectString;
    }

    /**
     * Gets inactivity string.
     *
     * @return the value of inactivityString
     */
    public String getInactivityString() {
        return this.inactivityString;
    }

    /**
     * Gets nodemapper implementation.
     *
     * @return the value of nodemapperImplementation
     */
    public String getNodemapperImplementation() {
        return this.nodemapperImplementation;
    }

    /**
     * Gets multiplexor implementation.
     *
     * @return the value of multiplexorImplementation
     */
    public String getMultiplexorImplementation() {
        return this.multiplexorImplementation;
    }

    /**
     * Gets multiplexor ffm dir.
     *
     * @return the value of multiplexorFfmDir
     */
    public URL getMultiplexorFfmDir() {
        return this.multiplexorFfmDir;
    }

    /**
     * Heart enabled boolean.
     *
     * @return the value of heartEnabled
     */
    public boolean heartEnabled() {
        return this.heartEnabled;
    }

    /**
     * Gets heart pulserate.
     *
     * @return the value of heartPulserate
     */
    public int getHeartPulserate() {
        return this.heartPulserate;
    }

    /**
     * Gets predicate cache max.
     *
     * @return the value of predicateCacheMax
     */
    public int getPredicateCacheMax() {
        return this.predicateCacheMax;
    }

    /**
     * Console use shell boolean.
     *
     * @return the value of consoleUseShell
     */
    public boolean consoleUseShell() {
        return this.consoleUseShell;
    }

    /**
     * Exit immediately on startup boolean.
     *
     * @return the value of exitImmediatelyOnStartup
     */
    public boolean exitImmediatelyOnStartup() {
        return this.exitImmediatelyOnStartup;
    }

    /**
     * Gets schema location aiml.
     *
     * @return the value of schemaLocationAIML
     */
    public URL getSchemaLocationAIML() {
        return this.schemaLocationAIML;
    }

    /**
     * Gets schema location plugins.
     *
     * @return the value of schemaLocationPlugins
     */
    public URL getSchemaLocationPlugins() {
        return this.schemaLocationPlugins;
    }

    /**
     * Gets schema location test cases.
     *
     * @return the value of schemaLocationTestCases
     */
    public URL getSchemaLocationTestCases() {
        return this.schemaLocationTestCases;
    }

    /**
     * Gets system interpreter directory.
     *
     * @return the value of systemInterpreterDirectory
     */
    public URL getSystemInterpreterDirectory() {
        return this.systemInterpreterDirectory;
    }

    /**
     * Gets system interpreter prefix.
     *
     * @return the value of systemInterpreterPrefix
     */
    public String getSystemInterpreterPrefix() {
        return this.systemInterpreterPrefix;
    }

    /**
     * Gets javascript interpreter classname.
     *
     * @return the value of javascriptInterpreterClassname
     */
    public String getJavascriptInterpreterClassname() {
        return this.javascriptInterpreterClassname;
    }

    /**
     * Use watcher boolean.
     *
     * @return the value of useWatcher
     */
    public boolean useWatcher() {
        return this.useWatcher;
    }

    /**
     * Gets watcher timer.
     *
     * @return the value of watcherTimer
     */
    public int getWatcherTimer() {
        return this.watcherTimer;
    }

    /**
     * Gets database url.
     *
     * @return the value of databaseUrl
     */
    public String getDatabaseUrl() {
        return this.databaseUrl;
    }

    /**
     * Gets database driver.
     *
     * @return the value of databaseDriver
     */
    public String getDatabaseDriver() {
        return this.databaseDriver;
    }

    /**
     * Gets database connections.
     *
     * @return the value of databaseConnections
     */
    public int getDatabaseConnections() {
        return this.databaseConnections;
    }

    /**
     * Gets database user.
     *
     * @return the value of databaseUser
     */
    public String getDatabaseUser() {
        return this.databaseUser;
    }

    /**
     * Gets database password.
     *
     * @return the value of databasePassword
     */
    public String getDatabasePassword() {
        return this.databasePassword;
    }

    /**
     * Gets conf location plugins.
     *
     * @return the value of confLocationPlugins
     */
    public URL getConfLocationPlugins() {
        return this.confLocationPlugins;
    }

    /**
     * Sets aiml schema namespace uri.
     *
     * @param aimlSchemaNamespaceUriToSet the value to which to set aimlSchemaNamespaceUri
     */
    public void setAimlSchemaNamespaceUri(URI aimlSchemaNamespaceUriToSet) {
        this.aimlSchemaNamespaceUri = aimlSchemaNamespaceUriToSet;
    }

    /**
     * Sets startup file path.
     *
     * @param startupFilePathToSet the value to which to set startupFilePath
     */
    public void setStartupFilePath(URL startupFilePathToSet) {
        this.startupFilePath = startupFilePathToSet;
    }

    /**
     * Sets merge policy.
     *
     * @param mergePolicyToSet the value to which to set mergePolicy
     */
    public void setMergePolicy(MergePolicy mergePolicyToSet) {
        this.mergePolicy = mergePolicyToSet;
    }

    /**
     * Sets merge append separator string.
     *
     * @param mergeAppendSeparatorStringToSet the value to which to set mergeAppendSeparatorString
     */
    public void setMergeAppendSeparatorString(String mergeAppendSeparatorStringToSet) {
        this.mergeAppendSeparatorString = mergeAppendSeparatorStringToSet;
    }

    /**
     * Sets merge note each.
     *
     * @param mergeNoteEachToSet the value to which to set mergeNoteEach
     */
    public void setMergeNoteEach(boolean mergeNoteEachToSet) {
        this.mergeNoteEach = mergeNoteEachToSet;
    }

    /**
     * Sets predicate empty default.
     *
     * @param predicateEmptyDefaultToSet the value to which to set predicateEmptyDefault
     */
    public void setPredicateEmptyDefault(String predicateEmptyDefaultToSet) {
        this.predicateEmptyDefault = predicateEmptyDefaultToSet;
    }

    /**
     * Sets response timeout.
     *
     * @param responseTimeoutToSet the value to which to set responseTimeout
     */
    public void setResponseTimeout(int responseTimeoutToSet) {
        this.responseTimeout = responseTimeoutToSet;
    }

    /**
     * Sets category load notify interval.
     *
     * @param categoryLoadNotifyIntervalToSet the value to which to set categoryLoadNotifyInterval
     */
    public void setCategoryLoadNotifyInterval(int categoryLoadNotifyIntervalToSet) {
        this.categoryLoadNotifyInterval = categoryLoadNotifyIntervalToSet;
    }

    /**
     * Sets load notify each file.
     *
     * @param loadNotifyEachFileToSet the value to which to set loadNotifyEachFile
     */
    public void setLoadNotifyEachFile(boolean loadNotifyEachFileToSet) {
        this.loadNotifyEachFile = loadNotifyEachFileToSet;
    }

    /**
     * Sets infinite loop input.
     *
     * @param infiniteLoopInputToSet the value to which to set infiniteLoopInput
     */
    public void setInfiniteLoopInput(String infiniteLoopInputToSet) {
        this.infiniteLoopInput = infiniteLoopInputToSet;
    }

    /**
     * Sets client name predicate.
     *
     * @param clientNamePredicateToSet the value to which to set clientNamePredicate
     */
    public void setClientNamePredicate(String clientNamePredicateToSet) {
        this.clientNamePredicate = clientNamePredicateToSet;
    }

    /**
     * Sets bot name predicate.
     *
     * @param botNamePredicateToSet the value to which to set botNamePredicate
     */
    public void setBotNamePredicate(String botNamePredicateToSet) {
        this.botNamePredicate = botNamePredicateToSet;
    }

    /**
     * Sets on uncaught exception print stack trace.
     *
     * @param onUncaughtExceptionsPrintStackTraceToSet the value to which to set onUncaughtExceptionsPrintStackTrace
     */
    public void setOnUncaughtExceptionsPrintStackTrace(boolean onUncaughtExceptionsPrintStackTraceToSet) {
        this.onUncaughtExceptionsPrintStackTrace = onUncaughtExceptionsPrintStackTraceToSet;
    }

    /**
     * Sets os access allowed.
     *
     * @param osAccessAllowedToSet the value to which to set osAccessAllowed
     */
    public void setOsAccessAllowed(boolean osAccessAllowedToSet) {
        this.osAccessAllowed = osAccessAllowedToSet;
    }

    /**
     * Sets javascript allowed.
     *
     * @param javascriptAllowedToSet the value to which to set javascriptAllowed
     */
    public void setJavascriptAllowed(boolean javascriptAllowedToSet) {
        this.javascriptAllowed = javascriptAllowedToSet;
    }

    /**
     * Sets gossip path.
     *
     * @param gossipPathToSet the value to which to set gossipPath
     */
    public void setGossipPath(URL gossipPathToSet) {
        this.gossipPath = gossipPathToSet;
    }

    /**
     * Sets connect string.
     *
     * @param connectStringToSet the value to which to set connectString
     */
    public void setConnectString(String connectStringToSet) {
        this.connectString = connectStringToSet;
    }

    /**
     * Sets inactivity string.
     *
     * @param inactivityStringToSet the value to which to set inactivityString
     */
    public void setInactivityString(String inactivityStringToSet) {
        this.inactivityString = inactivityStringToSet;
    }

    /**
     * Sets nodemapper implementation.
     *
     * @param nodemapperImplementationToSet the value to which to set nodemapperImplementation
     */
    public void setNodemapperImplementation(String nodemapperImplementationToSet) {
        this.nodemapperImplementation = nodemapperImplementationToSet;
    }

    /**
     * Sets multiplexor implementation.
     *
     * @param multiplexorImplementationToSet the value to which to set multiplexorImplementation
     */
    public void setMultiplexorImplementation(String multiplexorImplementationToSet) {
        this.multiplexorImplementation = multiplexorImplementationToSet;
    }

    /**
     * Sets multiplexor ffm dir.
     *
     * @param multiplexorFfmDirToSet the value to which to set multiplexorFfmDir
     */
    public void setMultiplexorFfmDir(URL multiplexorFfmDirToSet) {
        this.multiplexorFfmDir = multiplexorFfmDirToSet;
    }

    /**
     * Sets heart enabled.
     *
     * @param heartEnabledToSet the value to which to set heartEnabled
     */
    public void setHeartEnabled(boolean heartEnabledToSet) {
        this.heartEnabled = heartEnabledToSet;
    }

    /**
     * Sets heart pulserate.
     *
     * @param heartPulserateToSet the value to which to set heartPulserate
     */
    public void setHeartPulserate(int heartPulserateToSet) {
        this.heartPulserate = heartPulserateToSet;
    }

    /**
     * Sets predicate cache max.
     *
     * @param predicateCacheMaxToSet the value to which to set predicateCacheMax
     */
    public void setPredicateCacheMax(int predicateCacheMaxToSet) {
        this.predicateCacheMax = predicateCacheMaxToSet;
    }

    /**
     * Sets console use shell.
     *
     * @param consoleUseShellToSet the value to which to set consoleUseShell
     */
    public void setConsoleUseShell(boolean consoleUseShellToSet) {
        this.consoleUseShell = consoleUseShellToSet;
    }

    /**
     * Sets exit immediately on startup.
     *
     * @param exitImmediatelyOnStartupToSet the value to which to set exitImmediatelyOnStartup
     */
    public void setExitImmediatelyOnStartup(boolean exitImmediatelyOnStartupToSet) {
        this.exitImmediatelyOnStartup = exitImmediatelyOnStartupToSet;
    }

    /**
     * Sets schema location aiml.
     *
     * @param schemaLocationAIMLToSet the value to which to set schemaLocationAIML
     */
    public void setSchemaLocationAIML(URL schemaLocationAIMLToSet) {
        this.schemaLocationAIML = schemaLocationAIMLToSet;
    }

    /**
     * Sets schema location plugins.
     *
     * @param schemaLocationPluginsToSet the value to which to set schemaLocationPlugins
     */
    public void setSchemaLocationPlugins(URL schemaLocationPluginsToSet) {
        this.schemaLocationPlugins = schemaLocationPluginsToSet;
    }

    /**
     * Sets schema location test cases.
     *
     * @param schemaLocationTestCasesToSet the value to which to set schemaLocationTestCases
     */
    public void setSchemaLocationTestCases(URL schemaLocationTestCasesToSet) {
        this.schemaLocationTestCases = schemaLocationTestCasesToSet;
    }

    /**
     * Sets system interpreter directory.
     *
     * @param systemInterpreterDirectoryToSet the value to which to set systemInterpreterDirectory
     */
    public void setSystemInterpreterDirectory(URL systemInterpreterDirectoryToSet) {
        this.systemInterpreterDirectory = systemInterpreterDirectoryToSet;
    }

    /**
     * Sets system interpreter prefix.
     *
     * @param systemInterpreterPrefixToSet the value to which to set systemInterpreterPrefix
     */
    public void setSystemInterpreterPrefix(String systemInterpreterPrefixToSet) {
        this.systemInterpreterPrefix = systemInterpreterPrefixToSet;
    }

    /**
     * Sets javascript interpreter classname.
     *
     * @param javascriptInterpreterClassnameToSet the value to which to set javascriptInterpreterClassname
     */
    public void setJavascriptInterpreterClassname(String javascriptInterpreterClassnameToSet) {
        this.javascriptInterpreterClassname = javascriptInterpreterClassnameToSet;
    }

    /**
     * Sets use watcher.
     *
     * @param useWatcherToSet the value to which to set useWatcher
     */
    public void setUseWatcher(boolean useWatcherToSet) {
        this.useWatcher = useWatcherToSet;
    }

    /**
     * Sets watcher timer.
     *
     * @param watcherTimerToSet the value to which to set watcherTimer
     */
    public void setWatcherTimer(int watcherTimerToSet) {
        this.watcherTimer = watcherTimerToSet;
    }

    /**
     * Sets database url.
     *
     * @param databaseUrlToSet the value to which to set databaseUrl
     */
    public void setDatabaseUrl(String databaseUrlToSet) {
        this.databaseUrl = databaseUrlToSet;
    }

    /**
     * Sets database driver.
     *
     * @param databaseDriverToSet the value to which to set databaseDriver
     */
    public void setDatabaseDriver(String databaseDriverToSet) {
        this.databaseDriver = databaseDriverToSet;
    }

    /**
     * Sets database connections.
     *
     * @param databaseConnectionsToSet the value to which to set databaseConnections
     */
    public void setDatabaseConnections(int databaseConnectionsToSet) {
        this.databaseConnections = databaseConnectionsToSet;
    }

    /**
     * Sets database user.
     *
     * @param databaseUserToSet the value to which to set databaseUser
     */
    public void setDatabaseUser(String databaseUserToSet) {
        this.databaseUser = databaseUserToSet;
    }

    /**
     * Sets database password.
     *
     * @param databasePasswordToSet the value to which to set databasePassword
     */
    public void setDatabasePassword(String databasePasswordToSet) {
        this.databasePassword = databasePasswordToSet;
    }

    /**
     * Sets conf location plugins.
     *
     * @param confLocationPluginsToSet the value to which to set confLocationPlugins
     */
    public void setConfLocationPlugins(URL confLocationPluginsToSet) {
        this.confLocationPlugins = confLocationPluginsToSet;
    }

    /**
     * Sets debug mode.
     *
     * @param debug the debug
     */
    public void setDebugMode(boolean debug) {
        this.debugmode = debug;
    }

    /**
     * Gets debug mode.
     *
     * @return debug mode
     */
    public boolean getDebugMode() {
        return this.debugmode;
    }

    /**
     * Gets auto wword space.
     *
     * @return autowordspace auto wword space
     */
    public boolean getAutoWwordSpace() {
        return this.autowordspace;
    }

    /**
     * Sets auto wword space.
     *
     * @param wordspace the wordspace
     */
    public void setAutoWwordSpace(boolean wordspace) {
        this.autowordspace = wordspace;
    }


    /**
     * Sets cachetimeout.
     *
     * @param timeout the timeout
     */
    public void setCachetimeout(int timeout) {
        this.cachetimeout = timeout * 1000; //sec -> msec
    }

    /**
     * Gets cachetimeout.
     *
     * @return the cachetimeout
     */
    public long getCachetimeout() {
        return this.cachetimeout;
    }

    /**
     * Sets use filesystem.
     *
     * @param filesystem the filesystem
     */
    public void setUseFilesystem(boolean filesystem) {
        this.usefilesystem = filesystem;
    }

    /**
     * Gets use filesystem.
     *
     * @return the use filesystem
     */
    public boolean getUseFilesystem() {
        return this.usefilesystem;
    }

}