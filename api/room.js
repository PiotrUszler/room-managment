/**
 * Created by Piotr Uszler on 06.11.2016.
 */
var router = require('express').Router(),
    Room = require('../models/room'),
    Extra = require('../models/extras');

router.post('/findRooms', function (req, res) {
    Room.find({
        reservations: {
            $not: {
                $elemMatch: {
                    from: {$lt: req.body.to},
                    to: {$gt: req.body.from}
                }
            }
        }
    }, function (err, rooms) {
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

module.exports = router;