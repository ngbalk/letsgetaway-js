'use strict';

/* Module */

var mainModule = angular.module('mainModule', ['ngRoute']);

/* Module Config */

mainModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/main', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl'
  });
}]);
 
 /* Controller */

mainModule.controller('MainCtrl', ['$scope', '$http', function($scope,$http) {
  $scope.name="Main";
  $scope.first="JFK";
  $scope.second="LAX";
 

  $scope.query = function($event){
    var data = {}
    var originCities = [$scope.first, $scope.second];
    for (var i=0;i<originCities.length;i++){
      var origin=originCities[i];
      console.log("search "+origin);
      $http.get('https://www.kayak.com/h/explore/api?airport='+origin+'&depart='+20160401+'&return='+20160430)
      .then(function succesfullCallback(response){
        console.log(response);
        data[origin]=response.data.destinations;
      }, function errorCallback(response){
        console.log(response);
      });
    }
    console.log(data);



    };
    
  }

]);



