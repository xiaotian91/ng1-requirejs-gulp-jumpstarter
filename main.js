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

        'angular-smart-table': 'bower_components/angular-smart-table/dist/smart-table.min',

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
    'modules/tableDemo/main',
    'modules/stDemo/main',
    'template',
    'config'
],function(){
    var app = angular.module("myApp", [
        "myApp.home",
        "myApp.login",
        "myApp.utilsDemo",
        "myApp.inputsDemo",
        "myApp.dataService",
        "myApp.tableDemo",
        "myApp.stDemo",
        "template-app",
        "myApp.config"
    ]).run(['$rootScope', '$apiPath', '$state', '$transitions', function($rootScope, $apiPath, $state, $transitions) {
        // 定义一些root级别的公用方法, 共享登录状态, 返回上一页等
        $rootScope.loggedIn = true; // fake loggedIn
        $rootScope.$apiPath = $apiPath; // 后台资源url地址
        var previousState;
        var previousStateParameters;
        $transitions.onSuccess({}, function (transition) {
            previousState = transition.from().name;
            previousStateParameters = transition.params('from');
        });
        $rootScope.back = function (options) {
            $state.go(previousState, previousStateParameters, options);
        }
    }]);
    angular.bootstrap(document,['myApp']); // 启动项目
});

