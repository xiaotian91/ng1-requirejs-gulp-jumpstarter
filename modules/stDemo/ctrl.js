define(['./app'],function(app){
    app.controller('stDemoCtrl',
        ['$scope', '$xoConfirm', '$uibModal',function($scope, $xoConfirm, $uibModal) {
            $scope.list = [{
                name: 'Uzi',
                pkhCode: '002'
            },{
                name: 'Deft',
                pkhCode: '003'
            }];
            $scope.selectedList = {
                val: []
            };
            $scope.personModel = {};
            $scope.openT = function (size) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'myModalAdd.html',
                    resolve: {
                        person: function () {
                            return $scope.personModel;
                        }
                    },
                    controller: function($scope, $uibModalInstance, person) {
                        $scope.person = person;
                        $scope.ok = function () {
                            $uibModalInstance.close($scope.person);
                        };

                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                    console.log(selectedItem)
                }, function () {
                    //$log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.confirm = function() {
                console.log($scope.selectedList);
            }
        }])
});