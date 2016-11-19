/**
 * Created by Piotr Uszler on 19.09.2016.
 */
var express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    passport = require('passport'),
    favicon = require('serve-favicon');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(favicon(__dirname+'/favicon.ico'));

app.use('/api', require('./api/auth'));
app.use('/api', require('./api/room'));
app.use(require('./routes'));

app.listen(process.env.PORT || 3000, function () {
    if(process.env.PORT != undefined)
        console.log('Server działa na procie ' + process.env.PORT);
    else
        console.log('Server działa na procie 3000');
});