<!DOCTYPE html>
<html>
<head>
<title>主界面</title>
<!-- Bootstrap -->
<%@include file="/jsp/common/bootstrap.jsp"%>
<link type="text/css" href="${base}js/plugins/message/message.css" rel="stylesheet" />
<script src="${base}js/plugins/message/message.js"></script>
<script src="${base}js/editor.js"></script>
<link type="text/css" href="${base}css/chat.css" rel="stylesheet" />
</head>
<body>
	<input id="userid" type="hidden" value="${user.id}"/>
	<input id="username" type="hidden" value="${user.username}"/>
	<input id="user_photo" type="hidden" value="${user.photo}"/>
	<input id="friendId" type="hidden" value="10000"/>
	<div class="container">
		<%@include file="/jsp/common/header.jsp" %>
		<div class="row">
		  	<div class="col-md-8 no_padding_right">
				<div class="panel panel-default chat_warp">
					<div class="chat_blank">请先选择右边好友！</div>
					<div class="panel-heading"><span id="chat_title">与</span><a href="javascript:;" id="btn_reload" title="刷新" class="glyphicon glyphicon-refresh pull-right"></a></div>
					<div class="panel-body chat_warp_out">
						<div class="chat_wait"></div>
						<div class="more_message">加载更早记录</div>
						<ul class="chat_warp_out_ui"></ul>
					</div>
					
					<div class="face_panel">
						<span class="icon-heart icon_qqfaces" title="表情"></span>
					</div>
					<!-- <textarea id="content" class="form-control reply_content"></textarea> -->
					<iframe id="content" class="editor" width="100%" height="86" frameborder="0" designMode="on"></iframe>
					<div class="send_panel clearfix">
						<div class="btn-group dropup pull-right">
						  <button id="input_ok" type="button" class="btn btn-primary btn-xs">发送消息</button>
						  <button type="button" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown">
						    <span class="caret"></span>
						  </button>
						  <ul class="dropdown-menu">
						    <!-- Dropdown menu links -->
						    <li><a class="icon-ok" data-value="return"> 按Enter发送消息</a></li>
    						<li><a data-value="Ctrl+return"> 按Ctrl+Enter发送消息</a></li>
						  </ul>
						</div>

						
						
					</div>
				</div>
			</div>
		  	<div class="col-md-4">
				<!-- 		  	
				<ul class="nav nav-tabs">
				  <li class="active"><a href="#">我的好友</a></li>
				  <li><a href="#">最近联系人</a></li>
				</ul> 
				-->
				
				
				<div class="panel panel-default chat_user_panel">
				  	<div class="panel-heading clearfix">
						<a class="btn btn-default btn-xs">批量删除</a>
						<a class="btn btn-default btn-xs">标为已读</a>
					</div>
					<div class="list-group chat_user_list">
						<div class="chat_user_group clearfix chat_user_group_active">
							<div class="chat_user_group_head"><em class="ui-icon ui-icon-triangle-1-e chat_user_group_dot"></em>我的好友</div>
							<div id="friendList" class="chat_user_group_body"></div>
						</div>
						
						<div class="chat_user_group clearfix">
							<div class="chat_user_group_head"><em class="ui-icon ui-icon-triangle-1-e chat_user_group_dot"></em>陌生人</div>
							<div id="stranger" class="chat_user_group_body"></div>
						</div>
					</div>

					<div class="panel-footer clearfix">
						<span class="glyphicon glyphicon-th-large chat_user_menu"></span>
						<a class="btn btn-default btn-xs glyphicon glyphicon-plus pull-right chat_user_add">添加好友</a>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	
	<div id="dialog_search_user" title="<span class='glyphicon glyphicon-search'>查找好友</span>">
	    <label>请输入用户名：</label>
	    <div class="input-group">
	      <input id="text_search_user" type="text" class="form-control">
	      <span class="input-group-btn"><button id="btn_search_user" class="btn btn-default" type="button">搜索</button></span>
		</div>
		
		<div class="dialog_search_user_result">
			<div class="row dialog_search_user_row"></div>
		</div>
	</div>
</body>
</html>

<script type="text/javascript">

//参数列表
var page={
	pageTotal:0,
	pageIndex:1,	//默认第一页
	pageSize:10		//每页显示10条
};
var $out=$(".chat_warp_out_ui"),$more=$(".more_message"),$blank=$(".chat_blank"),$wait=$(".chat_wait"),userPhoto=$("#user_photo").val();
//轮询回调控制计数器
var ajax_loop=0;
var current_request=null,index_request=null,index_request_stop=false;
var service={
		//发送消息
		sendMsg:function(item){
			var content=$("#content").contents().find("body").html();
			if(content==""||content=="<br>"){
				$("#content").focus();
				return message.warn("不能发送空消息");
			}
			var option={
				"parameter.content":content,
				"parameter.friendId":$("#friendId").val()
			};
			var $li=$(service.getOneself({content:content,createTime:"发送时间：正在发送",photo:userPhoto,wait:true})).appendTo($out);
			$.post("${base}message/send.action",option).done(function(result){
				if(result.recode==1){
					service.scrollEnd();
					$("#content").contents().find("body").html("");
					$li.attr("id","chat_"+result.data.id);
					$li.find(".time").html("发送时间："+result.data.createTime);
					$li.find(".wait").remove();
				}
			});
		},
		//刷新新消息列表
		getNewMessageList:function(callback){
			$.get("message/getMessageList.action?parameter.friendId="+$("#friendId").val()).done(function(result){
				$wait.hide();
				if(typeof result=="object"){
					if(result.data!=null && result.data.length>0){
						var ids=[],msgListCache=[],data=result.data;
						for(var i=0,j=data.length;i<j;i++){
							var item=result.data[i];
							if($("#chat_"+item.id).size()==0){
					    		if(item.createBy==$("#username").val()){
					    			msgListCache.push(service.getOneself(item));
								}
								else{
									msgListCache.push(service.getHimself(item));
								}
					    		ids.push(item.id);
							}
				    	}
						$out.append(msgListCache);
						service.updateMsgRead(ids);
						service.scrollEnd();
					}else{
						callback&&callback();
					}
				}
			});
		},
		//轮询新消息
		loopMessage:function(){
			ajax_loop++;
			if(current_request!=null){
				current_request.abort();
				ajax_loop--;
			}
			current_request=$.get("message/loopMessage.action?parameter.friendId="+$("#friendId").val()).done(function(result){
				$wait.hide();
				if(typeof result=="object"){
					var userid=$("#userid").val(),ids=[],msgListCache=[],DATA=!!result.data?result.data.DATA:[],COUNT=!!result.data?result.data.COUNT:[];
					if(!!DATA&&DATA.length>0){
						for(var i=0,j=DATA.length;i<j;i++){
							var item=DATA[i];
							if($("#chat_"+item.id).size()==0){
					    		if(item.createBy==$("#username").val()){
					    			msgListCache.push(service.getOneself(item));
								}
								else{
									msgListCache.push(service.getHimself(item));
								}
					    		ids.push(item.id);
							}
				    	}
						$out.append(msgListCache);
						service.updateMsgRead(ids);
						service.scrollEnd();
					}
					for(var i in COUNT){
						var count=COUNT[i].count,friendId=COUNT[i].friendId;
						var $user=$("#user_"+friendId),$friend=$("#user_"+$("#friendId").val());
						if($user.size()>0){
							$user.html(count).show();
						}else{
							$user.hide();
						}
						$friend.hide();
					}
					
					//递归-重新轮询
					if(ajax_loop<=1){
						service.loopMessage(); 
					}
					ajax_loop--;
				}
			});
		},
		//标记消息为已读
		updateMsgRead:function(ids){
			if(ids.length>0){
				$.ajax({url:"message/updateMessageIsRead.action?parameter.ids="+ids.join(","),async:false}).done(function(result){
					console.log(result.message);
				});
			}
		},
		//显示自己
		getHimself:function(data){
			var li ="<li id=\"chat_"+data.id+"\" class=\"chat_left\">"
				+"<div class=\"left chat_user\"><a><img class=\"border-radius-5 border-shadow-img user_img\" src=\"${base}"+data.photo+"\"/></a></div>"
				+"<div class=\"left tip\"></div>"
				+"<div class=\"border-radius-5 left chat_body\">"
				+"<a class=\"close\" href=\"javascript:;\">×</a>" 
				+"<div class=\"content\">"+data.content+"</div>" 
				+"<div class=\"create_time\"><span class=\"user\">用户名："+data.sendUsername+"</span><span class=\"time\">"+data.createTime.replace("T"," ")+"</span><a class=\"reply hide\">回复</a></div>" 
				+"</div></li>";
			return li;
		},
		//显示他人
		getOneself:function(data){
			var li ="<li id=\"chat_"+data.id+"\" class=\"chat_right\">" 
				+"<div class=\"right chat_user\"><a><img class=\"border-radius-5 border-shadow-img user_img\" src=\"${base}"+data.photo+"\"/></a></div>"
				+"<div class=\"right tip\"></div>"
				+"<div class=\"border-radius-5 right chat_body\"><a class=\"close\">×</a>" 
				+"<div class=\"content\">"+data.content+"</div>" 
				+"<div class=\"create_time\">"
				//+"<span class=\"user\">用户名："+data.sendUsername+"</span>"
				+"<span class=\"time\">"+data.createTime.replace("T"," ")+"</span><a class=\"reply hide\">回复</a></div></div>";
				if(data.wait){
					li+="<div class=\"wait\"><i class=\"icon-spinner icon-spin text_wait\"></i></div>";
				}
				li+="</li>";
			return li;
		},
		pageNext:function(){
			$.post("message/findMessageListByPage.action",{"parameter.pageIndex":page.pageIndex,"parameter.pageSize":page.pageSize,"parameter.friendId":$("#friendId").val()}).done(function(result){
				if(typeof result=="object" && result.data!=null){
					if(result.data.list!=null && result.data.list.length>0){
						page.pageTotal=result.data.pageTotal;
						var ids=[],msgListCache=[],data=result.data.list;
						for(var i=0,j=data.length;i<j;i++){
							var item=data[i];
							if($("#chat_"+item.id).size()==0){
					    		if(item.createBy==$("#username").val()){
					    			msgListCache.push(service.getOneself(item));
								}
								else{
									msgListCache.push(service.getHimself(item));
								}
					    		ids.push(item.id);
							}
				    	}
						$out.prepend(msgListCache.reverse());
						if(page.pageIndex==page.pageTotal){
							service.waitHide();
						}else{
							page.pageIndex++;
						}
					}else{
						service.waitHide();
					}
				}
			});
		},
		//查找用户列表信息
		findUserListAjax:function(){
			if(index_request!=null){
				index_request.abort();
			}
			index_request=$.get("user/findUserListAjax.action",function(result){
				$("#friendList").html(service.createFriendDiv(result.data.friendList));
				$("#stranger").html(service.createStrangerDiv(result.data.stranger));
				var COUNT=result.data.count;
				for(var i in COUNT){
					var count=COUNT[i].count,friendId=COUNT[i].friendId;
					var $user=$("#user_"+friendId);
					if($user.size()>0){
						$user.html(count).show();
					}else{
						$user.hide();
					}
				}
				if(!index_request_stop){
					setTimeout(function(){
						service.findUserListAjax();
					},5000);
				}
			});
		},
		//创建用户列表信息
		createUserDiv:function(data,type){
			var div="";
			if(typeof data=="object"){
				for(var i=0,j=data.length;i<j;i++){
					var item=data[i];
					if( item[type] == undefined){
						continue;
					}
					div+="<a class=\"chat_user_item clearfix\" friendId="+item[type].id+">";
					div+="<img class=\"user_img pull-left\" src=\""+item[type].photo+"\"/>";
					div+="<div class=\"chat_user_item_name\">";
					div+="<div class=\"chat_user_group_title\">"+item[type].name+"</div>";
					div+="<div class=\"chat_user_group_history\">127.0.0.1</div>";
			  	 	div+="</div>";
			  	 	div+="<span id=\"user_"+item[type].id+"\" class=\"chat_user_group_count\">0</span>";
			  	 	div+="</a>";
				}
			}
		  	return div;
		},
		//好友列表信息
		createFriendDiv:function(data){
		  	return service.createUserDiv(data,"friend");
		},
		//创建陌生人列表信息
		createStrangerDiv:function(data){
		  	return service.createUserDiv(data,"user");
		},
		//滚屏置底
		scrollEnd:function(){
			$out.scrollTop(9999);
		},
		clear:function(){
			$("#content").html("");
			$out.empty();
		},
		waitShow:function(){
			$more.show();
			$(".chat_warp_out_ui").height(291);
		},
		waitHide:function(){
			$more.hide();
			$(".chat_warp_out_ui").height(319);
		}
	};
	
	//点击用户列表
	$(".chat_user_group_head").on("click",function(){
		$(this).parent(".chat_user_group").toggleClass("chat_user_group_active");
	});
	
	//单击用户
	$(".chat_user_group_body").on("click",".chat_user_item",function(){
		var $this=$(this);
		var friendId=$this.attr("friendId"),
			friendName=$this.find(".chat_user_group_title").html();
		$(".chat_user_group_body .chat_user_item").removeClass("chat_user_item_focus");
		$this.find(".chat_user_group_count").hide();
		$this.addClass("chat_user_item_focus");
		$("#friendId").val(friendId);
		$("#chat_title").html("我与"+friendName+"的聊天");
		service.clear();
		$blank.hide();
		service.waitShow();
		service.getNewMessageList(function(){
			service.loopMessage();
			index_request.abort();
			index_request_stop=true;//停止主定时器
		});
		page.pageIndex=1;
	});
	
	//点击加载更早记录
	$more.on("click",function(){
		service.pageNext();
	});
	
	//点击刷新消息
	$("#btn_reload").on("click",function(){
		service.loopMessage();
	});
	
	//初始化弹出框
	$("#dialog_search_user").dialog({
		 autoOpen: false,
		 resizable :false,
		 modal:true,
		 width: 755,
		 height:"auto",
		 buttons: {
		 	"加为好友": function () {
		 		var friendIds=[];
		 		$(".dialog_search_user_photo .checked").each(function(){
		 			var friendId=$(this).attr("friendId");
		 			if(typeof friendId!="undefined" && friendId!="" && friendId!="null"){
		 				friendIds.push(friendId);
		 			}
		 		});
		 		
		 		if(friendIds.length==0){
		 			return message.warn("请先选中要添加的好友！");
		 		}
		 		$.post("${base}user/saveUserFriend.action",{"parameter.friendId":friendIds.join(",")},function(result){
					 if(typeof result=="object"&&result.recode==1){
						 message.ok("操作成功！");
						 service.findUserListAjax();
						 //window.location.reload();
					 }
					 else{
						 message.error("添加失败！");
					 }
		 		 });
		 		$(this).dialog("close");
		 	},
		 	"关闭": function () {
		 		$(this).dialog("close");
		 	}
		 }
	 });
	 
	 //点击添加好友按钮
	 $( ".chat_user_add").click(function() {
		 $("#text_search_user").val("");
		 $(".dialog_search_user_row").empty();
		 $( "#dialog_search_user" ).dialog( "open" );
	 });
	 
	 //点击搜索按钮
	 $("#btn_search_user").on("click",function(){
		 var text_search=$("#text_search_user").val();
		 if(text_search==""){
			 //return alert("请输入用户名！");
		 }
		 $.post("${base}user/findPageListByname.action",{"parameter.pageIndex":1,"parameter.pageSize":100,"parameter.name":text_search},function(result){
			 if(typeof result=="object"&&result.data!=null&&result.data.list!=null){
				 if(result.data.list.length!=0){
					 var data =result.data.list;
					 var userArray=[];
					 for(var i=0,j=data.length;i<j;i++){
						 var item=data[i];
						 var user='<div class="dialog_search_user_photo"><a friendid="'+item.id+'">'
								+'<em class="checked"></em>'
					      		+'<img src="'+item.photo+'" alt="头像">'
					      		+'<span>'+item.name+'</span></a></div>';
						 userArray.push(user);
					 }
					 $(".dialog_search_user_row").html(userArray.join(""));
				 }else{
					 message.info("没有找到用户！");
					 //$(".dialog_search_user_row").html("没有找到用户！");
				 }
			 }else{
				 message.error("系统错误！没有找到用户！");
			 }
		 });
	 });
	 
	 //点击选中头像
	 $(".dialog_search_user_row").on("click","a",function(){
		 var $this=$(this);
		 $this.toggleClass("checked");
	 });
	 
	 service.findUserListAjax();
	 //启用编辑器组件
	 $("#content").editor();
</script>
