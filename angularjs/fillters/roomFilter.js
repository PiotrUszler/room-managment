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