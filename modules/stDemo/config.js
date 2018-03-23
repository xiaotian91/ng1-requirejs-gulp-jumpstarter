define(['./app','routeConfig'],function(app,routeConfig){
    routeConfig.registerConfig(app);
    app.config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('stDemo', {
        	url: '/stDemo?id',
            templateUrl: 'stDemo/view.html',
            controller: 'stDemoCtrl'
        });
    }])
});
