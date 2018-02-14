define(['./app','routeConfig'],function(app,routeConfig){
    routeConfig.registerConfig(app);
    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('utilsDemo', {
            url: '/utilsDemo',
            templateUrl: 'utilsDemo/view.html',
            controller: 'utilsDemoCtrl',
            resolve:{
                // forces the page to wait for this promise to resolve before controller is loaded
                // the controller can then inject `user` as a dependency. This could also be done
                // in the controller, but this makes things cleaner (controller doesn't need to worry
                // about auth status or timing of accessing data or displaying elements)
                /*loadMyCtrl:['$ocLazyLoad','$q', 'DataService', function($ocLazyLoad, $q, DataService){
                    var  deferred = $q.defer();
                    require(['modules/utilsDemo/ctrl.js'], function() {
                        $ocLazyLoad.inject(app.name);
                        deferred.resolve();
                    });
                    return deferred.promise;
                }],*/
                menus: ['DataService', function(DataService) {
                    return DataService.getXoMenus().then(function(res) {
                        if (res.status == 200) {
                            return res.data;
                        }
                    }, function(err) {  
                        console.log(err);
                    });
                }]
            }
        });
        $stateProvider.state('utilsDemo.strings', {
            url: '/strings',
            templateUrl: 'utilsDemo/tpls/xoStrings.html',
            controller: 'utilsDemoStringsCtrl'
        });
        $stateProvider.state('utilsDemo.dates', {
            url: '/dates',
            templateUrl: 'utilsDemo/tpls/xoDates.html',
            controller: 'utilsDemoDatesCtrl'
        });
    }]);
});
