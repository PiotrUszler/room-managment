/**
 * Created by Piotr Uszler on 08.11.2016.
 */

var Extra = require('../models/extras'),
    db = require('../db');

var extras = [
    new Extra({
        name: 'Obiadokolacja',
        price: 30,
        unit: '/noc'
    }),
    new Extra({
        name: 'Dostawka dla dziecka',
        price: 50,
        unit: '/noc'
    }),
    new Extra({
        name: 'Parking',
        price: 15,
        unit: '/noc'
    }),
    new Extra({
        name: 'Bukiet kwiatów',
        price: 35,
        unit: '/szt'
    })
];

var done = 0;
for(var i = 0; i < extras.length; i++){
    extras[i].save(function () {
        done++;
        if(done == extras.length)
            exit();
    })
}

var exit = function () {
    db.disconnect();
};