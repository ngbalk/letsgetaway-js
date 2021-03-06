
var dataService = angular.module('flightsDataService',[]);

dataService.factory('flightsDataService',['$q','$http','backendService',function($q,$http,backendService){
	var service = {};

	service.getDomesticDestinations=function(originCities){
    	var promise = backendService.call(buildCheapestDestinationCalls(originCities, "domestic"));
      var newPromise = promise.then(
      		function(results){
	        	return doParsing(results);
	    	},
	      	function(errors){
	        	console.log(errors);
	      	}
    	);
      return newPromise;
	};

	service.getInternationalDestinations=function(originCities){
    	var promise = backendService.call(buildCheapestDestinationCalls(originCities, "international"));
    	var newPromise = promise.then(
      		function(results){
	        	return doParsing(results);
	    	},
	      	function(errors){
	        	console.log(errors);
	      	}
    	);
      return newPromise;
	};

  service.getDateGrid=function(originCities,destination){
     var promise = backendService.call(buildDateGridCalls(originCities,destination));
          var newPromise = promise.then(
          function(results){
            return buildMonthGrid(doDateGridsArrayProcessing(results));
        },
          function(errors){
            console.log(errors);
          }
      );
      return newPromise;
  };

/*
*  
* Functions for getting price date gride
*
*/

function buildMonthGrid(dateGrid){
  var monthGrid = [];
  var weekGrid = [];
  for(var i = 0;i<dateGrid.length;i++){
    var cur = dateGrid[i];
    weekGrid[cur.date.getDay()]=cur;
    if(cur.date.getDay()==6){
      monthGrid.push(weekGrid);
      weekGrid = [];
    }
  }
  monthGrid.push(weekGrid);
  return monthGrid;
}

function buildDateGridCalls(originCities,destination){
  var urlCalls=[];
  for (var i=0;i<originCities.length;i++){
      var origin=originCities[i];
      urlCalls.push($http.get('/api/v1/rest/grid/'+origin+'/'+destination+'/'+formatCurrentDate()));
  }
  console.log(urlCalls);
  return urlCalls;
}

function doDateGridsArrayProcessing(datesGridsArray){
  var totalPriceByDate = [];
  for(var i = 0;i<datesGridsArray.length;i++){
    var dateGrid=datesGridsArray[i].data;
    for(var j = 0; j<dateGrid.Dates[0].length;j++){
      if(!totalPriceByDate[j]){
        var datePrice = {
          dateString: dateGrid.Dates[0][j].DateString,
          date: new Date(dateGrid.Dates[0][j].DateString),
          price: dateGrid.Dates[1][j] !== null ? dateGrid.Dates[1][j].MinPrice : 0
        };
        totalPriceByDate[j]=datePrice;
      }
      else{
        totalPriceByDate[j].price += dateGrid.Dates[1][j] !== null ? dateGrid.Dates[1][j].MinPrice : 0;
      }
    }
  }
  return totalPriceByDate;
}

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
    var travelDataObject=travelDataArray[0];
    if(!travelDataObject){
      return [];
    }
    var tripQuotesArray=travelDataObject.data.Quotes;
    var groupTripOptionsByPrice=[];
    for(var i=0;i<tripQuotesArray.length;i++){
      var tripQuote=tripQuotesArray[i];
      var result=isCommonDestination(tripQuote, travelDataArray); //This returns an array of all trips to shared destination i.e. [tripFromLAX, tripFromJFK, tripFromSFO]... or false if not shared
      if(result){
        var totalCost=calculateTotalCost(result);
        var groupTripOptionData={
          destinationId: tripQuote.OutboundLeg.DestinationId,
          destinationName: getDestinationNameById(tripQuote.OutboundLeg.DestinationId,travelDataObject),
          skyscannerCode: getSkyscannerCodeById(tripQuote.OutboundLeg.DestinationId,travelDataObject),
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
    var places = travelDataObject.data.Places;
    for(var i=0;i<places.length;i++){
      if(places[i].PlaceId==destinationId){
        return places[i].Name;
      }
    }
  }

  function getSkyscannerCodeById(destinationId,travelDataObject){
    var places = travelDataObject.data.Places;
    for(var i=0;i<places.length;i++){
      if(places[i].PlaceId==destinationId){
        return places[i].SkyscannerCode;
      }
    }
  }

  function formatCurrentDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    return [year, month].join('-');
  }

	return service;
}]);