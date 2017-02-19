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

        var changeUserDetails = function (newDetails) {
            return $q(function (resolve, reject) {
                $http.post('/api/adminChangeUserDetails', newDetails).then(function (result) {
                    if(result.data.success){
                        resolve({success: true, msg: "Pomyślnie zmieniono dane"})
                    } else {
                        reject({success: false, msg: "coś poszło nie tak"});
                    }
                })
            })
        };

        return{
            getAllUsers: getAllUsers,
            changeUserDetails: changeUserDetails
        }
    });