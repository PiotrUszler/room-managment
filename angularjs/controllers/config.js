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

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home',{
                url: '/main',
                controller: 'roomCtrl',
                templateUrl: 'main'
            })
            .state('offer',{
                url: '/offer',
                controller: 'offerCtrl',
                templateUrl: 'offer'
            })
            .state('confirmation',{
                url: '/confirmation',
                templateUrl: 'confirmation'
            })
            .state('successfulBooking',{
                url: '/successfulBooking',
                templateUrl: 'successfulBooking'
            })
            .state('successfulSignup',{
                url: '/successfulSignup',
                templateUrl: 'successfulSignup'
            })
            .state('account',{
                url: '/account',
                templateUrl: 'account'
            })
            .state('signin',{
                url: '/signin',
                templateUrl: 'signin'
            })
            .state('signup',{
                url: '/signup',
                templateUrl: 'signup'
            })
            .state('account.bookings',{
                url: '/bookings',
                templateUrl: 'bookings'
            })
            .state('account.details',{
                url: '/details',
                templateUrl: 'details'
            })
            .state('account.changePassword',{
                url: '/changePassword',
                templateUrl: 'changePassword'
            });
        $urlRouterProvider.otherwise('/main')
    })
    .run(['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]);
    /*
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
            .when('/successfulBooking',{
                templateUrl: '/successfulBooking'
            })
            .otherwise('/');
    });
*/

