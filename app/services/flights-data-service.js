'use strict';

var dataService = angular.module('flightsDataService',[]);

dataService.factory('flightsDataService',['$q','$http','backendService',function($q,$http,backendService){
	var service = {};

	service.getDomesticDestinations=function(originCities){
    	var promise = backendService.call(buildCheapestDestinationCalls(originCities, "domestic"));
    	promise.then(
      		function(results){
	        	return doParsing(results);
	    	},
	      	function(errors){
	        	console.log(errors);
	      	}
    	);
	};

	service.getInternationalDestinations=function(originCities){
    	var promise = backendService.call(buildCheapestDestinationCalls(originCities, "international"));
    	promise.then(
      		function(results){
	        	return doParsing(results);
	    	},
	      	function(errors){
	        	console.log(errors);
	      	}
    	);
	};

/*
*
* Functions for getting and parsing flight data
*
*/
  function buildCheapestDestinationCalls(originCities, dest){
    var urlCalls=[];
    for (var i=0;i<originCities.length;i++){
      var origin=originCities[i];
      urlCalls.push($http.get('/api/v1/rest/'+dest+'/'+origin));
    }
    return urlCalls; 
  }

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

  }

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
  }

  function calculateTotalCost(allTripsToSharedDestination){
    var totalCost=0;
    for(var i=0;i<allTripsToSharedDestination.length;i++){
      var trip=allTripsToSharedDestination[i];
      totalCost+=trip.MinPrice;
    }
    return totalCost;
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

	return service;
}]);