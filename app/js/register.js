angular.module('register', ['ngResource'])

    /*.controller('SignUpCtrl', ['$scope', 'socialTradeService', 'AuthService', '$location', function($scope, socialTradeService, AuthService, $location) {
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
                // TODO: POST request to store user in

                $location.path('/login');
            }
        };
    }]); */
    .controller('SignUpCtrl', ['$scope', 'loginService', '$location', function($scope, loginService, $location) {
      $scope.email = null;
      $scope.pass = null;
      $scope.confirm = null;
      $scope.createMode = false;

      $scope.login = function(cb) {
         $scope.err = null;
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else {
            loginService.login($scope.email, $scope.pass, function(err, user) {
               $scope.err = err? err + '' : null;
               if( !err ) {
                  cb && cb(user);
               }
            });
         }
      };

      $scope.createAccount = function() {
         $scope.err = null;
         if( assertValidLoginAttempt() ) {
            loginService.createAccount($scope.email, $scope.pass, function(err, user) {
               if( err ) {
                  $scope.err = err? err + '' : null;
               }
               else {
                  // must be logged in before I can write to my profile
                  $scope.login(function() {
                     var id = parseInt(user.id);
                     loginService.createProfile(id-1, user.email, $scope.first_name, $scope.last_name, $scope.phone);
                     $location.path('/trades');
                  });
               }
            });
         }
      };

      function assertValidLoginAttempt() {
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else if( $scope.pass !== $scope.confirm ) {
            $scope.err = 'Passwords do not match';
         }
         return !$scope.err;
      }
   }])