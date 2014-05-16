'use strict';


/* Controllers */
var socialTradeControllers = angular.module('socialTradeControllers', []);

socialTradeControllers.controller('ArticleListCtrl', ['$scope', 'socialTradeService',
  function($scope, socialTradeService) {
    $scope.trades = socialTradeService.trades.query();
    $scope.order = '-created';
    $scope.category_show = 'all';
    $scope.showfilter = "1";
    // TODO: preveri datume in avtomatsko zapri potecene trade (v backendu ali filtru)

  }]);

socialTradeControllers.controller('ArticleDetailCtrl', ['$scope', '$routeParams', 'socialTradeService',
  function($scope, $routeParams, socialTradeService) {
    $scope.trade = socialTradeService.trades.get({tradeId: $routeParams.tradeId}, function(trade) {
    	$scope.mainImage = trade.article.image[0];
    	//get needed values from trade object

    });
    
    $scope.setImage = function(image) {
      $scope.mainImage = image;
    };
    $scope.closeTrade = function(trade) {
    	// TODO: PUT zahtevek za spremembo vrednosti atributa active v 0
    }

    $scope.$watch('trade', function(oldValue, newValue) {
		if (!newValue) {
			$scope.tradeArticle = null;
			$scope.tradeUser = null;
			return;
		}
		newValue.$promise.then(function() {
			$scope.tradeArticle = socialTradeService.articles.get({
				articleId : $scope.trade.article_id
			});
		});
		newValue.$promise.then(function() {
			$scope.tradeUser = socialTradeService.users.get({
				userId : $scope.trade.user_id
			});
		});
		
	});


	
	
}]);

socialTradeControllers.controller('UserListCtrl', ['$scope', 'socialTradeService',
  function($scope, socialTradeService) {
    $scope.users = socialTradeService.users.query();
    $scope.order = 'last_name';

}]);
socialTradeControllers.controller('UserDetailCtrl', ['$scope', '$routeParams', 'socialTradeService',
  function($scope, $routeParams, socialTradeService) {
    $scope.userU = socialTradeService.users.get({userId: $routeParams.userId});
    $scope.trades = socialTradeService.trades.query();
    $scope.order = '-created';
    $scope.category_show = 'all';
    $scope.showfilter = "1";
    //TODO: izboljsano (optimizirano) bo v naslednjih fazah, ko bo REST service
  }]);

socialTradeControllers.controller('UserEditCtrl', ['$scope', 'socialTradeService', '$location',
  function($scope, socialTradeService, $location) {
     // TODO: Create a PUT request and store new data into DB
      $scope.editProfile = function() {
           $location.path('myprofile');
      };


}]);


/*V VSAK CONTROLLER JE POTREBNO INJECTAT $firebase service
 firebase lahko naredimo kot service - glej angularfire seed project
 ALI v kontrolerju: 
          var ref = new Firebase("https://feg3jk6f9bz.firebaseio-demo.com/");
          $scope.messages = $firebase(ref);
          //dodajanje
          $scope.addMessage = function(e) { //to je event na input submit ng-keydown="addmessage(...)"
            if (e.keyCode != 13) return;
            $scope.messages.$add({from: $scope.name, body: $scope.msg});
            $scope.msg = "";
          };

*/
