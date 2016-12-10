'use strict';

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

  /** Root scope variables**/
  $rootScope.originCities=[];

  /** Normal scope variables **/
  $scope.originCity="JFK";
  $scope.intTripOptions=[];
  $scope.domTripOptions=[];

  $scope.getFlights = function($event){
    if($rootScope.originCities.length===0){
      return false;
    }
    spinnerService.startSpinner();
    $scope.domTripOptions=flightsDataService.getDomesticDestinations($rootScope.originCities);
    $scope.intTripOptions=flightsDataService.getInternationalDestinations($rootScope.originCities);
    spinnerService.stopSpinner();
  };

  $scope.addOriginCity = function($event){
    if($rootScope.originCities.indexOf($scope.originCity)==-1){
      $rootScope.originCities.push($scope.originCity);  
    }
  };

  $scope.getColor = function(index, max){
    colorService.getColor('ff4d4d','66ff99',index,max);
  };

}]);



