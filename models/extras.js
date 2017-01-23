/**
 * Created by Piotr Uszler on 08.11.2016.
 */
var db = require('../db');

var schema = db.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    price:{
        type: Number,
        required: true
    },
    unit:{
        type: String,
        required: true
    }
});

module.exports = db.model('Extra', schema);