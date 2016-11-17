/**
 * Created by Piotr Uszler on 14.11.2016.
 */
angular.module('app')
    .controller('accCtrl', function ($scope, AuthService) {

        
        var getUserBookings = function () {
            AuthService.getUserBookings().then(function (msg) {
                console.log(msg);
                $scope.userBookings = msg;
                })
            };

        var getInfo = function () {
            AuthService.getUserInfo().then(function (user) {
                console.log(user);
                $scope.firstName = user.firstName;
                $scope.lastName = user.lastName;
                $scope.email = user.email;
                $scope.phone = user.phone;
            })
        };

        getInfo();
        getUserBookings();
    });