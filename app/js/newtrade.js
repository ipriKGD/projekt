angular.module('newtrade', ['ngResource'])

    .controller('AddListingCtrl', ['$scope', 'socialTradeService', '$location', function($scope, socialTradeService, $location) {
        // TODO: Create a POST request and store new trade and article into DB
         $scope.newListing = function() {
             $location.path('trades');
        };
    }]);