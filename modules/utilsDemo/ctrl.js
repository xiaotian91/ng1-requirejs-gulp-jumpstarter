define(['./app'],function(app){
    app.controller('utilsDemoCtrl', ['$scope', 'stringsUtils', function ($scope, stringsUtils) {
        $scope.string1 = 'uzie23';
        $scope.string2 = 'uzi|deft|meiko';

        $scope.setUsernamePrivacy = function(str) {
            return stringsUtils.setUsernamePrivacy(str);
        };
        $scope.splitToArray = function(str) {
            return stringsUtils.splitToArray(str, '|');
        };
    }]);
});