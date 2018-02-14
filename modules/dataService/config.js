define(['./app','routeConfig'],function(app,routeConfig){
    routeConfig.registerConfig(app);
    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('dataService', {
            url: '/dataService',
            templateUrl: 'dataService/view.html',
            controller: 'DataServiceCtrl',
            resolve: {
                // forces the page to wait for this promise to resolve before controller is loaded
                // the controller can then inject `user` as a dependency. This could also be done
                // in the controller, but this makes things cleaner (controller doesn't need to worry
                // about auth status or timing of accessing data or displaying elements)
            }
        });
    }]);
});
