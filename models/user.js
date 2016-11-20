/**
 * Created by Piotr Uszler on 21.09.2016.
 */
var db = require('../db'),
    bcrypt = require('bcrypt');

var schema = db.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    phoneNumber:{
      type: String,
      required: false
    },
    role: {
        type: String,
        default: 'user'
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    }

});

schema.pre('save', function (next) {
    var user = this;
    if(this.isNew || this.isModified('password')){
        bcrypt.genSalt(10, function (err, salt) {
            if(err) {return next(err)}
            bcrypt.hash(user.password, salt, function (err, hash) {
                if(err) {return next(err)}
                user.password = hash;
                next();
            })
        })
    } else {
        return next();
    }
});
/*
schema.post('update', function (next) {
    bcrypt.genSalt(10, function (err, salt) {
        if(err) return next(err);
        bcrypt.hash(this.password, salt, function (err, hash) {
            if(err) return next(err);
            console.log(this);
            this.password = hash;
            next();
        });
    });
});
*/
schema.methods.changePass = function (pass, newPass, cb) {
    var user = this;
    console.log('stare haslo: '+user.password);
    //user.password = newPass;
    console.log('nowe haslo: '+ user.password);
    bcrypt.compare(pass, this.password, function (err, matching) {
        if(err) return cb(err);
        if(matching){
            user.password = newPass;
            user.save();
            cb(null,true);
        } else {
            cb('hasła nie pasują', false);
        }
    });


/*
    bcrypt.genSalt(10, function (err, salt) {
        if(err) {return cb(err)}
        bcrypt.hash(user.password, salt, function (err, hash) {
            if(err) {return cb(err)}
            user.password = hash;
            console.log('haslo po hashu: '+user.password);
            user.save();
            cb(null, true);
        })
    })
*/
};

schema.methods.comparePassword = function (pass, cb) {
    bcrypt.compare(pass, this.password, function (err, matching) {
        if(err) {return cb(err)}
        cb(null, matching);
    })
};

module.exports = db.model('User', schema);