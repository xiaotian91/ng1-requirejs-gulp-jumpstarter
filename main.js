'use strict';
// 入口程序
require.config({
    baseUrl:'',
    paths: {
        'ui-bootstrap' : 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        'angular-animate':'bower_components/angular-animate/angular-animate.min',
        'routeConfig':'components/routeConfig',

        'jquery': 'node_modules/jquery/dist/jquery',
        'jquery-plugin': 'plugins/jquery-datepick/jquery.plugin',
        'jquery-datetime-picker': 'plugins/jquery-datetimepicker/jquery.datetimepicker',
        'jquery-datepick': 'plugins/jquery-datepick/jquery.datepick',
        'lodash': 'node_modules/lodash/lodash',

        'template': 'tmp/template.tpl', // 所有的html模版
        'config': 'config' // 全局配置文件
    },
    shim: { // 非AMD模块需要Shim
        "jquery-plugin": ['jquery'],
        "jquery-datetime-picker": ['jquery'],
        "jquery-datepick": ['jquery-plugin']
    }
});

require([ // 加载所有模块的入口文件
    'modules/home/main',
    'modules/login/main',
    'modules/utilsDemo/main',
    'modules/inputsDemo/main',
    'modules/dataService/main',
    'template',
    'config'
],function(){
    var app = angular.module("myApp", [
        "myApp.home",
        "myApp.login",
        "myApp.utilsDemo",
        "myApp.inputsDemo",
        "myApp.dataService",
        "template-app",
        "myApp.config"
    ]).run(['$rootScope', '$apiPath', function($rootScope, $apiPath) {
        // 定义一些root级别的公用方法, 共享登录状态等
        $rootScope.loggedIn = true; // fake loggedIn
        $rootScope.$apiPath = $apiPath;
    }]);
    angular.bootstrap(document,['myApp']); // 启动项目
});

