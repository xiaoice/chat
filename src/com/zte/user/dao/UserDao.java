package com.zte.user.dao;

import java.util.List;
import java.util.Map;

import com.zte.user.domain.User;

public interface UserDao {
	
	/**
	 * 根据用户名、密码登录
	 * @param map
	 * @return
	 */
	User findUserByUsernameAndPwd(Map<String,String> parameter);
	
	/**
	 * 根据朋友Id得到陌生人列表
	 * @param parameter
	 * @return
	 */
	List<Map<String,String>> findPageListByname(Map<String,Object> parameter);
	
	/**
	 * 根据用户名等条件进行分页查找总数
	 * @param parameter
	 * @return
	 */
	int findPageListCountByname(Map<String,Object> parameter);
	
	int insert(User user);
	int update(User user);
	
	int checkByUsername(Map<String,Object> parameter);
}
