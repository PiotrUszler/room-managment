/**
 * Created by Piotr Uszler on 06.11.2016.
 */
angular.module('app')
    .service('roomService', function ($q, $http) {

        var selectedRoom = null;

        var getRooms = function (data) {
            return $q(function (resolve, reject) {
                $http.post('/api/findRooms', data).then(function (result) {
                    if(result.data.success){
                        console.log('Pobrano pokoje');
                        resolve(result.data.rooms);
                    } else {
                        reject(result.data.error);
                    }
                })
            })
        };

        var bookRoom = function (data) {//TODO zjaąć się
            return $q(function (resolve, reject) {
                $http.post('/api/reserve', data).then(function (result) {
                    if(result.data.success){
                        resolve(result.data.success)
                    } else {
                        reject(result.data.error)
                    }
                })
            })
        };

        var cancelBooking = function (room_id, booking_id) {
            return $q(function (resolve, reject) {
                console.log('jetem przed post cancel');
                $http.post('/api/cancelBooking',{room_id: room_id, booking_id: booking_id}).then(function (result) {
                    if(result.data.success){
                        console.log('resolve cancel');
                        resolve(result.data.success)
                    } else {
                        console.log('reject cancel');
                        reject(result.data.error)
                    }
                })
            })
        };

        var getAllRooms = function () {
            return $q(function (resolve, reject) {
                $http.get('/api/getRooms').then(function (result) {
                    if(result.data.success){
                        resolve(result.data.result)
                    } else {
                        reject(result.data.error)
                    }
                })
            })
        };

        var getRoomBookings = function (room_id) {
            return $q(function (resolve, reject) {
                $http.post('/api/getRoomBookings', {room_id: room_id}).then(function (result) {
                        console.log(result.data[0].reservations);
                        resolve(result.data[0])
                },function (result) {
                    reject(result.data)
                })
            })
        };

        var getUserInfo = function (user) {
            return $q(function (resolve, reject) {
                $http.post('/api/getUserInfo', {email: user}).then(function (userInfo) {
                    if(!userInfo.data.error)
                        resolve(userInfo.data);
                    else
                        reject(userInfo.data)
                },function (userInfo) {
                    reject(userInfo.data);
                })
            })
        };

        var signupAndBook = function (user, id, dates, price, extras) {
            console.log(extras);
            return $q(function (resolve, reject) {
                $http.post('/api/signupAndBook', {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    number: user.phone,
                    id: id,
                    from: dates.dateFrom,
                    to: dates.dateTo,
                    price: price,
                    extras: extras
                }).then(function (result) {
                        console.log('udało się')
                    }, function (result) {
                        console.log('nie udało się')
                })
            })
        };


        return{
            getRooms: getRooms,
            getAllRooms: getAllRooms,
            bookRoom: bookRoom,
            cancelBooking: cancelBooking,
            getRoomBookings: getRoomBookings,
            getUserInfo: getUserInfo,
            signupAndBook: signupAndBook
        }
    });