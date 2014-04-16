angular.module('login', ['ngResource'])

    /*.service('LoginService', [function() {
      this.attemptLogin = function(email, password) {
            // create your request to your resource or $http request
            var r = $resource('users/:userId.json', {}, {
                query: {method:'GET', params:{userId:'users'}, isArray:true}
            });
            console.log(r);
            return true;
        };

        return this;
    }]) */

    .controller('LoginCtrl', ['$scope', 'socialTradeService', 'AuthService', '$location', function($scope, socialTradeService, AuthService, $location) {
        // If user is logged in send them to home page
        if (AuthService.getUserAuthenticated()) {
            $location.path('/trades');
        }
        $scope.users = socialTradeService.users.query();
        // attempt login
        $scope.attemptLogin = function() {
            
            var loggedin = false;
            var usr = null;
            for ( i=0; i< $scope.users.length; i++){
                if(($scope.users[i].username == $scope.username) && ($scope.users[i].password == $scope.password)){
                    loggedin = true;
                    usr = $scope.users[i];
                    break;
                }
            }
            if( loggedin) {
                $scope.error = false;
                AuthService.setUserAuthenticated(true);
                AuthService.setAuthenticatedUser(usr);
                $location.path('/trades');
            } else {
                //TODO: naredi izpis v spr. (scope)
                $scope.error = true;
                //alert("Username and password do not match or exist.")
            }
          /*  LoginService.attemptLogin($scope.username, $scope.password).success(function(data) {
                if (data.success) {
                    AuthService.setUserAuthenticated(true);
                    $location.path('/trades');
                } else {
                    AuthService.setUserAuthenticated(false);
                    // Incorrect login
                    //TODO: message
                }
            });
             
            // samo za test, da smo auto-loginani
            AuthService.setUserAuthenticated(true);
            $location.path('/trades'); */
        };
    }]);