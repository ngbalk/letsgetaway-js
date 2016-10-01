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

mainModule.controller('MainCtrl', ['$scope', '$http', '$q', function($scope,$http,$q) {

  $scope.originCities=[];
  $scope.originCity="JFK";
  $scope.windowStart="2016-09-01";
  $scope.windowEnd="2016-09-30";
  $scope.intTripOptions=[];
  $scope.domTripOptions=[];

  //JQuery
  $(function() {
    $("#datepickerStart").datepicker({ dateFormat: 'yy-mm-dd' });
    $("#datepickerEnd").datepicker({ dateFormat: 'yy-mm-dd' });
  });

  $scope.query = function($event){
    if($scope.originCities.length==0){
      return false;
    }
    toggleSpinnerOn();
    var domPromise = callAPIs($scope.originCities, "domestic");
    var intPromise = callAPIs($scope.originCities, "international");
    domPromise.then(
      function(results){
        $scope.domTripOptions=doParsing(results);
      },
      function(errors){
        console.log(errors);
      }
    );
    intPromise.then(
      function(results){
        togglerSpinnerOff();
        $scope.intTripOptions=doParsing(results);
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

  function callAPIs(originCities, dest){
    var transformedWindowStart=transformDate($scope.windowStart);
    var transformedWindowEnd=transformDate($scope.windowEnd);
    var deferred = $q.defer();
    var urlCalls=[];
    for (var i=0;i<originCities.length;i++){
      var origin=originCities[i];
      urlCalls.push($http.get('/api/v1/rest/'+dest+'/'+origin));
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

  function isCommonDestination(keyTripQuote, travelDataArray){
    var keyDestinationId=keyTripQuote.OutboundLeg.DestinationId;
    var allTripsToSharedDestination=[];
    for(var j=1;j<travelDataArray.length;j++){
      var travelDataObject=travelDataArray[j];
      var foundMatch=false;
      var tripQuotesArray=travelDataObject.data.Quotes;
      for(var i=0;i<tripQuotesArray.length;i++){
        var tripQuote=tripQuotesArray[i];
        if(keyDestinationId==tripQuote.OutboundLeg.DestinationId){
          allTripsToSharedDestination.push(tripQuote);
          foundMatch=true;
          break;
        }
      }
      if(!foundMatch){
        return false;
      }
    }
    allTripsToSharedDestination.push(keyTripQuote);
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

  function toggleSpinnerOn() {
    var elem = document.getElementById("spinner"); 
    elem.style.display = "block";
  }
  function togglerSpinnerOff(){
    var elem = document.getElementById("spinner"); 
    elem.style.display = "none";
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
  $scope.getColor = function(index, list){
    console.log(list);
    var color1 = '#66ff99';
    var color2 = '#ff4d4d';
    var ratio = index/list.length;
    var hex = function(x) {
      x = x.toString(16);
      return (x.length == 1) ? '0' + x : x;
    };

    var r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
    var g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
    var b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));

    var gradientColor = hex(r) + hex(g) + hex(b);
  }

}]);



