package com.zte.user.dao;

import java.util.List;
import java.util.Map;

import com.zte.user.domain.UserFriend;

public interface UserFriendDao {
	
	/**
	 * 根据用户名id得到好友列表
	 * @param map
	 * @return
	 */
	List<Map<String, Object>> findByUserId(Map<String,Object> parameter);
	
	/**
	 * 根据用户名id得到好友列表
	 * @param map
	 * @return
	 */
	List<Map<String, Object>> findByFriendId(Map<String,Object> parameter);
	
	int insert(UserFriend userFriend);
	
}
