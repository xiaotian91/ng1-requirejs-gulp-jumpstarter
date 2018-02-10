##介绍

种子项目, 为单页面应用设计, 整合了Angular 1和RequireJS以及一些常用的JS库, 另外用Gulp压缩打包, 模块化开发模式.


1. 在`/modules`下放置项目模块, 例如登录模块：
	
	- 每个module 作为一个独立的模块，有五个文件组成，分别如下：
	+ **app.js** 入口文件, 负责沟通其他模块
	+ **main.js** 模块定义文件, 负责定义模块名称
	+ **config.js** 模块配置文件,负责路由定义等等
	+ **ctrl.js** 模块控制器文件,负责功能逻辑
	+ **view.html**，负责界面展示
	
	
2. `/components`放置公用的Angular指令,服务，方法等等.



##技术栈
---
- RequireJS(AMD模块加载器)
- AngularJS(前端MVC框架)
- jQuery(DOM操作)
- lodash(函数式编程加强)
- sass(样式)
- Puer ＋ Mock（前后端分离开发, 模拟后台接口）


## 环境搭建
---

###### 安装node环境与npm管理工具

**基本安装**

[官网下载](https://nodejs.org/en/download/)

**Windows下安装陷阱:**  

+ **坑一:** 配置npm的全局模块的存放路径

`npm config set prefix 'C:\Program Files\nodejs\node_global'`
`npm config set cache 'C:\Program Files\nodejs\ndoe_cache'`

在系统环境变量**`Path`** , 添加 `C:\Program Files\nodejs\node_global\`

改完配置以后，**重启cmd，重启cmd，重启cmd**, 这样就可以在命令行启用全局`puer`命令<br><br>


+ **坑二:** 在.npmrc这个文件中加一行`registry=https://registry.npm.taobao.org`或者`npm config set registry http://registry.npm.taobao.org`<br><br>

+ **坑三:** npm下标不停的闪 删除C:\Users\Administrator\下的npmrc文件

######安装puer和puer-mock
1. `npm install -g puer`, 
2. 然后打开cmd或terminal，进入项目目录，输入`npm install puer-mock --save-dev` 安装puer-mock
3. 将examples文件下的三个文件`_mockserver.js, _mockserver.json, _apidoc.html`放到项目根目录下，
4. 然后输入`puer -a _mockserver.js`自动打开本地server
5. http://localhost:8000/_apidoc.html 可打开api接口文档

[github地址](https://github.com/ufologist/puer-mock)

[为什么需要一个mock-server](https://github.com/ufologist/puer-mock/blob/master/why-your-need-a-mock-server.md)

[前后端接口规范](https://github.com/f2e-journey/treasure/blob/master/api.md)


##SASS
---

**基础类库:** sassCore <a href="http://www.w3cplus.com/sasscore/index.html">查看文档</a>

**规则:** 

- CSS/SASS的类名需要统一加**前缀xo-**,中间用**中划线'－'**连接

		.xo-btn-red {
			@inlcude btn-color(#f33, #fff);
		}
- 变量和函数使用**驼峰式**, mixin/%命名采用**中划线**
		
		$txtColor: #000 !default;
		
		@mixin inline-block() {
			// Do nothing
		}
		

**结构:**

项目初期可采用**一个模块对应一个scss**，如：_login.scss, 再加一个项目用的变量文件定义字体、颜色（覆盖sass-core中的设置).

##JS打包
---
采用gulp + r.js

命令行 `npm run build`

这一步会自动生成一个build-main.js并且放置在dist文件夹作为最终部署发布的版本

[采坑大全](http://www.jb51.net/article/77771.htm)

Linux 删除文件夹下的 .DS_Store find ./ -name "*.DS_Store" -print -exec rm -fr {} \;