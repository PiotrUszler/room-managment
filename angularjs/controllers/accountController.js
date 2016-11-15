/**
 * Created by Piotr Uszler on 14.11.2016.
 */
angular.module('app')
    .controller('accCtrl', function ($scope, AuthService) {

        
        $scope.getUserBookings = function () {
            AuthService.getUserBookings().then(function (msg) {
                console.log(msg);
                $scope.userBookings = msg;
                })
            };
    });