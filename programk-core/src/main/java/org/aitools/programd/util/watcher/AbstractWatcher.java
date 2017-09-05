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
 * Seo Jong Hwa        2016 . 7 . 1
 */

package org.aitools.programd.util.watcher;

import java.io.IOException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import org.aitools.programd.Core;
import org.aitools.programd.util.URLTools;
import org.apache.log4j.Logger;

/**
 * ProgramK 파일 감시 추상클래스
 */
public abstract class AbstractWatcher {
    /**
     * Core
     */
    protected Core core;
    /**
     * Used for storing information about file changes.
     */
    protected Map<URL, Long> watchMap = new HashMap<URL, Long>();

    /**
     * 로그 파일 경로
     */
    protected Logger logger = Logger.getLogger("programd");
    /**
     * The Timer that handles watching AIML files.
     */
    private Timer timer;

    /**
     * 생성자
     * @param coreToUse
     */
    public AbstractWatcher(Core coreToUse) {
        this.core = coreToUse;
        this.logger = this.core.getLogger();
    }

    /**
     * Starts the AIMLWatcher.
     */
    public void start() {
        this.timer = new Timer(true);
        this.timer.schedule(new CheckAIMLTask(), 0, this.core.getSettings().getWatcherTimer());
    }

    /**
     * Stops the AIMLWatcher.
     */
    public void stop() {
        if (this.timer != null) {
            this.timer.cancel();
            this.timer = null;

        }
    }

    /**
     * 파일 종류 마다 로직을 정의해야함
     * @param path
     */
    protected abstract void reload(URL path);

    /**
     * Adds a file to the watchlist.
     *
     * @param path the path to the file
     */
    @SuppressWarnings("boxing")
    public void addWatchFile(URL path) {
        if (this.logger.isDebugEnabled()) {
            this.logger.debug(String.format("Adding watch file \"%s\".", path));
        }
        synchronized (this) {
            if (URLTools.seemsToExist(path)) {
                if (!this.watchMap.containsKey(path)) {
                    this.watchMap.put(path, URLTools.getLastModified(path));
                }
            } else {
                this.logger.warn(String.format("AIMLWatcher cannot read path \"%s\"", path), new IOException());
            }
        }
    }

    /**
     * A {@link java.util.TimerTask TimerTask} for checking changed AIML files.
     */
    protected class CheckAIMLTask extends TimerTask {
        /**
         * Creates a new CheckAIMLTask.
         */
        public CheckAIMLTask() {
            super();
        }

        /**
         * @see TimerTask#run()
         */
        @SuppressWarnings("boxing")
        @Override
        public void run() {
            synchronized (AbstractWatcher.this) {
                for (URL path : AbstractWatcher.this.watchMap.keySet()) {
                    long previousTime = AbstractWatcher.this.watchMap.get(path);
                    if (previousTime != 0) {
                        long lastModified = URLTools.getLastModified(path);
                        if (lastModified > previousTime) {
                            AbstractWatcher.this.watchMap.put(path, lastModified);
                            reload(path);
                        }
                    }
                }
            }
        }
    }
}
