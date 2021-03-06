define(['./app','routeConfig'],function(app,routeConfig){
    routeConfig.registerConfig(app);
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'home/view.html',
            controller: 'HomeCtrl',
            resolve: {
                // forces the page to wait for this promise to resolve before controller is loaded
                // the controller can then inject `user` as a dependency. This could also be done
                // in the controller, but this makes things cleaner (controller doesn't need to worry
                // about auth status or timing of accessing data or displaying elements)
            }
        });
    }]);
});
