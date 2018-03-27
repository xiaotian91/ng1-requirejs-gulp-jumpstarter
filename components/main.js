// 共用模块的集合
define(
    [
        "ui-bootstrap",
        "angular-animate",
        "./xo-utils/src/ng-index",
        "./angular-datetimepicker/index",
        "./uib-modal/index",
        "./angular-table-select/index"
    ], function () {
        return angular.module('myApp.commonComponents', [
            'ui.bootstrap',
            'ngAnimate',
            'xo.utils',
            'custom.datetimepicker',
            'xo.confirm',
            'xo.tableSelect',
            'ui.router'
        ])
    });

