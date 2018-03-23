define(['./app'], function(app) {
    app.controller('HomeCtrl', ['$rootScope', '$scope', '$xoConfirm', function($rootScope, $scope, $xoConfirm) {
        $scope.profile = {
            name: '亲爱的用户',
            email: 'user@user.com'
        };
        $scope.testParams = {
            id: JSON.stringify({})
        };
        $scope.openT = function() {
            $xoConfirm.open({
                title: '确认框',
                content: 'hahaha, 你打开了一个默认的Ui Bootstrap弹出框'
            }, function() {
                console.log('点击了确认按钮');
            });
        };
    }]);
});