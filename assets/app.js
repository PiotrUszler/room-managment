/**
 * Created by Piotr Uszler on 22.09.2016.
 */
var app = angular.module('app', ['ngRoute', 'ui.router', 'ngCookies']);


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
 * Created by Piotr Uszler on 08.11.2016.
 */
angular.module('app')
    .controller('offerCtrl', function ($scope, $cookies, offerSvc) {
        $scope.offer = {};
        $scope.extras = [];
        $scope.selectedExtras = [];
        var dates = {};
        $scope.dateFrom = '';
        $scope.dateTo = '';
        $scope.roomName = '';

        $scope.showOffer = function () {
            $scope.offer = JSON.parse($cookies.get('room'));
            $scope.extras = getExtras();

            dates = JSON.parse($cookies.get('dates'));
            $scope.dateFrom = datePreetify(new Date(dates.dateFrom));
            $scope.dateTo = datePreetify(new Date(dates.dateTo));

            $scope.roomName = $scope.offer.type;
        };

        var datePreetify = function (date) {
            var day = date.getUTCDate();
            var month = date.getUTCMonth() + 1;
            var year = date.getUTCFullYear();
            return ''+day+'-'+month+'-'+year;
        };

        $scope.addOrRemoveExtra = function (extra) {

            var index = $scope.selectedExtras.indexOf(extra);
            extra.buttonText = extra.buttonToggle ? 'Dodaj +' : 'Usuń -';
            extra.buttonToggle = !extra.buttonToggle;

            if(index == -1){
                $scope.selectedExtras.push(extra);
            } else {
                $scope.selectedExtras.splice(index,1);
            }
        };

        var getExtras = function () {
            offerSvc.getExtras().then(function (extrasData) {
                $scope.extras = extrasData;
                for(var i = 0 ; i < $scope.extras.length; i++){
                    $scope.extras[i].buttonText = 'Dodaj +';
                    $scope.extras[i].buttonToggle = false;;
                }
            });
        };



    });
/**
 * Created by Piotr Uszler on 06.11.2016.
 */
angular.module('app')
    .controller('roomCtrl', function ($q, $cookies, $scope, $window, $location, roomService, offerSvc,$filter) {
        $scope.dateFrom = '';
        $scope.dateTo = '';
        $scope.noRoomsError = false;
        $scope.errorMsg ='';
        $scope.rooms = [];
        $scope.numberOfBeds = 1;


        var setDate = function () {
            var date = new Date();
            console.log(date);
            $scope.dateFrom = date;
            var dateTemp = new Date;
            dateTemp.setDate(dateTemp.getDate()+1);
            $scope.dateTo = dateTemp;
        };

        $scope.init = function () {
            setDate();
            $scope.findRooms();
        };

        $scope.findRooms = function () {//TODO Wyświetlenie errora o braku pokoji o wybranych parametrach używając noRoomsError i ng-Hide
            roomService.getRooms({
                from: $scope.dateFrom.toISOString(),
                to: $scope.dateTo.toISOString(),
                beds: $scope.numberOfBeds
            }).then(function (roomsData) {
                $scope.rooms = roomsData;
            }, function (error) {
                $scope.noRoomsError = true;
                $scope.errorMsg = 'Coś poszło nie tak.'
            });
        };

        $scope.addRoom = function (room) {
            $cookies.put('room', JSON.stringify(room));
            $cookies.put('dates', JSON.stringify({dateFrom: $scope.dateFrom, dateTo: $scope.dateTo}));
            offerSvc.chooseRoom(room);
            $window.location.href='#/offer';
        };

        $scope.test = function () {
            console.log($scope.rooms);
            $scope.findRooms();
        }

    });
/**
 * Created by Piotr Uszler on 07.11.2016.
 */
angular.module('app')
    .filter('uniqueCategories', function () {
        return function (rooms, propertyName) {
            if(angular.isArray(rooms)){
                var result = [];
                var keys = {};
                for(var i = 0; i < rooms.length; i++){
                    var val = rooms[i][propertyName]
                    if(angular.isUndefined(keys[val])){
                        keys[val] = true;
                        result.push(rooms[i]);
                    }
                }
                return result;
            } else {
                return rooms;
            }
        }
    });
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
/**
 * Created by Piotr Uszler on 08.11.2016.
 */
angular.module('app')
    .service('offerSvc', function ($q, $http) {
        var chosenRoom = {};
        var extras = [];

        var chooseRoom = function (room) {
            choosenRoom = room;
        };

        var getRoom = function () {
            return choosenRoom;
        };

        var getExtras = function () {
            return $q(function (resolve, reject) {
                $http.get('/api/getExtras').then(function (result) {
                    if(result.data.success){
                        resolve(result.data.extras);
                    } else {
                        reject(result.data.error);
                    }
                })
            })
        };



        return{
            chooseRoom: chooseRoom,
            getRoom: getRoom,
            getExtras: getExtras,
        };
    });
/**
 * Created by Piotr Uszler on 06.11.2016.
 */
angular.module('app')
    .service('roomService', function ($q, $http) {

        var getRooms = function (data) {
            return $q(function (resolve, reject) {
                $http.post('/api/findRooms', data).then(function (result) {
                    if(result.data.success){
                        console.log('Pobrano pokoje');
                        resolve(result.data.rooms);
                    } else {
                        reject(result.data.error);
                    }
                })
            })
        };

        return{
            getRooms: getRooms
        }
    });