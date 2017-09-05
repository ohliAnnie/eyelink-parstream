/*
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version. You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */

package org.aitools.programd.graph;

import org.apache.log4j.Logger;

import java.util.Map;
import java.util.Set;

/**
 * This is the most trivial, and likely the most wasteful, implementation of
 * {@link org.aitools.programd.graph.Nodemapper Nodemapper}.  It does not attempt to do any optimizations.
 * 
 * @author <a href="mailto:noel@aitools.org">Noel Bush</a>
 * @version 4.6
 */
public class NonOptimalNodemaster extends AbstractNodemaster
{
    /** 
     * 토큰의 +의 substituter 
     * @author sspark ss.park@kt.com 2012.09.24 
     **/
    
    private static final String EXTRA_PLUS ="\\+";
    private static final String EXTRA_STRING ="((([^ ]+)))?";
    
    
    private static final String LEFT_MID_PARENTHESIS ="\\{";
    private static final String RIGHT_MID_PARENTHESIS ="\\}";
    
    private static final String LEFT_OPT_PARENTHESIS ="((";
    private static final String RIGHT_OPT_PARENTHESIS =")?)";
	
    
    public NonOptimalNodemaster() 
    {
    	this.hidden = getAimlMapInstance() ;//new LinkedHashMap<String, Object>();
    }
	
  
    
    /**
     * Puts the given object into the Nodemaster, associated with the given key.
     * 
     * @param keyToUse the key to use
     * @param valueToPut the value to put
     * @return the same object that was put into the Nodemaster
     */
    public Object put(String keyToUse, Object valueToPut)
    {
    	/**
    	 * @author sspark (ss.park@kt.com)
    	 * @since 2012.08.23
    	 */
    	
    	if (this.hidden == null)
        {
            this.hidden = getAimlMapInstance() ;//new LinkedHashMap<String, Object>();
        }
    	
        if (valueToPut instanceof String)
        {
        	return this.hidden.put(transform(keyToUse.toUpperCase().intern()), ((String) valueToPut).intern());
            //transform(PatternArbiter.normalizeAIMLtoken(keyToUse.toUpperCase().intern()))
        }
        else 
        {	
        	return this.hidden.put(transform(keyToUse.toUpperCase().intern()), valueToPut);
        	//transform(PatternArbiter.normalizeAIMLtoken(keyToUse.toUpperCase().intern()))
        }
    }

    /**
     * Removes the given object from the Nodemaster.
     * 
     * @param valueToRemove the object to remove
     */
    public void remove(Object valueToRemove)
    {
        // Find the key for this value.
        Object keyToRemove = null;
        if (this.hidden != null)
        {
            for (Map.Entry<String, Object> item : this.hidden.entrySet())
            {
                if (item.getValue().equals(valueToRemove))
                {
                    // Found it.
                    keyToRemove = item.getKey();
                    break;
                }
            }
        }
        if (keyToRemove == null)
        {
            // We didn't find a key.
            Logger.getLogger("programd.graphmaster").error(String.format("Key was not found for value when trying to remove \"%s\".", valueToRemove));
            return;
        }
        // Remove the value from the HashMap (ignore the primary
        // value/key pair).
        this.hidden.remove(keyToRemove);
    }

    /**
     * Gets the object associated with the specified key.
     * 
     * @param keyToGet the key to use
     * @return the object associated with the given key
     */
    public Object get(String keyToGet)
    {
        if (this.hidden == null)
        {
            return null;
        }
        return  this.hidden.get(transform(keyToGet.toUpperCase()));
        //return  this.hidden.get(transform(PatternArbiter.normalizeAIMLtoken(keyToGet.toUpperCase())));
    }
    
    
    /**
     * Gets the object associated with the specified key.
     * 
     * @param keyToGet the key to use
     * @return the object associated with the given key
     */
    public Object getList(String keyToGet)
    {
        if (this.hidden == null)
        {
            return null;
        }
        return  this.hidden.getList(transform(keyToGet.toUpperCase()));
        //return  this.hidden.getList(transform(PatternArbiter.normalizeAIMLtoken(keyToGet.toUpperCase())));
    }
    
    
    /**
     * @param keyToCheck the key to check
     * @return whether or not the Nodemaster contains the given key
     */
    public boolean containsKeyList(String keyToCheck)
    {
        if (this.hidden == null)
        {
            return false;
        }
        return this.hidden.containsKeyList(keyToCheck.toUpperCase());
        //return this.hidden.containsKeyList(transform(PatternArbiter.normalizeAIMLtoken(keyToCheck.toUpperCase())));
    }
    
    

    /**
     * @return the keyset of the Nodemaster
     */
    public Set<String> keySet()
    {
        if (this.hidden == null)
        {
            return null;
        }
        return this.hidden.keySet();
    }

    /**
     * @param keyToCheck the key to check
     * @return whether or not the Nodemaster contains the given key
     */
    public boolean containsKey(String keyToCheck)
    {
        if (this.hidden == null)
        {
            return false;
        }
        return this.hidden.containsKey(transform(keyToCheck.toUpperCase()));
        //return this.hidden.containsKey(transform(PatternArbiter.normalizeAIMLtoken(keyToCheck.toUpperCase())));
    }

    
    /**
     * @param 저장할 노드들의 데이터, 현재 Node에서 Trie 구조를 생성함.
     */
    public void putAll(Map map)
    {
    	for(Object key: map.keySet())
    	{
    		String cKey = (String)key;
    		if(containsKey(cKey))
    		{
    			if(map.get(key) instanceof NonOptimalNodemaster)
    			{
    				NonOptimalNodemaster saved = (NonOptimalNodemaster)get(cKey);
        			NonOptimalNodemaster newnode = (NonOptimalNodemaster)map.get(key);
        			
        			//empty node를 하나 생성하고 여기에 기존 것을 저장함.
        			NonOptimalNodemaster temp = new NonOptimalNodemaster();
    				temp.hidden.putAll(saved.hidden) ;
        			temp.setParent(this);
        			
        			//상위 노드는 같은 key를 공유하므로 하위 노드에 대해서 연결함.
        			temp.putAll(newnode.hidden) ;
        			put(cKey,temp);
    			}
    			else //종단 node까지 같은 경우에는 <template> 부분을 overwrite한다. 
    			{
    				put(cKey, map.get(key)) ;
    			}
    			
    		}
    		else //일치하는게 없을 경우 
    		{
    			put(cKey, map.get(key)) ;
    		}
    	}
    }
    
    
    /**
     * @return the size of the Nodemaster
     */
    public int size()
    {
        if (this.hidden == null)
        {
            return 0;
        }
        return this.hidden.size();
    }

    /**
     * Sets the parent of the Nodemaster.
     * 
     * @param parentToSet the parent to set
     */
    @Override
    public void setParent(Nodemapper parentToSet)
    {
        this.parent = parentToSet;
    }

    /**
     * @return the parent of the Nodemaster
     */
    @Override
    public Nodemapper getParent()
    {
        return this.parent;
    }

    /**
     * @return the height of the Nodemaster
     */
    @Override
    public int getHeight()
    {
        return this.height;
    }

    /**
     * Sets the Nodemaster as being at the top.
     */
    @Override
    public void setTop()
    {
        this.fillInHeight(0);
    }

    /**
     * Sets the <code>height</code> of this <code>Nodemaster</code> to
     * <code>height</code>, and calls <code>fillInHeight()</code> on its
     * parent (if not null) with a height <code>height + 1</code>.
     * 
     * @param heightToFillIn the height for this node
     */
    @Override
    protected void fillInHeight(int heightToFillIn)
    {
        if (this.height > heightToFillIn)
        {
            this.height = heightToFillIn;
        }
        if (this.parent != null)
        {
            ((NonOptimalNodemaster) this.parent).fillInHeight(heightToFillIn + 1);
        }
    }
    
    public double getAverageSize()
    {
        double total = 0d;
        if (this.hidden != null)
        {
            for (Object object : this.hidden.values())
            {
                if (object instanceof Nodemapper)
                {
                    total += ((Nodemapper)object).getAverageSize();
                }
            }
        }
        if (this.parent != null)
        {
            int size = this.hidden.size();
            return (size + (total / size)) / 2d;
        }
        // otherwise...
        return total / this.hidden.size();
    }
    
    
    /**
     * <pattern></pattern>의 token에서 '+'에 대해 변환 처리한다.
     * @author sspark (ss.park@kt.com) 2012.09.24
     * @param token  원본 토큰
     * @return token 변환된 토큰
     */
	public static String transform(String token)
	{
		if(token.length() > 1)
		{
			String newToken=token.replaceAll(EXTRA_PLUS, EXTRA_STRING)
					             .replaceAll(LEFT_MID_PARENTHESIS, LEFT_OPT_PARENTHESIS)
					             .replaceAll(RIGHT_MID_PARENTHESIS, RIGHT_OPT_PARENTHESIS);
		    return newToken;
		}
		else 
			return token; 
				
	}
}