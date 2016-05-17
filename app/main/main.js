'use strict';

/* Module */

var mainModule = angular.module('mainModule', ['ngRoute']);

/* Module Config */

mainModule.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl'
  });
}]);
 
 /* Controller */

mainModule.controller('MainCtrl', ['$scope', '$http', '$q', function($scope,$http,$q) {

  $scope.originCities=[];
  $scope.originCity="JFK";
  $scope.windowStart="2016-06-01";
  $scope.windowEnd="2016-06-30";
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
        console.log(errors);
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
      urlCalls.push($http.get('/api/v1/rest/'+origin+'/'+$scope.windowStart+'/'+$scope.windowEnd));
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

  function doParsing(travelDataArray){
    var groupTripOptionsByPrice=[];
    var travelDataObject=travelDataArray[0];
    var tripQuotesArray=travelDataObject.data.Quotes;
    for(var i=0;i<tripQuotesArray.length;i++){
      var tripQuote=tripQuotesArray[i];
      var result=isCommonDestination(tripQuote, travelDataArray); //This returns an array of all trips to shared destination i.e. [tripFromLAX, tripFromJFK, tripFromSFO]... or false if not shared
      if(result){
        var totalCost=calculateTotalCost(result);
        var groupTripOptionData={
          destinationId: tripQuote.OutboundLeg.DestinationId,
          destinationName: getDestinationNameById(tripQuote.OutboundLeg.DestinationId,travelDataObject),
          totalCost: totalCost,
          tripQuotes: result
        };
        groupTripOptionsByPrice.push(groupTripOptionData);
      }
    }
    groupTripOptionsByPrice.sort(function(a,b){
      return a.totalCost - b.totalCost;
    });
    console.log(groupTripOptionsByPrice);
    return groupTripOptionsByPrice;

  };

  function isCommonDestination(tripQuote, travelDataArray){
    var keyDestinationId=tripQuote.OutboundLeg.DestinationId;
    var allTripsToSharedDestination=[];
    for(var j=0;j<travelDataArray.length;j++){
      var travelDataObject=travelDataArray[j];
      var foundMatch=false;
      var tripQuotesArray=travelDataObject.data.Quotes;
      for(var i=0;i<tripQuotesArray.length;i++){
        var tripQuote=tripQuotesArray[i];
        if(keyDestinationId==tripQuote.OutboundLeg.DestinationId){
          allTripsToSharedDestination.push(tripQuote);
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
      totalCost+=trip.MinPrice;
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
  function getDestinationNameById(destinationId, travelDataObject){
    console.log(travelDataObject);
    var places = travelDataObject.data.Places;
    for(var i=0;i<places.length;i++){
      if(places[i].PlaceId==destinationId){
        return places[i].Name;
      }
    }
  }

}]);



