package org.aitools.programd.multiplexor;

import org.junit.Test;

import java.util.*;

public class PredicateMasterRedisTest {

    @Test
    public void testSet() throws Exception {
        Map<String, PredicateMap> predicateCache = Collections.synchronizedMap(new HashMap<String, PredicateMap>());
        PredicateMap userA = new PredicateMap();

        PredicateValue one = new PredicateValue("connect");
        userA.put("input.1", one);
        Thread.sleep(1000);

        PredicateValue two = new PredicateValue("connect");
        userA.put("input.2", two);
        Thread.sleep(1000);

        PredicateValue three = new PredicateValue("connect");
        userA.put("input.3", three);
        Thread.sleep(1000);

//        MemoryCacheHandler pool = new MemoryCacheHandler();
//        pool.setPredicateMap("1", "1", userA);
//
//        PredicateMap predicateMap = pool.getPredicateMap("1", "1");
//
//        System.out.println(predicateMap.size());

//        //정렬전
//        for( String key : predicateMap.keySet() ){
//            PredicateValue val = predicateMap.get(key);
//            System.out.println( String.format("키 : %s, 값 : %s, access time: %s", key, val.getFirstValue(), val.getAccesstime()));
//        }
//
//        Iterator it = sortByValue(predicateMap).iterator();
//
//        //정렬후
//        while( it.hasNext() ){
//            String key = (String) it.next();
//            System.out.println( String.format("키 : %s, 값 : %s, access time: %s", key, predicateMap.get(key).getFirstValue(), predicateMap.get(key).getAccesstime()));
//        }

    }

    /**
     * Hash Map 정렬
     * @param map
     * @return
     */
    public static List sortByValue(final Map map){
        List<String> list = new ArrayList();
//        list.addAll(map.keySet());
//
//        Collections.sort(list,new Comparator(){
//
//            public int compare(Object o1,Object o2){
//                PredicateValue v1 = (PredicateValue) map.get(o1);
//                PredicateValue v2 = (PredicateValue) map.get(o2);
//
//                return ((Comparable) v1.getAccesstime()).compareTo(v2.getAccesstime());
//            }
//
//        });
//        Collections.reverse(list); // 주석시 오름차순
        return list;
    }
}