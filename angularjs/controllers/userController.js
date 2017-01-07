/**
 * Created by Piotr Uszler on 06.01.2017.
 */
angular.module('app')
    .controller('userCtrl', function ($scope, $state, AuthService, roomService, userService) {

        userService.getAllUsers().then(function (users) {
            $scope.users = users;
        });
        
        $scope.changeUserDetails = function(isValid){
            if(isValid){
                var newDetails = {
                    firstName: $scope.selectedUser.firstName,
                    lastName: $scope.selectedUser.lastName,
                    email: $scope.selectedUser.email,
                    phoneNumber: $scope.selectedUser.phoneNumber,
                    role: $scope.selectedUser.role
                };
                userService.changeUserDetails(newDetails).then(function (a) {
                    $state.reload();
                })
            }
        };

    });