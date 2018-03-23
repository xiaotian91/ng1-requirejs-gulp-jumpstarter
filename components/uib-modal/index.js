/*
 * ng-confirm
 *
 * created by Xiaotian Li
 */

'use strict'
;(function( root, module_name, factory ) {
    if (typeof define === 'function' && define.amd) { // Angular-based AMD Support
        define([], factory);
    } else { // Browser Support
        if (!root[module_name]) {
            root[module_name] = factory(root);
        }
    }
}(this, 'xoConfirm', function() {
    var app = angular.module('xo.confirm', [])
        .factory('$xoConfirm', xoConfirmController);

    function xoConfirmController($uibModal, $sce){
        return{
            open:function(opts, callback){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'uib-modal/view.html',
                    controller: function($scope, $uibModalInstance) {
                        $scope.o = opts;
                        $scope.o.content = $sce.trustAsHtml($scope.o.content);
                        $scope.ok = function () {
                            $uibModalInstance.close();
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    }
                });

                modalInstance.result.then(function () {
                    callback.call();
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }
        }
    }
}));