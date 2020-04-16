/*
Based on Assignment 1 examples.
*/

var express = require('express'); //Load express for handling HTTP requests.

var app = express();

var fs = require('fs'); //

app.post("/display.html",function (request, response,){
    response.send('Thanks!');
});

app.post("/process_purchase", function (request, response,){
    display
});

app.use(express.static('./public')); //

app.listen(8080, () => console.log(`Listening...`));