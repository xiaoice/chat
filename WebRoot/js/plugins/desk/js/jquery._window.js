/**
 * _window - xiaoice
 * 
 * Dependencies:
 * task
 */

(function($){
	
	var service = {
		//最小化面板
		minimizePanel:function(target){
			var state = $.data(target, '_window');
			var options=state.options;
			state.window.hide();
			state.backdrop.hide();
			options.minimized = true;
			options.maximized = false;
			options.onMinimize.call(target);//让target继承外部的onMinimize方法
		},
		//最大化面板
		maximizePanel:function(target){
			var state = $.data(target, '_window');
			var options=state.options;
			var tool=state.window.find(".desk_icon_max");
			if (tool.hasClass('desk_icon_restore')) return;
			tool.addClass('desk_icon_restore');
			options.original = {
				width: options.width,
				height: options.height,
				contentWidth: options.contentWidth,
				contentHeight: options.contentHeight,
				left: options.left,
				top: options.top,
				fit: options.fit
			};
			options.left = 0;
			options.top = 0;
			options.fit = true;
			service.setSize(target);
			state.backdrop.offset(state.window.offset());
			options.minimized = false;
			options.maximized = true;
			state.window.draggable("disable");
			state.window.resizable("disable");
			service.setOffset(target);
			options.onMaximize.call(target);
		},
		//还原面板
		restorePanel:function(target){
			var state = $.data(target, '_window');
			var options=state.options;
			var tool=state.window.find(".desk_icon_max");
			if (!tool.hasClass('desk_icon_restore')) return;
			tool.removeClass('desk_icon_restore');
			$.extend(options, {
				width: options.original.width,
				height: options.original.height,
				contentWidth: options.original.contentWidth,
				contentHeight: options.original.contentHeight,
				left: options.original.left,
				top: options.original.top,
				fit: options.original.fit
			});
			state.backdrop.offset(state.window.offset());
			service.setSize(target);
			//state.window.show();
			options.minimized = false;
			options.maximized = false;
			state.window.draggable("enable");
			state.window.resizable("enable");
			service.setOffset(target);
			options.onRestore.call(target);
		},
		//移除节点
		removeNode:function(node){
			node.each(function(){
				$(this).remove();
				if ($.browser.msie){
					this.outerHTML = '';
				}
			});
		},
		//判断元素是否存在
		isExist:function(target){
			return $(target).length>0;
		},
		//关闭隐藏面板
		hidePanel:function(target){
			var state = $.data(target, '_window');
			if(typeof state=="undefined"){
				state=target.data('_window');
			}
			state.options.minimized = true;
			state.options.maximized = false;
			state.backdrop.hide();
			state.window.hide();
		},
		//显示隐藏面板
		showPanel:function(target){
			var state = $.data(target, '_window');
			if(typeof state=="undefined"){
				state=target.data('_window');
			}
			state.options.minimized = false;
			state.options.maximized = true;
			state.backdrop.show();
			state.window.show();
			$.fn._window.defaults.zIndex++;
			$.fn._window.defaults.zIndex++;
			service.setSize(target);
			service.setOffset(target);
		},
		//删除面板
		destroyPanel:function(target,forceDestroy){
			var state = $.data(target, '_window');
			var options=state.options;
			
			if (forceDestroy != true){
				if (options.onBeforeDestroy.call(target) == false) return;
			}
			service.removeNode(state.window);
			service.removeNode(state.backdrop);
			options.onDestroy.call(target);
		},
		//移动面板
		movePanel:function(target,param){
			var state = $.data(target, '_window');
			var options=state.options;
			if (param){
				if (param.left != null) options.left = param.left;
				if (param.top != null) options.top = param.top;
			}
			state.window.css({
				left: options.left,
				top: options.top
			});
			options.onMove.apply(target, [options.left, options.top]);
		},
		//设置面板标题
		setTitle:function(target,title){
			var state = $.data(target, '_window');
			state.options.title = title;
			state.title.html(title);
		},
		//设置主题
		setTheme:function(param){
			$.fn._window.defaults.theme=param.theme!=null?param.theme:$.fn._window.defaults.theme;
			$.fn._window.defaults.themeFilter=param.themeFilter!=null?param.themeFilter:$.fn._window.defaults.themeFilter;
			$(".desk_window_backdrop").css({
				background:param.theme,
				"filter":"alpha(opacity="+param.themeFilter+")",
				"-moz-opacity":param.themeFilter/100,
				"-khtml-opacity": param.themeFilter/100,
				"opacity":param.themeFilter/100
			});
		},
		//读取数据
		loadData:function(target){
			var state = $.data(target, '_window');
			var options=state.options;
			if (options.href && (!state.isLoaded || !options.cache)){
				state.isLoaded = false;
				if(!options.iframeable){
					state.content.html($('<div class="panel-loading"></div>').html(options.loadingMessage));
					options.href="http://"+options.href.replace("http://", "");
					state.content.load(options.href, null, function(){
						if ($.parser){
							$.parser.parse(state.content);
							state.isLoaded = true;
						}
					});
				}
				else{
					var html='<div class="iframe_app relative" iconCls="icon-ok" title="'+options.title+'" >';
						html+='<div class="iframe_wait">'+options.loadingMessage+'</div>';
						html+='<iframe class="iframe_html" src="'+options.href+'" scrolling="auto" frameborder="no" hidefocus="" allowtransparency="true" ></iframe></div>';
					state.content.html($(html));
					state.window.find(".iframe_wait").css({height:options.contentHeight,"line-height":(options.contentHeight-32)+"px"});
					state.content.find(".iframe_html").load(function(){
						state.isLoaded = true;
						state.window.find(".iframe_wait").hide();
					});
				}
				options.onLoad.apply(target, arguments);
			}
		},
		//调整大小
		setSize:function(target, param){
			var state = $.data(target, '_window');
			if(typeof state=="undefined"){
				return;
			}
			var options=state.options;
			if (param){
				if (param.width) options.width = param.width;
				if (param.height) options.height = param.height;
				if (param.left) options.left = param.left;
				if (param.top) options.top = param.top;
			}
			
			if (options.fit){
				var p = state.window.parent();
				options.width = p.width();
				options.height = p.height();
			}
			
			options.zIndex = $.fn._window.defaults.zIndex;
			options.contentWidth=options.width-2;
			options.contentHeight=options.height-30;
			state.window.css({
				left: options.left-6,
				top: options.top,
				zIndex:options.zIndex
			});
			state.backdrop.css({
				left: options.left-6,
				top: options.top,
				zIndex:options.zIndex-1
			});
			
			if ($.isNumeric(options.width)){
				state.window.width(options.width);
				state.content.width(options.contentWidth);
				state.backdrop.width(options.width);
			} else {
				state.window.width('auto');
				state.content.width('auto');
				state.backdrop.width('auto');
			}
			if ($.isNumeric(options.height)){
				state.window.height(options.height);
				state.content.height(options.contentHeight);
				state.backdrop.height(options.height);
			} else {
				state.window.height('auto');
				state.content.height('auto');
				state.backdrop.height('auto');
			}
			options.onResize.apply(target, [options.width, options.height]);
		},
		setOffset:function(target){
			var state = $.data(target, '_window');
			if(typeof state=="undefined"){
				return;
			}
			var options=state.options;
			state.window.css("top",options.top<0?0:options.top);
			state.backdrop.css("top",options.top<0?0:options.top);
		},
		//打开面板
		openPanel:function(target, forceOpen){
			var state = $.data(target, '_window');
			var options=state.options;
			if (forceOpen != true){
				if (options.onBeforeOpen.call(target) == false) return;
			}
			//内容
			if(options.href!=null){
				service.loadData(target);
			}
			
			if (options.content!=null){
				$(state.content).html(options.content);
				if ($.parser){
					$.parser.parse(this);
				}
			}else{
				if(options.appable){
					$(state.content).html(options.appcache);
				}
			}
			if (options.maximized == true) service.maximizePanel(target);
			if (options.minimized == true) service.minimizePanel(target);
			
			options.closed = false;
			service.setOffset(target);
			//调用任务栏
			$(".desk_task").task({
				id:$(target).attr("id"),
				icon:options.icon,
				base:options.base,
				onCreate:function(_target){
					state.task=_target;
					_target.data('task')._window=target;
					_target.data('task')._windowOption=options;
				},
				onClick:function(e,_target,_state){
					var _window =_target.data('task')._window;
					var _windowOption=_target.data('task')._windowOption;
					
					if(_windowOption.zIndex==$.fn._window.defaults.zIndex++){
						if(_windowOption.minimized){
							service.showPanel(_window);
						}
						else{
							service.hidePanel(_window);
						}
					}
					else{
						service.showPanel(_window);
					}
				}
			});
			
			options.onOpen.call(target,target);
		},
		//初始化
		init:function(target){
			var state = $.data(target, '_window');
			if(typeof state=="undefined"){
				return;
			}
			var options=state.options;
			var $target=$(target);
			var html='<div class="desk_title"></div>';
			html+='<div class="desk_title_left"></div><div class="desk_title_right"></div><div class="desk_content"></div>';
			$target.addClass('desk_window').html(html);
			state.window=$target;
			state.title=state.window.find(".desk_title");
			state.content=state.window.find(".desk_content");
			state.body=$("body");
			state.iconLeft=state.window.find(".desk_title_left");
			state.iconRight=state.window.find(".desk_title_right");
			//标题
			state.title.html(options.title);
			state.content.width(options.contentWidth).height(options.contentHeight);
			//window长度宽度
			options.bodyWidth=state.body.width();
			options.bodyHeight=state.body.height();
			options.width=state.window.width();
			options.height=state.window.height();
			options.left=options.left==null?(options.bodyWidth-options.width)/2:options.left;
			options.top=options.top==null?(options.bodyHeight-options.height)/2:options.top;
			
			// create backdrop
			state.backdrop = $('<div class="desk_window_backdrop"></div>').insertAfter(state.window);
			service.setTheme(options);
			options.zIndex = $.fn._window.defaults.zIndex++;
			
			if (options.tools){
				for(var i=options.tools.length-1; i>=0; i--){
					var t = $('<div></div>').addClass(options.tools[i].iconCls).appendTo(tool);
					if (options.tools[i].handler){
						t.bind('click', eval(options.tools[i].handler));
					}
				}
			}
			var action={
				onMin:function(){
					service.minimizePanel(target);
					return false;
				},
				onMax:function(event){
					if (state.window.find(".desk_icon_max").hasClass('desk_icon_restore')){
						service.restorePanel(target);
					} else {
						service.maximizePanel(target);
					}
					return false;
				},
				onClose:function(){
					if(options.appable){
						state.window.hide();
						state.backdrop.hide();
					}
					else{
						service.destroyPanel(target);
						options.onClose.call(target,state);
					}
					if(state.task!=null && service.isExist(state.task)){
						state.task.task("destroy",state.task);
					}
					return false;
				},
				onRefresh:function(){
					var iframe=state.content.find(".iframe_html");
					iframe.attr("src",iframe.attr("src"));
					state.window.find(".iframe_wait").show();
					iframe.load(function(){
						state.isLoaded = true;
						state.window.find(".iframe_wait").hide();
					});
				}
			};
			
			//left icon
			options.refreshable=options.refreshable&&$('<span class="desk_icon desk_icon_refresh"></span>').appendTo(state.iconLeft).bind("click",action.onRefresh);
			options.fixedable=options.fixedable&&$('<span class="desk_icon desk_icon_fixed"></span>').appendTo(state.iconLeft);
			options.loveable=options.loveable&&$('<span class="desk_icon desk_icon_love"></span>').appendTo(state.iconLeft);
			options.userable=options.userable&&$('<span class="desk_icon desk_icon_user"></span>').appendTo(state.iconLeft);
			//right icon
			options.closable=options.closable&&$('<span class="desk_icon desk_icon_close"></span>').appendTo(state.iconRight).bind("click",action.onClose);
			options.maximizable=options.maximizable&&$('<span class="desk_icon desk_icon_max"></span>').appendTo(state.iconRight).bind("click",action.onMax);
			options.minimizable=options.minimizable&&$('<span class="desk_icon desk_icon_min"></span>').appendTo(state.iconRight).bind("click",action.onMin);
			state.title.bind("dblclick",action.onMax);
			service.setSize(target);
			return $(target);
		},
		//附加插件
		setProperties:function(target){
			var state = $.data(target, '_window');
			var options=state.options;
			state.window.draggable({
				handle: state.title,
				disabled: options.draggable == false,
				onStartDrag: function(e){
					state.backdrop.css('z-index', $.fn._window.defaults.zIndex++);
					state.window.css('z-index', $.fn._window.defaults.zIndex++);
					
					if(options.proxy){
						if (!state.proxy){
							state.proxy = $('<div class="window-proxy desk_window_proxy"></div>').insertAfter(state.window);
						}
						state.proxy.css({
							display:'none',
							zIndex: $.fn.window.defaults.zIndex++,
							left: e.data.left,
							top: e.data.top,
							width: ($.boxModel==true ? (state.window.outerWidth()-(state.proxy.outerWidth()-state.proxy.width())) : state.window.outerWidth())-6,
							height: ($.boxModel==true ? (state.window.outerHeight()-(state.proxy.outerHeight()-state.proxy.height())) : state.window.outerHeight())-12,
							zIndex:$.fn._window.defaults.zIndex,
							"border-color":$.fn._window.defaults.theme
						});
						setTimeout(function(){
							if (state.proxy) state.proxy.show();
						}, 500);
					}
				},
				onDrag: function(e){
					if(options.proxy){
						state.proxy.css({
							display:'block',
							left: e.data.left,
							top: e.data.top<=0?0:(e.data.top>options.bodyHeight-34?options.bodyHeight-34:e.data.top)
						});
						$(state.window).hide();
						$(state.backdrop).hide();
					}
					else{
						var $state=$.merge($(state.window),$(state.backdrop));
						$state.css({
							display:'block',
							left: e.data.left,
							top: e.data.top<=0?0:(e.data.top>options.bodyHeight-34?options.bodyHeight-34:e.data.top)
						});
					}
					return false;
				},
				onStopDrag: function(e){
					if(!$(e.target).hasClass("desk_icon")){
						$.extend(options, {
							left: e.data.left,
							top: e.data.top<=0?0:(e.data.top>=options.bodyHeight-34?options.bodyHeight-34:e.data.top)
						});
					}
					options.zIndex=$.fn._window.defaults.zIndex;
					
					var $state=$.merge($(state.window),$(state.backdrop));
					$state.css({
						display:'block',
						left: e.data.left,
						top: e.data.top<=0?0:(e.data.top>=options.bodyHeight-34?options.bodyHeight-34:e.data.top)
					});
					if(options.proxy){
						state.proxy.remove();
						state.proxy = null;
					}
				}
			});
			
			state.window.resizable({
				disabled: options.resizable == false,
				onStartResize:function(e){
					state.backdrop.css({zIndex: $.fn._window.defaults.zIndex++});
					state.window.css({zIndex: $.fn._window.defaults.zIndex++});
					if(options.proxy){
						state.pmask = $('<div class="window-proxy-mask radius5"></div>').insertAfter(state.window);
						state.pmask.css({
							zIndex: $.fn._window.defaults.zIndex,
							left: e.data.left,
							top: e.data.top,
							width: state.window._outerWidth(),
							height: state.window._outerHeight()
						});
						if (!state.proxy){
							state.proxy = $('<div class="window-proxy radius5"></div>').insertAfter(state.window);
						}
						state.proxy.css({
							zIndex: $.fn._window.defaults.zIndex,
							left: e.data.left,
							top: e.data.top
						});
						state.proxy._outerWidth(e.data.width);
						state.proxy._outerHeight(e.data.height);
					}
				},
				onResize: function(e){
					if(options.proxy){
						state.proxy.css({
							left: e.data.left,
							top: e.data.top<=0?0:(e.data.top>options.bodyHeight-34?options.bodyHeight-34:e.data.top)
						});
						state.proxy._outerWidth(e.data.width);
						state.proxy._outerHeight(e.data.height);
					}
					else{
						var $state=$.merge($(state.window),$(state.backdrop));
						$state.css({
							left: e.data.left,
							top: e.data.top<=0?0:(e.data.top>options.bodyHeight-34?options.bodyHeight-34:e.data.top)
						});
						$state._outerWidth(e.data.width)._outerHeight(e.data.height);
						state.content.width(e.data.width-14).height(e.data.height-42);
					}
					return false;
				},
				onStopResize: function(e){
					var bodyHeight=$("body").height()-6;
					$.extend(options, {
						left: e.data.left+6,
						top: e.data.top<=0?0:(e.data.top>options.bodyHeight-34?options.bodyHeight-34:e.data.top),
						width: e.data.width-12,
						height: e.data.height-12>bodyHeight?bodyHeight:e.data.height-12,
						zIndex: $.fn._window.defaults.zIndex
					});
					service.setSize(target);
					if(options.proxy){
						state.pmask.remove();
						state.pmask = null;
						state.proxy.remove();
						state.proxy = null;
					}
				}
			});
		}
	};
	
	$.fn._window = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn._window.methods[options];
			if (method){
				return method(this, param);
			}
		}
		return this.each(function(){
			var self=this;
			if(options.appable){
				options.appcache=$(this).html();
			}
			var state = $.data(self, '_window');
			if (state){
				$.extend({},state.options, options);
				state.window.show();
				state.backdrop.show();
			} else {
				state = $.data(self, '_window', {
					options: $.extend({}, $.fn._window.defaults, options),
					isLoaded: false			//是否已经读取完毕
				});
				service.init(self);
				service.setProperties(self);
			}
			service.openPanel(self, true);
			jsUnit.processor.process(function(){
				$(window).unbind("resize").bind("resize",function(e){
					service.setSize(self);
					service.setOffset(self);
				});
			});
		});
	};
	
	$.fn._window.methods = {
		options: function(jq){
			return $.data(jq[0], '_window').options;
		},
		resize: function(jq, param){
			return jq.each(function(){
				service.setSize(this, param);
			});
		},
		setTheme:function(jq,theme){
			service.setTheme(theme);
		},
		show:function(jq){
			service.showPanel(jq[0]);
		},
		hide:function(jq){
			service.hidePanel(jq);
		},
		proxy:function(jq,b){
			if(b==false || b=="false"){
				$.fn._window.defaults.proxy=false;
			}else{
				$.fn._window.defaults.proxy=true;
			}
		}
	};
	
	$.fn._window.defaults = {
		left:null,					//记录X轴坐标
		top:null,					//记录Y轴坐标
		contentWidth:600,			//面板宽度
		contentHeight:400,			//面板高度
		draggable:true,				//是否可拖动
		title:"my app",				//标题
		content:null,				//内容
		appable:false,				//是否为应用程序
		appcache:false,				//应用程序缓存内容
		icon:null,					//图标
		base:null,					//系统相对路径
		href:null,					//网页url
		iframeable:true,			//是否使用iframe
		cache: true,				//是否使用缓存
		loadingMessage:"Loading...",//加载等待文字
		proxy: true,				//使用页面临时层代替过度效果,为false的话有损性能
		themeFilter:80,				//透明遮罩，能够有透明效果 0透明，1不透明
		theme:"#5458D3",			//背景色
		zIndex:9001,				//层的索引高度
		fit:false,					//是否全屏
		refreshable: true,			//显示刷新按钮
		fixedable: true,			//显示固定按钮
		loveable: true,				//显示喜欢按钮
		userable: true,				//显示用户按钮
		maximizable: true,			//显示最大化按钮
		minimizable: true,			//显示最小化按钮
		minimized:false,			//最大化
		maximized:false,			//最小化
		closable: true,				//显示关闭按钮
		tools: [],					//自定义工具栏
		onLoad: function(){},		
		onBeforeOpen: function(){},
		onOpen: function(target){},
		onClose: function(){},
		onMinimize:function(){},
		onMaximize:function(){},
		onRestore:function(){},
		onResize:function(width,height){},
		onBeforeDestroy: function(){},
		onDestroy: function(){},
		onMove: function(left,top){}
	};
	
})(jQuery);
