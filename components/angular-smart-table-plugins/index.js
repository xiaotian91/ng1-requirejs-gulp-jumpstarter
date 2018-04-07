'use strict';
(function(root, module_name, factory) {
    if (typeof define === 'function' && define.amd) { // Angular-based AMD Support
        define([], factory);
    } else { // Browser Support
        if (!root[module_name]) {
            root[module_name] = factory(root);
        }
    }
}(this, 'stPaginationPlugins', function() {
    angular.module('st.pagination-plugins', [])
        .directive('pageSelect', function() {
            return {
                restrict: 'E',
                template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
                link: function(scope, element, attrs) {
                    scope.$watch('currentPage', function(c) {
                        scope.inputPage = c;
                    });
                }
            }
        })
        .directive('stIdp', ['stConfig', function(stConfig) {
            return {
                restrict: 'AE',
                require: '^stTable',
                scope: {
                    stTotalCount: '=',
                    itemsPerPage: '='
                },
                template: '<div ng-include="getTemplate()"></div>',
                link: function(scope, element, attrs, ctrl) {
                    scope.getTemplate= function() {
                        return attrs.templateUrl;
                    };
                    scope.currentPage = 1;
                    scope.numPages = 0;

                    scope.stItemsByPage = scope.stItemsByPage ? +(scope.stItemsByPage) : stConfig.pagination.itemsByPage;

                    //页码改变时，修改当前页码数，和总页数。
                    scope.$watch(function() {
                        return ctrl.tableState().pagination;
                    }, function() {
                        scope.currentPage = Math.floor(ctrl.tableState().pagination.start / ctrl.tableState().pagination.number) + 1;
                        scope.numPages = ctrl.tableState().pagination.numberOfPages;
                    }, true);


                    scope.getFromItemIndex = function() {
                        if (scope.stTotalCount === 0) {
                            return 0;
                        } else {
                            return (scope.currentPage - 1) * scope.stItemsByPage + 1;
                        }

                    };

                    scope.getToItemIndex = function() {
                        if (scope.stTotalCount === 0) {
                            return 0;

                        } else {
                            return scope.currentPage >= scope.numPages ? scope.stTotalCount : scope.currentPage * scope.stItemsByPage;
                        }
                    };

                    scope.displayLengthChange = function(stItemsByPage) {
                        scope.stItemsByPage = scope.itemsPerPage = stItemsByPage;
                    };

                }
            };
        }])
        .directive('rowSelectAll', rowSelectAll)
        .directive('rowSelect', rowSelect);
        function rowSelect() {
          return {
            require: '^stTable',
            template: '<input type="checkbox">',
            scope: {
                row: '=rowSelect'
            },
            link: function (scope, element, attr, ctrl) {

              element.bind('click', function (evt) {

                scope.$apply(function () {

                    ctrl.select(scope.row, 'multiple');

                });

              });

              scope.$watch('row.isSelected', function (newValue) {

                if (newValue === true) {

                    element.parent().addClass('st-selected');
                    $(element).find('input').get(0).checked = true;

                } else {

                    element.parent().removeClass('st-selected');
                    $(element).find('input').get(0).checked = false;

                }
              });
            }
          };
        }
        function rowSelectAll() {
          return {
            require: '^stTable',
            template: '<input type="checkbox">',
            scope: {
              all: '=rowSelectAll',
              selected: '='
            },
            link: function (scope, element, attr) {

              scope.isAllSelected = false;

              element.bind('click', function (evt) {

                scope.$apply(function () {

                  scope.all.forEach(function (val) {

                    val.isSelected = scope.isAllSelected;

                  });

                });

              });

              scope.$watchCollection('selected', function(newVal) {

                var s = newVal.length;
                var a = scope.all.length;

                if ((s == a) && s > 0 && a > 0) {

                  $(element).find('input').get(0).checked = true;
                  scope.isAllSelected = false;

                } else {

                  $(element).find('input').get(0).checked = false;
                  scope.isAllSelected = true;

                }

              });
            }
          };
        }
}));