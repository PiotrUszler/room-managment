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
            .state('rooms',{
                url: '/rooms',
                templateUrl: 'rooms'
            })
            .state('restaurant',{
                url: '/restaurant',
                templateUrl: 'restaurant'
            })
            .state('contact',{
                url: '/contact',
                templateUrl: 'contact'
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
            })
            .state('managment',{
                url: '/managment',
                templateUrl: 'managment'
            })
            .state('managment.rooms',{
                url: '/managment-rooms',
                templateUrl: 'managment-rooms'
            })
            .state('managment.users',{
                url: '/managment-users',
                templateUrl: 'managment-users'
            })
            .state('managment.vouchers',{
                url: '/managment-vouchers',
                templateUrl: 'managment-vouchers'
            })
            .state('managment-bookings', {
                url: '/managment-bookings',
                templateUrl: '/managment-bookings'
            })
            .state('managment.room-details',{
                url: '/managment-room-details',
                templateUrl: 'managment-room-details',
                controller: 'roomCtrl',
                params:{
                    obj: null
                }
            })
            .state('admin-booking',{
                url: '/admin-booking',
                templateUrl: 'admin-booking'
            });

        $urlRouterProvider.otherwise('/main')
    })
    .run(['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]);


