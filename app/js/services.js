'use strict';

/* Services */
var socialTradeServices = angular.module('socialTradeServices', ['ngResource']);
 
socialTradeServices.factory('socialTradeService', ['$resource',
	function($resource){
		var service = {
			trades : $resource('trades/:tradeId.json', {}, {
				query: {method:'GET', params:{tradeId:'trades'}, isArray:true}
			}),
			users : $resource('users/:userId.json', {}, {
				query: {method:'GET', params:{userId:'users'}, isArray:true}
			}),
			articles : $resource('/articles/:articleId.json', {}, {
				query: {method:'GET', params:{articleId:'articles'}, isArray:true}
			})
		};
		return service;
			
	}]);
