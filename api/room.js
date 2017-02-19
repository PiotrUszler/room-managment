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

router.get('/getUserBookings',  passport.authenticate('jwt', {session: false}), function (req, res) {
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
        }
        res.json({success:true, bookings: test});
        console.log(test);
        //res.json({success: true, result: result})
    })
});

router.post('/reserve', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if(token) {
        var decoded = jwt.decode(token, 'aH3kx09$s');
    }
    console.log("id:"+req.body.id+", from: "+ req.body.from+', to: '+req.body.to+", email: "+decoded.email+', price: '+req.body.price+", extras: "+req.body.extras);
    Room.update(
        {_id: mongoose.Types.ObjectId(req.body.id)},
        {$push: {reservations: {from: req.body.from, to: req.body.to, user: decoded.email, price: req.body.price, extras: req.body.extras}}},function (err, result) {
            if(err)
                res.json({success: false, error: err});
            else
                res.json({success: true, result: result});
        }
    )
});

router.post('/changeUserDetails', passport.authenticate('jwt', {session: false}), function (req, res) {
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
    console.log("id:"+req.body.id+", from: "+ req.body.from+', to: '+req.body.to+", email: "+req.body.email.email+', price: '+req.body.price+", extras: "+req.body.extras);
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

router.post('/getRoomDetails', function (req, res) {
    Room.find({_id: mongoose.Types.ObjectId(req.body.id)},{reservations: 0},function (err, result) {
        if(err) res.json({success: false, error: err});
        else res.json({success: true, roomDetails: result})
    })
});

router.post('/changeRoomDetails', function (req, res) {
    Room.update(
        {_id: mongoose.Types.ObjectId(req.body.id)},
        {$set: {number: req.body.number, type: req.body.type, beds: req.body.beds, price: req.body.price, description: req.body.description}}
        ,function (err, result) {
            if(err){
                res.json({success: false, error: err});
            } else {
                res.json({success: true, result: result})
            }
        }
    )
});


router.post('/changeExtraDetails', function (req, res) {
    Extra.update(
        {_id: mongoose.Types.ObjectId(req.body.id)},
        {$set: {name: req.body.name, price: req.body.price, unit: req.body.unit}}
        ,function (err, result) {
            if(err){
                res.json({success: false, error: err});
            } else {
                res.json({success: true, result: result})
            }
        }
    )
});

router.post('/createExtra', function (req, res) {
    var extra = new Extra({
        name: req.body.name, price: req.body.price, unit: req.body.unit
    });
    extra.save(function (err) {
        if(err) res.json({error: err});
        else res.json({success: true, msg: 'Dodano nowy dodatek.'})

    })
});

router.post('/deleteExtra', function (req, res) {
    Extra.remove({_id: mongoose.Types.ObjectId(req.body.id)},function (err, result) {
        if(err){
            res.josn({error: err})
        } else {
            res.json({result: result})
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