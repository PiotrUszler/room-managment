/**
 * Created by Piotr Uszler on 22.09.2016.
 */
var app = angular.module('app', ['ngRoute', 'ui.router']);


/**
 * Created by Piotr Uszler on 11.10.2016.
 */
angular.module('app')
    .factory('authInterceptor', function ($window) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if($window.localStorage.token){
                    config.headers['Authorization'] = $window.localStorage.token;
                }

                return config;
            }
        }
    })

    .config(function ($routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
        $routeProvider
            .when('/', {
                templateUrl: '/main'
            })
            .when('/signup', {
                templateUrl: '/signup'
            })
            .when('/signin', {
            templateUrl: '/signin'
            })
            .when('/userinfo', {
                templateUrl: '/userinfo'
            })
            .when('/successfulSignup',{
                templateUrl: '/successfulSignup'
            })
            .otherwise('/');
    });



/**
 * Created by Piotr Uszler on 14.10.2016.
 */
angular.module('app')
    .controller('authCtrl', function ($q, $scope, $window, $location, $route, $rootScope, AuthService) {


        $scope.regex = '(\\+[0-9]\\d{1})*(\\s)*([0-9]\\d{2})(\\s*)([0-9]\\d{2})(\\s*)([0-9]\\d{2})';

        $scope.submitError = false;
        $scope.errorMessage = '';

        $rootScope.isLoggedIn = function (){
            return AuthService.isAuthenticated;
        };

        $scope.signin = function () {
            console.log('login');
            AuthService.signin($scope.user).then(function (msg, success) {
                $rootScope.isLogedIn = true;
                $window.location.href='#/';
                $window.location.reload();
                console.log(msg);
            })
        };

        $scope.signout = function () {
            AuthService.signout();
            $rootScope.isLogedIn = false;
            $window.location.reload();
            console.log('logout');
        };

        $scope.getUserInfo = function () {
            AuthService.getUserInfo().then(function (msg) {
                console.log(msg);
                $scope.userinfo = msg;
            })
        };

        $scope.submitForm = function (isValid) {
            if(isValid){
                AuthService.signup($scope.user).then(function (data) {
                    console.log('Pomyślnie zarejestrowano');
                    $scope.submitError = false;
                    $window.location.href='#/successfulSignup';
                }, function (data) {
                    console.log(data);
                    
                    switch(data.code){
                        case 11000:
                            $scope.submitError = true;
                            $scope.errorMessage = 'Wybrany email jest już zarejestrowany. Proszę wybrać inny.';
                            break;
                        default:
                            $scope.submitError = true;
                            $scope.errorMessage = 'Upss coś poszło nie tak. Proszę spróbować później.';
                    }
                });
            } else {
                $scope.submitError = true;
                $scope.errorMessage = 'Upss coś poszło nie tak. Proszę spróbować później.';
            }
        };

        $scope.$watch('submitError', function (errorMessage) {
            console.log(errorMessage)
        })

    });
angular.module('app')
    .directive('compareTo', function () {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    })


/**
 * Created by Piotr Uszler on 11.10.2016.
 */
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