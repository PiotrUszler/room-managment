/**
 * Created by Piotr Uszler on 11.11.2016.
 */
angular.module('app')
    .controller('confirmationCtrl', function ($q, $window, $location, $state, $cookies, $scope, $rootScope, AuthService, roomService, voucherService) {

        $scope.isSignedIn = false;

        $scope.room = JSON.parse($cookies.get('room'));
        $scope.dateFrom = JSON.parse($cookies.get('dates')).dateFrom;
        $scope.dateTo = JSON.parse($cookies.get('dates')).dateTo;
        $scope.extras = JSON.parse($cookies.get('extras')).extras;
        $scope.numOfDays = JSON.parse($cookies.get('extras')).numOfDays;
        $scope.price = JSON.parse($cookies.get('price'));

        var init = function () {
            AuthService.isAuthenticated ? $scope.isSignedIn = true : $scope.isSignedIn = false;
        };


        $scope.reserve = function () {
            if($scope.terms != true)
                alert('Przed potwierdzeniem rezerwacji należy zaakceptowaćregulamin.');
            else{
                roomService.bookRoom({id: $scope.room._id, from: $scope.dateFrom, to: $scope.dateTo, price: calculateTotalPrice(), extras: $scope.extras})
                    .then(function () {
                        if($rootScope.discount){
                            voucherService.useVoucher($rootScope.discount.code).then(function (vResult) {
                                $state.go('successfulBooking')
                            },function (error) {
                                console.log(error);
                            });
                        }

                },function (error) {
                    //TODO wyświetlenie errrora
                    })
            }
        };

        $scope.toPrevious = function () {
            //$window.location.href = '#/offer'
            $state.go('offer')
        };

        var calculateTotalPrice = function () {
            var total = 0;
            total = ($scope.room.price * $scope.numOfDays);
            $scope.extras.forEach(function (e) {
                total += e.price * $scope.numOfDays;
            });
            return total;

        };

        //TODO zrobienie rejestracji(może przeniesienie na signup view? do rozważenia) i obsługa błędów(może jakoś połączyć obydwa logowania i rejestracje w jedno?)
        //TODO Obsluga bledow rezerwacji
        //TODO dodanie czegos do widoku rezerwajci
        //TODO pousówać jakieś inity(wystaczy wyołać funkcję w kontrolerze lub srv)
        //TODO dodanie całej obsługi konta(zmiana hasła, numeru telefonu[dodanie lub zmiana], podglądu rezerwacji, itp) oraz obsługi hotelu(CRUD dodatków, pokoji itp).
        //TODO dodanie może jakiś wykresów na temat obciążenia pokoji lub jakiś przychodów czy coś albo jaieś coś do generowanie pdf z raportem
        //TODO pozmieniać słowa reservation itp na booking
        //TODO kody rabatowe
        //TODO powiadomienie o ciasteczkach
        //TODO dodanie podglądu obłożenia hotelu jak w kini(3 stany: wolny, zarezerwowany, zajety)
        //TODO zbadanie czy .run stateProvidera poczebne
        //TODO poznanie stateProvidera i dodanie nested views
        //TODO na głównej stronie zrobićżeby data byłą conajmniej jeden dzien rezerwacji
        //TODO zmiana regex na rootScope jesli mozliwe
        //TODo data rezerwacji tylko od daty dzisiejszej (bez rezerwacji w przeszłości)
        //TODO konto
        //zmiana danych
        //zmiana hasła
        //zobaczenie rezerwacji
        //anulowanie rezerwacji
        //
        init();

    });