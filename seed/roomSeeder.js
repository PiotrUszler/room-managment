/**
 * Created by Piotr Uszler on 22.09.2016.
 */
var Room = require('../models/room'),
    db = require('../db');

var rooms = [
    new Room({
        number: 1,
        type: 'Brązowy',
        beds: 2,
        price: 70,
        reservations: {
            
        }
    })
];