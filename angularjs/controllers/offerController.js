/**
 * Created by Piotr Uszler on 08.11.2016.
 */
angular.module('app')
    .controller('offerCtrl', function ($scope, $cookies, offerSvc) {
        $scope.offer = {};
        $scope.extras = [];
        $scope.selectedExtras = [];


        $scope.showOffer = function () {
            $scope.offer = JSON.parse($cookies.get('room'));
            $scope.extras = getExtras();
        };

        $scope.addExtra = function (extra) {//TODO Dodawanie i usówanie dodatków

            $scope.selectedExtras.push(extra);
            if($scope.selectedExtras.indexOf(extra) != -1){
                console.log('asdasd');
            }
            console.log($scope.selectedExtras);
        };

        var getExtras = function () {
            offerSvc.getExtras().then(function (extrasData) {
                $scope.extras = extrasData;
            });
            console.log($scope.extras);
        }


    });