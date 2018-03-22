## 介绍

种子项目, 为单页面应用设计, 整合了Angular 1和RequireJS以及一些常用的JS库, 另外用Gulp压缩打包, 模块化开发模式.


1. 在`/modules`下放置项目模块, 例如登录模块：
	
	- 每个module 作为一个独立的模块，有五个文件组成，分别如下：
	+ **app.js** 入口文件, 负责沟通其他模块
	+ **main.js** 模块定义文件, 负责定义模块名称
	+ **config.js** 模块配置文件,负责路由定义等等
	+ **ctrl.js** 模块控制器文件,负责功能逻辑
	+ **view.html**，负责界面展示
	
	
2. `/components`放置公用的Angular指令,服务，方法等等.这些模块不仅可以在Angular的生态里工作，同时也可以独立出来作为普通的JS方法

3. `/plugins`放置第三方插件，主要是一些非官方的插件

## 环境搭建

###### 安装node环境与npm管理工具

node, npm, gulp 是必须要安装的

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

## 开始
		npm install
		bower install
		
		npm run dev //开发环境
		npm run build //打包
		npm run clean //清理
		
## 主要技术栈

- RequireJS(AMD模块加载器)
- AngularJS(前端MVC框架)
- jQuery(DOM操作)
- lodash(函数式编程加强)
- sass + bootstrap 3(样式)
- Browsersync ＋ Mock（前后端分离开发, 模拟后台接口）

## 样式
---

使用SASS进行管理，方便制作皮肤

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
		

## 打包

`npm run build`  这一步会自动生成一个dist文件夹作为最终部署发布的版本.

    - dist
        - index.html
        - styles
            - css
                - themes(皮肤css)
                - 其他css
        - app.js // 未压缩js
        - app.min.js // 压缩js
        - app.js.gz // gzip
        - app.min.js.gz

notes: 在`build`之前如果先使用过`npm run dev`建立过开发环境，那么请先用 `npm run clean`之后在用`npm run build`.
 
## 补丁与小Tips

请用patch里的模块替换掉node_modules里相同的模块的index.js

[采坑大全](http://www.jb51.net/article/77771.htm)

Linux 删除文件夹下的 .DS_Store find ./ -name "*.DS_Store" -print -exec rm -fr {} \;

Windows环境下可能会遇到权限问题，需要给cmd.exe‘Run As Adminitrator’