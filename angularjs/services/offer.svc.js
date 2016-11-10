/**
 * Created by Piotr Uszler on 08.11.2016.
 */
angular.module('app')
    .service('offerSvc', function ($q, $http) {
        var chosenRoom = {};
        var extras = [];

        var chooseRoom = function (room) {
            choosenRoom = room;
        };

        var getRoom = function () {
            return choosenRoom;
        };

        var getExtras = function () {
            return $q(function (resolve, reject) {
                $http.get('/api/getExtras').then(function (result) {
                    if(result.data.success){
                        resolve(result.data.extras);
                    } else {
                        reject(result.data.error);
                    }
                })
            })
        };



        return{
            chooseRoom: chooseRoom,
            getRoom: getRoom,
            getExtras: getExtras,
        };
    });