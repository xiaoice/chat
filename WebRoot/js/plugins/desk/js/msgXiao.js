/**
 * msgXiao - xiaoice
 */

//消息提示框插件
var msgXiao={
	show:function(html,time,bgColor){
		if($(".msg_xiao").length==0){
			$('<div class="msg_xiao"></div>').hide().appendTo('body');
			$(".msg_xiao").css({position:"absolute",left:0,top:"2px","z-index":"99999"});
		}
		
		var time=time||50000;
		var _bgColor=bgColor||"#4B981D";
		$(".msg_xiao").css({"background-color":_bgColor,color:"#fff",position:"fixed",padding:"2px 10px","border-radius":"3px","border":"0"}).html(html);
		$(".msg_xiao").css("left",($(document).width()-$(".msg_xiao").width())/2).show();
		setTimeout(function(){  
			msgXiao.hide();
	    },time);
	},
	warn:function(html,time){
		msgXiao.show(html,time||2000,"#fff");
		$(".msg_xiao").css({"border":"1px solid #8f0000",color:"#8f0000"});
	},
	ok:function(html,time){
		msgXiao.show(html,time||2000,"#4B981D");
	},
	wait:function(html,time){
		msgXiao.show(html,time,"#514BBC");
	},
	error:function(html,time){
		msgXiao.show(html,time||2000,"#8f0000");
	},
	hide:function(){
		$(".msg_xiao").hide();
	}
};

$(function(){
	/*
	/**input 能拉能写的select控件  
	/**by colin 曾小斌
	/**2012-11-18 15:45:23
	/** 使用前  请先加载几行CSS
	/**width控件宽度，maxHeight控件高度,data要显示的 内容，是一个数组
	/**在input控件中添加class来加载控件   //<input class="select_text" data="1,2,3" type="text"/>
	/**使用Js脚本来加载控件   //demo $("#input_1,#input_2").selectText({data:[5,7,9]});
	*/
	var selectText=function($self,options){
		var model = { 
			width: $self.attr("width")||$self.width()||160, 
			maxHeight: $self.attr("maxHeight")||100,
			data:($self.attr("data")&&$self.attr("data").split(','))||[]
		};
		if(typeof options!="undefined"){
			model = $.extend({}, model, options);
		}
		
		var data=model.data;
		var process=function(_$this){
			$(document).unbind("click");
			var createBox=function(model){
				if ($(".select_text_box").length != 0) {
					$(".select_text_box").remove();
			    }
				$('<div class="select_text_box" ></div>').appendTo("body");
				$(".select_text_box").hide().css({width:model.width,"max-height":model.maxHeight});
				if(data!=null && data.length>0){
					for(var i in data){
						$(".select_text_box").append('<a>'+data[i]+'</a>');
					}
				}
			}(model);
			
			var _offset=_$this.offset();
			var _top=_$this.get(0).offsetHeight+_offset.top;
			if(data!=null && data.length>0){
				$(".select_text_box").css({top:_top,left:_offset.left}).show();
			}
			
	    	$(".select_text_box a").unbind("click").bind("click",function(){
	    		$(document).unbind("click");
		    	_$this.val($(this).html());
		    	$(".select_text_box").hide();
		    });
		};
		
		$self.unbind("focus").bind("focus",function(){
			process($(this));
		});
		
		$self.unbind("blur").bind("blur",function(){
			$(document).bind("click",function(){
	    		$(".select_text_box").hide("slow");
	    	});
		});
		
		$self.unbind("keyup").bind("keyup",function(event){
			process($(this));
			var value=$(this).val();
			var text =$(".select_text_box :not(:contains('"+value+"'))").remove();
			if($(".select_text_box a").size()==0){
				$(".select_text_box").hide();
			}
		});
	};
	
	//在input控件中添加class来加载控件   //<input class="select_text" data="1,2,3" type="text"/>
	$(".select_text").each(function () {
		selectText($(this));
	});
	
	//使用Js脚本来加载控件   //demo $("#input_1,#input_2").selectText({data:[5,7,9]});
	$.fn.selectText = function (options) {
		selectText($(this),options);
	};
});


