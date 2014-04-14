'use strict';


// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'socialTradeServices',
  'myApp.directives',
  'socialTradeControllers'
]);
myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/trades', {templateUrl: 'partials/article-list.html', controller: 'ArticleListCtrl'});
  $routeProvider.when('/trades/:tradeId', {templateUrl: 'partials/article-detail.html', controller: 'ArticleDetailCtrl'});
  $routeProvider.otherwise({redirectTo: '/trades'});
}]);
