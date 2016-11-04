/**
 * Created by Piotr Uszler on 14.10.2016.
 */
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    db = require('./db'),
    User = require('./models/user');

module.exports = function (passport) {
    var options = {};
    options.secretOrKey = 'aH3kx09$s';
    options.jwtFromRequest = ExtractJwt.fromAuthHeader();
    passport.use(new JwtStrategy(options, function (jwt_payload, done) {
        User.findOne({id: jwt_payload.id}, function (error, user) {
            if(error)
                return done(error, false);
            if(user)
                done(null, user);
            else
                done(null, false);
        })
    }))
};