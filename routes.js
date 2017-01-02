/**
 * Created by Piotr Uszler on 22.09.2016.
 */
var express = require('express'),
    router = express.Router(),
    path = require('path');

//Static files
router.use(express.static(__dirname+'/assets'));

//router.use(express.static(__dirname+'/css'));

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
router.get('/footer', function (req, res) {
    res.sendFile(path.resolve('angularjs/components/footer.html'))
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
router.get('/changePassword', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/changePassword.html'))
});
router.get('/managment', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/managment.html'))
});
router.get('/managment-bookings', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/managment-bookings.html'))
});
router.get('/rooms', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/rooms.html'))
});
router.get('/restaurant', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/restaurant.html'))
});
router.get('/contact', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/contact.html'))
});
router.get('/test', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/test.html'))
});
module.exports = router;