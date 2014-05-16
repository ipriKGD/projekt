'use strict';


// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'socialTradeServices',
  'myApp.directives',
  'socialTradeControllers',
  'socialTradeAnimations',
  'login',
  'auth',
  'register',
  'newtrade',
  'angulartics',
  'angulartics.google.analytics',
  'firebaseService'
]);
myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/trades', {templateUrl: 'partials/article-list.html', controller: 'ArticleListCtrl' });
  $routeProvider.when('/trades/:tradeId', {templateUrl: 'partials/article-detail.html', controller: 'ArticleDetailCtrl', requireLogin: true});
  $routeProvider.when('/login', {templateUrl: "partials/login.tpl.html", controller: "LoginCtrl", requireLogin: false });
  $routeProvider.when('/mytrades', {templateUrl: "partials/mytrades.html", controller: "ArticleListCtrl", requireLogin: true });
  $routeProvider.when('/myprofile', {templateUrl: "partials/myprofile.html", requireLogin: true });
  $routeProvider.when('/editprofile', {templateUrl: "partials/editprofile.html", controller: "UserEditCtrl", requireLogin: true });
  //$routeProvider.when('/logout',  {templateUrl: "partials/logout.html"});
  $routeProvider.when("/signup", {templateUrl: "partials/signup.html", controller: "SignUpCtrl", requireLogin: false });
  $routeProvider.when("/users", {templateUrl: "partials/user-list.html", controller: "UserListCtrl", requireLogin: true });
  $routeProvider.when("/users/:userId", {templateUrl: "partials/user-view.html", controller: "UserDetailCtrl", requireLogin: true });
  $routeProvider.when("/newtrade", {templateUrl: "partials/addlisting-view.html", controller: "AddListingCtrl", requireLogin: true });
  $routeProvider.otherwise({redirectTo: '/trades'});
}]).constant('FBURL', 'https://socialtrade.firebaseio.com')
;

// Testing user's rights to access a url
myApp.run(['$rootScope', 'AuthService', '$location', function($rootScope, AuthService, $location){
    // Everytime the route in our app changes check auth status
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        // if you're logged out send to login page.
        if (next.requireLogin && !AuthService.getUserAuthenticated()) {
            $location.path('/login');
            event.preventDefault();
        }
    });
}]);

// Main App controller - used for "fake" authentication
 myApp.controller('MainCtrl', ['$scope', 'AuthService', '$location', function($scope, AuthService, $location) {
 	
 	// check if user is authenticated on every page and return them
 	$scope.$on('$viewContentLoaded', function() {
		
		$scope.user = AuthService.getAuthenticatedUser();
		
	});
    $scope.logoutUser = function() {
        // run a logout function to your api
        AuthService.setUserAuthenticated(false);
        AuthService.setAuthenticatedUser(null);
        $location.path('/login');
    };

    $scope.isLoggedIn = function() {
        return AuthService.getUserAuthenticated();
    };
    $scope.isActive = function(url) {
    	return url == $location.$$url;
    };
}]);