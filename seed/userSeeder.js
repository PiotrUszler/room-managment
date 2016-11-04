/**
 * Created by Piotr Uszler on 21.09.2016.
 */
var User = require('../models/user'),
    db = require('../db');

var users = [
    new User({
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan.kowalski@poczta.pl',
        password: '$2a$10$MlqsKwpsNsOakMAMtb/ns.nRgr3A16wPvkCjXKnWkF2h4P3ShUNMG',//haslo123
        phoneNumber: '123456789'
    }),
    new User({
        firstName: 'Mirek',
        lastName: 'Nowak',
        email: 'mirek.nowak@poczta.pl',
        password: '$2a$10$b0xpo/coizAY/B4nFE9qBOukBx4WZ0xyb6TjgwYDUP31OiUqmtYAm',//mirek987
        phoneNumber: '89237492'
    }),
    new User({
        firstName: 'admin',
        lastName: 'admin',
        email: 'admin@poczta.pl',
        password: '$2a$10$tPxrpQKQso4XPSshmYs/reMVunlKg1dQTGYokdpWbHd9d/p3KRtOK',//admin
        phoneNumber: '111111111',
        role: 'admin'
    })
];

var done = 0;
for(var i = 0; i < users.length; i++){
    users[i].save(function (err) {
        done++;
        if(done == users.length)
            exit();
    })
}

var exit = function () {
    db.disconnect();
};