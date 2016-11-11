/**
 * Created by Piotr Uszler on 11.11.2016.
 */
angular.module('app')
    .controller('confirmationCtrl', function ($q, $window, $location, $cookies, $scope, $rootScope, AuthService) {

        $scope.isSignedIn = false;

        var init = function () {
            AuthService.isAuthenticated ? $scope.isSignedIn = true : $scope.isSignedIn = false;

        };

        $scope.signin = function () {
            AuthService.signin($scope.user).then(function (msg, success) {
                $rootScope.isLogedIn = true;
                $scope.isSignedIn = true;
                $window.location.reload();
                console.log('wohohoho');
            }, function (msg) {
                console.log('błędny login lub hasło')
            })
        };

        //TODO zrobienie rejestracji(może przeniesienie na signup view? do rozważenia) i obsługa błędów(może jakoś połączyć obydwa logowania i rejestracje w jedno?)
        //TODO porobienie i przetestowanie referencji w mongodb i zrobienie nowej kolekcji i potwierdzonymi rezerwacjami(zastanowić się nad bazą danych)
        init();

    });