angular.module('register', ['ngResource'])
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
         if($scope.phone == null || $scope.first_name == null || $scope.last_name == null) {
            $scope.err = "Please, enter all data!"
         } else {
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