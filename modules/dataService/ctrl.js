define(['./app'], function(app) {
    app.controller('DataServiceCtrl', ['$scope', 'DataService', function($scope, DataService) {
    
        DataService.test().then(function(res){
            $scope.data1 = res.data;
        }, function(err) {  
            console.log(err);
        });

    }]);
});