define(['./app'],function(app){
    app.service ('SmartTableTestServ', ['$q', '$filter', '$timeout', function ($q, $filter, $timeout) {
        //this would be the service to call your server, a standard bridge between your model an $http

        // the database (normally on your server)
        var randomsItems = [];

        function createRandomItem(id) {
            var heroes = ['Batman', 'Superman', 'Robin', 'Thor', 'Hulk', 'Niki Larson', 'Stark', 'Bob Leponge'];
            return {
                id: id,
                name: heroes[Math.floor(Math.random() * 7)],
                age: Math.floor(Math.random() * 1000),
                saved: Math.floor(Math.random() * 10000)
            };

        }

        for (var i = 0; i < 100; i++) {
            randomsItems.push(createRandomItem(i));
        }

        //fake call to the server, normally this service would serialize table state to send it to the server (with query parameters for example) and parse the response
        //in our case, it actually performs the logic which would happened in the server
        function getPage(params) {

        	var pagination = params.pagination;

            var deferred = $q.defer();

            var filtered = params.search.predicateObject ? $filter('filter')(randomsItems, params.search.predicateObject) : randomsItems;

            if (params.sort.predicate) {
                filtered = $filter('orderBy')(filtered, params.sort.predicate, params.sort.reverse);
            }

            var result = filtered.slice(pagination.start, pagination.start + pagination.number);

            $timeout(function () {
                //note, the server passes the information about the data set size
                deferred.resolve({
                    data: result,
                    totalItems: filtered.length,
                    numberOfPages: Math.ceil(filtered.length / pagination.number)
                });
            }, 1500);


            return deferred.promise;
        }

    return {
            getPage: getPage
        }
    }]);
});