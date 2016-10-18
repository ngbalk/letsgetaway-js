'use strict';

var selectDatesDirective = angular.module('selectDatesDirective', ['backendService']);

selectDatesDirective.directive('mySelectDatesDirective', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
	      	destName: '@destName',
	      	destId: '@destId',
	      	destAirportCode: '@destArptCd'
    	},
		templateUrl: 'app/directives/select-dates/select-dates.html',
		controller: 'SelectDatesCtrl'
	};
});

selectDatesDirective.controller('SelectDatesCtrl', ['$scope', '$rootScope', '$http', 'backendService', function($scope, $rootScope, $http, backendService){
	$scope.priceGrid = [];
	$scope.getPriceGrid = function(outboundMonth, inboundMonth){

		//For testing
		$scope.destAirportCode = 'LAX';

		outboundMonth=resolveOutboundMonth(outboundMonth);
		inboundMonth=resolveInboundMonth(inboundMonth);
		console.log("Search range: " + outboundMonth + " " + inboundMonth);
		var urlCalls = [];
		for (var i=0;i<$rootScope.originCities.length;i++){
	      var origin=$rootScope.originCities[i];
	      urlCalls.push($http.get('/api/v1/rest/grid/'+origin+'/'+$scope.destAirportCode+'/'+outboundMonth+'/'+inboundMonth));
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
