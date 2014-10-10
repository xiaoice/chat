/**
 * 修改表、添加表操作
 * 曾小斌
 * 2013-12-31 15:39:15
 */

define(function(require,exports,module){
	var util=require("util"),message=util.message,processor=util.processor,windows=require("windows");
	var views={},index_request=null;
	module.exports.init=function(callback){
		bindDrag($(".panel_wrap").removeClass("window_warp_model"));
		findUserListAjax();
		callback&&callback();
	};
	
	//绑定拖动事件
	function bindDrag(target){
		target.resizable({minHeight:500,minWidth:300,handles: "n, e, s, w, ne, se, sw, nw"}).draggable({
			handle:target.find(".panel_head"),
			containment: "document",
			scroll: false,
			start: function(event, ui) {
				console.log(event, ui);
			},
			stop: function(event, ui) {
				console.log(event, ui);
			}
		});
	}
	
	//查找用户列表信息
	function findUserListAjax(callback){
		if(index_request!=null){
			index_request.abort();
		}
		index_request=$.get("../user/findUserListAjax.action",function(result){
			//$("#friendList").html(service.createFriendDiv(result.data.friendList));
			//$("#stranger").html(service.createStrangerDiv(result.data.stranger));
			bindAnt(result.data.friendList,result.data.stranger);
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
			callback&&callback();
		});
	}
	
	//根据friendId获取消息列表
	function getMessageListByFriendId(friendId,callback){
		$.get("../message/getMessageList.action?parameter.friendId="+friendId).done(function(result){
			if(typeof result=="object"){
				if(result.data!=null && result.data.length>0){
					callback&&callback(result);
				}else{
					callback&&callback();
				}
			}
		});
	}
	
	//根据friendId获取新消息列表
	function getNewMessageListByFriendId(view,callback){
		//控制开关
		if(view.enble){
			if(typeof view.ajax!="undefined"){
			  view.ajax.abort();
			}
			view.ajax=$.get("../message/loopMessage.action?parameter.friendId="+view.friendId).done(function(result){
				if(result&&result.data&&result.data.DATA){
					//view.view.set("list",result.data.DATA);
					view.view.get("list").push.apply(view.view.get("list"), result.data.DATA);
					var ids=[],data=result.data.DATA,i=0,j=data.length;
					for(;i<j;i++){
						ids.push(data[i].id);
			    	}
					updateMsgRead(ids);
					view.$body.scrollTop(9999);
					getNewMessageListByFriendId(view);
				}else{
					getNewMessageListByFriendId(view);
				}
				callback&&callback(result);
			}).fail(function(){
				view.ajax=undefined;
			});
		}
	}
	
	//标记消息为已读
	function updateMsgRead(ids){
		if(ids.length>0){
			$.get("../message/updateMessageIsRead.action?parameter.ids="+ids.join(",")).done(function(result){
				console.log(result.message);
			});
		}
	}
	
	//加入ant组件
	function bindAnt(friendList,stranger){
		var ant = new Ant($(".panel_wrap .panel_body_ui")[0], {
			  data: {friendList:friendList},
			  events: {
				  //点击用户名，触发事件
				  'click li': function(e) {
					  var index=e.currentTarget.$index
					  , name = this.data.friendList[index].user.name
					  , userId = this.data.friendList[index].user.id
					  , friendId = this.data.friendList[index].friend.id
					  ,view=undefined;
					  if(typeof views["view"+friendId]=="undefined"){
						  views["view"+friendId]={};
					  }
					  view=views["view"+friendId];
					  view.friendId=friendId;
					  getMessageListByFriendId(friendId,function(result){
						  //若这个对话框不存在，则创建，确保唯一性
						  if($("#window_"+friendId).size()==0){
							  var model_html=$('.window_warp_model').clone().removeClass("window_warp_model")[0].outerHTML,list=[];
							  if(result&&result.data){
								  list=result.data;
								  var ids=[],i=0,j=list.length;
								  for(;i<j;i++){
									ids.push(list[i].id);
								  }
								  updateMsgRead(ids);
							  }
							  
							  view.view=new Ant(model_html, {data: {name: name,list: list,friendID:view.friendId},
								  events: {'click .send_msg': function() {
									  var t=new Date().getTime(),that=this,content=that.data.content,$content=$(".window_edit_text");
									  $content.focus();
									  if(content==""||typeof content=="undefined"){
										  return message.warn("不能发送空消息");
									  }
									  this.data.list.push({content: content,id:t,createTime:"正在发送",userId:userId,friendId:friendId});
									  $.post("../message/send.action",{"parameter.content":content,"parameter.friendId":friendId}).done(function(result){
										  var $li=$("#li_"+t);
										  if(result&&result.data){
											  $li.find(".li_foot_time").html(result.data.createTime);
										  }else{
											  $li.find(".li_foot_time").html("<i class='text-danger'>发送失败！<i>");
										  }
										  //清空输入内容
										  that.set("content","");
										  $("#window_"+friendId).find(".window_body_ui").scrollTop(99999);
									  });
							  		}
								  }
							  });
							  view.$el= $(view.view.el).appendTo("body").find(".window_warp");
							  windows.bindDrag(view.$el);
							  
							  //轮询控制
							  view.enble=true;
							  view.$body=view.$el.find(".window_body_ui");
							  
							  //轮询最新消息
							  getNewMessageListByFriendId(view);
						  }
					  });
				  }
			  }
		});
	}
	
	//关闭弹出层
	$document.on("click",".windows_close",function(){
		$(this).parents(".window_warp").parent("div").remove(),val=$(this).data("value");
		//关闭弹出层时，同时关闭调ajax请求
		var view=views["view"+val];
		view&&view.ajax&&view.ajax.abort();
	});
	
	//弹出层缩放
	$document.on("mousedown",".window_body_resize",function(){
		var that=this
			,$window=$(that).parents(".window_warp")
			,$body=$window.find(".window_body")
			,$foot=$window.find(".window_foot")
			,window_height=$window.height()
			,body_height=$(that).parents(".window_body").height()
			,offset=$window.offset()
			,proxy=$('<div class="window_body_resize_proxy"></div>').insertBefore(that);
		$window.addClass("no_select");
		$window.on("mousemove",function(e){
			var height=e.pageY-offset.top-24;
			if(height<=2){
				height=2;
			}
			if(height>=window_height-51){
				height=window_height-51;
			}
			var bottom=body_height-height;
			proxy.css("bottom",bottom);
		});
		$window.one("mouseup",function(e){
			var height=e.pageY-offset.top-24,window_height=$window.height();
			if(height<=0){
				height=0;
			}
			if(height>=window_height-54){
				height=window_height-54;
			}
			
			var body_height=(height+24)/(window_height)*100+"%";
			var foot_height=(window_height-height-24)/(window_height)*100+"%";
			proxy.remove();
			$window.off("mousemove");
			$body.css("height",body_height);
			$foot.css("height",foot_height);
			$window.removeClass("no_select");
			$window.find(".window_edit_text").focus();
		});
	});
	
	$document.on("mouseover",".window_body_ui",function(){
		$(this).parents(".window_warp").removeClass("no_select");
	}).on("mouseout",".window_body_ui",function(){
		$(this).parents(".window_warp").addClass("no_select");
	})
});