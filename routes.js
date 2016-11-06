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
router.get('/userinfo', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/userinfo.html'))
});
router.get('/successfulSignup', function (req, res) {
    res.sendFile(path.resolve('angularjs/views/successfulSignup.html'))
});
module.exports = router;