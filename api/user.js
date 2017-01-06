/**
 * Created by Piotr Uszler on 06.01.2017.
 */
var router = require('express').Router(),
    User = require('../models/user'),
    passport = require('passport'),
    jwt = require('jwt-simple'),
    db = require('../db');
require('../passport')(passport);

router.get('/getAllUsers', function (req, res) {
    User.find({}, {email:1, firstName: 1, lastName: 1, role: 1, phoneNumber: 1},function (err, result) {
        if(err)
            res.json({success: false, msg: err});
        else
            res.json(result);
    })
});

router.get('/getUsersEmails', function (req, res) {
    User.find({}, {email:1},function (err, result) {
        if(err)
            res.json({success: false, msg: err});
        else
            res.json(result);
    })
});
module.exports = router;