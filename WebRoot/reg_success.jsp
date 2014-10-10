<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>

<!DOCTYPE html>
<html>
<head>
<title>注册界面</title>
<!-- Bootstrap -->
<%@include file="/jsp/common/bootstrap.jsp"%>
<meta http-equiv="refresh" content="2;url=${base}user/index.action"> 
</head>
<body>
	<div class="container">
		<%@include file="/jsp/common/header.jsp" %>
		<div class="row">
		  	<div class="col-md-12">
		  		<div class="alert alert-success text-center">注册成功！<a href="${base}user/index.action">2秒后自动跳转！点击这里进入用户中心</a></div>
			</div>
		</div>



	</div>
</body>
</html>

