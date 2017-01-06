/**
 * Created by Piotr Uszler on 06.01.2017.
 */
angular.module('app')
    .controller('userCtrl', function ($scope, $state, AuthService, roomService, userService) {

        userService.getAllUsers().then(function (users) {
            $scope.users = users;
            console.log($scope.users)
        })
    });