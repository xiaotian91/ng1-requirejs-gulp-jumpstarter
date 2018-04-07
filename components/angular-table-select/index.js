'use strict'
;(function( root, module_name, factory ) {
    if (typeof define === 'function' && define.amd) { // Angular-based AMD Support
        define(['jquery', 'lodash'], factory);
    } else { // Browser Support
        if (!root[module_name]) {
            root[module_name] = factory(root, $, _);
        }
    }
}(this, 'xoTableselect', function($,_) {

    angular.module('xo.tableSelect', [])
        .directive('xoTableselect', checkBoxController)
        .directive('rowSelectable', function($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var row = $parse(attrs.rowSelectable)(scope);
                    element.on('click', function($event) {
                        if ($event.target.nodeName.toLowerCase()!='input') {  
                            var checkbox = $(element).find('input').get(0);
                            checkbox.checked = !checkbox.checked;
                        }
                    });
                }
            }
        })
        .directive('rowChecklistModel', function($parse) {
            return {
                restrict: 'EA',
                scope: {
                    rowChecklistModel: "=",
                    rowChecklistValue: "="
                },
                require: '^?xoCheckall',
                link: function(scope, element, attrs, xoCheckAllController) {
                    var arr = scope.rowChecklistModel;
                    var row = scope.rowChecklistValue;
                    element.on('click', function($event) {
                        var $element = $(element);
                        var _isSelected = isSelected($element);
                        if (_isSelected) {
                            arr.push(row);
                        } else {
                            arr.splice(arr.indexOf(row), 1);
                        }
                    });

                    function isSelected($element) {
                        var _isSelected = $element.hasClass('st-selected');
                        if (!_isSelected) { 
                            $element.addClass('st-selected');
                        } else {    
                            if (_isSelected) {
                               $element.removeClass('st-selected');
                            } else {
                               $element.addClass('st-selected');
                            }
                        }
                        return $element.hasClass('st-selected');
                    }
                }
            }
        });

    function checkBoxController($parse, $timeout) {

        return {
            restrict: 'EA',
            replace: true,
            scope: {
                items: "=",
                selectedItems: "=",
                forSelectedKey: "=",
                forFuncs: "=",
                srcUrl: '='
            },
            /*templateUrl: function(elem, attrs) {
             if (!attrs.templateUrl) {
             console.log('template is not given! please assign a template-url to the directive');
             return false;
             }
             return attrs.templateUrl;
             },*/
            template: '<div ng-include="getTemplate()"></div>',
            link: function(scope, elem, attrs) {
                scope.selectAll = false;
                scope.selectedKey = scope.forSelectedKey;
                scope.getTemplate= function() {
                    return attrs.templateUrl
                };
                scope.all = function(m) {
                    for (var i = 0; i < scope.items.length; i++) {
                        if (m === true) {
                            scope.items[i].state = true;
                            scope.selectedItems.val = _.map(scope.items, function(value, key) {
                                return value;
                            }); // hack
                            scope.selectAll = true;
                        } else {
                            scope.items[i].state = false;
                            scope.selectedItems.val = [];
                            scope.selectAll = false;
                        }
                    }
                };

                _.each(scope.forFuncs, function(o) {
                    var func = $parse(o);
                    scope[o] = func(angular.element(elem).scope(), {$params: [].slice.call(arguments, 1)});
                });

                function updateSelected(action, val) {

                    if (action === 'add' && !_.includes(scope.selectedItems.val, val)) {
                        scope.selectedItems.val.push(val);
                        if (scope.selectedItems.val.length === scope.items.length) {
                            scope.selectAll = true;
                        } else {
                            scope.selectAll = false;
                        }
                    }
                    if (action === 'remove') {
                        var rem = _.remove(scope.selectedItems.val, function(item) {
                            return item[scope.selectedKey] === val[scope.selectedKey];
                        });
                        scope.selectAll = false;
                    }
                }

                scope.updateSelection = function($event, val) {
                    var checkbox = $event.target;
                    var action = (checkbox.checked) ? 'add' : 'remove';
                    updateSelected(action, val);
                    $event.stopPropagation();
                };

                scope.selectRow = function($event, val) { // 单击tr选中行
                    var tagName = $event.target.parentNode.nodeName.toLowerCase();
                    var $elem;
                    if (tagName == 'tr') {
                        $elem = $($event.target.parentNode);
                    } else {
                        $elem = $($event.target.parentNode.parentNode);
                    }
                    var checkbox = $elem.find('input').get(0);
                    checkbox.checked = !checkbox.checked;
                    val.state = !val.state;
                    var action = (checkbox.checked) ? 'add' : 'remove';
                    updateSelected(action, val);
                };

                scope.isSelected = function(val) {
                    return scope.selectedItems.val.indexOf(val) > -1;
                };

                scope.isSelectedAll = function () {
                    if (!scope.items) return;
                    return (scope.selectedItems.val.length === scope.items.length) && (!!scope.selectedItems.val.length); // 保证数组不为空
                };
            }
        }
    }

}));