define(['./app'],function(app){
    app.controller('utilsDemoCtrl', ['$scope',  '$state', 'menus', function ($scope, $state, menus) {
        $state.go('utilsDemo.strings');
        $scope.menus = menus;
    }]);

    app.controller('utilsDemoStringsCtrl', ['$scope', 'xoStrings', function($scope, xoStrings) {

        $scope.string1 = 'uzie23';
        $scope.string2 = 'uzi|deft|meiko';
        $scope.string3 = '[Test][][Test2]';
        $scope.string4 = 'test.jpg';
        $scope.arr1 = ['China', 'The United States', 'Japan'];
        $scope.arr1Random = xoStrings.getRandomFrom($scope.arr1);

        $scope.setUsernamePrivacy = function(str) {
            return xoStrings.setUsernamePrivacy(str);
        };
        $scope.splitToArray = function(str) {
            return xoStrings.splitToArray(str, '|');
        };
        $scope.getTxtFromContinousBrackets = function(str) {
            return xoStrings.getTxtFromContinousBrackets(str, ',');
        };
        $scope.convert2UrlFromSuffix = function(str) {
            return xoStrings.convert2UrlFromSuffix(str, 'png');
        };
    }]);

    app.controller('utilsDemoDatesCtrl', ['$scope', 'xoStrings', function($scope, xoStrings) {
    }]);
});