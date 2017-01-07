/**
 * Created by Piotr Uszler on 08.11.2016.
 */
angular.module('app')
    .controller('offerCtrl', function ($scope, $rootScope, $cookies, $state, $location, $window, offerSvc) {
        $scope.offer = {};
        $scope.extras = [];
        $scope.selectedExtras = [];
        var dates = {};
        $scope.dateFrom = '';
        $scope.dateTo = '';
        $scope.roomName = '';


        var showOffer = function () {
            $scope.offer = JSON.parse($cookies.get('room'));
            $scope.extras = getExtras();

            dates = JSON.parse($cookies.get('dates'));
            $scope.dateFrom = datePreetify(new Date(dates.dateFrom));
            $scope.dateTo = datePreetify(new Date(dates.dateTo));

            $scope.roomName = $scope.offer.room.type;
            $scope.roomPrice = $scope.offer.room.price * calculateDiffOfDays();
            $scope.extrasTotalPrice = 0;
            $scope.calculateTotalPrice();
        };

        var datePreetify = function (date) {
            var day = date.getUTCDate();
            var month = date.getUTCMonth() + 1;
            var year = date.getUTCFullYear();
            return ''+day+'-'+month+'-'+year;
        };

        $scope.addOrRemoveExtra = function (extra) {

            var index = $scope.selectedExtras.indexOf(extra);
            extra.buttonText = extra.buttonToggle ? 'Dodaj +' : 'Usuń -';
            extra.buttonToggle = !extra.buttonToggle;

            if(index == -1){
                $scope.selectedExtras.push(extra);
                $scope.extrasTotalPrice += (extra.price * calculateDiffOfDays());
            } else {
                $scope.selectedExtras.splice(index,1);
                $scope.extrasTotalPrice -= (extra.price * calculateDiffOfDays());
            }
            $scope.calculateTotalPrice();
        };

        $scope.toConfirmation = function () {
            var extras = {extras: $scope.selectedExtras, numOfDays: calculateDiffOfDays()};
            $cookies.put('extras', JSON.stringify(extras));
            $cookies.put('price', JSON.stringify($scope.totalPrice));
            $state.go('confirmation')
        };

        $scope.toPrevious = function () {
            //$window.location.href = '#/main'
            $state.go('home')
        };

        $scope.calculateTotalPrice = function () {
                if($rootScope.discount != undefined && $rootScope.discount.type == 'zl'){
                    $scope.totalPrice = ((calculateDiffOfDays() * $scope.offer.room.price) + $scope.extrasTotalPrice) - $rootScope.discount.amount;
                } else if($rootScope.discount != undefined && $rootScope.discount.type == '%'){
                    $scope.totalPrice = (calculateDiffOfDays() * $scope.offer.room.price) + $scope.extrasTotalPrice;
                    $scope.totalPrice = $scope.totalPrice - ($scope.totalPrice * ($rootScope.discount.amount / 100));
                } else{
                    $scope.totalPrice = (calculateDiffOfDays() * $scope.offer.room.price) + $scope.extrasTotalPrice;
                }
        };

        var getExtras = function () {
            offerSvc.getExtras().then(function (extrasData) {
                $scope.extras = extrasData;
                for(var i = 0 ; i < $scope.extras.length; i++){
                    $scope.extras[i].buttonText = 'Dodaj +';
                    $scope.extras[i].buttonToggle = false;
                }
            });
        };

        $scope.addOrRemoveExtra = function (extra) {
            var index = $scope.selectedExtras.indexOf(extra);
            extra.buttonText = extra.buttonToggle ? 'Dodaj +' : 'Usuń -';
            extra.buttonToggle = !extra.buttonToggle;
            $scope.totalPrice = 0;
            if(index == -1){
                $scope.selectedExtras.push(extra);
                $scope.extrasTotalPrice += extra.price * calculateDiffOfDays();
            } else {
                $scope.selectedExtras.splice(index,1);
                $scope.extrasTotalPrice -= extra.price * calculateDiffOfDays();
            }
            $scope.calculateTotalPrice();
        };

        var calculateDiffOfDays = function () {
            var MS_PER_DAY = 1000 * 60 * 60 * 24;
            var dateFrom = new Date(dates.dateFrom);
            var dateTo = new Date(dates.dateTo);
            var dateFromUTC = Date.UTC(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate());
            var dateToUTC = Date.UTC(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate());
            return Math.floor((dateToUTC - dateFromUTC) / MS_PER_DAY);
        };

        $rootScope.$watch('discount',function () {
            $scope.calculateTotalPrice();
        });

        showOffer();
    });