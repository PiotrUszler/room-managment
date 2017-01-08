/**
 * Created by Piotr Uszler on 06.11.2016.
 */
angular.module('app')
    .controller('roomCtrl', function ($q, $cookies, $scope, $rootScope, $window, $location, roomService, voucherService, offerSvc,$filter, $state) {
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

        $scope.selectOrAddUser = undefined;

        $scope.select = function (room) {
            $scope.selectedRoom = room;
        };

        var setDate = function () {
            var date = new Date();
            $scope.dateFrom = date;
            var dateTemp = new Date();
            dateTemp.setDate(dateTemp.getDate()+1);
            $scope.dateTo = dateTemp;
        };

        $scope.init = function () {
            setDate();
            $scope.findRooms();
        };

        $scope.findRooms = function () {//TODO ogarnac sie z tym beds, wyszukiwac pokoje o podanej ilosci osob i nazwac to jakos w bazie ostatecznie
            if($scope.dateFrom.getMonth() >= $scope.dateTo.getMonth() && $scope.dateFrom.getDate() >= $scope.dateTo.getDate()){
                var dateTemp = new Date();
                dateTemp.setDate($scope.dateFrom.getDate()+1);
                dateTemp.setMonth($scope.dateFrom.getMonth());
                $scope.dateTo = dateTemp;
            }
            roomService.getRooms({
                from: $scope.dateFrom.toISOString(),
                to: $scope.dateTo.toISOString(),
                beds: $scope.numberOfBeds
            }).then(function (roomsData) {
                if(roomsData.length >0){
                    $scope.rooms = roomsData;
                    $scope.noRoomsError = false;
                }
                else
                    $scope.noRoomsError = true;
            }, function (error) {
                $scope.noRoomsError = true;
                $scope.errorMsg = 'Coś poszło nie tak.'
            });
        };

        $scope.addRoom = function (room) {
            $cookies.put('room', JSON.stringify({room: {id: room._id, type: room.type, price: room.price}}));
            $cookies.put('dates', JSON.stringify({dateFrom: $scope.dateFrom, dateTo: $scope.dateTo}));
            offerSvc.chooseRoom(room);
            $state.go('offer');
        };

        $scope.getAllRooms = function () {
            roomService.getAllRooms().then(function (rooms) {
                $scope.allRooms = rooms;
                console.log(rooms);
            }, function (error) {
                //TODO obsługa errora
            })
        };

        $scope.dateChanged = function () {
            if($scope.dateFrom.getMonth() >= $scope.dateTo.getMonth() && $scope.dateFrom.getDate() >= $scope.dateTo.getDate()){
                var dateTemp = new Date();
                dateTemp.setDate($scope.dateFrom.getDate()+1);
                dateTemp.setMonth($scope.dateFrom.getMonth());
                $scope.dateTo = dateTemp;
            }
        };
        //TODo po zmianie daty zmienic classe(kompletny rework? :()
        $scope.getAvailability = function (reservations) {
            var currentDate = new Date();
            var roomDateFrom = new Date($scope.dateFrom);
            var roomDateTo = new Date($scope.dateTo);
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
            setDate();
            $scope.getAllRooms();
        };
        
        $scope.toBookings = function (room) {

            $cookies.put('selectedRoom', JSON.stringify({_id: room._id, type: room.type, number: room.number, beds: room.beds, price: room.price}));
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
            roomService.cancelBooking(room_id, booking_id).then(function (a) {
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
            $cookies.put('booking', JSON.stringify({room: {_id: room._id, type: room.type, number: room.number, beds: room.beds, price: room.price}, dateFrom: dateFrom, dateTo: dateTo}));
            $('#regulamin').modal('hide');
            setTimeout(function(){
                $state.go('admin-booking');
            }, 500);
        };

        $scope.initBooking = function () {
            $scope.booking = JSON.parse($cookies.get('booking'));
            //$scope.test.dateFrom = new Date($scope.booking.dateFrom);
            //$scope.test.dateTo = new Date($scope.booking.dateTo);
            $scope.calculateTotalPrice();
            getExtras();
            roomService.getUsersEmails().then(function (users) {
                $scope.users = JSON.parse(JSON.stringify(users));
            })
        };

        //TODO przeniesienie pewnych funkcjonalnosci do userCtrl

        $scope.submitBookForm = function () {
            var user = null;
            if($scope.selectOrAddUser){
                if($scope.bookingUser.email == undefined){
                    var user = {
                        email: ""+$scope.bookingUser.firstName+$scope.bookingUser.lastName+$scope.bookingUser.phone,
                        firstName: $scope.bookingUser.firstName,
                        lastName: $scope.bookingUser.lastName,
                        phone: $scope.bookingUser.phone
                    };
                } else {
                    var user = {
                        email: $scope.bookingUser.email,
                        firstName: $scope.bookingUser.firstName,
                        lastName: $scope.bookingUser.lastName,
                        phone: $scope.bookingUser.phone
                    };
                }

                roomService.signupAndBook(user, $scope.booking.room._id, {dateFrom: $scope.booking.dateFrom, dateTo: $scope.booking.dateTo}, $scope.totalPrice, $scope.selectedExtras)
                    .then(function (result) {
                        if($rootScope.discount){
                            voucherService.useVoucher($rootScope.discount.code).then(function (vResult) {
                            },function (error) {
                                console.log(error);
                            });
                        }
                    })
            } else {
                user = JSON.parse($scope.selectedUserBooking);
                roomService.adminBook($scope.booking.room._id, user.email ,{dateFrom: $scope.booking.dateFrom, dateTo: $scope.booking.dateTo}, $scope.totalPrice, $scope.selectedExtras)
                    .then(function (a) {
                        if($rootScope.discount){
                            voucherService.useVoucher($rootScope.discount.code).then(function (vResult) {
                            },function (error) {
                                console.log(error);
                            });
                        }

                    })
            }
        };

        var calculateDiffOfDays = function () {
            var MS_PER_DAY = 1000 * 60 * 60 * 24;
            var dateFrom = new Date($scope.booking.dateFrom);
            var dateTo = new Date($scope.booking.dateTo);
            var dateFromUTC = Date.UTC(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate());
            var dateToUTC = Date.UTC(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate());
            return Math.floor((dateToUTC - dateFromUTC) / MS_PER_DAY);
        };

        $scope.calculateTotalPrice = function () {
            if($scope.booking){
                if($rootScope.discount != undefined && $rootScope.discount.type == 'zl'){
                    $scope.totalPrice = ((calculateDiffOfDays() * $scope.booking.room.price) + $scope.extrasTotalPrice) - $rootScope.discount.amount;
                } else if($rootScope.discount != undefined && $rootScope.discount.type == '%'){
                    $scope.totalPrice = (calculateDiffOfDays() * $scope.booking.room.price) + $scope.extrasTotalPrice;
                    $scope.totalPrice = $scope.totalPrice - ($scope.totalPrice * ($rootScope.discount.amount / 100));
                } else{
                    $scope.totalPrice = (calculateDiffOfDays() * $scope.booking.room.price) + $scope.extrasTotalPrice;
                }

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
        
        $scope.paidClass = function (paid) {
            if(paid)
                return 'btn-success';
            return 'btn-warning'
        };
        $scope.pay = function (booking) {
            roomService.pay(booking._id, !booking.paid).then(function (result) {
                booking.paid = !booking.paid;
            })
        };
        $rootScope.$watch('discount',function () {
            $scope.calculateTotalPrice();
        })

    });