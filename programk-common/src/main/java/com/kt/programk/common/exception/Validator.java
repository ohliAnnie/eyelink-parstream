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

package com.kt.programk.common.exception;

import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.lang.reflect.Field;

/**
 * 데이터 바인딩 검증기
 */
public class Validator {

    /**
     * Instantiates a new Validator.
     */
    public Validator() {
        super();
    }

    /**
     * Validate void.
     * 
     * @param target
     *            the target
     * @throws IllegalArgumentException
     *             the illegal argument exception
     * @throws IllegalAccessException
     *             the illegal access exception
     */
    public static void validate(Object target) throws IllegalArgumentException, IllegalAccessException,SystemException {
        Class<?> clazz = target.getClass();
        Field[] fields = clazz.getDeclaredFields();

        for (Field field : fields) {
            validateField(field, target);
        }
    }

    /**
     * Validate field.
     * 
     * @param field
     *            the field
     * @param target
     *            the target
     * @throws IllegalArgumentException
     *             the illegal argument exception
     * @throws IllegalAccessException
     *             the illegal access exception
     */
    private static void validateField(Field field, Object target) throws IllegalAccessException, SystemException {
        field.setAccessible(true);
        Object value = field.get(target);

        if (field.isAnnotationPresent(NotNull.class)) {
            if (value == null) {
                throw new SystemException(ValidationCode.VALID_REQUIRED).set("field", field.getName()).set("value",value);
            }
        }

        if (field.isAnnotationPresent(Length.class)) {
            Length length = field.getAnnotation(Length.class);
            int max = length.max();
            int min = length.min();

            if (String.valueOf(value).length() > max || String.valueOf(value).length() < min) {
                throw new SystemException(ValidationCode.VALID_RANGELENGTH).set("field", field.getName()).set("value",value);
            }
        }

        if (field.isAnnotationPresent(Max.class)) {
            Max max = field.getAnnotation(Max.class);
            if ((Integer) value > max.value()) {
                throw new SystemException(ValidationCode.VALID_MAX).set("field", field.getName()).set("value", max.value());
            }
        }

        if (field.isAnnotationPresent(Min.class)) {
            Min min = field.getAnnotation(Min.class);
            if ((Integer) value < min.value()){
                throw new SystemException(ValidationCode.VALID_MIN).set("field", field.getName()).set("value",min.value());
            }
        }
    }

}
