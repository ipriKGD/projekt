'use strict';


/* Controllers */
var socialTradeControllers = angular.module('socialTradeControllers', []);

socialTradeControllers.controller('ArticleListCtrl', ['$scope', 'syncData', 
  function($scope, syncData) {
    $scope.trades = syncData('trades');
    $scope.order = '-created';
    $scope.category_show = 'all';
    $scope.showfilter = "1";

  }]);

socialTradeControllers.controller('ArticleDetailCtrl', ['$scope', '$routeParams', 'syncData', 'firebaseRef',
  function($scope, $routeParams, syncData, firebaseRef) {
    $scope.contentLoaded = false;
    //$scope.url = 'http://localhost:8000/app/index.html#/trades/'
    $scope.url = 'http://secure-stream-6699.herokuapp.com/app/index.html#/trades/'
    $scope.trade = syncData(['trades', $routeParams.tradeId]);
    $scope.trade.$on("loaded", function(){
      $scope.url += $scope.trade.article.id;
      console.log($scope.url);
      $scope.contentLoaded = true;
    })
    $scope.mainImage = $scope.trade.article.image[0];  
    
    $scope.setImage = function(image) {
      $scope.mainImage = image;
    };
    $scope.closeTrade = function(trade) {
      $scope.trade.active = 0;
      firebaseRef('trades/'+$scope.trade.id).update({active: 0});

    }
    $scope.tradeArticle = $scope.tradeArticle = syncData(['articles', $scope.trade.article_id]);
    $scope.tradeUser = syncData(['users', $scope.trade.user_id]);	
}]);

socialTradeControllers.controller('UserListCtrl', ['$scope', 'syncData',
  function($scope, syncData) {
    $scope.users = syncData('users');
    $scope.order = 'last_name';

}]);
socialTradeControllers.controller('UserDetailCtrl', ['$scope', '$routeParams', 'syncData',
  function($scope, $routeParams, syncData) {
    $scope.userU = syncData(['users', $routeParams.userId]);
    $scope.trades = syncData('trades');
    $scope.order = '-created';
    $scope.category_show = 'all';
    $scope.showfilter = "1";
  }]);


socialTradeControllers.controller('UserEditCtrl', ['$scope', '$location', 'firebaseRef',
  function($scope, $location, firebaseRef) {
      // TODO: Upload picture!!!
      $scope.editProfile = function() {
           if($scope.user.p_image.lenght== 0) $scope.user.p_image="";
           firebaseRef('users/'+$scope.user.id).update({p_image:$scope.user.p_image, username: $scope.user.username, phone: $scope.user.phone, about: $scope.user.about});
           $location.path('myprofile');
      };


}]);
