<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>

<!DOCTYPE html>
<html>
<head>
<title>欢迎</title>
<!-- Bootstrap -->
<%@include file="/jsp/common/bootstrap.jsp"%>
</head>
<body>
	<div class="container">
		<%@include file="/jsp/common/header.jsp" %>
		<div class="jumbotron">
			<div class="container jspjs_width_600">
				<h1>欢迎来到交流平台！</h1>
				<p>1、响应式排版布局，支持手机、Ipad等移动设备！</p>
				<p>2、自动刷新，点对点在线私聊，消息加密处理，更安全！</p>
				<p>3、历史记录，老婆再也不用发手机短信给我啦！</p>
				<p>
					<a href="${base}reg.action" class="btn btn-primary btn-lg" role="button">现在加入</a>
					<a href="${base}login.action" class="btn btn-default btn-lg" role="button">登录</a>
				</p>
			</div>
		</div>
	</div>
</body>
</html>

