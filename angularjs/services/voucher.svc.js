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

        var checkVoucher = function (voucher) {
            return $q(function (resolve, reject) {
                $http.post('/api/checkVoucher', {voucherCode: voucher}).then(function (result) {
                    if(result.data.success && (new Date(result.data.voucher.expiryDate) < new Date())){
                        reject('Termin miną');
                    }
                    else if(result.data.success && result.data.voucher.used){
                        reject('Kod został już wykożystany');
                    }
                    else if(result.data.success && !result.data.voucher.used){
                        resolve(result.data.voucher);
                    }
                    else{
                        reject(result.data.error);
                    }
                })
            })
        };

        var useVoucher = function (voucher) {
            return $q(function (resolve, reject) {
                $http.post('/api/useVoucher', {code: voucher}).then(function (result) {
                    if(result.data.success)
                        resolve('Klucz wykorzystany.');
                    else
                        reject(result.data.error)
                })
            })
        };

        return {
            saveVouchers: saveVouchers,
            checkVoucher: checkVoucher,
            useVoucher: useVoucher
        }
    });