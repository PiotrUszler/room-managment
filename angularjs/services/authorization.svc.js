angular.module('app')
    .service('AuthService', ['$http', '$q', function ($http, $q) {
        var LOCAL_TOKEN = 'token';
        var isAuthenticated = false;
        var authToken;

        function loadUserInfo() {
            var token = window.localStorage.getItem(LOCAL_TOKEN);
            if(token){
                userInfo(token);

            }
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
                        resolve({firstName: result.data.firstName, lastName: result.data.lastName, email: result.data.email, phone: result.data.phone, role: result.data.role});
                    } else {
                        reject(result.data.msg);
                    }
                })
            })
        };

        var getUserBookings = function () {//TODO poprawić razem z api żeby dawało success
            return $q(function (resolve, reject) {
                $http.get('/api/getUserBookings').then(function (result) {
                    resolve(result.data)
                })
            })
        };
        
        var changeUserDetails = function (newDetails) {
            return $q(function (resolve, reject) {
                $http.post('/api/changeUserDetails', newDetails).then(function (result) {
                    if(result.data.success){
                        $http.post('/api/getNewToken', {email: newDetails.email}).then(function (result2) {
                            if(result2.data.success){
                                storeUserInfo(result2.data.token);
                                loadUserInfo();
                            } else {
                            }
                        });
                        resolve({success: true, msg: "Pomyślnie zmieniono dane"})
                    } else {
                        reject({success: false, msg: "coś poszło nie tak"});
                    }
                })
            })
        };

        var changePassword = function (oldPass, newPass) {
            return $q(function (resolve, reject) {
                $http.post('/api/change-password', {oldPass: oldPass, newPass: newPass}).then(function (result) {
                    if(result.data.success)
                        resolve({msg: 'pomyślnie zmieniono haslo'});
                    else{
                        reject({msg: result.data.error})
                    }
                })
            })
        };

        var getUserRole = function () {
            return $q(function (resolve, reject) {
                $http.get('/api/userinfo').then(function (result) {
                    if(result.data.success){
                        resolve({role: result.data.role});
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
            getUserBookings: getUserBookings,
            changeUserDetails: changeUserDetails,
            changePassword: changePassword,
            getUserRole: getUserRole,
            isAuthenticated: isAuthenticated
        }
    }]);