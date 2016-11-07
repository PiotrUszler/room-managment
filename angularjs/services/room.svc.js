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

        return{
            getRooms: getRooms
        }
    });