/**
 * Created by Piotr Uszler on 12.12.2016.
 */
var router = require('express').Router(),
    mongoose = require('mongoose'),
    Voucher = require('../models/voucher'),
    db = require('../db');


router.post('/saveVouchers', function (req, res) {
    /*
    for(var i = 0; i < req.body.codes.length; i++){
        var voucher = {
            codes: req.body.codes[i],
            discount: req.body.discount,
            discountType: req.body.discountType,
            type: req.body.type,
            expiryDate: req.body.expiryDate
        };
        Voucher.insert(function (err, result) {
           if(err)
              res.json({success: false, msg: err})
        });

    }
    res.json({success: true, msg: 'Pomyślnie zapisano.'})
*/
    var voucher = {
        codes: req.body.codes[0],
        discount: req.body.discount,
        discountType: req.body.discountType,
        type: req.body.type,
        expiryDate: req.body.expiryDate
    };
    voucher.save(function (err, doc) {
        if(err)
            res.json({'success': false})
        else{
            res.json({'success': true})
        }
    })
});


module.exports = router;