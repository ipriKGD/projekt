angular.module('register', ['ngResource'])

    .controller('SignUpCtrl', ['$scope', 'socialTradeService', 'AuthService', '$location', function($scope, socialTradeService, AuthService, $location) {
        // If user is logged in send them to home page
        if (AuthService.getUserAuthenticated()) {
            $location.path('/trades');
        }
        $scope.users = socialTradeService.users.query();
        $scope.attemptRegister = function() {
            
            var exists = false;
            for ( i=0; i< $scope.users.length; i++){
                if($scope.users[i].username == $scope.username){
                    exists = true;
                    $scope.error = true;
                    break;
                }
            }
            if(!exists) {
                $scope.error = false;

                $location.path('/login');
            }
        };
    }]);