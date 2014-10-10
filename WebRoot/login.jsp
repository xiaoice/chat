<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>

<!DOCTYPE html>
<html>
<head>
<title>登录界面</title>
<!-- Bootstrap -->
<%@include file="/jsp/common/bootstrap.jsp"%>
</head>
<body>
	<div class="container">
		<%@include file="/jsp/common/header.jsp" %>
		<div class="row">
		  	<div class="col-md-8">
				<div class="jumbotron">
					<div class="container jspjs_width_600">
						<h1>欢迎来到交流平台！</h1>
						<p>1、响应式排版布局，支持手机、Ipad等移动设备！</p>
						<p>2、自动刷新，点对点在线私聊，消息加密处理，更安全！</p>
						<p>3、历史记录，老婆再也不用发手机短信给我啦！</p>
					</div>
				</div>
			</div>
		  	<div class="col-md-4">
				<s:form action="session.action" role="form-horizontal">
					<br>
					<div class="form-group">
						<label for="user_username">用户名： </label> 
						<input type="text" class="form-control" id="user_username" name="parameter.username" placeholder="请输入用户名">
					</div>
					<div class="form-group">
						<label for="user_password">密码：</label>
						<input type="password" class="form-control" id="user_password" name="parameter.password" placeholder="请输入密码">
					</div>
					<p>用户名为6-16位；密码为6位以上</p>
					<button type="submit" class="btn btn-primary btn-lg btn-block">登录</button>
				</s:form>
			</div>
		</div>



	</div>
</body>
</html>

