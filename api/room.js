/**
 * Created by Piotr Uszler on 06.11.2016.
 */
var router = require('express').Router(),
    mongoose = require('mongoose'),
    Room = require('../models/room'),
    Extra = require('../models/extras'),
    User = require('../models/user'),
    Voucher = require('../models/voucher'),
    passport = require('passport'),
    jwt = require('jwt-simple');
require('../passport')(passport);

router.post('/findRooms', function (req, res) {
    Room.find({
        $and:[{
            reservations: {
                $not: {
                    $elemMatch: {
                        from: {$lt: req.body.to},
                        to: {$gt: req.body.from}
                    }
                }
            }
        },
        {
            beds: {$gte: req.body.beds}
        }

    ]}, function (err, rooms) {
        if(err) {
            res.json({success: false, error: err})
        } else {
            res.json({success: true, rooms: rooms})
        }
    })
});

router.get('/getExtras', function (req, res) {
    Extra.find({}, function (err, extras) {
        if(err){
            res.json({success: false, error: err})
        } else {
            res.json({success: true, extras: extras})
        }
    });
});

//TODO uporządkować
router.get('/getUserBookings',  passport.authenticate('jwt', {session: false}), function (req, res) {//TODO uporzątkowanie oraz jak starczy czasu przerobienie na Query bazowe zamiast robić większość w JS
    var token = getToken(req.headers);
    if(token) {
        var decoded = jwt.decode(token, 'aH3kx09$s');
    }
    Room.find({
        "reservations.user": decoded.email
    },function (err,result) {
        var rooms = [];

        for(var i = 0; i < result.length; i++){
            rooms.push(result[i]);
        }

        var result = [];
var test = [];
        for(var j = 0; j < rooms.length; j++){
            var flag = false;
            var reservations = [];
            for(var k = 0; k < rooms[j].reservations.length; k++){
                if(rooms[j].reservations[k].user == decoded.email){
                    reservations.push(rooms[j].reservations[k]);
                    flag = true;
                    //console.log(rooms[j].reservations[k]);
                    test.push({_id: rooms[j]._id, number: rooms[j].number, type: rooms[j].type, beds: rooms[j].beds, price: rooms[j].price, imagePath: rooms[j].imagePath, reservations: rooms[j].reservations[k]});
                }
            }
            //if(flag){
              //  rooms[j].reservations = undefined;
                //result.push({room: rooms[j], reservations: reservations});
            //}
        }
        res.json({success:true, bookings: test});
        console.log(test);
        //res.json({success: true, result: result})
    })
});

router.post('/reserve', passport.authenticate('jwt', {session: false}), function (req, res) {//TODO do uporzątkowania i obsługa błędów i
    var token = getToken(req.headers);
    if(token) {
        var decoded = jwt.decode(token, 'aH3kx09$s');
    }
    Room.update(
        {_id: mongoose.Types.ObjectId(req.body.id)},
        {$push: {reservations: {from: req.body.from, to: req.body.to, user: decoded.email, price: req.body.price, extras: req.body.extras}}},function (err, result) {
            if(err)
                res.json({success: false, error: err});
            else
                res.json({success: true});
        }
    )
});

router.post('/test', passport.authenticate('jwt', {session: false}), function (req, res) {
    var query = {email: req.body.email};

    var newName = 'kasztan';
    var token = getToken(req.headers);
    if(token) {
        var decoded = jwt.decode(token, 'aH3kx09$s');
        console.log(decoded);
    }//TODO przniesienie do api auth, pamietac o zmianie tokena na nowy(bo nowe dane do zakodowania)
    console.log(req.body);
    User.findOneAndUpdate({email: decoded.email},{$set: {firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, phoneNumber: req.body.phoneNumber}},{upsert:true},function (err, doc) {
        if(err) res.status(500).send({error: err});
        else return res.send({success: true, msg: 'udało się yupii'});
    })
});
//TODO dodac autentykacje moze
router.post('/cancelBooking', function (req, res) {
    Room.update(
        {_id: mongoose.Types.ObjectId(req.body.room_id)},
        {$pull: {reservations: {_id: mongoose.Types.ObjectId(req.body.booking_id)}}},
        function (err, reslut) {
            if(err)
                res.json({success: false, error: err});
            else
                res.json({success: true});
        }
    )
});

router.get('/getRooms', function (req, res) {
    Room.find({}, function (err ,result) {
        if(err)
            res.json({success: false, error: err});
        else
            res.json({success: true, result: result})
    })
});

router.post('/getRoomBookings', function (req, res) {
    Room.find({_id: mongoose.Types.ObjectId(req.body.room_id)},{"reservations":1,"_id":0},function (err, result) {
        if(err){
            res.json({success: false, error: err})
        } else {
            res.json(result)
        }
    })
});

//TODO w przypadku rejestracji przez admina i braku emaila tworzony user z emailem firstName.lastName.phone, a pozostale dane to firstName, lastName phone i powinno dzialczyci
//i moze dac role jako hmmm unregistered or something i pozniej w miejscach gdzie pobiera sie dane sprawdzac role i zaleznie od niej przypisywac dane  ale naj[ier sprawdzic czy nie istnieje
//juz taki uzytkownik

//TODO jesli req.body.email == undefined to jako user dajemy firstName.lastName.phone (to bedzie unikalny klucz) i no problemo albo moze dac object user: {firstName,lastName, phone}
router.post('/signupAndBook', function (req, res) {
    console.log(req.body.extras);
    var newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: 'haslo123',
        phoneNumber: req.body.number
    });
    newUser.save(function (error) {
        if(error){
            res.json({success: false, msg: error});
        } else{
            Room.update(
                {_id: mongoose.Types.ObjectId(req.body.id)},
                {$push: {reservations: {from: req.body.from, to: req.body.to, user: newUser.email, price: req.body.price, extras: req.body.extras}}},function (err, result) {
                    if(err)
                        res.json({success: false, error: err});
                    else
                        res.json({success: true});
                }
            )
        }
    })
});

router.post('/adminBook', function (req, res) {
    Room.update(
        {_id: mongoose.Types.ObjectId(req.body.id)},
        {$push: {reservations: {from: req.body.from, to: req.body.to, user: req.body.email, price: req.body.price, extras: req.body.extras}}},function (err, result) {
            if(err)
                res.json({success: false, error: err});
            else
                res.json({success: true})

        }
    )
});



router.post('/paid', function (req, res) {
    Room.update(
        {"reservations._id": mongoose.Types.ObjectId(req.body.id)},
        {$set: {"reservations.$.paid": req.body.pay}},function (err, result) {
            if(err)
                res.json({success: false, error: err});
            else
                res.json({success: true})
        }
    )
});
/*
router.post('/saveVouchers', function (req, res) {

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
});
*/
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