/**
 * Created by Piotr Uszler on 19.09.2016.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/room-managment-system', function () {
    console.log('Połączono z db')
});
module.exports = mongoose;