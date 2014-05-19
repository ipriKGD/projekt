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

var loginService = angular.module('loginServices', ['firebase', 'firebaseService'])

   .factory('loginService', ['$rootScope', '$firebaseSimpleLogin', 'firebaseRef', 'profileCreator', '$timeout', 'syncData',
      function($rootScope, $firebaseSimpleLogin, firebaseRef, profileCreator, $timeout, syncData) {
         var auth = null;
         return {
            init: function() {
               return auth = $firebaseSimpleLogin(firebaseRef());
            },

            /**
             * @param {string} email
             * @param {string} pass
             * @param {Function} [callback]
             * @returns {*}
             */
            login: function(email, pass, callback) {
               assertAuth();
               auth.$login('password', {
                  email: email,
                  password: pass,
                  rememberMe: true
               }).then(function(user) {
                     if( callback ) {
                        //todo-bug https://github.com/firebase/angularFire/issues/199
                        $timeout(function() {
                           callback(null, user);
                        });
                     }
                  }, callback);
            },

            loginFB: function() {
              auth.$login('facebook', {
              rememberMe: true,
              scope: 'email,user_likes'
            }).then(function(user){
              console.log(user);
             //$rootScope.$emit("fblogin", user);
            });
            
              //pridobi podatke
            },
            loginG: function() {

             auth.$login('google', {
              rememberMe: true,
              scope: 'https://www.googleapis.com/auth/plus.login'

            }).then(function(user){
              $rootScope.$emit("glogin", user);

            });

            },

            logout: function() {
               assertAuth();
               auth.$logout();
            },

            changePassword: function(opts) {
               assertAuth();
               var cb = opts.callback || function() {};
               if( !opts.oldpass || !opts.newpass ) {
                  $timeout(function(){ cb('Please enter a password'); });
               }
               else if( opts.newpass !== opts.confirm ) {
                  $timeout(function() { cb('Passwords do not match'); });
               }
               else {
                  auth.$changePassword(opts.email, opts.oldpass, opts.newpass).then(function() { cb && cb(null) }, cb);
               }
            },

            createAccount: function(email, pass, callback) {
               assertAuth();
               auth.$createUser(email, pass).then(function(user) { callback && callback(null, user) }, callback);
            },

            createProfile: profileCreator
         };

         function assertAuth() {
            if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
         }
      }])

   .factory('profileCreator', ['firebaseRef', '$timeout', function(firebaseRef, $timeout) {
      return function(id, email, first_name, last_name, phone, callback) {
         firebaseRef('users/'+id).set({about: "No data.", email: email, id: id, first_name: first_name, last_message: "", last_name: last_name,
          online: true, p_image: " ", phone: phone, username: firstPartOfEmail(email)}, function(err) {
            //err && console.error(err);
            if( callback ) {
               $timeout(function() {
                  callback(err);
               })
            }
         });

         function firstPartOfEmail(email) {
            return email.substr(0, email.indexOf('@'))||'';
         }

         function ucfirst (str) {
            // credits: http://kevin.vanzonneveld.net
            str += '';
            var f = str.charAt(0).toUpperCase();
            return f + str.substr(1);
         }
      }
   }]);

  var fblogin = angular.module('fblogin', ['firebase', 'firebaseService'])
    .service('fbloginservice', ["$rootScope", function($rootScope) {
    var ref = new Firebase("https://socialtrade.firebaseio.com");
    this.auth = new FirebaseSimpleLogin(ref, function(error, user) {
        if (user) {
            $rootScope.$emit("login", user);
        }
        else if (error) {
            $rootScope.$emit("loginError", error);
        }
        else {
            $rootScope.$emit("logout");
        }   
    });
}]);
