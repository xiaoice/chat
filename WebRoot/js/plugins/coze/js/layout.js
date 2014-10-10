/**
 * 主文件
 * 曾小斌
 * 2013-12-31 15:39:15
 */

define(["Ant","jquery-ui","util","login","coze","panel","windows"],function(require, exports, module){
	window.$document=$(document);
	var login=require("login"),util=require("util"),message=util.message;
	login.init();
	
	
	//当window窗体大小改变时候，重置layout
	$(window).resize(function(){
		util.processor.process(function(){
			console.log("window.resize");
		},100);
	});
});


