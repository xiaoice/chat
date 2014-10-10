/**
 * 修改表、添加表操作
 * 曾小斌
 * 2013-12-31 15:39:15
 */

define(function(require,exports,module){
	var util=require("util"),message=util.message,panel=require("panel");
     var target=$(".login_wrap");
     module.exports.init=function(){
    	 target.draggable({handle:target.find(".login_head"),containment: "document",scroll: false});
     };
     
     $document.on("click","#bt_login",function(){
    	message.wait("正在登录。。。");
    	var data={
    		"parameter.username":$("#input_username").val(),
    		"parameter.password":$("#input_password").val()
    	};
    	if($("#input_user").val()==""){
    		return message.warn("请输入用户名！");
    	}
    	else if($("#input_password").val()==""){
    		return message.warn("请输入密码！");
    	}
    	else{
    		$.post("../loginAjax.action",data,function(result){
    			if(typeof result=="object"){
    				if(result.recode==1){
    					message.ok(result.message,function(){
    						panel.init();
    						target.hide();
    					});
    				}else{
    					message.error("登录失败！");
    				}
    			}else{
    				message.error("登录失败！系统错误！");
    			}
    		});
    	}
     });
    
});