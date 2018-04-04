define(['./app'],function(app){
    app.controller('tableDemoCtrl',
        ['$scope', '$xoConfirm', '$uibModal', 'DataService', function($scope, $xoConfirm, $uibModal, DataService) {
            getList(1);
            /*--分页属性配置变量--*/
            $scope.pageNo = 1; //分页当前页数
            $scope.pageSize = 5; //分页每页显示条数
            $scope.paging = {
                currentPage: $scope.pageNo,
                itemsPerPage: $scope.pageSize,
                pagesLength: $scope.pageSize,
                perPageOptions: [5, 10],
                onChange: function(page) {
                    getList($scope.paging.currentPage);
                }
            };

            function getList(pageNo) {
                DataService.test(pageNo).then(function(res){
                    $scope.paging.totalItems = res.data.totalCounts;
                    $scope.list = res.data.list;
                    var selected = _.intersectionBy($scope.selectedList.val, $scope.list, 'student_id');
                    _.each($scope.list, function(val, key) {
                        var o = val;
                        _.each(selected, function(val){
                            if (val.student_id == o.student_id && val.state == true) {
                                o.state = val.state;
                            }
                        })
                    });

                }, function(err) {
                    console.log(err);
                });
            }

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