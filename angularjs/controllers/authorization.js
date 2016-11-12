/**
 * Created by Piotr Uszler on 14.10.2016.
 */
angular.module('app')
    .controller('authCtrl', function ($q, $scope, $window, $location, $route, $rootScope, AuthService) {


        $scope.regex = '(\\+[0-9]\\d{1})*(\\s)*([0-9]\\d{2})(\\s*)([0-9]\\d{2})(\\s*)([0-9]\\d{2})';

        $scope.submitError = false;
        $scope.errorMessage = '';

        $rootScope.isLoggedIn = function (){
            return AuthService.isAuthenticated;
        };

        $scope.signin = function () {
            console.log('login');
            AuthService.signin($scope.user).then(function (msg, success) {
                $rootScope.isLogedIn = true;
                //$window.location.href='#/';
                $window.location.reload();
                console.log(msg);
            })
        };

        $scope.signout = function () {
            AuthService.signout();
            $rootScope.isLogedIn = false;
            $window.location.reload();
            console.log('logout');
        };

        $scope.getUserInfo = function () {
            AuthService.getUserInfo().then(function (msg) {
                console.log(msg);
                $scope.userinfo = msg;
            })
        };

        $scope.submitForm = function (isValid) {
            if(isValid){
                AuthService.signup($scope.user).then(function (data) {
                    console.log('Pomyślnie zarejestrowano');
                    $scope.submitError = false;
                    AuthService.signin($scope.user).then(function (msg, success) {
                        $rootScope.isLogedIn = true;
                        if($window.location.toString() == 'http://localhost:3001/#/confirmation')
                            $window.location.reload();
                        else
                            $window.location.href='#/successfulSignup';
                    });

                }, function (data) {
                    console.log(data);
                    
                    switch(data.code){
                        case 11000:
                            $scope.submitError = true;
                            $scope.errorMessage = 'Wybrany email jest już zarejestrowany. Proszę wybrać inny.';
                            break;
                        default:
                            $scope.submitError = true;
                            $scope.errorMessage = 'Upss coś poszło nie tak. Proszę spróbować później.';
                    }
                });
            } else {
                $scope.submitError = true;
                $scope.errorMessage = 'Upss coś poszło nie tak. Proszę spróbować później.';
            }
        };

        $scope.$watch('submitError', function (errorMessage) {
            console.log(errorMessage)
        });


    });