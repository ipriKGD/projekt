'use strict';


/* Controllers */
var socialTradeControllers = angular.module('socialTradeControllers', []);

socialTradeControllers.controller('ArticleListCtrl', ['$scope', 'socialTradeService', 'syncData', 
  function($scope, socialTradeService, syncData) {
    //$scope.trades = socialTradeService.trades.query();
    $scope.trades = syncData('trades');
    $scope.order = '-created';
    $scope.category_show = 'all';
    $scope.showfilter = "1";

  }]);

socialTradeControllers.controller('ArticleDetailCtrl', ['$scope', '$routeParams', 'socialTradeService', 'syncData', 'firebaseRef',
  function($scope, $routeParams, socialTradeService, syncData, firebaseRef) {
   //$scope.trade = socialTradeService.trades.get({tradeId: $routeParams.tradeId}, function(trade) {
   // console.log('trades/'+$routeParams.tradeId);
    $scope.trade = syncData(['trades', $routeParams.tradeId]);
    $scope.mainImage = $scope.trade.article.image[0];
    	//get needed values from trade object

    
    
    $scope.setImage = function(image) {
      $scope.mainImage = image;
    };
    $scope.closeTrade = function(trade) {
      $scope.trade.active = 0;
      firebaseRef('trades/'+$scope.trade.id).update({active: 0});

    }

    /*$scope.$watch('trade', function(oldValue, newValue) {
		if (!newValue) {
			$scope.tradeArticle = null;
			$scope.tradeUser = null;
			return;
		}
		newValue.$promise.then(function() {
			/*$scope.tradeArticle = socialTradeService.articles.get({
				articleId : $scope.trade.article_id
			});
      $scope.tradeArticle = syncData(['articles', $scope.trade.article_id]);
		});
		newValue.$promise.then(function() {
			/*$scope.tradeUser = socialTradeService.users.get({
				userId : $scope.trade.user_id
			}); 
      $scope.tradeUser = syncData(['users', $scope.trade.user_id]);
		}); */
    $scope.tradeArticle = $scope.tradeArticle = syncData(['articles', $scope.trade.article_id]);
    $scope.tradeUser = syncData(['users', $scope.trade.user_id]);
		//bind trade pomeni, da dodas tisto v userja/article!!! PAZI!!
    //bind user bi verjetno pomenil update!!! (torej daj bind na trade!!! !)
	
}]);

socialTradeControllers.controller('UserListCtrl', ['$scope', 'socialTradeService', 'syncData',
  function($scope, socialTradeService, syncData) {
    //$scope.users = socialTradeService.users.query();
    $scope.users = syncData('users');
    $scope.order = 'last_name';

}]);
socialTradeControllers.controller('UserDetailCtrl', ['$scope', '$routeParams', 'socialTradeService', 'syncData',
  function($scope, $routeParams, socialTradeService, syncData) {
    //$scope.userU = socialTradeService.users.get({userId: $routeParams.userId});
    //$scope.trades = socialTradeService.trades.query();
    $scope.userU = syncData(['users', $routeParams.userId]);
    $scope.trades = syncData('trades');
    $scope.order = '-created';
    $scope.category_show = 'all';
    $scope.showfilter = "1";
  }]);

socialTradeControllers.controller('UserEditCtrl', ['$scope', 'socialTradeService', '$location', 'firebaseRef',
  function($scope, socialTradeService, $location, firebaseRef) {
     // TODO: Update picture!!!
      $scope.editProfile = function() {
           firebaseRef('users/'+$scope.user.id).update({username: $scope.user.username, phone: $scope.user.phone, about: $scope.user.about});
           $location.path('myprofile');
      };


}]);


/*V VSAK CONTROLLER JE POTREBNO INJECTAT $firebase service
 firebase lahko naredimo kot service - glej angularfire seed project
 ALI v kontrolerju: 
          var messagesRef = new Firebase("https://feg3jk6f9bz.firebaseio-demo.com/");
          $scope.messages = $firebase(messagesRef);
          //dodajanje
          $scope.addMessage = function(e) { //to je event na input submit ng-keydown="addmessage(...)"
            if (e.keyCode != 13) return;
            $scope.messages.$add({from: $scope.name, body: $scope.msg});
            $scope.msg = "";
            //modify data: messagesRef.update({name:'alex', age:35}) ali $add, $remove, $update

            //kako deluje select? - morda kar v url dodas id? (sej itak za to imamo filterje!!!)
          };

*/
