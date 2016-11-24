/**
 * Created by Piotr Uszler on 06.11.2016.
 */
var router = require('express').Router(),
    mongoose = require('mongoose'),
    Room = require('../models/room'),
    Extra = require('../models/extras'),
    User = require('../models/user'),
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
        },{
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