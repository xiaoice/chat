/**
 * 修改表、添加表操作
 * 曾小斌
 * 2013-12-31 15:39:15
 */

define(function(require,exports,module){
	var util=require("util"),message=util.message;
	module.exports.init=function(callback){
		
	};
	
	//关闭窗体
	function close(){
		$(this).parents(".window_warp").remove();
	}
	
	
	//绑定拖动事件
	function bindDrag(target){
		target.resizable({minHeight:400,minWidth:500,handles: "n, e, s, w, ne, se, sw, nw"}).draggable({handle:target.find(".window_head"),cancel:target.find(".panel_tool"),containment: "document",scroll: false});
	}
	module.exports.bindDrag=bindDrag;
});