/**
*  colorGService Module
*
* Description: Returns a color within the specified range of colors
*/
angular.module('colorService', []).factory('colorService', [function(){
	this.getColor = function(color1, color2, index, max){
		var ratio = index/max;
	    var hex = function(x) {
	      x = x.toString(16);
	      return (x.length == 1) ? '0' + x : x;
	    };
	    var r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
	    var g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
	    var b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));
	    var gradientColor = hex(r) + hex(g) + hex(b);
	    return gradientColor;
	};
	return this;
}]);