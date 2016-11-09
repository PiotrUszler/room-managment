/**
 * Created by Piotr Uszler on 08.11.2016.
 */
angular.module('app')
    .controller('offerCtrl', function ($scope, $cookies, offerSvc) {
        $scope.offer = {};
        $scope.extras = [];
        $scope.selectedExtras = [];
        $scope.buttonFlag = false;
        $scope.btnTxt = 'Dodaj +';

        $scope.showOffer = function () {
            $scope.offer = JSON.parse($cookies.get('room'));
            $scope.extras = getExtras();
        };

        $scope.addOrRemoveExtra = function (extra) {//TODO zmiana wyglądu pojedyńczego przycisku po kliknieciu, link: http://stackoverflow.com/questions/27151868/change-class-of-just-one-element-in-an-ngrepeat

            var index = $scope.selectedExtras.indexOf(extra);
            console.log(index);
            if(index == -1){
                $scope.selectedExtras.push(extra);
                $scope.buttonFlag = true;
                $scope.btnTxt = 'Usuń -';
                console.log('Adding extra');
            } else {
                $scope.selectedExtras.splice(index,1);
                $scope.buttonFlag = false;
                $scope.btnTxt = 'Dodaj +';
                console.log('Removing extra');
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