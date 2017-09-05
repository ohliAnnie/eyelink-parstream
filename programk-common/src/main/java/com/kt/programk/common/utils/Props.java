/*
 *  Copyright (c) 2016 KT, Inc.
 *  All right reserved.
 *  This software is the confidential and proprietary information of KT
 *  , Inc. You shall not disclose such Confidential Information and
 *  shall use it only in accordance with the terms of the license agreement
 *  you entered into with KT.
 *
 *  Revision History
 *  Author Date Description
 *  ------------------ -------------- ------------------
 *  Seo Jong Hwa 16. 8. 22 오후 5:36
 *
 *
 */

package com.kt.programk.common.utils;

import com.kt.programk.common.exception.CommonCode;
import com.kt.programk.common.exception.SystemException;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.text.StrSubstitutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.*;

/**
 * The Class Props.
 */
public class Props extends HashMap<String, String> {

    // ~ Instance fields. ~~~~~~~~~~~~~~
    /**
     * The Constant logger.
     */
    private static final Logger LOG = LoggerFactory.getLogger(Props.class);

    /**
     * The Constant serialVersionUID.
     */
    private static final long serialVersionUID = 2211405016738281987L;

    // ~ Constructors. ~~~~~~~~~~~~~~~~~

    /**
     * Instantiates a new props.
     */
    public Props() {
        LOG.info(Props.class.getName());
    }

    /**
     * Instantiates a new props.
     *
     * @param url the url
     */
    public Props(final String url) {
        load(url);
        expandVariables();
    }

    /**
     * Instantiates a new props.
     *
     * @param url the url
     */
    public Props(final URL url) {
        load(url);
        expandVariables();
    }

    /**
     * Instantiates a new props.
     *
     * @param props the props
     */
    public Props(final Properties props) {
        fromProperties(props);
        expandVariables();
    }

    /**
     * Instantiates a new props.
     *
     * @param map the map
     */
    public Props(final Map<String, String> map) {
        putAll(map);
        expandVariables();
    }

    // ~ Implementation Method. ~~~~~~~~
    // ~ Self Methods. ~~~~~~~~~~~~~~~~~

    /**
     * Gets the group keys.
     *
     * @param groupKey the group key
     * @return the group keys
     */
    public final List<String> getGroupKeys(final String groupKey) {
        List<String> result = new ArrayList<String>();
        for (String key : keySet()) {
            if (key.startsWith(groupKey)) {
                result.add(key);
            }
        }
        return result;
    }

    /**
     * Gets the string.
     *
     * @param key the key
     * @return the string
     */
    public final String getString(final String key) {
        if (!containsKey(key)) {
            LOG.error(key + " Map key not found ERROR() !!!");
            throw new SystemException(CommonCode.COM_MAP_KEYNOTFOUNF_ERROR);
        }
        String result = get(key);
        return result;
    }

    /**
     * Gets the string.
     *
     * @param key the key
     * @param def the def
     * @return the string
     */
    public final String getString(final String key, final String def) {
        String result = get(key);
        if (result == null) {
            result = def;
        }
        return result;
    }

    /**
     * Gets the int.
     *
     * @param key the key
     * @return the int
     */
    public final int getInt(final String key) {
        String val = getString(key);
        int ret = Integer.parseInt(val);
        return ret;
    }

    /**
     * Gets the int.
     *
     * @param key the key
     * @param def the def
     * @return the int
     */
    public final int getInt(final String key, final int def) {
        String val = getString(key, "" + def);
        int ret = Integer.parseInt(val);
        return ret;
    }

    /**
     * Gets the boolean.
     *
     * @param key the key
     * @return the boolean
     */
    public final boolean getBoolean(final String key) {
        String val = getString(key);
        return Boolean.parseBoolean(val);
    }

    /**
     * Gets the boolean.
     *
     * @param key the key
     * @param def the def
     * @return the boolean
     */
    public final boolean getBoolean(final String key, final boolean def) {
        String val = getString(key, "" + def);
        return Boolean.parseBoolean(val);
    }

    /**
     * Gets the long.
     *
     * @param key the key
     * @return the long
     */
    public final long getLong(final String key) {
        String val = getString(key);
        long ret = Long.parseLong(val);
        return ret;
    }

    /**
     * Gets the long.
     *
     * @param key the key
     * @param def the def
     * @return the long
     */
    public final long getLong(final String key, final long def) {
        String val = getString(key, "" + def);
        long ret = Long.parseLong(val);
        return ret;
    }

    /**
     * Gets the double.
     *
     * @param key the key
     * @return the double
     */
    public final double getDouble(final String key) {
        String val = getString(key);
        double ret = Double.parseDouble(val);
        return ret;
    }

    /**
     * Gets the double.
     *
     * @param key the key
     * @param def the def
     * @return the double
     */
    public final double getDouble(final String key, final double def) {
        String val = getString(key, "" + def);
        double ret = Double.parseDouble(val);
        return ret;
    }

    /**
     * Load.
     *
     * @param url the url
     */
    public final void load(final String url) {
        URL urlObj = ClasspathURLStreamHandler.createURL(url);
        load(urlObj);
    }

    /**
     * Load.
     *
     * @param url the url
     */
    public final void load(final URL url) {
        try {
            load(url.openStream()); // load() should call close on stream.
        } catch (IOException e) {
            LOG.error("Failed to open " + url, e);
            throw new SystemException(CommonCode.UTIL_URL_CONNECT_ERROR);
        }
    }

    /**
     * Load.
     *
     * @param inStream the in stream
     */
    public final void load(final InputStream inStream) {
        Properties props = null;
        try {
            props = new Properties();
            props.load(inStream);
        } catch (FileNotFoundException e) {
            LOG.error("File Load ERROR(0) !!!");
            throw new SystemException(e, CommonCode.UTIL_FILE_FILENOTFOUND_ERROR);
        } catch (IOException e) {
            LOG.error("File Load ERROR(1) !!!");
            throw new SystemException(e, CommonCode.UTIL_FILE_FILENOTFOUND_ERROR);
        } finally {
            if (inStream != null) {
                IOUtils.closeQuietly(inStream);
            }
        }
        fromProperties(props);
    }

    /**
     * Auto expand any ${variable} in expandProps using a lookupProps for
     * existing variable definitions. This method will automatically search the
     * System Properties space for lookup as well.
     * <p/>
     * Note: There is no going back after you call this method!
     */
    public final void expandVariables() {
        StrSubstitutor substitutor = new StrSubstitutor(this);
        for (Map.Entry<String, String> entry : entrySet()) {
            String name = entry.getKey();
            String val = entry.getValue();
            if (val == null) {
                continue;
            }
            String newVal = substitutor.replace(val);
            if (!newVal.equals(val)) {
                this.put(name, newVal);
            }
        }
    }

    /**
     * From properties.
     *
     * @param props the props
     */
    public final void fromProperties(final Properties props) {
        @SuppressWarnings({"rawtypes", "unchecked"})
        Map<String, String> map = (Map) props;
        super.putAll(map);
    }

    /**
     * Clone this map and return it as java.util.Properties.
     *
     * @return the properties
     */
    @SuppressWarnings({"rawtypes", "unchecked"})
    public final Properties toProperties() {
        Properties properties = new Properties();
        properties.putAll((Map) this.clone());
        return properties;
    }
}
