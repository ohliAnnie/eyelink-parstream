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
 * Seo Jong Hwa        2016 . 6 . 21
 */

package com.kt.programk.api.viewresolver;

import org.springframework.oxm.Marshaller;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.view.xml.MarshallingView;

import java.util.Locale;

/**
 * The type Jaxb 2 marshalling xml view resolver.
 */
public class Jaxb2MarshallingXmlViewResolver implements ViewResolver {

    /**
     * The Marshaller.
     */
    private Marshaller marshaller;


    /**
     * Instantiates a new Jaxb 2 marshalling xml view resolver.
     *
     * @param marshaller the marshaller
     */
    public Jaxb2MarshallingXmlViewResolver(Marshaller marshaller) {
        this.marshaller = marshaller;
    }


    /**
     * Resolve view name view.
     *
     * @param viewName the view name
     * @param locale   the locale
     * @return the view
     * @throws Exception the exception
     */
    @Override
    public View resolveViewName(String viewName, Locale locale) {
        MarshallingView view = new MarshallingView();
        view.setMarshaller(marshaller);
        return view;
    }

}
