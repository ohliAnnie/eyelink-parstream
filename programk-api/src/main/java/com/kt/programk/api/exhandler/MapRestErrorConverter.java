/*
 * Copyright 2012 Stormpath, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.kt.programk.api.exhandler;

import org.springframework.http.HttpStatus;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Simple {@code RestErrorConverter} implementation that creates a new Map instance based on the specified RestError
 * instance.  Some {@link org.springframework.http.converter.HttpMessageConverter HttpMessageConverter}s (like a JSON
 * converter) can easily automatically convert Maps to response bodies.  The map is populated with the following
 * default name/value pairs:
 * <p>
 * <table>
 * <tr>
 * <th>Key (a String)</th>
 * <th>Value (an Object)</th>
 * <th>Notes</th>
 * </tr>
 * <tr>
 * <td>status</td>
 * <td>restError.{@link RestError#getStatus() getStatus()}.{@link org.springframework.http.HttpStatus#value() value()}</td>
 * <td></td>
 * </tr>
 * <tr>
 * <td>code</td>
 * <td>restError.{@link RestError#getCode() getCode()}</td>
 * <td>Only set if {@code code > 0}</td>
 * </tr>
 * <tr>
 * <td>message</td>
 * <td>restError.{@link RestError#getMessage() getMessage()}</td>
 * <td>Only set if {@code message != null}</td>
 * </tr>
 * <tr>
 * <td>developerMessage</td>
 * <td>restError.{@link RestError#getDeveloperMessage() getDeveloperMessage()}</td>
 * <td>Only set if {@code developerMessage != null}</td>
 * </tr>
 * </table>
 * <p/>
 * The map key names are customizable via setter methods (setStatusKey, setMessageKey, etc).
 *
 * @author Les Hazlewood
 */
public class MapRestErrorConverter implements RestErrorConverter<Map> {

    /**
     * The constant DEFAULT_STATUS_KEY.
     */
    private static final String DEFAULT_STATUS_KEY = "status";
    /**
     * The constant DEFAULT_CODE_KEY.
     */
    private static final String DEFAULT_CODE_KEY = "code";
    /**
     * The constant DEFAULT_MESSAGE_KEY.
     */
    private static final String DEFAULT_MESSAGE_KEY = "message";
    /**
     * The constant DEFAULT_DEVELOPER_MESSAGE_KEY.
     */
    private static final String DEFAULT_DEVELOPER_MESSAGE_KEY = "developerMessage";
    /**
     * The constant DEFAULT_MORE_INFO_URL_KEY.
     */
    private static final String DEFAULT_MORE_INFO_URL_KEY = "moreInfoUrl";

    /**
     * The Status key.
     */
    private String statusKey = DEFAULT_STATUS_KEY;
    /**
     * The Code key.
     */
    private String codeKey = DEFAULT_CODE_KEY;
    /**
     * The Message key.
     */
    private String messageKey = DEFAULT_MESSAGE_KEY;
    /**
     * The Developer message key.
     */
    private String developerMessageKey = DEFAULT_DEVELOPER_MESSAGE_KEY;
    /**
     * The More info url key.
     */
    private String moreInfoUrlKey = DEFAULT_MORE_INFO_URL_KEY;

    /**
     * Convert map.
     *
     * @param re the re
     * @return the map
     */
    @Override
    public Map convert(RestError re) {
        Map<String, Object> m = createMap();
        HttpStatus status = re.getStatus();
        m.put(getStatusKey(), status.value());

        int code = re.getCode();
        if (code > 0) {
            m.put(getCodeKey(), code);
        }

        String message = re.getMessage();
        if (message != null) {
            m.put(getMessageKey(), message);
        }

        String devMsg = re.getDeveloperMessage();
        if (devMsg != null) {
            m.put(getDeveloperMessageKey(), devMsg);
        }

        return m;
    }

    /**
     * Create map map.
     *
     * @return the map
     */
    protected Map<String,Object> createMap() {
        return new LinkedHashMap<String, Object>();
    }

    /**
     * Gets status key.
     *
     * @return the status key
     */
    public String getStatusKey() {
        return statusKey;
    }

    /**
     * Sets status key.
     *
     * @param statusKey the status key
     */
    public void setStatusKey(String statusKey) {
        this.statusKey = statusKey;
    }

    /**
     * Gets code key.
     *
     * @return the code key
     */
    public String getCodeKey() {
        return codeKey;
    }

    /**
     * Sets code key.
     *
     * @param codeKey the code key
     */
    public void setCodeKey(String codeKey) {
        this.codeKey = codeKey;
    }

    /**
     * Gets message key.
     *
     * @return the message key
     */
    public String getMessageKey() {
        return messageKey;
    }

    /**
     * Sets message key.
     *
     * @param messageKey the message key
     */
    public void setMessageKey(String messageKey) {
        this.messageKey = messageKey;
    }

    /**
     * Gets developer message key.
     *
     * @return the developer message key
     */
    public String getDeveloperMessageKey() {
        return developerMessageKey;
    }

    /**
     * Sets developer message key.
     *
     * @param developerMessageKey the developer message key
     */
    public void setDeveloperMessageKey(String developerMessageKey) {
        this.developerMessageKey = developerMessageKey;
    }

    /**
     * Gets more info url key.
     *
     * @return the more info url key
     */
    public String getMoreInfoUrlKey() {
        return moreInfoUrlKey;
    }

    /**
     * Sets more info url key.
     *
     * @param moreInfoUrlKey the more info url key
     */
    public void setMoreInfoUrlKey(String moreInfoUrlKey) {
        this.moreInfoUrlKey = moreInfoUrlKey;
    }
}
