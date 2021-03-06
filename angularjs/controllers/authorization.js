angular.module('app')
    .controller('authCtrl', function ($q, $scope, $state, $window, $location, $route, $rootScope, AuthService) {

        $scope.regex = '(\\+[0-9]\\d{1})*(\\s)*([0-9]\\d{2})(\\s*)([0-9]\\d{2})(\\s*)([0-9]\\d{2})';

        $scope.submitError = false;
        $scope.errorMessage = '';

        $rootScope.isLoggedIn = function (){
            return AuthService.isAuthenticated;
        };

        if($rootScope.isLoggedIn()) {
            AuthService.getUserRole().then(function (result) {
                $rootScope.role = result.role;
            });
        }

        $scope.signin = function () {
            AuthService.signin($scope.user).then(function (msg, success) {
                $rootScope.isLogedIn = true;
                AuthService.getUserRole().then(function (result) {
                    $rootScope.role = result.role;
                });
                $window.location.reload();
            })
        };

        $scope.signout = function () {
            AuthService.signout();
            $rootScope.isLogedIn = false;
            $state.go('home').then(function () {
                $window.location.reload();
            });
        };

        $scope.getUserInfo = function () {
            AuthService.getUserInfo().then(function (msg) {
                $scope.userinfo = msg;
            })
        };
        
        $scope.submitForm = function (isValid) {
            if(isValid){
                AuthService.signup($scope.user).then(function (data) {
                    $scope.submitError = false;
                    AuthService.signin($scope.user).then(function (msg, success) {
                        $rootScope.isLogedIn = true;
                        if($window.location.toString() == 'http://localhost:3001/#/confirmation')
                            $window.location.reload();
                        else
                            $state.go('successfulSignup').then(function () {
                                $window.location.reload();
                            });
                    });

                }, function (data) {
                    
                    switch(data.code){
                        case 11000:
                            $scope.submitError = true;
                            $scope.errorMessage = 'Wybrany email jest już zarejestrowany. Proszę wybrać inny.';
                            break;
                        default:
                            $scope.submitError = true;
                            $scope.errorMessage = 'Coś poszło nie tak. Proszę spróbować później.';
                    }
                });
            } else {
                $scope.submitError = true;
                $scope.errorMessage = 'Coś poszło nie tak. Proszę spróbować później.';
            }
        };

        $scope.$watch('submitError', function (errorMessage) {
            console.log(errorMessage)
        });

    });