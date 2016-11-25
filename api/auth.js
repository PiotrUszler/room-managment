/**
 * Created by Piotr Uszler on 14.10.2016.
 */

var router = require('express').Router(),
    User = require('../models/user'),
    passport = require('passport'),
    jwt = require('jwt-simple'),
    db = require('../db');
require('../passport')(passport);


router.post('/signup', function (req, res) {
    var newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.number
    });
    newUser.save(function (error) {
        if(error){
            res.json({success: false, msg: error});
        } else{
            res.json({success: true, msg: 'Swtworzono użytkownika.'})

        }
    })
});

router.post('/authenticate', function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (error, user) {
        if(error) throw err;

        if(!user){
            return res.status(403).send({success: false, msg: 'Logowanie nie powiodło się. Nie znaleziono użytkownika.'});
        } else {
            user.comparePassword(req.body.password, function (error, isMatching) {
                if(isMatching && !error){
                    var token = jwt.encode(user, 'aH3kx09$s');
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.json({success: false, msg: 'Logowanie nie powiodło się. Nie poprawne hasło.', err: req.body.password});
                }
            });
        }
    })
});

router.post('/getNewToken', function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if(err) throw error;
        if(!user){
            console.log('new token brak uzy');
             res.status(403).send({success: false, msg: 'Logowanie nie powiodło się. Nie znaleziono użytkownika.'});
        } else {
            console.log('new token new token');
            var token = jwt.encode(user, 'aH3kx09$s');
            res.json({success: true, token: 'JWT ' + token});
        }
    })
});

router.get('/userinfo', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if(token){
        var decoded = jwt.decode(token, 'aH3kx09$s');
        User.findOne({
            email: decoded.email
        }, function (error, user) {
            if(error) throw error;
            if(!user){
                res.status(403).send({success: false, msg: 'Logowanie nie powiodło się. Nie znaleziono użytkownika.'});
            } else {
                res.json({success: true, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phoneNumber, role: user.role});
            }
        })
    } else {
         res.status(403).send({success: false, msg: 'Brak tokena'});
    }
});

router.post('/getUserInfo', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if(token){
        var decoded = jwt.decode(token, 'aH3kx09$s');
        if(decoded.role == 'admin'){
            User.findOne({
                email: req.body.email
            }, function (error, user) {
                if(error) throw error;
                if(user)
                    res.json( {firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phoneNumber});
                else
                    res.json({error: 'User not found'})
            })
        }
    }
});

router.post('/change-user-details', function (req, res) {
    User.update(
        {email: req.body.email},
        {$set: {firstName: req.body.firstName}},function (err, result) {
            if(err)
                res.json({success: false, error: err});
            else
                res.json({success: true});
        }
    )
});



router.post('/change-password', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if(token) {
        var decoded = jwt.decode(token, 'aH3kx09$s');
    }
    User.findOne({email: decoded.email}, function (error, user) {
        if(error) throw error;
        if(!user){
            res.status(403).send({success: false, msg: 'Nie znaleziono użytkownika'})
        } else{
            //console.log(user);
            user.changePass(req.body.oldPass, req.body.newPass, function(err, result){
                if(result){
                    res.json({success: true, msg: 'udało się?'})
                } else {
                    res.json({success: false, error: err});
                }
            })
        }
    })
});

getToken = function (headers) {
    if(headers && headers.authorization){
        var parts = headers.authorization.split(' ');
        if(parts.length == 2)
            return parts[1];
        else
            return null;
    } else {
        return null;
    }
};

module.exports = router;