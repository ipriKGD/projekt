'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }])
  .filter('activeFilter',[function(){
  	return function(input){
  		var ret = [];
  		angular.forEach(input, function(trade){
  			var t = Date.parse(trade.expiry);
  			if(t >= Date.now()){
  				ret.push(trade);
  			}
  		});
  		return ret;
  	};
  }]);
