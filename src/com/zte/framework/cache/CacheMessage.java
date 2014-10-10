package com.zte.framework.cache;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

public class CacheMessage {
	private CacheMessage(){
		super();
	}
	
	public static Map<String,List<JSONObject>> cacheMessageList=new HashMap<String, List<JSONObject>>();
	public static void putCache(Integer key,JSONObject message){
		putCache(String.valueOf(key), message);
	}
	
	public static void putCache(String key,JSONObject message){
		if(cacheMessageList.containsKey(key)&&cacheMessageList.get(key)!=null){
			cacheMessageList.get(key).add(message);
		}else{
			List<JSONObject> list=new ArrayList<JSONObject>();
			list.add(message);
			cacheMessageList.put(key,list);
		}
	}
	
	public static List<JSONObject> getCache(int userId,int friendId){
		return getCache(String.valueOf(userId), String.valueOf(friendId));
	}
	
	public static List<JSONObject> getCache(int userId){
		return getCache(String.valueOf(userId));
	}
	
	/**
	 * 用户ID，指定的朋友Id
	 * @param userId
	 * @param friendId
	 * @return
	 */
	public static List<JSONObject> getCache(String userId,String friendId){
		if(cacheMessageList.containsKey(userId)){
			List<JSONObject> list=cacheMessageList.get(userId);
			List<JSONObject> resultList=new ArrayList<JSONObject>();
			if(list!=null){
				for(JSONObject jo:list){
					if(String.valueOf(jo.get("userId")).equals(friendId)){
						if(jo.containsKey("TIMEOUT")){
							long timeout = Long.valueOf(String.valueOf(jo.get("TIMEOUT")));
							System.out.println(timeout+"|"+new Date().getTime());
							if(timeout<new Date().getTime()){
								jo.remove("TIMEOUT");
								resultList.add(jo);
							}
						}else{
							resultList.add(jo);
						}
					}
				}
			}
			return resultList;
		}else{
			return null;
		}
	}
	
	public static List<JSONObject> getCache(String userId){
		if(cacheMessageList.containsKey(userId)){
			List<JSONObject> list=cacheMessageList.get(userId);
			List<JSONObject> resultList=new ArrayList<JSONObject>();
			if(list!=null){
				for(JSONObject jo:list){
					if(jo.containsKey("TIMEOUT")){
						long timeout = Long.valueOf(String.valueOf(jo.get("TIMEOUT")));
						System.out.println(timeout+"|"+new Date().getTime());
						if(timeout<new Date().getTime()){
							jo.remove("TIMEOUT");
							resultList.add(jo);
						}
					}else{
						resultList.add(jo);
					}
				}
			}
			return resultList;
		}else{
			return null;
		}
	}
	
	//用超时的方式暂时屏蔽这条缓存，若超时时间到了后这条缓存还存在的话，则会再次显示这条缓存
	public static void removeCacheTimeOut(Integer key){
		removeCacheTimeOut(String.valueOf(key));
	}
	
	//用超时的方式暂时屏蔽这条缓存，若超时时间到了后这条缓存还存在的话，则会再次显示这条缓存
	public static void removeCacheTimeOut(String key){
		removeCacheTimeOut(key, 5000);
	}
	
	//用超时的方式暂时屏蔽这条缓存，若超时时间到了后这条缓存还存在的话，则会再次显示这条缓存
	public static void removeCacheTimeOut(String key,long timeout){
		List<JSONObject> list= getCache(key);
		if(list!=null){
			for(JSONObject jo:list){
				if(!jo.containsKey("TIMEOUT")){
					jo.accumulate("TIMEOUT", String.valueOf(timeout+new Date().getTime()));
				}
			}
		}
	}
	
	//移除指定用户ID下所有的缓存
	public static void remove(String key){
		cacheMessageList.remove(key);
	}
	
	//移除指定用户ID下所有的缓存
	public static void remove(Integer key){
		remove(String.valueOf(key));
	}
	
	//移除指定用户ID下指定的消息缓存
	public static void removeCache(Integer key,String strIds){
		removeCache(String.valueOf(key), strIds);
	}
	
	//移除指定用户ID下指定的消息缓存
	public static void removeCache(String key,String strIds){
		List<JSONObject> list= getCache(key);
		String[] ids=strIds.split(",");
		if(list!=null){
			for(int i=0;i<list.size();i++){
				String j_id=String.valueOf(list.get(i).get("id"));
				for(String id:ids){
					if(j_id.equals(id)){
						list.remove(i);
					}
				}
			}
		}
		cacheMessageList.put(key, list);
	}
}
