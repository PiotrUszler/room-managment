/**
 * Created by Piotr Uszler on 21.09.2016.
 */
var db = require('../db');

var schema = db.Schema({
   number: {
       type: Number,
       required: true,
       unique: true
   },
   type: {
       type: String,
       required: true
    },
    beds: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imagePath:{
        type: String
    },
    reservations: [
        {
            from: String,
            to: String
        }
    ]
});

module.exports = db.model('Room', schema);