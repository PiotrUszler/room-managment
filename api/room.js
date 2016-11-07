/**
 * Created by Piotr Uszler on 06.11.2016.
 */
var router = require('express').Router(),
    Room = require('../models/room');

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

module.exports = router;