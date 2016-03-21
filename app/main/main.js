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

mainModule.controller('MainCtrl', ['$scope', '$http', '$q', function($scope,$http,$q) {
  $scope.originCities=[];
  $scope.originCity="JFK";
  $scope.windowStart="2016-04-01";
  $scope.windowEnd="2016-04-30";
  $scope.tripOptions=[];

  //JQuery
  $(function() {
    $("#datepickerStart").datepicker({ dateFormat: 'yy-mm-dd' });
    $("#datepickerEnd").datepicker({ dateFormat: 'yy-mm-dd' });
  });

  $scope.query = function($event){
    if($scope.originCities.length==0){
      return false;
    }
    move();
    var promise = callAPIs($scope.originCities);
    promise.then(
      function(results){
        $scope.tripOptions=doParsing(results);
      },
      function(errors){
        consolelog(errors);
      }
    );
  };

  $scope.addOriginCity = function($event){
    if($scope.originCities.indexOf($scope.originCity)==-1){
      $scope.originCities.push($scope.originCity);  
    }
  }

  function callAPIs(originCities){
    var transformedWindowStart=transformDate($scope.windowStart);
    var transformedWindowEnd=transformDate($scope.windowEnd);
    var deferred = $q.defer();
    var urlCalls=[];
    for (var i=0;i<originCities.length;i++){
      var origin=originCities[i];
      urlCalls.push($http.get('https://www.kayak.com/h/explore/api?airport='+origin+'&depart='+transformedWindowStart+'&return='+transformedWindowEnd));
    }
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

  function doParsing(allTripData){
    var tripOptionsByPrice=[]
    var singleTripData=allTripData[0];
    var destinations=singleTripData.data.destinations;
    for(var i=0;i<destinations.length;i++){
      var destination=destinations[i];
      var result=isCommonDestination(destination, allTripData); //This returns an array of all trips to shared destination i.e. [tripFromLAX, tripFromJFK, tripFromSFO]... or false if not shared
      if(result){
        var totalCost=calculateTotalCost(result);
        var tripOptionData={
          destinationShortName: destination.airport.shortName,
          destinationFullName: destination.city.name,
          price: totalCost,
          trips: result
        };
        tripOptionsByPrice.push(tripOptionData);
      }
    }
    tripOptionsByPrice.sort(function(a,b){
      return a.price - b.price;
    });
    console.log(tripOptionsByPrice);
    return tripOptionsByPrice;

  };

  function isCommonDestination(keyDestination, allTripData){
    var keyShortName=keyDestination.airport.shortName;
    var allTripsToSharedDestination=[];
    for(var j=0;j<allTripData.length;j++){
      var singleTripData=allTripData[j];
      var foundMatch=false;
      var destinations=singleTripData.data.destinations;
      for(var i=0;i<destinations.length;i++){
        var destination=destinations[i];
        if(keyShortName==destination.airport.shortName){
          destination["origin"]=singleTripData.data.origin.shortName; //Need to add information about origin because Kayak's returned destination objects don't say the origin 
          allTripsToSharedDestination.push(destination);
          foundMatch=true;
        }
      }
      if(!foundMatch){
        return false;
      }
    }
    return allTripsToSharedDestination;
  };

  function calculateTotalCost(allTripsToSharedDestination){
    var totalCost=0;
    for(var i=0;i<allTripsToSharedDestination.length;i++){
      var trip=allTripsToSharedDestination[i];
      totalCost+=trip.flightInfo.price;
    }
    return totalCost;
  };

  function transformDate(date){
    return date.replace(/-/g,"");
  }

  function move() {
    var elem = document.getElementById("myBar"); 
    var width = 1;
    var id = setInterval(frame, 30);
    function frame() {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++; 
            elem.style.width = width + '%'; 
        }
    }
}

}]);



