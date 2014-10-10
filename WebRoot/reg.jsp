<%@page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>

<!DOCTYPE html>
<html>
<head>
<title>注册界面</title>
<!-- Bootstrap -->
<%@include file="/jsp/common/bootstrap.jsp"%>
<link type="text/css" href="css/reg.css" rel="stylesheet" />
<link type="text/css" href="${base}js/plugins/message/message.css" rel="stylesheet" />
<script src="${base}js/form-validator.js"></script>
<script src="${base}js/plugins/message/message.js"></script>

</head>
<body>
	<div class="container">
		<%@include file="/jsp/common/header.jsp" %>
		<div class="panel panel-default">
	  		<div class="panel-heading no_border">新用户注册</div>
			<s:form action="join.action" role="form-horizontal">
				<table class="table reg_table">
					<tr>
						<td align="right"><label for="user_username">请输入用户名：</label></td>
						<td><input type="text" class="form-control" id="user_username" name="parameter.username" placeholder="请输入用户名"></td>
						<td></td>
					</tr>
					<tr>
						<td align="right"><label for="user_password">请输入密码：</label></td>
						<td><input type="password" class="form-control" id="user_password" name="parameter.password" placeholder="请输入密码"></td>
						<td></td>
					</tr>
					<tr>
						<td align="right"><label for="user_password_two">请输入确定密码：</label></td>
						<td><input type="password" class="form-control" id="user_password_two" placeholder="请再次输入密码"></td>
						<td></td>
					</tr>
					<tr>
						<td width="240" align="right"><label for="user_name">请输入昵称：</label></td>
						<td width="300"><input type="text" class="form-control" value="${user.name}" id="user_name" name="parameter.name" placeholder="请输入昵称"></td>
						<td></td>
					</tr>
					<tr>
						<td align="right"><label for="user_email">请输入邮箱：</label></td>
						<td><input type="email" class="form-control" id="user_email" name="parameter.email" placeholder="邮箱功能暂时未启用"></td>
						<td></td>
					</tr>
					<tr>
						<td align="right"><label for="user_photo">请选择头像：</label></td>
						<td valign="top"><input id="user_photo" name="parameter.photo" type="hidden" value="${user.photo}"/><img id="user_photo_img" class="user_photo_img" alt="头像" src="${user.photo}" onerror="this.onerror=null;this.src='images/github.png'"/> <a class="text-warning user_photo_img">更换头像</a></td>
						<td></td>
					</tr>
					<tr>
						<td align="right"><label for="user_age">年龄：</label></td>
						<td>
							<input type="number" class="form-control" value="${user.age}" id="user_age" name="parameter.age" placeholder="请输入年龄">
						</td>
						<td></td>
					</tr>
					<tr>
						<td></td>
						<td colspan="2">
							<button type="submit" class="btn btn-success">保存</button>
						</td>
					</tr>
				</table>
			</s:form>
		</div>
	</div>
	
	<div id="dialog_search_user" title="<span class='glyphicon glyphicon-search'>更换头像</span>">
		<div class="dialog_search_user_result">
			<div class="row dialog_search_user_row">
				<s:iterator begin="1" end="21" status="photo">
					<div class="dialog_search_user_photo">
						<a>
							<i></i>
					      	<img alt="头像${photo.index+1}" src="images/head_photo/user_${photo.index+1}.jpg" />
					    </a>
					</div>
				</s:iterator>
			</div>
		</div>
	</div>
</body>
</html>


<script type="text/javascript">
	
	$(":hidden").val("");
	
	$('#dialog_search_user').dialog({
		 autoOpen: false,
		 resizable :false,
		 modal:true,
		 width: 755,
		 height:"auto",
		 buttons: {
		 	"选择": function () {
		 		var src = $(".dialog_search_user_row .checked img").attr("src");
		 		if(!src){
		 			return message.warn("请选择一个头像！");
		 		}
		 		$("#user_photo").val(src).blur();
		 		$("#user_photo_img").attr("src",src);
		 		$(this).dialog("close");
		 	},
		 	"取消": function () {
		 		$(this).dialog("close");
		 	}
		 }
	});
	
	//点击添加好友按钮
	$( ".user_photo_img").click(function() {
		 $( "#dialog_search_user" ).dialog( "open" );
	});
	
	//点击选中头像
	$(".dialog_search_user_row").on("click","a",function(){
		 var $this=$(this);
		 $(".dialog_search_user_row .checked").removeClass("checked");
		 $this.addClass("checked");
	});
	
	$("#user_username").formValidator({focus:"用户名长度为4-16位",success:"正确",validator:{min:4,max:16,error:"用户名长度错误，应该为4-16位！"},ajax:{url:"${base}checkByUsername?parameter.username=",success:"恭喜你，用户名可以使用！",wait:"正在验证用户名是否可用",error:"用户名已经被使用！"}});
	$("#user_password").formValidator({focus:"密码长度为4-16位",success:"正确",validator:{min:4,max:16,error:"密码长度错误，应该为4-16位！"},concateCompare:"#user_password_two"});
	$("#user_password_two").formValidator({focus:"确认密码长度为4-16位",success:"正确",validator:{min:4,max:16,error:"确认密码长度错误，应该为4-16位！"},compare:{target:"#user_password",regexp:"=",error:"二次输入的密码不一致"}});
	$("#user_age").formValidator({focus:"请输入数字，支持方向键↓↑",success:"正确",validator:{type:"number",spinner:true,max:120,error:"你输入的年龄有误，必须为数字且范围为0-120"}});
	$("#user_photo").formValidator({success:"正确",validator:{type:"string",min:0,error:"请选择头像！"}});
	
</script>

