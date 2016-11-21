/**
 * Created by Piotr Uszler on 06.11.2016.
 */
angular.module('app')
    .controller('roomCtrl', function ($q, $cookies, $scope, $window, $location, roomService, offerSvc,$filter, $state) {
        $scope.dateFrom = '';
        $scope.dateTo = '';
        $scope.noRoomsError = false;
        $scope.errorMsg ='';
        $scope.rooms = [];
        $scope.numberOfBeds = 1;


        $scope.select = function (room) {
            $scope.selectedRoom = room;
        };

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

        $scope.findRooms = function () {//TODO Wyświetlenie errora o braku pokoji o wybranych parametrach używając noRoomsError i ng-Hide
            roomService.getRooms({
                from: $scope.dateFrom.toISOString(),
                to: $scope.dateTo.toISOString(),
                beds: $scope.numberOfBeds
            }).then(function (roomsData) {
                $scope.rooms = roomsData;
            }, function (error) {
                $scope.noRoomsError = true;
                $scope.errorMsg = 'Coś poszło nie tak.'
            });
        };

        $scope.addRoom = function (room) {
            $cookies.put('room', JSON.stringify(room));
            $cookies.put('dates', JSON.stringify({dateFrom: $scope.dateFrom, dateTo: $scope.dateTo}));
            offerSvc.chooseRoom(room);
            $state.go('offer');
            //$window.location.href='#/offer';
        };

        $scope.test = function () {
            console.log($scope.rooms);
            $scope.findRooms();
        };

        $scope.getAllRooms = function () {
            roomService.getAllRooms().then(function (rooms) {
                $scope.allRooms = rooms;
                console.log(rooms);
            }, function (error) {
                //TODO obsługa errora
            })
        };


        $scope.getAvailability = function (reservations) {
            var currentDate = new Date();
            for(var i = 0; i < reservations.length; i++){
                var dateFrom = new Date(reservations[i].from);
                var dateTo = new Date(reservations[i].to);
                if(currentDate < dateTo && currentDate > dateFrom)
                    return 'notAvailable'
            }
            return 'available'
        };
    });