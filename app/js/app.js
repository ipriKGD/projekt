'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/articles', {templateUrl: 'partials/article-list.html', controller: 'ArticleListCtrl'});
  $routeProvider.when('/articles/:articleId', {templateUrl: 'partials/article-detail.html', controller: 'ArticleDetailCtrl'});
  $routeProvider.otherwise({redirectTo: '/articles'});
}]);
