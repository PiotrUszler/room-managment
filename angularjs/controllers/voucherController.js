/**
 * Created by Piotr Uszler on 11.12.2016.
 */
angular.module('app')
.controller('voucherCtrl', function ($scope, voucherService) {


    //Ile, czy wielokrotnego uzytku, data wygaśnięcia
    $scope.generateVouchers = function () {
        $scope.vouchers = {
            codes: []
        };
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var expiryDate = $scope.voucherExpiryDate;
        if(expiryDate < new Date()){
            $scope.voucherError = 'Data wygaśnięcia nie może być z przeszłości';//TODO poprawić komunikat
            $scope.vouchersGenerated = false;
            $scope.generatedVouchers = {};
        }
        else {
            $scope.voucherError = undefined;
            while($scope.vouchers.codes.length < $scope.numberOfVouchers){
                var voucher = "";
                for(var i = 0; i < 4; i++){
                    for(var j = 0; j < 5; j++)
                        voucher += possible.charAt(Math.floor(Math.random() * possible.length));
                    if(i != 3 )voucher += '-';

                }
                $scope.vouchers.codes.push(voucher);
            }

            //TODO dalsza praca nad voucherami, pomyśleć jak to przechowywać w bazie czy jako tekst np. 20% czy oddzielnie number: 20, discountType: '%"
            var last = $scope.discount.charAt($scope.discount.length-1);
            if(last === '%')
                $scope.vouchers.discountType = '%';
            else if(last === 'ł' && $scope.discount.charAt($scope.discount.length-2) === 'z')
                $scope.vouchers.discountType = 'zl';

            $scope.vouchers.discount = convertToNumber($scope.discount);
            $scope.vouchers.type = $scope.voucherType;//0 jednoktronego, 1 wielo
            $scope.vouchers.expiryDate = expiryDate;
            $scope.generatedVouchers = $scope.vouchers.codes;
            $scope.vouchersGenerated = true;
        }
    };
    
    $scope.saveVouchers = function () {
        console.log($scope.vouchers);
        voucherService.saveVouchers($scope.vouchers).then(function (result) {
            console.log(result)
        });
    };

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function convertToNumber(n) {
        var discount = '';
        for(var i = 0; i < n.length; i++){
            if(isNumeric(n.charAt(i))){
                discount += n.charAt(i);
            } else {
                discount = Number(discount);
                return discount;
            }
        }
        discount = Number(discount);
        return discount;
    }
});