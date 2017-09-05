package com.kt.programd.util;

import java.text.CharacterIterator;
import java.text.StringCharacterIterator;
import java.util.ArrayList;
import java.util.BitSet;

public class InputCombGenerator {   
       
  
	private static ArrayList<String> combination(Object[] array, int n) {   
    	
    	ArrayList<String> combList= new 
    			ArrayList<String>(); 
    	
        int m = array.length;   
        if (m < n)   
            throw new IllegalArgumentException("Error   m   <   n");   
        BitSet bs = new BitSet(m);   
        for (int i = 0; i < n; i++) {   
            bs.set(i, true);   
        }   
        do {   
            StringBuffer sb = new StringBuffer();   
            for (int i = 0; i < array.length; i++)   
                if (bs.get(i)) {   
                    sb.append(array[i]).append(',');   
                }   
            sb.setLength(sb.length() - 1);   
            combList.add(sb.toString());   
            
        } while (moveNext(bs, m));   
  
        return combList; 
        
    }   

    private static boolean moveNext(BitSet bs, int m) {   
        int start = -1;   
        while (start < m)   
            if (bs.get(++start))   
                break;   
        if (start >= m)   
            return false;   
  
        int end = start;   
        while (end < m)   
            if (!bs.get(++end))   
                break;   
        if (end >= m)   
            return false;   
        for (int i = start; i < end; i++)   
            bs.set(i, false);   
        for (int i = 0; i < end - start - 1; i++)   
            bs.set(i);   
        bs.set(end);   
        return true;   
    }   
       
    
    public static ArrayList<String> getInputList(String input)
    {
    	StringCharacterIterator iterator = new StringCharacterIterator(input);
        ArrayList<String> pos = new ArrayList<String>(); 
        ArrayList<String> candidates = new ArrayList<String>(); 
        
        int i = 0 ;
        // Iterate over the input.
        for (char aChar = iterator.first(); aChar != CharacterIterator.DONE; aChar = iterator.next())
        {
            if (Character.isWhitespace(aChar))
            	pos.add(String.valueOf(i)) ;
            i++ ;
        }
        
        Object[] array = pos.toArray(); 
        
        candidates.add(input);
        
        for(i = 1; i <= array.length ; i++)
        {
        	 ArrayList<String> combination = InputCombGenerator.combination(array, i);
        	 for(int j = 0; j < combination.size() ; j++)
        	 {
        		 String[] tempComb = combination.get(j).split(",") ;
        		 StringBuilder tempStr = new StringBuilder(input); 
        		 for(int k = 0; k < tempComb.length ; k++ )
        		 {
        			 tempStr.replace(Integer.valueOf(tempComb[k]), Integer.valueOf(tempComb[k])+1, "^");
        		 }
        		 candidates.add(tempStr.toString().replace("^", ""));
        	 }
        }
        return candidates ;
    }
       
    //for test
    public static void main(String[] args) throws Exception {   
        
        
        String str =  "실시간 요금 알려주세요" ;
        
        System.out.println(getInputList(str)) ;
        
    }  
}  