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
    .directive('userInfo', function () {
        return{
            template: '<p>sialala</p>'
        }
    })

    .directive('vouchercheck', function (voucherService) {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, mCtrl) {
                function validation(voucher) {
                    if(voucher.length == 23){
                        if(voucher.charAt(5) == '-' && voucher.charAt(11) && voucher.charAt(17)) {
                            mCtrl.$setValidity('validVoucher', true);
                        } else {
                            mCtrl.$setValidity('validVoucher', false)
                        }
                    } else {
                        mCtrl.$setValidity('validVoucher', false)
                    }
                    return voucher;
                }
                mCtrl.$parsers.push(validation);
            }
        }
    });

