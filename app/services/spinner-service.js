/**
* Module
*
* Description
*/
angular.module('spinnerService', []).factory('spinnerService', [function(){
	this.startSpinner=function(){
		toggleSpinnerOn();
	};
	this.stopSpinner=function(){
		toggleSpinnerOff();
	};

	function toggleSpinnerOn() {
    	var elem = document.getElementById("spinner"); 
    	elem.style.display = "block";
  	}
  	function toggleSpinnerOff(){
    	var elem = document.getElementById("spinner"); 
    	elem.style.display = "none";
  	}
  	return this;
}]);