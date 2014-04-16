angular.module('auth', [])

    .service('AuthService', [function(){
        var userIsAuthenticated = false;
        var authenticatedUser = null;

        this.setUserAuthenticated = function(value) {
            userIsAuthenticated = value;
        };

        this.getUserAuthenticated = function() {
            return userIsAuthenticated;
        };
        this.setAuthenticatedUser = function(user) {
            authenticatedUser = user;
        };
        this.getAuthenticatedUser = function() {
            return authenticatedUser;
        };

        return this;
    }]);