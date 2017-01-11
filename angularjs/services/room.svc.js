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
                        resolve(result.data.rooms);
                    } else {
                        reject(result.data.error);
                    }
                })
            })
        };

        var bookRoom = function (data) {
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
                $http.post('/api/cancelBooking',{room_id: room_id, booking_id: booking_id}).then(function (result) {
                    if(result.data.success){
                        resolve(result.data.success)
                    } else {
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
                        resolve('OK');
                    }, function (result) {
                        reject('Wystąpił błąd podczas rezerwacji')
                })
            })
        };

        var adminBook = function (id, email, dates, price, extras) {
            return $q(function (resolve, reject) {
                $http.post('/api/adminBook', {
                    id: id,
                    email: email,
                    from: dates.dateFrom,
                    to: dates.dateTo,
                    price: price,
                    extras: extras
                }).then(function (result) {
                    if(result.data.success)
                        resolve('OK');
                    else{
                        reject('Wystąpił błąd podczas rezerwacji');
                    }
                }, function (result) {
                    reject('Wystąpił błąd podczas rezerwacji');
                })
            })
        };

        var getUsersEmails = function () {
            return $q(function (resolve, reject) {
                $http.get('/api/getUsersEmails').then(function (result) {
                    if(result.data.success = false){
                        reject('Nie znaleziono użytkowników')
                    }else{
                        resolve(result.data)
                    }
                }, function (result) {
                    reject('Nie znaleziono użytkowników')
                })
            })
        };

        var pay = function (reservation_id, pay) {
            return $q(function (resolve, reject) {
                $http.post('/api/paid', {id: reservation_id, pay: pay}).then(function (result) {
                    if(result.data.success)
                        resolve(true);
                    else
                        reject(false);
                })
            })
        };

        var changeRoomDetails = function (details) {
            return $q(function (resolve, reject) {
                $http.post('/api/changeRoomDetails', {id: details._id, number: details.number, beds: details.beds, price: details.price, type: details.type, description: details.description}).then(function (result) {
                    if(result.data.error){
                        if(result.data.error.code == 11000){
                            reject("NUM_ERR")
                        } else {
                            reject(result.data.error)
                        }
                    } else {
                        resolve("OK")
                    }

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
            signupAndBook: signupAndBook,
            adminBook: adminBook,
            getUsersEmails: getUsersEmails,
            pay: pay,
            changeRoomDetails: changeRoomDetails
        }
    });