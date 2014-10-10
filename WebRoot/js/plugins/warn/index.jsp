<%@page language="java" contentType="text/html; charset=UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>提醒</title>
	<%@include file="/jsp/common/head.jsp"%>
	<link rel="stylesheet" type="text/css" href="js/plugins/jquery-easyui/themes/icon.css">
	<link rel="stylesheet" type="text/css" href="${base}js/plugins/warn/css/warn_icon.css">
	<script type="text/javascript" src="${base}js/plugins/desk/js/msgXiao.js"></script>
	<script type="text/javascript" src="${base}js/plugins/warn/js/warn.js"></script>
	<style>
		.warn{position: absolute; left:200px; top:100px; text-align:center; background-color: #000; width:400px; height:200px;}
		.warn_title{}
		.warn_bar{ height:24px; line-height: 24px; width:56px; margin:0 auto;}
		.warn_bar_left,.warn_bar_right{display: block; float: left; width:16px; height:16px; margin-top: 4px;}
		.warn_bar_circle{display: block; float: left; width:24px; height:24px;}
		.warn_tip{width:92px; height:26px; line-height:26px; margin:0 auto; color:#f3f2e2;}
	</style>
</head>
<body>
	<div class="warn">
		<div class="warn_title">银行系统</div>
		<div class="warn_bar">
			<span class="warn_icon_left warn_bar_left"></span>
			<span class="warn_bar_circle warn_icon_circle_red_16"></span>
			<span class="warn_icon_right warn_bar_right"></span>
		</div>
		<div class="warn_icon_ellipse_red_active warn_tip">22</div>
	</div>
</body>
</html>

<script type="text/javascript">
	
</script>