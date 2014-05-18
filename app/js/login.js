angular.module('login', ['ngResource'])

    /*.service('LoginService', [function() {
      this.attemptLogin = function(email, password) {
            // create your request to your resource or $http request
            var r = $resource('users/:userId.json', {}, {
                query: {method:'GET', params:{userId:'users'}, isArray:true}
            });
            console.log(r);
            return true;
        };

        return this;
    }]) */

   /* .controller('LoginCtrl', ['$scope', 'socialTradeService', 'AuthService', '$location', function($scope, socialTradeService, AuthService, $location) {
        // If user is logged in send them to home page
        if (AuthService.getUserAuthenticated()) {
            $location.path('/trades');
        }
        $scope.users = socialTradeService.users.query();
        // attempt login
        $scope.attemptLogin = function() {
            
            var loggedin = false;
            var usr = null;
            for ( i=0; i< $scope.users.length; i++){
                if(($scope.users[i].username == $scope.username) && ($scope.users[i].password == $scope.password)){
                    loggedin = true;
                    usr = $scope.users[i];
                    break;
                }
            }
            if( loggedin) {
                $scope.error = false;
                AuthService.setUserAuthenticated(true);
                AuthService.setAuthenticatedUser(usr);
                $location.path('/trades');
            } else {
                //TODO: naredi izpis v spr. (scope)
                $scope.error = true;
                //alert("Username and password do not match or exist.")
            }
          /*  LoginService.attemptLogin($scope.username, $scope.password).success(function(data) {
                if (data.success) {
                    AuthService.setUserAuthenticated(true);
                    $location.path('/trades');
                } else {
                    AuthService.setUserAuthenticated(false);
                    // Incorrect login
                    //TODO: message
                }
            });
             
            // samo za test, da smo auto-loginani
            AuthService.setUserAuthenticated(true);
            $location.path('/trades'); 
        };
    }]); */
    .controller('LoginCtrl', ['$scope', 'loginService', '$location','syncData', 'AuthService',
    'firebaseRef', function($scope, loginService, $location, syncData,AuthService, firebaseRef) {
      $scope.email = null;
      $scope.pass = null;
      $scope.confirm = null;
      $scope.createMode = false;

      $scope.login = function(cb) {
         $scope.err = null;
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else {
            loginService.login($scope.email, $scope.pass, function(err, user) {
               $scope.err = err? err + '' : null;
               if( !err ) {
                 var id = parseInt(user.id);
                  firebaseRef('users/'+(id-1)).update({online: true});
                  cb && cb(user); 
               }
            });
         }
      };

      $scope.loginFB = function() {
        loginService.loginFB();
      };

      $scope.createAccount = function() {
         $scope.err = null;
         if( assertValidLoginAttempt() ) {
            loginService.createAccount($scope.email, $scope.pass, function(err, user) {
               if( err ) {
                  $scope.err = err? err + '' : null;
               }
               else {
                  // must be logged in before I can write to my profile
                  $scope.login(function() {
                     loginService.createProfile(user.uid, user.email);
                     $location.path('/account');
                  });
               }
            });
         }
      };

      function assertValidLoginAttempt() {
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else if( $scope.pass !== $scope.confirm ) {
            $scope.err = 'Passwords do not match';
         }
         return !$scope.err;
      }
   }]);

/**
 * This module monitors angularFire's authentication and performs actions based on authentication state.
 *
 * See usage examples here: https://gist.github.com/katowulf/7328023
 */
angular.module('waitForAuth', [])

/**
 * A service that returns a promise object, which is resolved once $firebaseSimpleLogin
 * is initialized (i.e. it returns login, logout, or error)
 */
   .service('waitForAuth', function($rootScope, $q, $timeout) {
      var def = $q.defer(), subs = [];
      subs.push($rootScope.$on('$firebaseSimpleLogin:login', fn));
      subs.push($rootScope.$on('$firebaseSimpleLogin:logout', fn));
      subs.push($rootScope.$on('$firebaseSimpleLogin:error', fn));
      function fn(err) {
         if( $rootScope.auth ) {
            $rootScope.auth.error = err instanceof Error? err.toString() : null;
         }
         for(var i=0; i < subs.length; i++) { subs[i](); }
         $timeout(function() {
            // force $scope.$apply to be re-run after login resolves
            def.resolve();
         });
      }
      return def.promise;
   })

/**
 * A directive that hides the element from view until waitForAuth resolves
 */
   .directive('ngCloakAuth', function(waitForAuth) {
      return {
         restrict: 'A',
         compile: function(el) {
            el.addClass('hide');
            waitForAuth.then(function() {
               el.removeClass('hide');
            })
         }
      }
   })

/**
 * A directive that shows elements only when the given authentication state is in effect
 */
   .directive('ngShowAuth', function($rootScope) {
      var loginState;
      $rootScope.$on("$firebaseSimpleLogin:login",  function() { loginState = 'login' });
      $rootScope.$on("$firebaseSimpleLogin:logout", function() { loginState = 'logout' });
      $rootScope.$on("$firebaseSimpleLogin:error",  function() { loginState = 'error' });
      function inList(needle, list) {
         var res = false;
         angular.forEach(list, function(x) {
            if( x === needle ) {
               res = true;
               return true;
            }
            return false;
         });
         return res;
      }
      function assertValidState(state) {
         if( !state ) {
            throw new Error('ng-show-auth directive must be login, logout, or error (you may use a comma-separated list)');
         }
         var states = (state||'').split(',');
         angular.forEach(states, function(s) {
            if( !inList(s, ['login', 'logout', 'error']) ) {
               throw new Error('Invalid state "'+s+'" for ng-show-auth directive, must be one of login, logout, or error');
            }
         });
         return true;
      }
      return {
         restrict: 'A',
         compile: function(el, attr) {
            assertValidState(attr.ngShowAuth);
            var expState = (attr.ngShowAuth||'').split(',');
            function fn(newState) {
               loginState = newState;
               var hide = !inList(newState, expState);
               el.toggleClass('hide', hide );
            }
            fn(loginState);
            $rootScope.$on("$firebaseSimpleLogin:login",  function() { fn('login') });
            $rootScope.$on("$firebaseSimpleLogin:logout", function() { fn('logout') });
            $rootScope.$on("$firebaseSimpleLogin:error",  function() { fn('error') });
         }
      }
   });