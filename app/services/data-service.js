'use strict';

var dataService = angular.module('dataService',[]);

dataService.factory('dataService',[function(){
	var service = {};

	var destDataMap = {}
	service.setDestData=function(rawDestData){
		for(var i=0;i<rawDestData.data.Places.length;i++){
			var dest = rawDestData.data.Places[i];
			if(!destDataMap[dest.PlaceId]){
				destDataMap[dest.PlaceId]={};
				destDataMap[dest.PlaceId]['code']=dest.SkyscannerCode;
				destDataMap[dest.PlaceId]['name']=dest.Name;
				destDataMap[dest.PlaceId]['type']=dest.Type;
			}
		}
	}
	service.getDestDataById=function(destId){
		return destDataMap[destId];
	}

	return service;
}]);