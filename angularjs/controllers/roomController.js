/**
 * Created by Piotr Uszler on 06.11.2016.
 */
angular.module('app')
    .controller('roomCtrl', function ($q, $scope, roomService, $filter) {
        $scope.dateFrom = '';
        $scope.dateTo = '';
        $scope.noRoomsError = false;
        $scope.errorMsg ='';
        $scope.rooms = [];

        var setDate = function () {
            var date = new Date();
            console.log(date);
            $scope.dateFrom = date;
            var dateTemp = new Date;
            dateTemp.setDate(dateTemp.getDate()+1);
            $scope.dateTo = dateTemp;
        };

        $scope.init = function () {
            setDate();
            $scope.findRooms();
        };

        $scope.findRooms = function () {//TODO Obsługa braku znalezionych pokoji i wogole
            roomService.getRooms({
                from: $scope.dateFrom.toISOString(),
                to: $scope.dateTo.toISOString()
            }).then(function (roomsData) {
                $scope.rooms = roomsData;
            }, function (error) {
                $scope.noRoomsError = true;
                $scope.errorMsg = 'Coś poszło nie tak.'
            });
        };

        $scope.test = function () {
            console.log($scope.rooms)
        }

    });