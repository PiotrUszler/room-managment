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
                roomService.bookRoom({id: $scope.room.room.id, from: $scope.dateFrom, to: $scope.dateTo, price: $scope.price, extras: $scope.extras})
                    .then(function () {
                        if($rootScope.discount){
                            voucherService.useVoucher($rootScope.discount.code).then(function (vResult) {
                                $state.go('successfulBooking')
                            },function (error) {
                                console.log(error);
                            });
                        } else {
                            $state.go('successfulBooking');
                        }

                },function (error) {
                    })
            }
        };

        $scope.toPrevious = function () {
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
        
        init();

    });