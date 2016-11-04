/**
 * Created by Piotr Uszler on 14.10.2016.
 */

var router = require('express').Router(),
    User = require('../models/user'),
    passport = require('passport'),
    jwt = require('jwt-simple');
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

router.get('/userinfo', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if(token){
        var decoded = jwt.decode(token, 'aH3kx09$s');
        User.findOne({
            email: decoded.email
        }, function (error, user) {
            if(error) throw error;
            if(!user){
                return res.status(403).send({success: false, msg: 'Logowanie nie powiodło się. Nie znaleziono użytkownika.'});
            } else {
                res.json({success: true, msg: 'Witaj w strzeżonym miejscu '+ user.email});
            }
        })
    } else {
        return res.status(403).send({success: false, msg: 'Brak tokena'});
    }
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