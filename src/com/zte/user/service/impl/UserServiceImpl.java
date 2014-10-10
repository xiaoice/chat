package com.zte.user.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zte.framework.jdbc.BaseServiceImpl;
import com.zte.user.dao.UserDao;
import com.zte.user.domain.User;
import com.zte.user.service.UserService;

@Service
public class UserServiceImpl extends BaseServiceImpl<User> implements UserService {
	@Autowired
	private UserDao userDao;

	@Override
	public User findUserByUsernameAndPwd(Map<String, String> parameter) {
		//return this.selectOne("com.zte.user.dao.UserDao.findUserByUsernameAndPwd", parameter);
		return userDao.findUserByUsernameAndPwd(parameter);
	}

	@Override
	public int insert(User user) {
		return this.insert("com.zte.user.dao.UserDao.insert", user);
	}

	@Override
	public List<Map<String, String>> findPageListByname(Map<String, Object> parameter) {
		return userDao.findPageListByname(parameter);
	}

	@Override
	public int findPageListCountByname(Map<String, Object> parameter) {
		return userDao.findPageListCountByname(parameter);
	}

	@Override
	public int update(User user) {
		return this.update("com.zte.user.dao.UserDao.update", user);
	}

	@Override
	public int checkByUsername(Map<String, Object> parameter) {
		return userDao.checkByUsername(parameter);
	}
	
}
