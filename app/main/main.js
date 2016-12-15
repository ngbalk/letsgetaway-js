
/* Module */

var mainModule = angular.module('mainModule', ['ngRoute']);

/* Module Config */

mainModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'app/main/main.html',
    controller: 'MainCtrl'
  });
}]);
 
 /* Controller */

mainModule.controller('MainCtrl', ['$rootScope','$scope','flightsDataService','spinnerService','colorService', function($rootScope,$scope,flightsDataService,spinnerService,colorService) {

  $scope.originCities=[];
  $scope.originCity="JFK";

  $scope.getFlights = function($event){
    if($scope.originCities.length===0){
      return false;
    }
    spinnerService.startSpinner();
    Promise.all([flightsDataService.getDomesticDestinations($scope.originCities),
                flightsDataService.getInternationalDestinations($scope.originCities)]).then(results => {
                        $scope.domTripOptions=results[0];
                        $scope.intTripOptions=results[1];
                        spinnerService.stopSpinner();
                        $scope.$apply();
                });  
  };

  $scope.addOriginCity = function($event){
    if($scope.originCities.indexOf($scope.originCity)==-1){
      $scope.originCities.push($scope.originCity);  
    }
  };

  $scope.removeOriginCity = function(origin){
    $scope.originCities.splice($scope.originCities.indexOf(origin),1);
  };

  $scope.getColor = function(index, max){
    return colorService.getColor('ff4d4d','66ff99',index,max);
  };

}]);



