/**
 * Created by Piotr Uszler on 22.09.2016.
 */
var Room = require('../models/room'),
    db = require('../db');

var rooms = [
    new Room({
        number: 1,
        type: 'Standard Single',
        beds: 1,
        price: 70,
        imagePath: '/images/standard-single.jpg',
        reservations: [
            {
                from: '2016-11-05',
                to: '2016-11-08'
            },
            {
                from: '2016-11-10',
                to: '2016-11-12'
            }
        ]
    }),
    new Room({
        number: 2,
        type: 'Standard Single',
        beds: 1,
        price: 70,
        imagePath: '/images/standard-single.jpg',
        reservations: [
            {
                from: '2016-11-06',
                to: '2016-11-09'
            },
            {
                from: '2016-11-13',
                to: '2016-11-17'
            }
        ]
    }),
    new Room({
        number: 3,
        type: 'Standard Twin',
        beds: 2,
        price: 95,
        imagePath: '/images/standard-twin.jpg',
        reservations: {

        }
    }),
    new Room({
        number: 4,
        type: 'Family Triple',
        beds: 2,
        price: 140,
        imagePath: '/images/family-triple.jpg',
        reservations: {

        }
    }),
    new Room({
        number: 5,
        type: 'Apartament',
        beds: 2,
        price: 320,
        imagePath: '/images/apartament.jpg',
        reservations: {

        }
    })
];

var done = 0;
for(var i = 0; i < rooms.length; i++){
    rooms[i].save(function () {
        done++;
        if(done == rooms.length)
            exit();
    })
}

var exit = function () {
    db.disconnect();
};