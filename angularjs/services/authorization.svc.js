/**
 * Created by Piotr Uszler on 14.10.2016.
 */
angular.module('app')
    .service('AuthService', ['$http', '$q', function ($http, $q) {
        var LOCAL_TOKEN = 'token';
        var isAuthenticated = false;
        var authToken;

        function loadUserInfo() {
            var token = window.localStorage.getItem(LOCAL_TOKEN);
            console.log('loading User info...');//Do usunięcia
            if(token)
                userInfo(token);
        }

        function destroyUserInfo() {
            authToken = undefined;
            isAuthenticated = false;
            $http.defaults.headers.common['Authorization'] = undefined;
            window.localStorage.removeItem(LOCAL_TOKEN);
        }

        function storeUserInfo(token) {
            window.localStorage.setItem(LOCAL_TOKEN, token);
            userInfo(token);
        }

        function userInfo(token) {
            isAuthenticated = true;
            authToken = token;
            $http.defaults.headers.common['Authorization'] = authToken;
        }

        var signin = function (user) {
            return $q(function (resolve, reject) {
                $http.post('/api/authenticate', user).then(function (result) {
                    if(result.data.success){
                        storeUserInfo(result.data.token);
                        resolve(result.data.msg, result.data.success);
                    } else {
                        reject(result.data.msg, result.data.success);
                    }
                })
            })
        };

        

        var signout = function () {
            destroyUserInfo();
        };

        var signup = function (user) {
            return $q(function (resolve, reject) {
                $http.post('/api/signup', user).then(function (result) {
                    if(result.data.success){
                        console.log('jestem w resolve');
                        resolve(result.data.msg);
                    } else {
                        reject(result.data.msg);
                    }
                })
            })
        };

        loadUserInfo();

        var getUserInfo = function () {
            return $q(function (resolve, reject) {
                $http.get('/api/userinfo').then(function (result) {
                    if(result.data.success){
                        resolve(result.data.msg);
                    } else {
                        reject(result.data.msg);
                    }
                })
            })
        };

        return{
            signin: signin,
            signout: signout,
            signup: signup,
            getUserInfo: getUserInfo,
            isAuthenticated: isAuthenticated
        }
    }]);