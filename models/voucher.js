/**
 * Created by Piotr Uszler on 12.12.2016.
 */
var db = require('../db');

var schema = db.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true
    },
    discountType: {
        type: String,
        required: true
    },
    type: { //0 Jednokrotnego użytku, 1 wielokrotnego
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    }
});

module.exports = db.model('Voucher', schema);
