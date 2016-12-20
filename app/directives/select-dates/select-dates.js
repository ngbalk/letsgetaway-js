'use strict';

var selectDatesDirective = angular.module('selectDatesDirective', ['backendService']);

selectDatesDirective.directive('mySelectDatesDirective', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
	      	destCode: '@',
	      	origins: '='
    	},
		templateUrl: 'app/directives/select-dates/select-dates.html',
		controller: 'SelectDatesCtrl'
	};
});

selectDatesDirective.controller('SelectDatesCtrl', ['$scope', '$rootScope', '$http', 'backendService', 'flightsDataService', function($scope, $rootScope, $http, backendService, flightsDataService){
	$scope.getDateGrid=function(){
		$scope.monthGrid = [];
		flightsDataService.getDateGrid($scope.origins,$scope.destCode).then(
      		function(results){
      			$scope.monthGrid=results;
      			console.log(results);
	    	},
	      	function(errors){
	        	console.log(errors);
	      	}
    	);

	};
}]);
