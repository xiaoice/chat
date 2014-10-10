/**
 * config配置文件
 * 曾小斌
 * 2014-01-10 14:36:19
 */

seajs.config({
  base: "../js",
  paths: {
	 'plugins': 'plugins'
  },
  alias: {
    "Ant": "ant.all.js",
    "jquery": "jquery.min.js",
    "bootstrapCss": "plugins/bootstrap/css/bootstrap.min.css",
    "bootstrap": "plugins/bootstrap/js/bootstrap.min.js",
    "jquery-ui": "plugins/jquery-ui-bootstrap/assets/js/jquery-ui-1.9.2.custom.min.js",
    "font-awesome": "plugins/bootstrap/css/font-awesome.css",
    "easyuiCss-black": "plugins/jquery-easyui/themes/black/easyui.css",
    "easyui": "plugins/jquery-easyui/jquery.easyui.min.js",
    "layout": "plugins/coze/js/layout.js",
    "util": "plugins/coze/js/util.js",
    "login": "plugins/coze/js/login.js",
    "panel": "plugins/coze/js/panel.js",
    "windows": "plugins/coze/js/windows.js",
    "coze": "plugins/coze/js/coze.js"
  },
  preload: [
     this.JSON ? '' : 'plugins/json.js',
     this.$?'':'jquery'
  ],
  debug: true,
  charset: 'utf-8'
});

//加载入口模块
seajs.use(["layout"],function(layout){
	console.log("page was init!",layout);
});