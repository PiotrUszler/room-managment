/**
 * Created by Piotr Uszler on 12.12.2016.
 */
angular.module('app')
    .service('voucherService', function ($q, $http) {
        
        var saveVouchers = function (vouchers) {
            console.log(vouchers);
            return $q(function (resolve, reject) {
                $http.post('/api/saveVouchers', vouchers).then(function(result){
                    if(result.data.success)
                        resolve(result.data.msg);
                    else
                        reject(result.data.msg);
                },function (result) {
                    reject(result.data.msg);
                })
            })
        };

        return {
            saveVouchers: saveVouchers
        }
    });