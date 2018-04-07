define(['./app'], function(app) {
	app.controller('stDemoCtrl', ['$scope', '$filter', 'SmartTableTestServ', function($scope, $filter, SmartTableTestServ) {

		$scope.itemsPerPage = 10;
		$scope.displayed = [];
		$scope.selectedList = [];

		$scope.callServer = function callServer(tableState) {
			$scope.tableState = tableState;
			$scope.getData();
		};

		$scope.getData = function() {
			$scope.selectedList = [];
			$scope.isLoading = true;

			SmartTableTestServ.getPage($scope.tableState).then(function(result) {
				$scope.displayed = result.data;
				$scope.tableState.pagination.numberOfPages = result.numberOfPages; //set the number of pages so the pagination can update
				$scope.totalItemsCount = result.totalItems; //设置数据总条数
				$scope.isLoading = false;
			});
		}

		$scope.check = function() {
			console.log($scope.selectedList);
		}

		// Function to get data by selecting a single row
		$scope.select = function(id) {

			var found = $scope.selectedList.indexOf(id);

			if (found == -1) $scope.selectedList.push(id);

			else $scope.selectedList.splice(found, 1);

		}

		// Function to get data for all selected items
		$scope.selectAll = function(collection) {

			// if there are no items in the 'selected' array, 
			// push all elements to 'selected'
			if ($scope.selectedList.length === 0) {

				angular.forEach(collection, function(val) {

					$scope.selectedList.push(val);

				});

				// if there are items in the 'selected' array, 
				// add only those that ar not
			} else if ($scope.selectedList.length > 0 && $scope.selectedList.length != $scope.displayed.length) {

				angular.forEach(collection, function(val) {

					var found = $scope.selectedList.indexOf(val);

					if (found == -1) $scope.selectedList.push(val);

				});

				// Otherwise, remove all items
			} else {

				$scope.selectedList = [];

			}

		};

	}])
});