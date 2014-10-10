/**
 * javascript工具类
 * xiaoice
 */

//延时加载
//demo jsUnit.processor.process(function(){alert("test")},2000);
						
var jsUnit={
	throttle:function(method,content){
		clearTimeout(method.id);
		method.id=setTimeout(function(){
			method.call(content);
		},1000);
	},
	processor:{
		timeoutId:null,
		perProcessing:function(){
			
		},
		process:function(callback,timeout){
			clearTimeout(this.timeoutId);
			var that=this;
			this.timeoutId=setTimeout(function(){
				that.perProcessing();//执行真正的方法  这里为空方法
				if(typeof callback=="function"){
					callback();
				}
			},timeout||100);
		}
	}
};



