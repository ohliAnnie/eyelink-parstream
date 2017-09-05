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

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;
import org.codehaus.jackson.map.annotate.JsonSerialize;
import org.codehaus.jackson.util.TokenBuffer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URI;
import java.util.Map;

/**
 * jSON 데이터를 마샬링/언마샬링 하는 유틸리티 클래스.
 */
public final class JsonUtil {

    // ~ Instance fields. ~~~~~~~~~~~~~~
    /**
     * The Constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(JsonUtil.class);

    // ~ Constructors. ~~~~~~~~~~~~~~~~~

    private JsonUtil() {
        LOG.info(JsonUtil.class.getName());
    }

    // ~ Implementation Method. ~~~~~~~~
    // ~ Self Methods. ~~~~~~~~~~~~~~~~~

    /**
     * <p>
     * 오브젝트를 JSON 형태로 마샬링 한다.
     * </p>
     * Marshalling json.
     *
     * @param object the object
     * @return the string
     */
    public static String marshallingJson(final Object object) {

        String jsonText = "";
        try {
            TokenBuffer buffer = new TokenBuffer(null);
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.setSerializationInclusion(JsonSerialize.Inclusion.NON_NULL);
            objectMapper.writeValue(buffer, object);
            JsonNode root = objectMapper.readTree(buffer.asParser());
            jsonText = objectMapper.writeValueAsString(root);
            jsonText = jsonText.replaceAll("null", "\"\"");
        } catch (Exception e) {
            LOG.error("marshallingJson ERROR !!!");
        }
        return jsonText;
    }

    /**
     * 오브젝트를 JSON 데이터로 사람이 보기 편한 형태로 마샬링 한다.
     *
     * @param object the object
     * @return the string
     */
    public static String marshallingJsonWithPretty(final Object object) {
        TokenBuffer buffer = new TokenBuffer(null);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setSerializationInclusion(JsonSerialize.Inclusion.NON_NULL);
        String jsonText = "";

        try {
            objectMapper.writeValue(buffer, object);
            objectMapper.configure(SerializationConfig.Feature.INDENT_OUTPUT, true);

            JsonNode root = objectMapper.readTree(buffer.asParser());
            jsonText = objectMapper.writeValueAsString(root);
            jsonText = jsonText.replaceAll("null", "\"\"");
        } catch (JsonGenerationException e) {
            LOG.error("marshallingJsonWithPretty ERROR(0) !!!");
        } catch (JsonMappingException e) {
            LOG.error("marshallingJsonWithPretty ERROR(1) !!!");
        } catch (IOException e) {
            LOG.error("marshallingJsonWithPretty ERROR(2) !!!");
        }

        return jsonText;
    }

    /**
     * <p>
     * JSON 형태의 스트링을 특정 오브젝트로 언마샬링 한다.
     * </p>
     * Unmarshalling json.
     *
     * @param jsonText  the json text
     * @param valueType the value type
     * @return the t
     */
    public static <T> T unmarshallingJson(final String jsonText, final Class<T> valueType) {

        ObjectMapper objectMapper = new ObjectMapper();
        String data;
        T t = null;

        try {
            data = jsonText.replaceAll("null", "\"\"");
            t = (T) objectMapper.readValue(data, valueType);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return t;
    }

    /**
     * URL 과 파라미터를 조합해서 새로운 URL 정보를 리턴 한다.
     *
     * @param invokeURL the invoke uRL
     * @param parameter the parameter
     * @return the string
     */
    public static String makeRestFulURL(final String invokeURL, final Map<String, ?> parameter) {
        String restURL = "";
        UriTemplateBuilder uriTemplate = new UriTemplateBuilder(invokeURL);
        URI url = uriTemplate.expand(parameter);
        restURL = url.toString();
        return restURL;
    }

    // ~ Getter and Setter. ~~~~~~~~~~~~
}
