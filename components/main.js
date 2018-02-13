// 共用模块的集合
define(
    [
        "ngRoute",
        "ui-bootstrap",
        "angular-animate",
        "./xo-utils/src/ng-index",
        "./angular-datetimepicker/index",
        "./uib-modal/index"
    ], function () {
        return angular.module('myApp.commonComponents', [
            'ngRoute',
            'ui.bootstrap',
            'ngAnimate',
            'xo.utils',
            'custom.datetimepicker',
            'xo.confirm'
        ])
    });