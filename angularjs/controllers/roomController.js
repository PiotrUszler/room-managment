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

        $scope.successfulCancel = false;
        $scope.totalPrice = 0;


        $scope.extras = [];
        $scope.selectedExtras = [];
        $scope.extrasTotalPrice = 0;

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
            var roomDateFrom = new Date($scope.roomDateFrom);
            var roomDateTo = new Date($scope.roomDateTo);
            for(var i = 0; i < reservations.length; i++){
                var dateFrom = new Date(reservations[i].from);
                var dateTo = new Date(reservations[i].to);
                if(roomDateFrom < dateTo && roomDateTo > dateFrom){
                    return 'notAvailable'
                }
            }
            return 'available'
        };

        $scope.managmentInit = function () {
            var date = new Date();
            $scope.roomDateFrom = date;
            var dateTemp = new Date;
            dateTemp.setDate(dateTemp.getDate()+1);
            $scope.roomDateTo = dateTemp;
            $scope.getAllRooms();
        };
        
        $scope.toBookings = function (room) {
            $cookies.put('selectedRoom', JSON.stringify(room));
            $('#regulamin').modal('hide');
            setTimeout(function(){
                $state.go('managment-bookings');
            }, 500);
        };

        $scope.getSelectedRoom = function () {
            $scope.selectedRoom = JSON.parse($cookies.get('selectedRoom'));
        };


        $scope.checkDate = function (date) {
            var currentDate = new Date();
            var dateFrom = new Date(date);
            return dateFrom > currentDate;
        };

        $scope.cancelBooking = function (room_id, booking_id) {
            console.log("room id to:"+room_id+", booking_id to:"+booking_id);

            roomService.cancelBooking(room_id, booking_id).then(function (a) {
                console.log('udało się anulować');
                $state.reload();
            })
        };

        $scope.getRoomBookings = function () {
            $scope.getSelectedRoom();
            roomService.getRoomBookings($scope.selectedRoom._id).then(function (b) {
                $scope.bookings = b.reservations;
            })
        };

        $scope.selectUser = function (user) {
            roomService.getUserInfo(user).then(function (u) {
                $scope.selectedUser = u;
            });

        };

        $scope.toBooking = function (room, dateFrom, dateTo) {
            $cookies.put('booking', JSON.stringify({room: room, dateFrom: dateFrom, dateTo: dateTo}));
            $('#regulamin').modal('hide');
            setTimeout(function(){
                $state.go('test');
            }, 500);
        };

        $scope.initBooking = function () {
            $scope.booking = JSON.parse($cookies.get('booking'));
            $scope.test.dateFrom = new Date($scope.booking.dateFrom);
            $scope.test.dateTo = new Date($scope.booking.dateTo);
            $scope.calculateTotalPrice();
            getExtras();
        };


        //TODO dodanie dodatków i obliczenie ceny
        $scope.submitBookForm = function () {
            var user = null;
            if($scope.test.email == undefined){
                var user = {
                    email: ""+$scope.test.firstName+$scope.test.lastName+$scope.test.phone,
                    firstName: $scope.test.firstName,
                    lastName: $scope.test.lastName,
                    phone: $scope.test.phone
                };
            } else {
                var user = {
                    email: $scope.test.email,
                    firstName: $scope.test.firstName,
                    lastName: $scope.test.lastName,
                    phone: $scope.test.phone
                };
            }
            roomService.signupAndBook(user, $scope.booking.room._id, {dateFrom: $scope.test.dateFrom, dateTo: $scope.test.dateTo}, $scope.totalPrice, $scope.selectedExtras)
                .then(function (a) {
                console.log(a);
            })
        };

        var calculateDiffOfDays = function () {
            var MS_PER_DAY = 1000 * 60 * 60 * 24;
            var dateFrom = new Date($scope.test.dateFrom);
            var dateTo = new Date($scope.test.dateTo);
            var dateFromUTC = Date.UTC(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate());
            var dateToUTC = Date.UTC(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate());
            return Math.floor((dateToUTC - dateFromUTC) / MS_PER_DAY);
        };

        $scope.calculateTotalPrice = function () {

            $scope.totalPrice = (calculateDiffOfDays() * $scope.booking.room.price) + $scope.extrasTotalPrice;
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


    });