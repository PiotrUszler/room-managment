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
            type: req.body.type,
            expiryDate: req.body.expiryDate
        });
        //TODO wyslac co cza resem
        voucher.save(function (err, result) {
            if(err)
                console.log(err);
            else
                console.log(result);
        })
    }
});


module.exports = router;