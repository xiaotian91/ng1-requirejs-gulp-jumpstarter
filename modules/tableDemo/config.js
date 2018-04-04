define(['./app','routeConfig'],function(app,routeConfig){
    routeConfig.registerConfig(app);
    app.config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('tableDemo', {
        	url: '/tableDemo?id',
            templateUrl: 'tableDemo/view.html',
            controller: 'tableDemoCtrl'
        });
    }])
});
