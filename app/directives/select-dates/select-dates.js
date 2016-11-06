'use strict';

var selectDatesDirective = angular.module('selectDatesDirective', ['backendService']);

selectDatesDirective.directive('mySelectDatesDirective', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
	      	destId: '@destId',
    	},
		templateUrl: 'app/directives/select-dates/select-dates.html',
		controller: 'SelectDatesCtrl'
	};
});

selectDatesDirective.controller('SelectDatesCtrl', ['$scope', '$rootScope', '$http', 'backendService', 'dataService', function($scope, $rootScope, $http, backendService, dataService){
	$scope.priceGrid = [];
	$scope.getPriceGrid = function(outboundMonth, inboundMonth){

		outboundMonth=resolveOutboundMonth(outboundMonth);
		inboundMonth=resolveInboundMonth(inboundMonth);
		console.log("Search range: " + outboundMonth + " " + inboundMonth);
		var urlCalls = [];
		for (var i=0;i<$rootScope.originCities.length;i++){
	      var origin=$rootScope.originCities[i];
	      urlCalls.push($http.get('/api/v1/rest/grid/'+origin+'/'+dataService.getDestDataById($scope.destId).code+'/'+outboundMonth+'/'+inboundMonth));
	    }
	    var priceGridPromise = backendService.call(urlCalls);
	    priceGridPromise.then(function(result){
	    	$scope.priceGrid = result;
	    	console.log(result);
	    },
	    function(errors){
	    	console.log(errors);
	    });
	}

	function resolveOutboundMonth(outboundMonth){
		if(!outboundMonth){
			var date = new Date();
			outboundMonth=date.getFullYear() + '-' + (date.getMonth()+1);
		}
		return outboundMonth;
	}

	function resolveInboundMonth(inboundMonth){
		if(!inboundMonth){
			var date = new Date();
			if(date.getDate()>16){
				if(date.getMonth()<11){
					inboundMonth=date.getFullYear() + '-' + (date.getMonth()+2);
				}
				else{
					inboundMonth=date.getFullYear()+1 + '-' + '01';
				}
			} 
			else{
				inboundMonth=date.getFullYear() + '-' + (date.getMonth()+1);	
			}
		}
		return inboundMonth;
	}
}]);
