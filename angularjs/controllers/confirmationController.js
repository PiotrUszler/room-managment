/**
 * Created by Piotr Uszler on 11.11.2016.
 */
angular.module('app')
    .controller('confirmationCtrl', function ($q, $window, $location, $cookies, $scope, $rootScope, AuthService) {

        $scope.isSignedIn = false;

        $scope.room = JSON.parse($cookies.get('room'));
        $scope.dateFrom = JSON.parse($cookies.get('dates')).dateFrom;
        $scope.dateTo = JSON.parse($cookies.get('dates')).dateTo;
        $scope.extras = JSON.parse($cookies.get('extras')).extras;
        $scope.numOfDays = JSON.parse($cookies.get('extras')).numOfDays;

        var init = function () {
            AuthService.isAuthenticated ? $scope.isSignedIn = true : $scope.isSignedIn = false;

        };
            
        $scope.reserve = function () {
            
        };

        //TODO zrobienie rejestracji(może przeniesienie na signup view? do rozważenia) i obsługa błędów(może jakoś połączyć obydwa logowania i rejestracje w jedno?)
        //TODO porobienie i przetestowanie referencji w mongodb i zrobienie nowej kolekcji i potwierdzonymi rezerwacjami(zastanowić się nad bazą danych)
        //TODO przejście do udanej rezerwacji tylko jesli sie zaakceptuje regulamin
        //TODO Obsluga bledow rezerwacji
        //TODO dodanie czegos do widoku rezerwajci
        //TODO dodanie całej obsługi konta(zmiana hasła, numeru telefonu[dodanie lub zmiana], podglądu rezerwacji, itp) oraz obsługi hotelu(CRUD dodatków, pokoji itp).
        //TODO dodanie może jakiś wykresów na temat obciążenia pokoji lub jakiś przychodów czy coś albo jaieś coś do generowanie pdf z raportem
        //TODO pozmieniać słowa reservation itp na booking
        init();

    });