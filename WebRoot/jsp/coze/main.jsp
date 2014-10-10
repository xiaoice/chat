<%@page language="java" contentType="text/html; charset=UTF-8"%>

<!DOCTYPE html>
<html lang="zh-CN">
 <head>
  	<title>coze</title>
  	<meta charset="utf-8">
  	<meta name="viewport" content="width=device-width, initial-scale=1.0">
  	<!-- Bootstrap -->
	<link charset="utf-8" rel="stylesheet" href="../js/plugins/bootstrap/css/bootstrap.min.css" />
	<link charset="utf-8" type="text/css" href="../js/plugins/jquery-ui-bootstrap/css/custom-theme/jquery-ui-1.10.0.custom.css" rel="stylesheet" />
	<link charset="utf-8" rel="stylesheet" href="../js/plugins/bootstrap/css/font-awesome.css" />
	<link charset="utf-8" rel="stylesheet" href="../js/plugins/coze/css/coze.css" />
 </head>
 <body>
 	<div class="panel_wrap window_warp_model">
		<div class="panel_box">
		  <div class=panel_tool><i class="icon-remove"></i></div>
		  <div class="panel_head">好友列表</div>
		  <div class="panel_body">
		    <ul class="panel_body_ui">
		    	<li a-repeat={{friendList}} id="li_{{$index}}">{{user.name}}</li>
		    </ul>
		  </div>
		  <div class="panel_foot">
		  	<div class="panel_foot_tool">
		  		<i class="icon-cog"></i>
		  		<i class="icon-search"></i>
		  	</div>
		  </div>
		</div>
 	</div>
 	
 	
 	<div class="window_warp window_warp_model no_select" id="window_{{friendID}}">
 		<div class="window_box">
 		<div class=window_tool><i data-value="{{friendID}}" class="icon-remove windows_close"></i></div>
 		<div class="window_head">与{{name}}对话中</div>
		  <div class="window_body">
		  	<div class="window_body_resize"></div>
		    <ul class="window_body_ui">
		    	<li class="clearfix" a-repeat="{{list}}">
		    		<div class="li_{{friendId==friendID?'right':'left'}}" id="li_{{id}}">
		    			<img class="li_photo no_select" src="../images/default_user.png">
		    			<div class="li_body">
		    				<i class="li_caret icon-caret-{{friendId==friendID?'right':'left'}}"></i><div class="li_content">{{content}}</div>
		    				<div class="li_foot">发送时间：<span class="li_foot_time">{{createTime==""?"正在发送":createTime}}</span></div>
		    			</div>
		    		</div>
		    	</li>
		    </ul>
		  </div>
		  <div class="window_foot">
		  	<div class="window_edit">
		  		<textarea class="window_edit_text" a-model='{{content}}'></textarea>
		  		<div class="window_edit_tool">
		  			<button type="button" class="btn btn-primary btn-xs send_msg">发送消息</button>
		  			<button type="button" data-value="{{friendID}}" class="btn btn-default btn-xs windows_close">关闭</button>
		  		</div>
		  	</div>
		  </div>
 		</div>
 	</div>
 	
 	<div class="login_wrap">
 		<div class="login_box">
	 		<div class="login_head">登录系统</div>
	 		<div class="login_body">
				<div class="form-group">
					<label for="user_username">用户名： </label> 
					<input type="text" class="form-control" id="input_username" placeholder="请输入用户名" value="zengxiaobin">
				</div>
				<div class="form-group">
					<label for="user_password">密码：</label>
					<input type="password" class="form-control" id="input_password" placeholder="请输入密码" value="123456">
				</div>
				<p>用户名为6-16位；密码为6位以上</p>
				<button id="bt_login" type="submit" class="btn btn-primary btn-small btn-block">登录</button>
	 		</div>
 		</div>
 	</div>
 	
 </body>
</html>
<script charset="utf-8" src="../js/sea-debug.js"></script>
<script charset="utf-8" src="../js/plugins/coze/js/config.js"></script>