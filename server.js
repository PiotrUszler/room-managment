/**
 * Created by Piotr Uszler on 19.09.2016.
 */
var express = require('express'),
    app = express();

app.listen(process.env.PORT || 3000, function () {
    if(process.env.PORT != undefined)
        console.log('Server działa na procie ' + process.env.PORT);
    else
        console.log('Server działa na procie 3000');
});