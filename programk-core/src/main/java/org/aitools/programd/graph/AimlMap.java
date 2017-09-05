package org.aitools.programd.graph;

import org.apache.log4j.Logger;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

/**
 * <p>
 * 입력된 토큰을 해석 처리하기 위한 AIML set 관리 맵. {@link org.aitools.programd.graph.AbstractNodemaster}
 * 각 토큰은 정규식 형태로 표현이 되는데 입력된 값의 토큰과 정규식 맵핑을 수행한다. 
 * 성능을 위해 기존의 contains()메소드를 통해서 값을 조회후 없을 경우 looping을 통해
 * 각 value들과 정규식 매칭을 수행한다.
 * </p>

 * @author Seongsoo Park (sspark)
 * @author <a href="ss.park@kt.com">Seongsoo Park</a>

 */
@SuppressWarnings("serial")
public class AimlMap<K, V> extends LinkedHashMap<K, V> {
	
	private static final String MARKER_START = "<";  //<that>, <topic>등 적용
	/**	
public  ArrayList<V> getList(Object key) {
		
		ArrayList<V> matchedList = new ArrayList<V>();
		
		Iterator itr = super.keySet().iterator();
		String inputkey= (String)key;
		
		while(itr.hasNext()) 
		{
			
			Object thekey = itr.next();
			String skey = (String)thekey;
			if(skey.equalsIgnoreCase("*") || skey.equalsIgnoreCase("_") ) 
				continue;
			
			try
			{
				if(inputkey.matches(skey)) 
				{
					V tmp = super.get(thekey) ;
					//matchedList.add(tmp);
					NonOptimalNodemaster node = (NonOptimalNodemaster)tmp ;
					if(node.containsKey("*"))
						matchedList.add(matchedList.size(), tmp);
					else if(node.containsKey("_"))
						matchedList.add(0, tmp);
					else
					{
						if(matchedList.size() > 0)
							matchedList.add(1, tmp);
						else
							matchedList.add(tmp);
					}
				}
			}
			catch(Exception e)
			{
				Logger.getLogger("programd").error("\"" +skey + "\"" + " Rex engine can't compile", e);
			}
			
		}
		
		return matchedList;
	}
	*/
	
	
	/**
	 * 원본: 서울부터
	 * 패턴: *부터
	 * 리턴: 서울
	 * @param replace
	 * @param untouched
	 * @param find
	 * @return
	
	*/
	public Nodemapper getList(Object key)
	{
		 String inputkey= (String)key;
		 if(inputkey.equalsIgnoreCase("*") || inputkey.equalsIgnoreCase("_") || inputkey.startsWith(MARKER_START)) 
			 return (Nodemapper)super.get(key) ;
		  
		 Map<Object, V> map = new TreeMap<Object, V>();  //key로 정렬된 map
		 //현재 노드의 keySet을 조회..
		  Iterator<?> itr = super.keySet().iterator();
		  
		  while(itr.hasNext()) 
		  {
			   Object thekey = itr.next();
			   String skey = (String)thekey;
			   if(skey.equalsIgnoreCase("*") || skey.equalsIgnoreCase("_") ) //Token node(*, _ 제외)에 대한 것만 해당됨. 
				   continue; 
			   
			   try
			   {
				   //현재 노드 기준으로 하위의 노드들을 탐색
				    if(inputkey.matches(skey)) 
				    {
					     V tmp = super.get(thekey) ;
					     map.put(thekey, tmp) ;   //매칭되는 것들을 수집..
				    }
			   }
			   catch(Exception e)
			   {
				   Logger.getLogger("programd").error("\"" +skey + "\"" + " Rex engine can't compile", e);
			   }
		   
		  }
		  
		  if(map.size() > 1)  //matching되는게 여러개인 경우
		  {	  
			  /*
			   * aiml pattern내의 token의 비교 우선 순위는 다음과 같다.
			   * AAA, AAA{B|C}, AAA+  ( {}기호는 ()?로 + 는 (([^ ]+))? 로 치환된다. @see NonOptimalNodeMapper 
			   * 즉, Exact matching, Optional matching, Trivial matching  
			   */
			  Map<Object, Object> exactKeyMap = new TreeMap<Object, Object>() ;
			  
			  NonOptimalNodemaster newNode =  new NonOptimalNodemaster();
			  for(Object matchedKey : map.keySet())
			  {
				  //treemap의 특성상 {}, () 등의 character가 없는 normal character로 구성된 token이 
				  //제일 앞쪽에 정렬된다. 따라서 제일 나중에 처리 하기 위해 임시로 저장
				  //이론상 동일한 값을 가지는 node는 1개 밖에 없다. map에 저장.
				  if(((String)matchedKey).equals((String)key))
				  {
					  exactKeyMap.put(matchedKey, map.get(matchedKey)) ;
				  }
				  //exact matching 되는 것 이외에는 (), {} 순서대로 처리가 된다.
				  else
				  {
					  newNode.putAll(((NonOptimalNodemaster)map.get(matchedKey)).hidden);
					 
				  }
					  
			  }
			  //Exact matching 되는 것은 제일 나중에 처리 한다.(결과적으로 제일 우선순위가 높게 처리 됨)
			  for(Object exactKey : exactKeyMap.keySet())
			  {
				  newNode.putAll(((NonOptimalNodemaster)map.get(exactKey)).hidden);
			  }
			  
			  return newNode;
		  }
		  else //if map.size() == 1 
			  return (Nodemapper)(map.values().toArray()[0]) ;
			  
	}
	
	public boolean containsKeyList(Object key) 
	{
		
		boolean isContain = super.containsKey(key);
		
		String stringKey = (String)key;
		
		if(stringKey.equals("_") || stringKey.equals("*") || stringKey.startsWith(MARKER_START)) 
			return isContain;
		
		if(!isContain) 
		{
			//현재 노드의 keySet을 조회..
			Iterator<?> itr = super.keySet().iterator();
			String inputkey= (String)key;
			
			while(itr.hasNext()) 
			{
				Object thekey = itr.next();
				String skey = (String)thekey;
				if(skey.equals("*") || skey.equals("_")) //Token node(*, _ 제외)에 대한 것만 해당됨. 
					continue; 
				try
				{
					if(inputkey.matches(skey))   //매칭되는것이 하나라도 있으면 return...
						return true;
				}
				catch(Exception e)
				{
					Logger.getLogger("programd").error("\"" +skey + "\" Rex engine can't interpret", e);
					return false;
				}

			}
		}
		return isContain;
	}


}
