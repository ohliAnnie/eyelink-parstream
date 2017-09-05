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

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLStreamHandler;

/**
 * 현재 쓰레드에서 사용하는 클래스로더 와 URL 객체를 생성한다.
 */
public class ClasspathURLStreamHandler extends URLStreamHandler {

    /**
     * The Constant logger.
     */
    private static final Logger LOG = LoggerFactory
            .getLogger(ClasspathURLStreamHandler.class);

    // ~ Instance fields. ~~~~~~~~~~~~~~
    /**
     * 클래스 패스 prefix.
     */
    public static final String CLASSPATH_PREFIX = "classpath";

    /**
     * 클래스로더.
     */
    private ClassLoader classLoader;

    // ~ Constructors. ~~~~~~~~~~~~~~~~~

    /**
     * 기본 생성자.
     */
    public ClasspathURLStreamHandler() {
        LOG.info("ClasspathURLStreamHandler");
        this.classLoader = Thread.currentThread().getContextClassLoader();
    }

    /**
     * 생성자.
     *
     * @param loader the loader
     */
    public ClasspathURLStreamHandler(final ClassLoader loader) {
        if (classLoader == null) {
            this.classLoader = Thread.currentThread().getContextClassLoader();
        } else {
            this.classLoader = loader;
        }
    }

    // ~ Implementation Method. ~~~~~~~~
    // ~ Self Methods. ~~~~~~~~~~~~~~~~~

    /**
     * 현재 클래스 로더를 리턴 한다.
     *
     * @return the class loader
     */
    public final ClassLoader getClassLoader() {
        return classLoader;
    }

    /**
     * 해당 URL의 커넥션을 생성 한다.
     *
     * @param url the url
     * @return URLConnection
     */
    protected final URLConnection openConnection(final URL url) {
        String protocol = url.getProtocol();
        if (CLASSPATH_PREFIX.equals(protocol)) {
            String path = url.getPath();
            while (path.startsWith("/")) {
                path = path.substring(1);
            }

            URL resUrl = getClassLoader().getResource(path);
            if (resUrl == null) {
                LOG.error("Classpath resource: " + path + " not found. ERROR(0) !!!");
                throw new SystemException(CommonCode.UTIL_URL_GETRESOURCE_ERROR);
            }
            try {
                return resUrl.openConnection();
            } catch (IOException e) {
                LOG.error("Classpath resource: " + path + " Open Connection ERROR(1) !!!");
                throw new SystemException(e, CommonCode.UTIL_URL_CONNECT_ERROR);
            }
        } else {
            // Use default JDK url impl.
            try {
                String path = url.getPath();
                return new URL(path).openConnection();

            } catch (MalformedURLException e) {
                // Try again with simple File path location.
                File file = new File(url.getPath());

                try {

                    return file.toURI().toURL().openConnection();

                } catch (MalformedURLException e1) {
                    LOG.error(url.getPath() + " Open Connection ERROR(1) !!!");
                    throw new SystemException(e, CommonCode.UTIL_URL_CONNECT_ERROR);
                } catch (IOException e1) {
                    LOG.error(url.getPath() + " Open Connection ERROR(2) !!!");
                    throw new SystemException(e, CommonCode.UTIL_URL_CONNECT_ERROR);
                }

            } catch (IOException e) {
                LOG.error(url.getPath() + " Open Connection ERROR(3) !!!");
                throw new SystemException(e, CommonCode.UTIL_URL_CONNECT_ERROR);
            }
        }
    }

    /**
     * URL 오브젝트를 생성 한다.
     *
     * @param url the url
     * @return the uRL
     */
    public static URL createURL(final String url) {
        return createURL(url, ClasspathURLStreamHandler.class.getClassLoader());
    }

    /**
     * URL 오브젝트를 생성 한다.
     *
     * @param url         the url
     * @param classLoader the class loader
     * @return the uRL
     */
    public static URL createURL(final String url, final ClassLoader classLoader) {
        URL context = null;
        URL urlObj = null;
        try {
            urlObj = new URL(context, url, new ClasspathURLStreamHandler(
                    classLoader));
        } catch (MalformedURLException e) {
            // Retry with file:// protocol.
            try {
                urlObj = new File(url).toURI().toURL();
            } catch (MalformedURLException e2) {
                LOG.error(url + " Create ERROR !!!");
                throw new SystemException(e, CommonCode.UTIL_URL_CREATE_ERROR);
            }
        }
        return urlObj;
    }
    // ~ Getter and Setter. ~~~~~~~~~~~~
}
