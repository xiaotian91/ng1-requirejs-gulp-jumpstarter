define(['./app'], function(app) {
    app.factory('DataService', ['$rootScope', '$http', function ($rootScope, $http) {
        var _sendFdRequest = function(url, params) {
            var defered = $q.defer();
            var fd = new FormData();
            $.each(params, function(i, val){
                fd.append(i,JSON.stringify(val));
            });
            $http({
                method: 'POST',
                url: $rootScope.$apiPath + url,
                data: fd,
                withCredentials: true,
                headers: {'Content-Type':undefined},
                transformRequest: angular.identity
            }).then(function(res) {
                defered.resolve(res);
            }, function(error) {
                defered.reject(error);
            });
            return defered.promise;
        };

        var _sendGetRequest = function(url, params) {
            //var deferred = $q.defer();
            return $http({ // $http 返回的就是Promise对象，不用使用$q
                method: 'GET',
                url: $rootScope.$apiPath + url,
                params: params
            });
        };

        var _sendPostRequest = function(url, params) {
            return $http({
                method: 'POST',
                url: $rootScope.$apiPath + url,
                data: params
            });
        };



        function test(params) {
            return _sendGetRequest('/employees/getAll', params);
        };

        function testDel(params) {
            return _sendPostRequest('/employees/delete', params);
        };

        function getXoMenus(params) {
            return _sendGetRequest('/getXoMenus', params);
        };

        return {
            test: test,
            testDel: testDel,
            getXoMenus: getXoMenus
        };

    }]);
});