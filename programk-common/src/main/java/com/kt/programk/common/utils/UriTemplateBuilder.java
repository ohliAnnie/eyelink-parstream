/*
 *  Copyright (c) 2013 KT, Inc.
 *  * All right reserved.
 *  * http://www.kt.com
 *  * This software is the confidential and proprietary information of KT
 *  * , Inc. You shall not disclose such Confidential Information and
 *  * shall use it only in accordance with the terms of the license agreement
 *  * you entered into with KT.
 *  *
 *  * Revision History
 *  * Author              Date                  Description
 *  * ===============    ================       ======================================
 *  *  beyondj2ee          ${date}
 *
 */
package com.kt.programk.common.utils;

import com.kt.programk.common.exception.CommonCode;
import com.kt.programk.common.exception.SystemException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * URL 생성 템플릿 클래스.
 */
public class UriTemplateBuilder {

    // ~ Instance fields. ~~~~~~~~~~~~~~
    /**
     * The Constant logger.
     */
    private static final Logger LOG = LoggerFactory.getLogger(UriTemplateBuilder.class);

    /**
     * Captures URI template variable names.
     */
    private static final Pattern NAMES_PATTERN = Pattern
            .compile("\\{([^/]+?)\\}");

    /**
     * Replaces template variables in the URI template.
     */
    private static final String VALUE_REGEX = "(.*)";

    /**
     * The variable names.
     */
    private final List<String> variableNames;

    /**
     * The match pattern.
     */
    private final Pattern matchPattern;

    /**
     * The uri template.
     */
    private final String uriTemplate;

    // ~ Constructors. ~~~~~~~~~~~~~~~~~

    /**
     * Construct a new URI String.
     * @param uriTemplate
     */
    public UriTemplateBuilder(final String uriTemplate) {
        LOG.info(UriTemplateBuilder.class.getName());
        Parser parser = new Parser(uriTemplate);
        this.uriTemplate = uriTemplate;
        this.variableNames = parser.getVariableNames();
        this.matchPattern = parser.getMatchPattern();
    }

    // ~ Implementation Method. ~~~~~~~~
    // ~ Self Methods. ~~~~~~~~~~~~~~~~~

    /**
     * Return the names of the variables in the template, in order.
     *
     * @return the template variable names
     */
    public final List<String> getVariableNames() {
        return this.variableNames;
    }

    /**
     * Expand.
     *
     * @param uriVariables the uri variables
     * @return the uri
     */
    public final URI expand(final Map<String, ?> uriVariables) {
        Object[] values = new String[this.variableNames.size()];
        for (int i = 0; i < this.variableNames.size(); i++) {
            String name = this.variableNames.get(i);
            if (!uriVariables.containsKey(name)) {
                LOG.error(name + "uriVariables' Map has no value ERROR() !!!");
                throw new SystemException(CommonCode.COM_MAP_KEYNOTFOUNF_ERROR);
            }
            values[i] = uriVariables.get(name);
        }
        return expand(values);
    }

    /**
     * Expand.
     *
     * @param uriVariableValues the uri variable values
     * @return the uri
     */
    public final URI expand(final Object... uriVariableValues) {

        if (uriVariableValues.length != this.variableNames.size()) {
            LOG.error("Invalid amount of variables values in ["
                    + this.uriTemplate + "]: expected "
                    + this.variableNames.size() + "; got "
                    + uriVariableValues.length);

            throw new SystemException(CommonCode.COM_VALUE_VALIDATE_ERROR);


        }
        Matcher matcher = NAMES_PATTERN.matcher(this.uriTemplate);
        StringBuffer buffer = new StringBuffer();
        int i = 0;
        while (matcher.find()) {
            String uriVariable = uriVariableValues[i++].toString();
            matcher.appendReplacement(buffer,
                    Matcher.quoteReplacement(uriVariable));
        }
        matcher.appendTail(buffer);
        return encodeUri(buffer.toString());
    }

    /**
     * Indicate whether the given URI matches this template.
     *
     * @param uri the URI to match to
     * @return <code>true</code> if it matches; <code>false</code> otherwise
     */
    public final boolean matches(final String uri) {
        if (uri == null) {
            return false;
        }
        Matcher matcher = this.matchPattern.matcher(uri);
        return matcher.matches();
    }

    /**
     * Match.
     *
     * @param uri the uri
     * @return the map< string, string>
     */
    public final Map<String, String> match(final String uri) {
        Map<String, String> result = new LinkedHashMap<String, String>(
                this.variableNames.size());
        Matcher matcher = this.matchPattern.matcher(uri);
        if (matcher.find()) {
            for (int i = 1; i <= matcher.groupCount(); i++) {
                String name = this.variableNames.get(i - 1);
                String value = matcher.group(i);
                result.put(name, value);
            }
        }
        return result;
    }

    /**
     * Encodes the given String as URL.
     *
     * @param uri
     * @return
     */
    protected final URI encodeUri(final String uri) {
        try {
            // String encoded = URLEncoder.encode(uri, "UTF-8");
            return new URI(uri);
        } catch (URISyntaxException ex) {

            LOG.error("Could not create URI from ["
                    + uri + "]: " + ex, ex);
            throw new SystemException(CommonCode.UTIL_URL_CREATE_ERROR);
        }
    }

    /**
     * Static inner class to parse uri template strings into a matching regular
     * expression.
     */
    private static final class Parser {

        /**
         * The variable names.
         */
        private final List<String> variableNames = new LinkedList<String>();

        /**
         * The pattern builder.
         */
        private final StringBuilder patternBuilder = new StringBuilder();

        /**
         * The Constructor.
         *
         * @param uriTemplate the uri template
         */
        private Parser(final String uriTemplate) {
            Matcher m = NAMES_PATTERN.matcher(uriTemplate);
            int end = 0;
            while (m.find()) {
                this.patternBuilder.append(quote(uriTemplate, end, m.start()));
                this.patternBuilder.append(VALUE_REGEX);
                this.variableNames.add(m.group(1));
                end = m.end();
            }
            this.patternBuilder.append(quote(uriTemplate, end,
                    uriTemplate.length()));
            int lastIdx = this.patternBuilder.length() - 1;
            if (lastIdx >= 0 && this.patternBuilder.charAt(lastIdx) == '/') {
                this.patternBuilder.deleteCharAt(lastIdx);
            }
        }

        /**
         * Quote.
         *
         * @param fullPath the full path
         * @param start    the start
         * @param end      the end
         * @return the string
         */
        private String quote(final String fullPath, final int start, final int end) {
            if (start == end) {
                return "";
            }
            return Pattern.quote(fullPath.substring(start, end));
        }

        /**
         * Gets the variable names.
         *
         * @return the variable names
         */
        private List<String> getVariableNames() {
            return Collections.unmodifiableList(this.variableNames);
        }

        /**
         * Gets the match pattern.
         *
         * @return the match pattern
         */
        private Pattern getMatchPattern() {
            return Pattern.compile(this.patternBuilder.toString());
        }
    }

    // ~ Getter and Setter. ~~~~~~~~~~~~

}
