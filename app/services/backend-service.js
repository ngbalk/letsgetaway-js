
var backendService = angular.module('backendService', []);

backendService.factory('backendService', ['$q', function($q){
	this.call = function(urlCalls){
	    var deferred = $q.defer();
	    $q.all(urlCalls)
	    .then(
	      function(results){
	        console.log(results);
	        deferred.resolve(results);
	      },
	      function(errors){
	        console.log(errors);
	        deferred.reject(errors);
	      }
	    );
		return deferred.promise;
	};
	return this;
}]);