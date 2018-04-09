define(['./app','routeConfig'],function(app,routeConfig){
    routeConfig.registerConfig(app);
    app.config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('apMesaDemo', {
        	url: '/apMesaDemo',
            templateUrl: 'apMesaDemo/view.html',
            controller: 'apMesaDemoCtrl'
        });
    }])
});
