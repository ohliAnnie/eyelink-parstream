package org.aitools.programd.multiplexor;

import com.google.gson.Gson;
import org.junit.Test;

import static org.junit.Assert.*;

public class PredicateMapTest {

    @Test
    public void testGetAccesstime() throws Exception {
        Gson gson = new Gson();

        PredicateValue one = new PredicateValue("connect1");
        PredicateValue two = new PredicateValue("connect2");
        PredicateValue three = new PredicateValue("connect3");

        PredicateMap predicateMap = new PredicateMap();

        predicateMap.put("that", one);
        predicateMap.put("input", one);
        predicateMap.put("topic", one);

        String result = gson.toJson(predicateMap);

        System.out.println(result);
    }
}