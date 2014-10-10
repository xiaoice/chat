/**
 * task - xiaoice
 */

(function($){
	
	var service={
		//任务栏图标总数
		getSize:function(){
			return $(".desk_task li").size();
		},
		//获取图标索引
		getIndex:function(left){
			return Math.floor((left-74)/(defaults.cellWidth+3));
		},
		//获取图标坐标
		getLeft:function(index){
			return (defaults.cellWidth+3)*index+74;
		},
		//根据坐标索引遍历查找对象
		findTask:function(x,target){
			var jq=[];
			$(".desk_task li").each(function(i){
				var index =$(this).data("task").options.index;
				if(index==x){
					jq.push($(this));
				}
			});
			if(jq.length==2){
				return jq[0];
			}else{
				return null;
			}
		},
		//设置left属性，后面的left赋值都将使用这个方法代替
		setOptions:function(target,left){
			var options = target.data("task").options;
			options.startLeft=target.offset().left; 		//当前图标的上一个拖动位置
			target.css("left",left);
			options.index = service.getIndex(left);
			options.left = service.getLeft(options.index);
		},
		//移除任务栏图标
		destroy:function(target){
			$(target).remove();
			service.setList();
			defaults.onDestroy.call(target,target);
		},
		//判断元素是否存在
		isExist:function(id){
			return $(id).length>0;
		},
		setList:function(){
			$(".desk_task li").each(function(i){
				var options =$(this).data("task").options;
				options.index = i;
				options.left = service.getLeft(i);
				$(this).css("left",options.left);
			});
		},
		//创建任务栏图标
		create:function(options){
			options.index = service.getSize();
			options.left = service.getLeft(options.index);
			if(service.isExist($("#task_"+options.id))){
				return true;
			}
			var target=$('<li id="task_'+options.id+'"><img src="'+options.base+options.icon.replace(options.base,"")+'"/></li>').appendTo(".desk_task");
			target.css("left",options.left);
			
			var state = $.data(target, 'task');
			if (state){
				$.extend(state.options, options);
				target.show();
			} else {
				state =target.data('task', {
					options: $.extend({}, $.fn.task.model, options),
					task:target
				});
				//service.setProperties(target);
			}
			
			target.bind("click",function(e){
				defaults.onClick.call(target,e,target,state);
			});
			
			service.setList();
			defaults.onCreate.call(target,target);
			return target;
		},
		setProperties:function(target){
			var state = target.data('task');
			var options=state.options;
			
			state.task.draggable({
				cursor:"pointer",
				axis:"h",
				onBeforeDrag:function(e){
					$('.desk_task li').css("z-index",9000);
					$(this).css("z-index",9001);
					$(this).draggable('options').startX=$(this).offset().left;		//当前图标的出发位置
					options.startLeft=$(this).offset().left; 						//当前图标的上一个拖动位置
					options.startIndex=service.getIndex(options.startLeft); 		//当前图标的上一个拖动索引
				},
				onDrag:function(e){
					//TODO
					var pageY=e.pageY;
					var pageX=e.pageX;
					
					options.index=service.getIndex(e.pageX);						//当前拖动的图标的索引
					options.proxy=service.findTask(options.index,target);
					
					if(options.index<=service.getSize()){
						var preLeft=options.startLeft; 								//当前图标的上一个停顿位置
						var preIndex = service.getIndex(preLeft);					//当前图标的上一个停顿索引
						//任务栏图标向左右移动
						if(options.index!=preIndex){
							if(options.proxy!=null){
								//options.proxy.css("left",preLeft-1.5);
								service.setOptions(options.proxy, preLeft-1.5);
								options.startLeft=service.getLeft(options.index)+1.5;	//当前图标的停顿位置重新定位
								options.moveed=true;									//图标已经发生移动
							}
						}
						else{
							//任务栏图标移动到原位
							options.moveed=false;
						}
					}
				},
				onStopDrag:function(e){
					options.index=service.getIndex(e.pageX);
					var size=service.getSize();
					options.index=options.index>size?size-1:options.index;
					var left=service.getLeft(options.index);
					if(!options.moveed && options.index<size){
						$(this).css("left",options.startLeft-1.5);
					}
					else{
						$(this).css("left",left);
					}
					options.startLeft=null;
				}
			});
		}
	};
	
	
	$.fn.task = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.task.methods[options];
			if (method){
				return method(this, param);
			}
		}
		defaults=$.extend({}, defaults, options);
		service.create(defaults);
	};
	
	$.fn.task.methods = {
		options: function(jq){
			return $.data(jq[0], 'task').options;
		},
		create: function(jq,param){
			defaults=$.extend({}, defaults, param);
			service.create(defaults);
		},
		destroy: function(jq,target){
			service.destroy(target);
		}
	};
	
	$.fn.task.model = {
		id:null,
		base:null,
		icon:null,
		left:null,					//当前图标的坐标
		index:null,					//当前图标的x坐标索引
		startLeft:null,				//当前图标拖动前的坐标
		startIndex:null,			//当前图标拖动前的X坐标索引
		moveed:false, 				//图标已经发生移动
		proxy:null   				//当前图标拖动到了哪个图标上面
	};
	
	//全局变量
	var defaults={
		bodyWidth:null,
		bodyHeight:null,
		cellWidth:59,
		cellHeight:40,
		xLength:null,				//x轴总数
		yLength:null,				//y轴总数
		count:0,					//图标的数量		
		proxy:null,					//图标移动到了哪个图标上面，缓存该图标
		zIndex:9000,				//层的高度
		locked:false,				//是否锁定
		onCreate:function(target){},
		onDestroy:function(target){},
		onClick:function(e,target){}
	};
	
})(jQuery);
