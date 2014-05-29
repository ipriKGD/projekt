'use strict';


// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.directives',
  'socialTradeControllers',
  'socialTradeAnimations',
  'login',
  'register',
  'newtrade',
  'angulartics',
  'angulartics.google.analytics',
  'firebaseService',
  'loginServices',
  'waitForAuth',
  'routeSecurity',
  'graph'
]);

myApp.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.when('/trades', {templateUrl: 'partials/article-list.html', controller: 'ArticleListCtrl' });
  $routeProvider.when('/trades/:tradeId', {templateUrl: 'partials/article-detail.html', controller: 'ArticleDetailCtrl', authRequired: true});
  $routeProvider.when('/login', {templateUrl: "partials/login.tpl.html", controller: "LoginCtrl"});
  $routeProvider.when('/mytrades', {templateUrl: "partials/mytrades.html", controller: "ArticleListCtrl", authRequired: true});
  $routeProvider.when('/myprofile', {templateUrl: "partials/myprofile.html", authRequired: true});
  $routeProvider.when('/editprofile', {templateUrl: "partials/editprofile.html", controller: "UserEditCtrl", authRequired: true });
  $routeProvider.when("/signup", {templateUrl: "partials/signup.html", controller: "SignUpCtrl"});
  $routeProvider.when("/users", {templateUrl: "partials/user-list.html", controller: "UserListCtrl", authRequired: true });
  $routeProvider.when("/users/:userId", {templateUrl: "partials/user-view.html", controller: "UserDetailCtrl", authRequired: true });
  $routeProvider.when("/newtrade", {templateUrl: "partials/addlisting-view.html", controller: "AddListingCtrl", authRequired: true });
  $routeProvider.when("/graph", {templateUrl: "partials/graph.html", authRequired: true});
  $routeProvider.otherwise({redirectTo: '/trades'});


  
}]).constant('FBURL', 'https://socialtrade.firebaseio.com').constant('loginRedirectPath', '/login')
;

myApp.run(['loginService', '$rootScope', 'FBURL', function(loginService, $rootScope, FBURL) {
   // establish authentication
   $rootScope.auth = loginService.init('/login');
   $rootScope.FBURL = FBURL;
}]);

// Main App controller - used for authentication
myApp.controller('MainCtrl', ['$scope', 'loginService', 'syncData', '$location', 'firebaseRef', '$rootScope',
 function($scope, loginService, syncData, $location, firebaseRef, $rootScope) {
      //normal login
      $scope.$on('$viewContentLoaded', function() {
        if($scope.auth.user != null && $scope.auth.user.provider !== "google" && $scope.auth.user.provider !== "facebook") {
          var id = parseInt($scope.auth.user.id);
          $scope.user =  syncData(['users', id-1]);
        }
      });
      //google login
      $rootScope.$on("glogin", function(event, user) {
            // do login things
            $scope.$apply;
            //find user by email
            $scope.tu = syncData('users');
            $scope.tu.$on("loaded", function() {
              var keys = $scope.tu.$getIndex();
              var reg = false;
              var id = 0;
              angular.forEach(keys, function(key) {
               if($scope.tu[key].email === user.email) {
                  reg = true;
                  id = key;
               } 
              });
              if(!reg) {
                 //automatically register user - create his account
                 loginService.createProfile(keys.length, user.email, user.thirdPartyUserData.given_name, 
                    user.thirdPartyUserData.family_name, "");
                 $scope.user = syncData(["users", keys.length]);
                 if(user.thirdPartyUserData.picture != null) {
                    firebaseRef('users/'+keys.length).update({online: true, p_image: user.thirdPartyUserData.picture});
                 } else {
                  firebaseRef('users/'+keys.length).update({online: true});
                 }
              } else {
                //Get user
                $scope.user = syncData(["users", id]);
                firebaseRef('users/'+id).update({online: true});
              }
            });
        });
        //facebook login
        $rootScope.$on("fblogin", function(event, user) {
            // do login things
            $scope.$apply;
            //find user by email
            console.log(user)
            $scope.tu = syncData('users');
            $scope.tu.$on("loaded", function() {
              var keys = $scope.tu.$getIndex();
              var reg = false;
              var id = 0;
              angular.forEach(keys, function(key) {
                 if($scope.tu[key].email === user.thirdPartyUserData.email) {
                    reg = true;
                    id = key;
                 } 
              });
              if(user.thirdPartyUserData.email != null) {
                if(!reg) {
                  //automatically register user - create his account
                  loginService.createProfile(keys.length, user.thirdPartyUserData.email, user.thirdPartyUserData.first_name, 
                    user.thirdPartyUserData.last_name, "");
                  $scope.user = syncData(["users", keys.length]);
                  firebaseRef('users/'+keys.length).update({online: true});
                } else {
                  //Get user
                  $scope.user = syncData(["users", id]);
                  firebaseRef('users/'+id).update({online: true});
                }
              
              } else {
                $scope.logout();
                alert("Please check your FB settings.");
                $location.path("/trades;");
              }
            }); 
        });

      $scope.logout = function() {
          if($scope.user != null) {
            $scope.user.online = false;
            $scope.user.last_active = ISODateString(new Date());
            firebaseRef('users/'+$scope.user.id).update({online: false, last_active: $scope.user.last_active});
          }
          loginService.logout();
      };
}]);

function ISODateString(d){
 function pad(n){return n<10 ? '0'+n : n}
 return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z'}