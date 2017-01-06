/**
 * Created by Piotr Uszler on 12.12.2016.
 */
var router = require('express').Router(),
    mongoose = require('mongoose'),
    Voucher = require('../models/voucher'),
    jwt = require('jwt-simple'),
    db = require('../db');

router.post('/saveVouchers', function (req, res) {
    for(var i = 0; i < req.body.codes.length; i++){
        var voucher = new Voucher({
            code: req.body.codes[i],
            discount: req.body.discount,
            discountType: req.body.discountType,
            expiryDate: req.body.expiryDate
        });
        //TODO wyslac co cza resem
        voucher.save(function (err, result) {
            if(err){
                console.log("err.code w voucher.save: "+err.code);
            }
        });
    }
});

router.post('/checkVoucher', function (req, res) {
    Voucher.findOne({
        code: req.body.voucherCode
    }, function (err, result) {
        if(result)
            res.json({success: true, voucher: result});
        else if (err)
            res.json({success: false, error: err});
        else
            res.json({success: false, error: 'Nie znaleziono klucza.'})

    })
});

router.post('/useVoucher', function (req, res) {
    Voucher.update({code: req.body.code}, {$set: {used: true}}, function (err, result) {
        if(result.nModified == 1)
            res.json({success: true});
        else if(err)
            res.json({success: false, error: err});
        else
            res.json({success: false, error: 'Nie znaleziono klucza.'})
    })
});


module.exports = router;