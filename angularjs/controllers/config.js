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
            .when('/offer',{
                templateUrl: '/offer'
            })
            .when('/confirmation',{
                templateUrl: '/confirmation'
            })
            .otherwise('/');
    });


