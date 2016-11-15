/**
 * Created by Piotr Uszler on 22.09.2016.
 */
var express = require('express'),
    router = express.Router(),
    path = require('path');

//Static files
router.use(express.static(__dirname+'/assets'));
router.use(express.static(__dirname+'/css'));

router.get('/', function (req, res) {
    res.sendFile(path.resolve('angularjs/app.html'))
});
router.get('/main', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/main.html'))
});
router.get('/signin', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/signin.html'))
});
router.get('/signup', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/signup.html'))
});
router.get('/navbar', function (req, res) {
    res.sendFile(path.resolve('angularjs/components/navbar/navigation.html'))
});
router.get('/offer', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/offer.html'))
});
router.get('/account', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/account.html'))
});
router.get('/successfulSignup', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/successfulSignup.html'))
});
router.get('/confirmation', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/confirmation.html'))
});
router.get('/successfulBooking', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/successfulBooking.html'))
});
router.get('/details', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/details.html'))
});
router.get('/bookings', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/bookings.html'))
});
module.exports = router;