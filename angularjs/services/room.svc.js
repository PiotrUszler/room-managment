/**
 * Created by Piotr Uszler on 06.11.2016.
 */
angular.module('app')
    .service('roomService', function ($q, $http) {

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

        return{
            getRooms: getRooms,
            bookRoom: bookRoom,
            cancelBooking: cancelBooking
        }
    });