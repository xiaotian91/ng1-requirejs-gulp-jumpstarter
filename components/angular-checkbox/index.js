
'use strict'
;(function(_) {

    angular.module('customCheckbox', []).directive('xoCheckboxes', checkBoxController);

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
                    if (action === 'remove' && _.includes(scope.selectedItems.val, val)) {
                        var rem = _.remove(scope.selectedItems.val, function(item) {
                                return item[scope.selectedKey] === val[scope.selectedKey];
                            });
                            //var idx = scope.selectedItems.indexOf(val);
                            //scope.selectedItems.splice(idx, 1);
                        scope.selectAll = false;
                    }
                }

                scope.updateSelection = function($event, val) {
                    var checkbox = $event.target;
                    var action = (checkbox.checked) ? 'add' : 'remove';
                    updateSelected(action, val);
                };

                scope.isSelected = function(val) {
                    return scope.selectedItems.val.indexOf(val) > -1;
                };

                scope.isSelectedAll = function () {
                    if (!scope.items) return;
                    return (scope.selectedItems.val.length === scope.items.length) && (scope.selectedItems.val.length); // 保证数组不为空
                };

            }
        }
    }

})(_);