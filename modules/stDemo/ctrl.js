define(['./app'],function(app){
    app.controller('stDemoCtrl',
        ['$scope', '$xoConfirm', '$uibModal',function($scope, $xoConfirm, $uibModal) {
            $scope.e = {
                name: null
            };
            var firstnames = ['Laurent', 'Blandine', 'Olivier', 'Max'];
            var lastnames = ['Renard', 'Faivre', 'Frere', 'Eponge'];
            var dates = ['1987-05-21', '1987-04-25', '1955-08-27', '1966-06-06'];
            var id = 1;

            function generateRandomItem(id) {

                var firstname = firstnames[Math.floor(Math.random() * 3)];
                var lastname = lastnames[Math.floor(Math.random() * 3)];
                var birthdate = dates[Math.floor(Math.random() * 3)];
                var balance = Math.floor(Math.random() * 2000);

                return {
                    id: id,
                    firstName: firstname,
                    lastName: lastname,
                    birthDate: new Date(birthdate),
                    balance: balance
                }
            }

            $scope.rowCollection = [];

            for (id; id < 5; id++) {
                $scope.rowCollection.push(generateRandomItem(id));
            }

            //add to the real data holder
            $scope.addRandomItem = function addRandomItem() {
                $scope.rowCollection.push(generateRandomItem(id));
                id++;
            };

            //remove to the real data holder
            $scope.removeItem = function removeItem(row) {
                var index = $scope.rowCollection.indexOf(row);
                if (index !== -1) {
                    $scope.rowCollection.splice(index, 1);
                }
            };

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.openT = function (size) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'myModalAdd.html',
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    },
                    controller: function($scope, $uibModalInstance, items) {
                        $scope.items = items;
                        $scope.selected = {
                            item: $scope.items[0]
                        };

                        $scope.ok = function () {
                            $uibModalInstance.close($scope.selected.item);
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
        }])
});