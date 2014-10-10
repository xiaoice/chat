package com.zte.user.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.zte.framework.util.AjaxAction;
import com.zte.framework.util.DateUtil;
import com.zte.framework.util.Page;
import com.zte.user.domain.User;
import com.zte.user.domain.UserFriend;
import com.zte.user.service.UserFriendService;
import com.zte.user.service.UserService;

@Controller
@Scope("prototype")
public class UserAction extends AjaxAction{
	@Resource(name="userServiceImpl")
	private UserService userService;
	@Resource(name="userFriendServiceImpl")
	private UserFriendService userFriendService;
	
	//登录
	public String session(){
		User user = userService.findUserByUsernameAndPwd(parameter);
		if(user!=null){
			user.setPassword(null);
			setSessionProperty("user", user);
			return SUCCESS;
		}
		setContextProperty("tip", "用户名或者密码错误！");
		return INPUT;
	}
	
	//登录AJAX方式
	public String loginAjax(){
		User user = userService.findUserByUsernameAndPwd(parameter);
		if(user!=null){
			user.setPassword(null);
			setSessionProperty("user", user);
			return ajaxUtil.setSuccess("登录成功！",user);
		}
		return ajaxUtil.setFail("用户名或者密码错误！");
	}
	
	//注销
	public String logout(){
		removeSessionProperty("user");
		return SUCCESS;
	}
	
	//检查用户名是否存在
	public String checkByUsername(){
		if(!(parameter!=null&&parameter.containsKey("username")&&StringUtils.isNotBlank(parameter.get("username")))){
			return ajaxUtil.setFail("参数错误！");
		}
		Map<String,Object> map=new HashMap<String, Object>();
		map.put("username", parameter.get("username"));
		boolean result= userService.checkByUsername(map)==0;
		if(result){
			return ajaxUtil.setSuccess(result);
		}else{
			return ajaxUtil.setFail(result);
		}
	}
	
	//注册
	public String join(){
		if(parameter==null){
			return INPUT;
		}else{
			User user=new User();
			user.setUsername(parameter.get("username"));
			user.setPassword(parameter.get("password"));
			user.setName(parameter.get("name"));
			user.setPhoto(parameter.get("photo"));
			user.setAge(Integer.valueOf(parameter.get("age")));
			int result =userService.insert(user);
			if(result>0){
				user.setPassword(null);
				setSessionProperty("user", user);
				
				UserFriend userFriend = new UserFriend();
				userFriend.setCreateBy(user.getUsername());
				userFriend.setCreateTime(DateUtil.getCurrentDateTime());
				userFriend.setFriendId(10000);
				userFriend.setStatus("1");
				userFriend.setUserId(user.getId());
				userFriendService.insert(userFriend);
				
				return SUCCESS;
			}
		}
		return INPUT;
	}
	
	//根据用户名分页-查找好友
	public String findPageListByname(){
		if(!(parameter!=null&&parameter.containsKey("pageIndex")&&StringUtils.isNotBlank(parameter.get("pageIndex")) 
							&& parameter.containsKey("pageSize")&&StringUtils.isNotBlank(parameter.get("pageSize"))
							//&&parameter.containsKey("name")&&StringUtils.isNotBlank(parameter.get("name")
							)){
			return ajaxUtil.setFail("参数错误！");
		}
		Map<String,Object> map=new HashMap<String, Object>();
		int pageIndex=Integer.valueOf(parameter.get("pageIndex"));
		int pageSize=Integer.valueOf(parameter.get("pageSize"));
		map.put("userId", getUserId());
		map.put("name", parameter.get("name"));
		map.put("startNum", Page.getStartNum(pageIndex, pageSize));
		map.put("endNum",Page.getEndNum(pageIndex, pageSize));
		List<Map<String,String>> list =userService.findPageListByname(map);
		int pageTotal = userService.findPageListCountByname(map);
		Page<Map<String,String>> page=new Page<Map<String,String>>(pageIndex,pageSize,list,pageTotal);
		return ajaxUtil.setSuccess(page);
	}
	
	//修改用户信息
	public String updateUserinfo(){
		if(parameter==null){
			return ajaxUtil.setFail("参数错误！");
		}
		User user=getUser();
		user.setName(parameter.get("name"));
		user.setPhoto(parameter.get("photo"));
		user.setAge(Integer.valueOf(parameter.get("age")));
		int result =userService.update(user);
		if(result>0){
			setContextProperty("result_tip", SUCCESS);
			setSessionProperty("user",user);
			return ERROR;
		}
		else{
			setContextProperty("result_tip", ERROR);
			return ERROR;
		}
	}
}
