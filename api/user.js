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

router.post('/adminChangeUserDetails', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if(token) {
        var decoded = jwt.decode(token, 'aH3kx09$s');
    }
    if(decoded.role == 'admin'){
        User.findOneAndUpdate({email: req.body.email},{$set: {firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, phoneNumber: req.body.phoneNumber}},{upsert:true},function (err, doc) {
            if(err) res.status(500).send({error: err});
            else return res.send({success: true});
        })
    } else {
        res.send({success: false, error: 'Brak uprawnień admina'})
    }


});
module.exports = router;