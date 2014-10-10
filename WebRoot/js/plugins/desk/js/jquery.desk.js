/**
 * desk - xiaoice
 * 
 * Dependencies:
 * _window
 */

(function($){
	
	var service={
		//获取X轴图标总数
		getXLength:function(){
			return Math.floor(defaults.bodyWidth/defaults.width);
		},
		//获取Y轴图标总数
		getYLength:function(){
			return Math.floor(defaults.bodyHeight/defaults.height);
		},
		//获取当前X轴坐标索引
		getXIndex:function(left){
			return Math.floor(left/defaults.width);
		},
		//获取当前Y轴坐标索引
		getYIndex:function(top){
			return Math.floor(top/defaults.height);
		},
		//根据坐标索引获取当前坐标
		getOffset:function(x,y){
			var _left=x*defaults.width;
			var _top=y*defaults.height;
			return {left:_left,top:_top};
		},
		//根据x、y索引获取对象
		getDesk:function(x,y){
			return $("#"+service.formatId(x,y));
		},
		//根据坐标索引遍历查找对象
		findDesk:function(x,y){
			var jq=null;
			$(".desk_model").each(function(i){
				var xIndex =$(this).data("desk").options.xIndex;
				var yIndex =$(this).data("desk").options.yIndex;
				if(xIndex==x&&yIndex==y){
					if(jq==null){
						jq=$(this);
					}
					else{
						return $(this);
					}
				}
				else{
					return null;
				}
			});
			return jq;
		},
		//将图标的X轴、Y轴坐标索引转换成一个二维数组
		getArray:function(){
			var arrays=[];
			$(".desk_model").each(function(i){
				var xIndex =$(this).data("desk").options.xIndex;
				var yIndex =$(this).data("desk").options.yIndex;
				arrays.push([xIndex,yIndex]);
			});
			return arrays.sort(function(x, y){
			    return x[0] - y[0];
			});
		},
		//格式化id
		formatId:function(x,y){
			return "desk_"+x+"_"+y;
		},
		//设置id值
		setId:function(target,id){
			target.attr("id",id);
		},
		//设置offset属性，后面的offset赋值都将使用这个方法代替
		setOptions:function(target,offset){
			var options = target.data("desk").options;
			target.offset(offset);
			options.xIndex = service.getXIndex(offset.left);
			options.yIndex = service.getYIndex(offset.top);
			service.setId(target,service.formatId(options.xIndex,options.yIndex));
			options.offset=offset;
		},
		//创建图标
		create:function(parent,id,img,title){
			var target="";
				target+='<div id="'+id+'" class="desk_model">';
				target+='<div class="desk_model_img"><img src="'+img+'"/></div>';
				target+='<div class="desk_model_text">'+title+'</div>';
				target+='</div>';
			var $target=$(target);
			$target.appendTo(parent);
			return $target;
		},
		//移除图标
		remove:function($this){
			$this.remove();
		},
		//判断元素是否存在
		isExist:function(id){
			return $(id).length>0;
		},
		//重新计算defaults的值
		resetDefaults:function(){
			defaults.count=0;
			defaults.bodyWidth=$("body").width();
			defaults.bodyHeight=$("body").height()-32;
			defaults.xLength=service.getXLength(defaults.width);
			defaults.yLength=service.getYLength(defaults.height);
		},
		//刷新图标
		refresh:function(){
			service.resetDefaults();
			var array=service.getArray();
			//获取X轴上面的图标列数
			var xCount=Math.round(defaults.count/defaults.yLength);
			for(var i in array){
				var item=array[i];
				var $this = service.getDesk(item[0],item[1]);
				var offset = service.getOffset(Math.floor(defaults.count/defaults.yLength),defaults.count%defaults.yLength);
				service.setOptions($this,offset);
				$this.width(defaults.width).height(defaults.height);
				defaults.count++;
			}
		},
		//重新加载
		reload:function(param){
			defaults=$.extend({}, defaults, param);
			//service.refresh();
			service.loadDesk();
		},
		//设置是否锁定
		setLocked:function(b){
			defaults.locked=(b==true||b=="true")?true:false;
			if(defaults.locked){
				service.refresh();
			}
		},
		setIcon:function(){
			if(defaults.bigIcon){
				defaults.width=88;
				defaults.height=88;
				$(".desk_model_img").removeClass("desk_model_img_small");
			}else{
				defaults.width=60;
				defaults.height=60;
				$(".desk_model_img").addClass("desk_model_img_small");
			}
			service.refresh();
		},
		//读取url分配图标
		loadDesk:function(){
			$.getJSON(defaults.href,function(result){
				if(typeof result=="object"){
					service.resetDefaults();
					defaults.jq.empty();
					for(var i in result){
						var options=result[i];
						var target=service.create(defaults.jq,options.id,defaults.base+options.icon,options.title);
						var state = $.data(target, 'desk');
						if (state){
							$.extend(state.options, options);
						} else {
							state =target.data('desk', {
								options: $.extend({}, $.fn.desk.model, options)
							});
							service.init(target);
							service.setProperties(target);
						}
					}
				}
			});
		},
		//初始化控件
		init:function(target){
			var state = target.data('desk');
			var options=state.options;
			state.desk=$(target);
			state.desk.width(defaults.width).height(defaults.height);
			var offset = service.getOffset(Math.floor(defaults.count/defaults.yLength),defaults.count%defaults.yLength);
			service.setOptions(state.desk,offset);
			//设置id值
			service.setId(state.desk,service.formatId(options.xIndex,options.yIndex));
			defaults.count++;
			return $(target);
		},
		openWindow:function(e,state){
			//var state = source.data('desk');
			var options = state.options;
			var id=state.desk.attr("id");
			if($("#window_"+id).length>0){
				state._window._window("show",state._window);
				return ;
			}
			var _target=$('<div id="window_'+id+'"></div>').appendTo("body");
			state._window=_target;
			_target._window({
				title:options.title,
				href:options.href,
				icon:options.icon,
				base:defaults.base,
				contentWidth:options.width,
				contentHeight:options.height,
				onOpen:function(source){
					defaults.onOpen.call(state.desk,e,state);
				},
				onClose:function(e){
					defaults.onClose.call(state.desk,e,state);
				}
			});
			defaults.openWindow.call(state.desk,e,state);
		},
		//为控件附加事件-加载其他插件
		setProperties:function(target){
			var state = target.data('desk');
			var options=state.options;
			state.desk.draggable({
				//proxy:"clone",
				proxy: function(source){
					var draggableState = $.data(source).draggable;
					var proxy = $('<div class="desk_model_copy"></div>');
					proxy.html($(source).html()).insertAfter(source);
					proxy.offset($(source).offset()).width(defaults.width);
					//proxy会被清空，所以将proxy保存到临时变量_proxy中
					draggableState.proxy=proxy;
					draggableState._proxy=proxy;
					proxy&&$(this).draggable('proxy').css("z-index",++defaults.zIndex).addClass("desk_model_filter").removeClass("desk_model_hover");
					
					//proxy.add($(source))
					var $proxy=$.merge($(source),proxy);
					$proxy.unbind("mouseup").bind("mouseup",function(e){
						if(proxy.offset().left==$(source).offset().left &&proxy.offset().top==$(source).offset().top){
							//e.which 1鼠标左键 2、中键、3右键
							if(e.which==1){
								service.openWindow(e,state);
								defaults.onClick.call(state.desk,e,state);
							}
							else if(e.which==3){
								defaults.onMouseRight.call(state.desk,e,state);
							}
						}
					});
					return proxy;
				},
				
				cursor:"default",
				//revert:true,
				onBeforeDrag:function(e){
					options.startXIndex=options.xIndex;
					options.startYIndex=options.yIndex;
					options.startOffset=options.offset;
				},
				onDrag:function(e){
					var xIndex = service.getXIndex(e.pageX);
					var yIndex = service.getYIndex(e.pageY);
					defaults.proxy = service.findDesk(xIndex,yIndex);
				},
				onStopDrag:function(e){
					if($.data(this).draggable._proxy){
						//$.data(this).draggable.proxy.remove();
						//$(this).draggable('proxy').remove();
						options.xIndex = service.getXIndex(e.pageX);
						options.yIndex = service.getYIndex(e.pageY);
						var offset = service.getOffset(options.xIndex,options.yIndex);
						var $this=$(this);
						if(defaults.proxy!=null && defaults.proxy[0]!=$this[0]){
							$this.css("z-index",defaults.zIndex++);
							service.setOptions($this, offset);
							service.setOptions(defaults.proxy, options.startOffset);
						}
						else{
							service.setOptions($this, offset);
						}
						options.startXIndex=null;
						options.startYIndex=null;
						options.startOffset=null;
						defaults.proxy=null;
					}
					if(defaults.locked){
						service.refresh();
					}
				}
			});
		}
	};
	
	
	
	$.fn.desk = function(options, param){
		if (typeof options == 'string'){
			switch(options){
				case 'options':
					return $.data(this[0], '_window').options;
				case 'setTheme':
					return this._window("setTheme",param);
			}
			var method = $.fn.desk.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		/*
		return this.each(function(){
			var state = $.data(this, 'desk');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'desk', {
					options: $.extend({}, $.fn.desk.model, $.fn.desk.parseOptions(this), options)
				});
			}
		});
		*/
		defaults.jq=this;
		defaults=$.extend({}, defaults, options);
		service.loadDesk();
		
		$(window).resize(function(e){
			service.refresh();
			defaults.onResize.call(this,e);
		});
	};
	
	$.fn.desk.methods = {
		options: function(jq){
			return $.data(jq[0], 'desk').options;
		},
		defaults:function(){
			return defaults;
		},
		refresh: function(){
			service.refresh();
		},
		reload: function(){
			service.reload();
		},
		locked: function(target,b){
			service.setLocked(b);
		},
		setIcon: function(target,b){
			if(b==true || b=="true"){
				defaults.bigIcon=true;
			}
			else{
				defaults.bigIcon=false;
			}
			service.setIcon();
		},
		openWindow:function(target,param){
			service.openWindow(param.e,param.state);
		}
	};
	
	$.fn.desk.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, ['width','text',{value:'number'}]));
	};
	
	//图标对象的属性
	$.fn.desk.model = {
		xIndex:null,				//当前图标的x坐标索引
		yIndex:null,				//当前图标的y坐标索引
		offset:{left:null,top:null},//当前图标的坐标
		startXIndex:null,			//当前图标拖动前的X坐标索引
		startYIndex:null,			//当前图标拖动前的Y坐标索引
		startOffset:null			//当前图标拖动前的坐标
	};
	
	//全局变量
	var defaults={
		bodyWidth:null,				//页面宽度
		bodyHeight:null,			//页面高度
		width:88,					//当前图标的高度
		height:88,					//当前图标的宽度
		bigIcon:true,				//是否使用大图标
		xLength:null,				//x轴总数
		yLength:null,				//y轴总数
		count:0,					//图标的数量		
		proxy:null,					//图标移动到了哪个图标上面，缓存该图标
		zIndex:1000,				//层的索引
		locked:false,				//是否锁定
		jq:null,					//初始化对象
		base:null,					//初始化服务器路径
		href:null,					//初始化url
		onMouseRight: function(e,source){},
		onClick:function(e,source){},
		onOpen:function(e,source){},
		openWindow:function(e,source){},
		onClose:function(e,source){},
		onResize:function(e){}
	};
	
})(jQuery);
