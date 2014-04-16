'use strict';


// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'socialTradeServices',
  'myApp.directives',
  'socialTradeControllers',
  'socialTradeAnimations',

]);
myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/trades', {templateUrl: 'partials/article-list.html', controller: 'ArticleListCtrl' });
  $routeProvider.when('/trades/:tradeId', {templateUrl: 'partials/article-detail.html', controller: 'ArticleDetailCtrl'});
  $routeProvider.when('/login', {templateUrl: "partials/login.html" });
  $routeProvider.when('/logout',  {templateUrl: "partials/logout.html"});
  $routeProvider.when("/signup", {templateUrl: "partials/signup.html", });
  $routeProvider.otherwise({redirectTo: '/trades'});
}]);
