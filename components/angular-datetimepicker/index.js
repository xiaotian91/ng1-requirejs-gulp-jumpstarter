/*
 * angular-datetimepicker
 * inspired by Code2Life's work
 * author: Code2Life
 * blog: http://www.open-open.com/lib/view/open1451869347980.html
 *
 * modified and extended by Xiaotian Li
 */

'use strict'
;(function( root, module_name, factory ) {
    if (typeof define === 'function' && define.amd) { // Angular-based AMD Support
        define(['lodash'], factory);
    } else { // Browser Support
        if (!root[module_name]) {
            root[module_name] = factory(root, _);
        }
    }
}(this, 'xoDatetimepicker', function(_) {
    var app = angular.module('custom.datetimepicker', [])
        .directive('datetimepicker', datetimepickerController)
        .directive('countdowntimer', countdownController);

    function datetimepickerController() {

        return {
            restrict: 'EA',
            require: 'ngModel',
            link: function(scope, elem, attrs, ctrl) {
                var jqPluginOpts = {};
                var jqPluginMethods = {};

                _.each(scope.$eval(attrs.pluginSettings), function(val, key) {
                    if (key == 'callbacks') {
                        _bindFuncs(val, jqPluginOpts);
                    } else if (key !== 'callbacks' && key !== 'methods') {
                        jqPluginOpts[key] = val;
                    } else if (key == 'methods') {
                        _.each(val, function(val, key) {
                            jqPluginMethods[val] = val;
                        });
                    }
                });

                function _bindFuncs(inputs, outputs) {
                    _.each(inputs, function(val, key) {
                        outputs[val] = eval(key);
                    });
                }

                function onClose() {
                    $(elem).change(); //关闭日期框时手动触发change事件
                }

                function onShow() {
                }

                scope.$on('$stateChangeStart', function(event) {
                    $("#date-" + attrs.timepickerId)[attrs.jqPlugin](jqPluginMethods['destroy']);
                });

                var unregister = scope.$watch(function() {

                    $(elem).append("<input id='date-" + attrs.timepickerId + "' style='border:none;width:100%;height:100%' " +
                        "value='" + ctrl.$modelValue + "'>"); //$modelValue为模型值，即赋给ng-model的值（与控制器绑定的值）

                    $(elem).bind('change', function() { //注册onChange事件，设置viewValue
                        scope.$apply(function() {

                            var $v = $("#date-" + attrs.timepickerId);
                            var temps = {
                                notLessThan: $("#date-" + attrs.notLessThan).val() || '',
                                notGreaterThan: $("#date-" + attrs.notGreaterThan).val() || ''
                            };

                            if (temps.notLessThan) {
                                if ($v.val() < temps.notLessThan) {
                                    $v.val(temps.notLessThan);
                                }
                            }
                            if (temps.notGreaterThan) {
                                if ($v.val() > temps.notGreaterThan) {
                                    $v.val(temps.notGreaterThan);
                                }
                            }
                            ctrl.$setViewValue($v.val());
                        });
                    });

                    elem.on('click', function() { // click 触发日期控件
                        $("#date-" + attrs.timepickerId)[attrs.jqPlugin](jqPluginOpts);
                    });

                    $(elem).click(); //第一次绑定事件，模拟一次click，否则肯能要点两下才会出日期框

                    return ctrl.$modelValue;

                }, init);

                function init(value) {
                    ctrl.$setViewValue(value);
                    unregister();
                }
            }
        }
    }

    function countdownController() {
        return {
            scope: {
                until: '@',
                onExpiry: '&'
            },
            restrict: 'EA',
            link: function(scope, elem, attrs) {
                $(elem).countdown({
                    until: scope.until,
                    padZeroes: true,
                    compact: true,
                    format: 'HMS',
                    onExpiry: scope.onExpiry,
                    onTick: function(periods) {
                        var s = periods[4] * 3600 + periods[5] * 60 + periods[6];
                        //$sessionStorage.remaining = s; // // 在客户端保存用户刷新页面时的剩余时间
                    }
                });

                scope.$root.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                    $(elem).countdown('destroy');
                    //delete $sessionStorage.remaining;
                });
            }
        };
    }
}));