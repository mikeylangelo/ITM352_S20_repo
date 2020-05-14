var express = require('express');
var app = express();

var myParser = require("body-parser")
var cookieParser = require('cookie-parser');
app.use(cookieParser());

var session = require('express-session');
app.use(session({secret:"ITM 352"}));

app.use(myParser.urlencoded({ extended: true }));

//Cookie route that may have been set
app.get('/set_cookie', function (request, response){
    console.log('GET to /set_cookie')
    var my_name = 'Mikey';
    response.cookie('your_name', my_name, {maxAge: 5000}).send('cookie set'); //Sets name = express
});

app.get('/use_cookie', function (request, response){
    console.log('GET to /use_cookie', request.cookies);
    var the_name = request.cookies.your_name;
    response.send('Welcome to the cookie page ' + the_name); 
});

app.get('/use_session', function (request, response){
    console.log('GET to /use_session', request.session.id);
    var the_sess_id = request.session.id;
    response.send('Welcome your session ID is ' + the_sess_id); 
});


app.listen(8080, () => console.log(`Listening on port 8080`));