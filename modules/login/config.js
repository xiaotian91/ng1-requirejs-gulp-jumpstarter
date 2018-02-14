define(['./app','routeConfig'],function(app,routeConfig){
    routeConfig.registerConfig(app);
    app.config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('login', {
        	url: '/login',
            templateUrl: 'login/view.html',
            controller: 'LoginCtrl'
        });
    }])
});
