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
			articles : $resource('articles/:articleId.json', {}, {
				query: {method:'GET', params:{articleId:'articles'}, isArray:true}
			})
		};
		return service;
			
	}]);

//firebase
var firebaseService = angular.module('firebaseService', ['firebase'])

// a simple utility to create references to Firebase paths
   .factory('firebaseRef', ['Firebase', 'FBURL', function(Firebase, FBURL) {
      /**
       * @function
       * @name firebaseRef
       * @param {String|Array...} path
       * @return a Firebase instance
       */
      return function(path) {
         return new Firebase(pathRef([FBURL].concat(Array.prototype.slice.call(arguments))));
      }
   }])

   // a simple utility to create $firebase objects from angularFire
   .service('syncData', ['$firebase', 'firebaseRef', function($firebase, firebaseRef) {
      /**
       * @function
       * @name syncData
       * @param {String|Array...} path
       * @param {int} [limit]
       * @return a Firebase instance
       */
      return function(path, limit) {
         var ref = firebaseRef(path);
         limit && (ref = ref.limit(limit));
         return $firebase(ref);
      }
   }]);

function pathRef(args) {
   for(var i=0; i < args.length; i++) {
      if( typeof(args[i]) === 'object' ) {
         args[i] = pathRef(args[i]);
      }
   }
   return args.join('/');
}