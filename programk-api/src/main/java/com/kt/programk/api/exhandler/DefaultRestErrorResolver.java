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

import com.google.gson.Gson;
import com.kt.programk.common.logs.CLogger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.TypeMismatchException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.MessageSource;
import org.springframework.context.MessageSourceAware;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.mvc.multiaction.NoSuchRequestHandlingMethodException;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

/**
 * The type Default rest error resolver.
 */
public class DefaultRestErrorResolver implements RestErrorResolver, MessageSourceAware, InitializingBean {
    /**
     * The constant DEFAULT_EXCEPTION_MESSAGE_VALUE.
     */
    public static final String DEFAULT_EXCEPTION_MESSAGE_VALUE = "_exmsg";
    /**
     * The constant DEFAULT_MESSAGE_VALUE.
     */
    public static final String DEFAULT_MESSAGE_VALUE = "_msg";

    /**
     * The constant log.
     */
    private static final Logger log = LoggerFactory.getLogger(DefaultRestErrorResolver.class);

    /**
     * The Exception mappings.
     */
    private Map<String, RestError> exceptionMappings = Collections.emptyMap();

    /**
     * The Exception mapping definitions.
     */
    private Map<String, String> exceptionMappingDefinitions = Collections.emptyMap();

    /**
     * The Message source.
     */
    private MessageSource messageSource;
    /**
     * The Locale resolver.
     */
    private LocaleResolver localeResolver;

    /**
     * The Default empty code to status.
     */
    private boolean defaultEmptyCodeToStatus;
    /**
     * The Default developer message.
     */
    private String defaultDeveloperMessage;

    /**
     * JSON 변환
     */
    private final Gson gson = new Gson();

    /**
     * Instantiates a new Default rest error resolver.
     */
    public DefaultRestErrorResolver() {
        this.defaultEmptyCodeToStatus = true;
        this.defaultDeveloperMessage = DEFAULT_EXCEPTION_MESSAGE_VALUE;
    }

    /**
     * Sets message source.
     *
     * @param messageSource the message source
     */
    public void setMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * Sets locale resolver.
     *
     * @param resolver the resolver
     */
    public void setLocaleResolver(LocaleResolver resolver) {
        this.localeResolver = resolver;
    }

    /**
     * Sets exception mapping definitions.
     *
     * @param exceptionMappingDefinitions the exception mapping definitions
     */
    public void setExceptionMappingDefinitions(Map<String, String> exceptionMappingDefinitions) {
        this.exceptionMappingDefinitions = exceptionMappingDefinitions;
    }


    /**
     * Sets default empty code to status.
     *
     * @param defaultEmptyCodeToStatus the default empty code to status
     */
    public void setDefaultEmptyCodeToStatus(boolean defaultEmptyCodeToStatus) {
        this.defaultEmptyCodeToStatus = defaultEmptyCodeToStatus;
    }

    /**
     * Sets default developer message.
     *
     * @param defaultDeveloperMessage the default developer message
     */
    public void setDefaultDeveloperMessage(String defaultDeveloperMessage) {
        this.defaultDeveloperMessage = defaultDeveloperMessage;
    }

    /**
     * After properties set.
     */
    @Override
    public void afterPropertiesSet(){

        //populate with some defaults:
        Map<String, String> definitions = createDefaultExceptionMappingDefinitions();

        //add in user-specified mappings (will override defaults as necessary):
        if (this.exceptionMappingDefinitions != null && !this.exceptionMappingDefinitions.isEmpty()) {
            definitions.putAll(this.exceptionMappingDefinitions);
        }

        this.exceptionMappings = toRestErrors(definitions);
    }

    /**
     * Create default exception mapping definitions.
     *
     * @return the map
     */
    protected final Map<String, String> createDefaultExceptionMappingDefinitions() {

        Map<String, String> m = new LinkedHashMap<String, String>();

        // 400
        applyDef(m, HttpMessageNotReadableException.class, HttpStatus.BAD_REQUEST);
        applyDef(m, MissingServletRequestParameterException.class, HttpStatus.BAD_REQUEST);
        applyDef(m, TypeMismatchException.class, HttpStatus.BAD_REQUEST);
        applyDef(m, "javax.validation.ValidationException", HttpStatus.BAD_REQUEST);

        // 404
        applyDef(m, NoSuchRequestHandlingMethodException.class, HttpStatus.NOT_FOUND);
        applyDef(m, "org.hibernate.ObjectNotFoundException", HttpStatus.NOT_FOUND);

        // 405
        applyDef(m, HttpRequestMethodNotSupportedException.class, HttpStatus.METHOD_NOT_ALLOWED);

        // 406
        applyDef(m, HttpMediaTypeNotAcceptableException.class, HttpStatus.NOT_ACCEPTABLE);

        // 409
        //can't use the class directly here as it may not be an available dependency:
        applyDef(m, "org.springframework.dao.DataIntegrityViolationException", HttpStatus.CONFLICT);

        // 415
        applyDef(m, HttpMediaTypeNotSupportedException.class, HttpStatus.UNSUPPORTED_MEDIA_TYPE);

        return m;
    }

    /**
     * Apply def.
     *
     * @param m      the m
     * @param clazz  the clazz
     * @param status the status
     */
    private void applyDef(Map<String, String> m, Class clazz, HttpStatus status) {
        applyDef(m, clazz.getName(), status);
    }

    /**
     * Apply def.
     *
     * @param m      the m
     * @param key    the key
     * @param status the status
     */
    private void applyDef(Map<String, String> m, String key, HttpStatus status) {
        m.put(key, definitionFor(status));
    }

    /**
     * Definition for.
     *
     * @param status the status
     * @return the string
     */
    private String definitionFor(HttpStatus status) {
        return status.value() + ", " + DEFAULT_EXCEPTION_MESSAGE_VALUE;
    }

    /**
     * Resolve error.
     *
     * @param request the request
     * @param handler the handler
     * @param ex      the ex
     * @return the rest error
     */
    @Override
    public RestError resolveError(ServletWebRequest request, Object handler, Exception ex) {

        RestError template = getRestErrorTemplate(ex);
        if (template == null) {
            return null;
        }

        RestError.Builder builder = new RestError.Builder();
        builder.setStatus(getStatusValue(template, request, ex));
        builder.setCode(getCode(template, request, ex));
        builder.setThrowable(ex);

        String msg = getMessage(template, request, ex);
        if (msg != null) {
            builder.setMessage(msg);
        }
        msg = getDeveloperMessage(template, request, ex);
        if (msg != null) {
            builder.setDeveloperMessage(msg);
        }

        RestError build = builder.build();
        CLogger.error(gson.toJson(build));

        return build;
    }

    /**
     * Gets status value.
     *
     * @param template the template
     * @param request  the request
     * @param ex       the ex
     * @return the status value
     */
    protected int getStatusValue(RestError template, ServletWebRequest request, Exception ex) {
        return template.getStatus().value();
    }

    /**
     * Gets code.
     *
     * @param template the template
     * @param request  the request
     * @param ex       the ex
     * @return the code
     */
    protected int getCode(RestError template, ServletWebRequest request, Exception ex) {
        int code = template.getCode();
        if (code <= 0 && defaultEmptyCodeToStatus) {
            code = getStatusValue(template, request, ex);
        }
        return code;
    }

    /**
     * Gets more info url.
     *
     * @param template the template
     * @param request the request
     * @param ex the ex
     * @return the more info url
     */
//    protected String getMoreInfoUrl(RestError template, ServletWebRequest request, Exception ex) {
//        String moreInfoUrl = template.getMoreInfoUrl();
//        if (moreInfoUrl == null) {
//            moreInfoUrl = this.defaultMoreInfoUrl;
//        }
//        return moreInfoUrl;
//    }

    /**
     * Gets message.
     *
     * @param template the template
     * @param request  the request
     * @param ex       the ex
     * @return the message
     */
    protected String getMessage(RestError template, ServletWebRequest request, Exception ex) {
        return getMessage(template.getMessage(), request, ex);
    }

    /**
     * Gets developer message.
     *
     * @param template the template
     * @param request  the request
     * @param ex       the ex
     * @return the developer message
     */
    protected String getDeveloperMessage(RestError template, ServletWebRequest request, Exception ex) {
        String devMsg = template.getDeveloperMessage();
        if (devMsg == null && defaultDeveloperMessage != null) {
            devMsg = defaultDeveloperMessage;
        }
        if (DEFAULT_MESSAGE_VALUE.equals(devMsg)) {
            devMsg = template.getMessage();
        }
        return getMessage(devMsg, request, ex);
    }

    /**
     * Returns the response status message to return to the client, or {@code null} if no
     * status message should be returned.
     *
     * @param msg        the msg
     * @param webRequest the web request
     * @param ex         the ex
     * @return the response status message to return to the client, or
     * if no
     * status message should be returned.
     */
    protected String getMessage(String msg, ServletWebRequest webRequest, Exception ex) {
        String temp = msg;

        if (temp != null) {
            if (temp.equalsIgnoreCase("null") || temp.equalsIgnoreCase("off")) {
                return null;
            }
            if (temp.equalsIgnoreCase(DEFAULT_EXCEPTION_MESSAGE_VALUE)) {
                temp = ex.getMessage();
            }
            if (messageSource != null) {
                Locale locale = null;
                if (localeResolver != null) {
                    locale = localeResolver.resolveLocale(webRequest.getRequest());
                }
                temp = messageSource.getMessage(temp, null, temp, locale);
            }
        }

        return temp;
    }

    /**
     * Returns the config-time 'template' RestError instance configured for the specified Exception, or
     * {@code null} if a match was not found.
     * <p/>
     * The config-time template is used as the basis for the RestError constructed at runtime.
     *
     * @param ex the ex
     * @return the template to use for the RestError instance to be constructed.
     */
    private RestError getRestErrorTemplate(Exception ex) {
        Map<String, RestError> mappings = this.exceptionMappings;
        if (CollectionUtils.isEmpty(mappings)) {
            return null;
        }
        RestError template = null;
        String dominantMapping = null;
        int deepest = Integer.MAX_VALUE;
        for (Map.Entry<String, RestError> entry : mappings.entrySet()) {
            String key = entry.getKey();
            int depth = getDepth(key, ex);
            if (depth >= 0 && depth < deepest) {
                deepest = depth;
                dominantMapping = key;
                template = entry.getValue();
            }
        }
        if (template != null && log.isDebugEnabled()) {
            log.debug("Resolving to RestError template '" + template + "' for exception of type [" + ex.getClass().getName() +
                    "], based on exception mapping [" + dominantMapping + "]");
        }
        return template;
    }

    /**
     * Return the depth to the superclass matching.
     * <p>0 means ex matches exactly. Returns -1 if there's no match.
     * Otherwise, returns depth. Lowest depth wins.
     *
     * @param exceptionMapping the exception mapping
     * @param ex               the ex
     * @return the depth
     */
    protected int getDepth(String exceptionMapping, Exception ex) {
        return getDepth(exceptionMapping, ex.getClass(), 0);
    }

    /**
     * Gets depth.
     *
     * @param exceptionMapping the exception mapping
     * @param exceptionClass   the exception class
     * @param depth            the depth
     * @return the depth
     */
    private int getDepth(String exceptionMapping, Class exceptionClass, int depth) {
        if (exceptionClass.getName().contains(exceptionMapping)) {
            // Found it!
            return depth;
        }
        // If we've gone as far as we can go and haven't found it...
        if (exceptionClass.equals(Throwable.class)) {
            return -1;
        }
        return getDepth(exceptionMapping, exceptionClass.getSuperclass(), depth + 1);
    }


    /**
     * To rest errors.
     *
     * @param smap the smap
     * @return the map
     */
    protected Map<String, RestError> toRestErrors(Map<String, String> smap) {
        if (CollectionUtils.isEmpty(smap)) {
            return Collections.emptyMap();
        }

        Map<String, RestError> map = new LinkedHashMap<String, RestError>(smap.size());

        for (Map.Entry<String, String> entry : smap.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            RestError template = toRestError(value);
            map.put(key, template);
        }

        return map;
    }

    /**
     * To rest error.
     *
     * @param exceptionConfig the exception config
     * @return the rest error
     */
    protected RestError toRestError(String exceptionConfig) {
        String[] values = StringUtils.commaDelimitedListToStringArray(exceptionConfig);
        if (values == null || values.length == 0) {
            throw new IllegalStateException("Invalid config mapping.  Exception names must map to a string configuration.");
        }

        RestError.Builder builder = new RestError.Builder();

        boolean statusSet = false;
        boolean codeSet = false;
        boolean msgSet = false;
        boolean devMsgSet = false;
        boolean moreInfoSet = false;

        for (String value : values) {

            String trimmedVal = StringUtils.trimWhitespace(value);

            //check to see if the value is an explicitly named key/value pair:
            String[] pair = StringUtils.split(trimmedVal, "=");
            if (pair != null) {
                //explicit attribute set:
                String pairKey = StringUtils.trimWhitespace(pair[0]);
                if (!StringUtils.hasText(pairKey)) {
                    pairKey = null;
                }
                String pairValue = StringUtils.trimWhitespace(pair[1]);
                if (!StringUtils.hasText(pairValue)) {
                    pairValue = null;
                }
                if ("status".equalsIgnoreCase(pairKey)) {
                    int statusCode = getRequiredInt(pairKey, pairValue);
                    builder.setStatus(statusCode);
                    statusSet = true;
                } else if ("code".equalsIgnoreCase(pairKey)) {
                    int code = getRequiredInt(pairKey, pairValue);
                    builder.setCode(code);
                    codeSet = true;
                } else if ("msg".equalsIgnoreCase(pairKey)) {
                    builder.setMessage(pairValue);
                    msgSet = true;
                } else if ("devMsg".equalsIgnoreCase(pairKey)) {
                    builder.setDeveloperMessage(pairValue);
                    devMsgSet = true;
                } else if ("infoUrl".equalsIgnoreCase(pairKey)) {
                    builder.setMoreInfoUrl(pairValue);
                    moreInfoSet = true;
                }
            } else {
                //not a key/value pair - use heuristics to determine what value is being set:
                int val;
                if (!statusSet) {
                    val = getInt("status", trimmedVal);
                    if (val > 0) {
                        builder.setStatus(val);
                        statusSet = true;
                        continue;
                    }
                }
                if (!codeSet) {
                    val = getInt("code", trimmedVal);
                    if (val > 0) {
                        builder.setCode(val);
                        codeSet = true;
                        continue;
                    }
                }
                if (!moreInfoSet && trimmedVal.toLowerCase().startsWith("http")) {
                    builder.setMoreInfoUrl(trimmedVal);
                    moreInfoSet = true;
                    continue;
                }
                if (!msgSet) {
                    builder.setMessage(trimmedVal);
                    msgSet = true;
                    continue;
                }
                if (!devMsgSet) {
                    builder.setDeveloperMessage(trimmedVal);
                    devMsgSet = true;
                    continue;
                }
                if (!moreInfoSet) {
                    builder.setMoreInfoUrl(trimmedVal);
                    moreInfoSet = true;
                    //noinspection UnnecessaryContinue
                    continue;
                }
            }
        }

        return builder.build();
    }

    /**
     * Gets required int.
     *
     * @param key   the key
     * @param value the value
     * @return the required int
     */
    private static int getRequiredInt(String key, String value) {
        try {
            int anInt = Integer.valueOf(value);
            return Math.max(-1, anInt);
        } catch (NumberFormatException e) {
            String msg = "Configuration element '" + key + "' requires an integer value.  The value " +
                    "specified: " + value;
            throw new IllegalArgumentException(msg, e);
        }
    }

    /**
     * Gets int.
     *
     * @param key   the key
     * @param value the value
     * @return the int
     */
    private static int getInt(String key, String value) {
        try {
            return getRequiredInt(key, value);
        } catch (IllegalArgumentException iae) {
            return 0;
        }
    }
}
