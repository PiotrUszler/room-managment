/**
 * Created by Piotr Uszler on 06.11.2016.
 */
angular.module('app')
    .service('userService', function ($q, $http) {

        var getAllUsers = function () {
            return $q(function (resolve, reject) {
                $http.get('/api/getAllUsers').then(function (result) {
                    resolve(result.data);
                },function (error) {
                    reject(error.data);
                })
            })
        };


        return{
            getAllUsers: getAllUsers
        }
    });