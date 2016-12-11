/**
 * Created by Piotr Uszler on 11.12.2016.
 */
angular.module('app')
.controller('voucherCtrl', function ($scope) {


    //Ile, czy wielokrotnego uzytku, data wygaśnięcia
    $scope.generateVouchers = function () {
        var vouchers = [];
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var discount = '';

        while(vouchers.length < $scope.numberOfVouchers){
            var voucher = "";
            for(var i = 0; i < 4; i++){
                for(var j = 0; j < 5; j++)
                    voucher += possible.charAt(Math.floor(Math.random() * possible.length));
                if(i != 3 )voucher += '-';

            }
            vouchers.push(voucher);
        }

        //TODO dalsza praca nad voucherami, pomyśleć jak to przechowywać w bazie czy jako tekst np. 20% czy oddzielnie number: 20, discountType: '%"
        var last = $scope.discount.charAt($scope.discount.length-1);
        if(last === '%')
            discount = $scope;
        else if(last === 'ł' && $scope.discount.charAt($scope.discount.length-2) === 'z')
            console.log(last);
        $scope.generatedVouchers = vouchers;
    }
});