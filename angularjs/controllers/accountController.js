/**
 * Created by Piotr Uszler on 14.11.2016.
 */
angular.module('app')
    .controller('accCtrl', function ($scope, $state, AuthService, roomService) {

        $scope.regex = '(\\+[0-9]\\d{1})*(\\s)*([0-9]\\d{2})(\\s*)([0-9]\\d{2})(\\s*)([0-9]\\d{2})';

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
        
        $scope.changeUserDetails = function(isValid, fName, lName, nEmail, nPhone){
            if(isValid){
                var newDetails = {
                    firstName: fName,
                    lastName: lName,
                    email: nEmail,
                    phoneNumber: nPhone
                };
                AuthService.changeUserDetails(newDetails).then(function (a) {
                    $state.reload();
                })
            }
        };

        $scope.cancelBooking = function (room_id, booking_id) {
            roomService.cancelBooking(room_id, booking_id).then(function (a) {
                $state.reload();
            })
        };

        var getUserBookings = function () {
            AuthService.getUserBookings().then(function (msg) {
                $scope.userBookings = msg;
                })
            };

        var getInfo = function () {
            AuthService.getUserInfo().then(function (user) {
                $scope.firstName = user.firstName;
                $scope.lastName = user.lastName;
                $scope.email = user.email;
                $scope.phone = user.phone;
            })
        };

        $scope.changePassword = function (valid,oldP, newP) {
            if(valid){
                AuthService.changePassword(oldP, newP).then(function (res) {
                    $scope.successfulPasswordChange = true;
                },function (rej) {
                    $scope.wrongPassword = true;
                })
            }
        };

        $scope.checkDate = function (date) {
            var currentDate = new Date();
            var dateFrom = new Date(date);
            return dateFrom > currentDate;
        };
        
        getInfo();
        getUserBookings();
    });