//参数列表
var page={
	pageTotal:0,
	pageIndex:1,	//默认第一页
	pageSize:10		//每页显示10条
};
var $out=$(".chat_warp_out_ui"),$more=$(".more_message"),$blank=$(".chat_blank"),$wait=$(".chat_wait");
var timer_user=null;

var service={
	//发送消息
	sendMsg:function(item){
		var content=$("#content").html();
		if(content==""){
			$("#content").focus();
			return message.warn("不能发送空消息");
		}
		var option={
			"parameter.content":content,
			"parameter.friendId":$("#friendId").val()
		};
		$.post("${base}message/send.action",option).done(function(result){
			$out.append(service.getOneself(result.data));
			service.scrollEnd();
			$("#content").html("");
		});
	},
	//刷新新消息列表
	getNewMessageList:function(){
		$.get("message/getMessageList.action?parameter.friendId="+$("#friendId").val()).done(function(result){
			$wait.hide();
			if(typeof result=="object" && result.data!=null && result.data.length>0){
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
			+'<div class="left chat_user">'
			+'<a href="javascript:;"><img class="border-radius-5 border-shadow-img user_img" src="${base}'+data.photo+'"/></a></div>'
			+"<div class=\"left tip\"></div> <div class=\"border-radius-5 left chat_body\"> <a class=\"close\" href=\"javascript:;\">×</a> <p class= " 
			+"\"content\">"+data.content+"</p> <p class=\"create_time\"><span class=\"user\"> " 
			+"用户名："+data.sendUsername+"</span><span class=\"time\">"+data.createTime.replace("T"," ")+"</span><a href=\"javascript:;\" " 
			+"class=\"reply hide\">回复</a></p> </div> </li>";
		return li;
	},
	//显示他人
	getOneself:function(data){
		var li ="<li id=\"chat_"+data.id+"\" class=\"chat_right\">" 
			+'<div class="right chat_user">'
			+'<a href="javascript:;"><img class="border-radius-5 border-shadow-img user_img" src="${base}'+data.photo+'"/></a></div>'
			+"<div class=\"right tip\"></div><div class=\"border-radius-5 right chat_body\"> <a class=\"close\" href=\"javascript:;\">×</a> <p class= " 
			+"\"content\">"+data.content+"</p> <p class=\"create_time\"><span class=\"user\"> " 
			+"用户名："+data.sendUsername+"</span><span class=\"time\">"+data.createTime.replace("T"," ")+"</span><a href=\"javascript:;\" " 
			+"class=\"reply hide\">回复</a></p> </div> </li>";
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
	//循环获取消息
	timer:function(){
		return setInterval(function(){
			service.getNewMessageList();
		},2000);
	},
	//滚屏置底
	scrollEnd:function(){
		$out.scrollTop(99999);
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
$(".chat_user_item").on("click",function(){
	var $this=$(this);
	var friendId=$this.attr("friendId"),
		friendName=$this.find(".chat_user_group_title").html();
	$(".chat_user_group_body .chat_user_item").removeClass("chat_user_item_focus");
	$this.addClass("chat_user_item_focus");
	$("#friendId").val(friendId);
	$("#chat_title").html("我与"+friendName+"的聊天");
	service.clear();
	$blank.hide();
	service.waitShow();
	service.getNewMessageList();
	page.pageIndex=1;
	if(timer_user!=null){
		clearInterval(timer_user);
	}
	timer_user=service.timer();
});

//点击发送消息
$("#input_ok").on("click",function(){
	service.sendMsg();
});

//点击发送消息
$(".ke-edit-iframe").contents().find(".ke-content").bind("keydown", "return", function (ev) { 
	service.sendMsg();
});


//点击加载更早记录
$more.on("click",function(){
	service.pageNext();
});

//点击刷新消息
$("#btn_reload").on("click",function(){
	service.getNewMessageList();
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
					 message.ok("操作完毕！");
					 window.location.reload();
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
	 $.post("${base}user/findListByPage.action",{"parameter.pageIndex":1,"parameter.pageSize":100,"parameter.name":text_search},function(result){
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
 
 //失去焦点
 window.onblur = function(){
	 if(timer_user!=null){
		clearInterval(timer_user);
	 }
 };
 
 //得到焦点
 window.onfocus = function(){
	 if(timer_user!=null){
		 //message.info("欢迎回来！");
	 }
	 timer_user=service.timer();
 };