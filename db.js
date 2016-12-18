/**
 * Created by Piotr Uszler on 19.09.2016.
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/room-managment-system', function () {
    console.log('Połączono z db')
});

/*
mongoose.connect('mongodb://Shardo:Piotrek123@ds147985.mlab.com:47985/mytestdb', function () {
    console.log('Połączono z db')
});
*/
module.exports = mongoose;