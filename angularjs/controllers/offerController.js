/**
 * Created by Piotr Uszler on 08.11.2016.
 */
angular.module('app')
    .controller('offerCtrl', function ($scope, $cookies, offerSvc) {
        $scope.offer = {};
        $scope.extras = [];
        $scope.selectedExtras = [];
        var dates = {};
        $scope.dateFrom = '';
        $scope.dateTo = '';
        $scope.roomName = '';

        $scope.showOffer = function () {
            $scope.offer = JSON.parse($cookies.get('room'));
            $scope.extras = getExtras();

            dates = JSON.parse($cookies.get('dates'));
            $scope.dateFrom = datePreetify(new Date(dates.dateFrom));
            $scope.dateTo = datePreetify(new Date(dates.dateTo));

            $scope.roomName = $scope.offer.type;
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
            } else {
                $scope.selectedExtras.splice(index,1);
            }
        };

        var getExtras = function () {
            offerSvc.getExtras().then(function (extrasData) {
                $scope.extras = extrasData;
                for(var i = 0 ; i < $scope.extras.length; i++){
                    $scope.extras[i].buttonText = 'Dodaj +';
                    $scope.extras[i].buttonToggle = false;;
                }
            });
        };



    });