//use Ember.js! thanks!

//display bindings to console
Ember.LOG_BINDINGS = true;
Ember.LOG_STACKTRACE_ON_DEPRECATION=false;

/**
 * Application应用程序
 * chat 在线聊天
 */
Chat = window.App = Em.Application.create({
	ver:"1.0",
	ready: function(){
		console.log("Ember.Chat is ready!");
	}
});


/**************************
* Models
**************************/
Chat.Message = Em.Object.extend({
	id: null,
	sendReceiveGroup: null,
	content: null,
	sendUsername: null,
	ip: null,
	createBy: null,
	createTime: null,
	owner:false
});


/**************************
* Views
**************************/
Chat.sendBtnView = Em.Button.extend({
	//target: 'Chat.pageController',
	//action: 'btnSend',
	click: function(e) {
		var option={
				"message.content":$("#content").val(),
				"message.sendReceiveGroup":"10-11",
				"message.createBy":$("#userId").val(),
				"message.sendUsername":$("#createBy").val(),
				"message.ip":"192.168.1.1"
			}
			$.post("message/insert.action",option,function(result){
				$(".chat_warp_out").empty();
				if(typeof result=="object"){
					for(var i=0,data=result.data,j=data.length;i<j;i++){
						var item=data[i];
						if(item.createBy==$("#userId").val()){
							$(".chat_warp_out").append(getOneself(item));
						}
						else{
							$(".chat_warp_out").append(getHimself(item));
						}
					}
					$(".chat_warp_out").scrollTop(99999);
				}
			});
	}
});

/**************************
* Controllers
**************************/
Chat.messageController = Ember.ArrayController.create({
    content: [],
    done: function(){
    	var that=this;
		$.ajax({url:"message/getList.action",async:false}).done(function(result){
			var ids=[];
			for(var i=0,data=result.data,j=data.length;i<j;i++){
				var create=data[i].createBy;
				if(create==$("#userId").val()){
					data[i].owner=true;
				}
	    		var message = Chat.Message.create(data[i]);
	    		that.pushObject(message);
	    		ids.push(data[i]["id"]);
	    	}
			if(ids.length>0){
				$.ajax({url:"message/updateMessageIsRead.action?para.ids="+ids.join(","),async:false}).done(function(result){
					console.log(result.message);
				});
			}
		});
    	return this.content;
    },
    init:function(){
    	this.done();
    }
});

//表单按钮控制器
Chat.pageController=Em.ArrayController.create({
	btnSend:function(e){
		console.log(e.target);
	}
});

setInterval(function(){
	Chat.messageController.done();
	$(".chat_warp_out").scrollTop(99999);
},2000);

//显示自己
function getHimself(data){
	var li ="<li class=\"chat_left\"> <div class=\"left tip\"></div> <div class= " 
		+"\"border-radius-5 left chat_body\"> <a class=\"close\" href=\"javascript:;\">×</a> <p class= " 
		+"\"content\">"+data.content+"</p> <p class=\"create_time\"><span class=\"user\"> " 
		+"用户名："+data.sendUsername+"</span><span class=\"time\">"+data.createTime+"</span><a href=\"javascript:;\" " 
		+"class=\"reply hide\">回复</a></p> </div> </li>"
	return li;
}


//显示他人
function getOneself(data){
	var li ="<li class=\"chat_right\"> <div class=\"right tip\"></div> <div class= " 
		+"\"border-radius-5 right chat_body\"> <a class=\"close\" href=\"javascript:;\">×</a> <p class= " 
		+"\"content\">"+data.content+"</p> <p class=\"create_time\"><span class=\"user\"> " 
		+"用户名："+data.sendUsername+"</span><span class=\"time\">"+data.createTime+"</span><a href=\"javascript:;\" " 
		+"class=\"reply hide\">回复</a></p> </div> </li>"
	return li;
}
