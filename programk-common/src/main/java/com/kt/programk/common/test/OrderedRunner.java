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
 *  Seo Jong Hwa 16. 8. 22 오전 9:54
 *
 *
 */

package com.kt.programk.common.test;

import org.junit.runners.BlockJUnit4ClassRunner;
import org.junit.runners.model.FrameworkMethod;
import org.junit.runners.model.InitializationError;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * junit 테스트할 때 어노테이션으로 메소드 실행 순서를 지정
 */
public class OrderedRunner extends BlockJUnit4ClassRunner {

    /**
     * Instantiates a new Ordered runner.
     *
     * @param clazz the clazz
     * @throws InitializationError the initialization error
     */
    public OrderedRunner(Class<?> clazz) throws InitializationError {
        super(clazz);
    }

    /**
     * Compute test methods list.
     *
     * @return the list
     */
    @Override
    protected List<FrameworkMethod> computeTestMethods() {
        List<FrameworkMethod> list = super.computeTestMethods();
        List<FrameworkMethod> copy = new ArrayList<FrameworkMethod>(list);
        Collections.sort(copy, new Comparator<FrameworkMethod>() {
            @Override
            public int compare(FrameworkMethod f1, FrameworkMethod f2) {
                Order o1 = f1.getAnnotation(Order.class);
                Order o2 = f2.getAnnotation(Order.class);

                if (o1 == null || o2 == null) {
                    return -1;
                }
                return o1.order() - o2.order();
            }
        });
        return copy;
    }
}