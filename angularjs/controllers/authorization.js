/**
 * Created by Piotr Uszler on 14.10.2016.
 */
angular.module('app')
    .controller('authCtrl', function ($q, $scope, $window, $location, $route, $rootScope, AuthService) {


        $scope.regex = '(\\+[0-9]\\d{1})*(\\s)*([0-9]\\d{2})(\\s*)([0-9]\\d{2})(\\s*)([0-9]\\d{2})';

        $rootScope.isLogedIn = function (){
            return AuthService.isAuthenticated;
        };


        $scope.signin = function () {
            console.log('login');
            AuthService.signin($scope.user).then(function (msg, success) {
                $rootScope.isLogedIn = true;
                $window.location.href='#/';
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
                    console.log(data);

                    if(data.success){
                        console.log('Pomyślnie zarejestrowano');

                    } else{
                        console.log('wystąpił błąd: '+data.msg);
                    }
                }, function (data) {
                    console.log(data.msg.code);
                });
            } else {
                console.log('Wystąpił błą podczas rejestracji')//TODO obsługa błędu podczas rejestracji
            }
        }

    });