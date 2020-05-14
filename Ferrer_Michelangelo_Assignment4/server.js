var express = require('express'); //Load express for handling HTTP requests
var app = express();
var bodyParser = require('body-parser'); //Load bodyParser for parsing any data that passes through the server
app.use(bodyParser());
var fs = require('fs'); //Load file system
var qs = require('querystring'); //Load query string module

//Assign JSON files to a variable
var udata = './userdata.json';

//Get raw data files
var unparseduserdata = fs.readFileSync(udata, 'utf-8');

//Parse the raw data as JSON files
var userdata = JSON.parse(unparseduserdata);

//Read the templates and assign to variable
var invoice_contents = fs.readFileSync('./public/invoice.html', 'utf8');
var display_contents = fs.readFileSync('./public/display.html', 'utf8');

//Variable for all input data on display
var user_quantities;

//Indicate any requests coming in from the server
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

/* 
The structure for the display and invoice generationwas based on the MVC Assignment 1 example from Professor Port.
We use the server to host the data and ask the public directory for the files
such as the display.html and invoice.html which contains the layout for the functions
which inputs the data the server has on to the static files.
*/

/*
The next five posts are made to handle whichever option the user chooses from the index. Data is loaded
from the specific option they choose from the info file. It will then assign a variable to those arrays.
The posts will then redirect to the display which changes the data depending on which option they choose.
Their are different arrays for every type of option in the product_data.js file
*/

app.post("/bouquet", function (request, response) {
    var bouquet_data = require('./public/info/bouquet_data.js');
    var products = bouquet_data.products;
    response.redirect('display.html');
});

app.post("/seed", function (request, response) {
    var seed_data = require('./public/info/seed_data.js');
    var products = seed_data.products;
    response.redirect('display.html');
});

app.post("/soil", function (request, response) {
    var soil_data = require('./public/info/soil_data.js');
    var products = soil_data.products;
    response.redirect('display.html');
});

app.post("/accessory", function (request, response) {
    var accessory_data = require('./public/info/accessory_data.js');
    var products = accessory_data.products;
    response.redirect('display.html');
});

app.get("/display.html", function (request, response, ) {
     //Evaluates the display_contents variable which contains a function that creates dislpay page
     response.send(eval('`' + display_contents + '`'));
});

app.post("/display.html", function (request, response, ) { //Handles all POST requests
    let POST = request.body; //Request the POST data from body
    user_quantities = POST; //Assign POST to variable

    //Object for errors
    var errs_array = []; //Assume no errors initially

    for (i = 0; i < products.length; i++) {
        p = POST[`quantity${i}`]
        console.log(p)

        //If it is not a number or is negative, redirect to an error page.  
        if (p < 0) {
            errs_array[0] = 'No_negative_values!';
        }
        else if (Number(p) != p) {
            errs_array[0] = 'No_letters_or_special_characters!';
        }
    }

    //Check if err_array is greater than 0, if there is send to error
    if (errs_array.length > 0) {
        var q_str = qs.stringify(errs_array);
        response.redirect(`error.html?${q_str}`);
    }
    //Quantities are okay. Redirect to login
    else {
        response.redirect(`login.html`);
    }
});

/* 
Login and register were taken from Lab 14 completed by me. I also had
some help from Professor Port during class
*/

app.post("/login.html", function (request, response) {
    //Object for errors
    var errs_array = []; //Assume no errors initially

    // Assign variable to input data
    var input_username = request.body.username;
    var input_password = request.body.password;

    // Check if the type of data in input username is defined in user_data.json file
    if (typeof userdata[input_username] != 'undefined') {
        var user_info = userdata[input_username];
        // Succesful login. Match password with username and generate invoice
        if (user_info["password"] == input_password) {
            response.send(eval('`' + invoice_contents + '`'));
        }

        // If the password and username do not match redirect to error
        else {
            errs_array[0] = 'Incorrect_username_or_password.'
            var q_str = qs.stringify(errs_array);
            response.redirect(`error.html?${q_str}`);
        }

        // If the username does not exist
    }
    else {
        errs_array[0] = 'Username_does_not_exist._Please_register!'
        var q_str = qs.stringify(errs_array);
        response.redirect(`error.html?${q_str}`);
    }
});

app.post("/register.html", function (request, response) {
    //Object for errors
    var errs_array = []; //Assume no errors initially

    //Error if fields are left empty
    if ((request.body.username == '') || (request.body.name == '') || (request.body.password == '') || (request.body.repeat_password == '')
    || (request.body.email == '')) {
        errs_array[0] = 'You_have_left_areas_blank!'
    }

    //Check if username exists, if so generate error
    if (userdata[request.body.username] != undefined){
        errs_array[0] = 'Username_taken!'
    }

     //Error if passwords don't match
    if(request.body.password != request.body.repeat_password){
        errs_array[0] = 'Your_passwords_do_not_match!'
    }

    //Check for succesful register. Save data and generate invoice
    if(errs_array.length > 0) {
        var q_str = qs.stringify(errs_array);
        response.redirect(`error.html?${q_str}`);
        
    }else{
        userdata[request.body.username] = {};
        userdata[request.body.username].name = request.body.name;
        userdata[request.body.username].password = request.body.password;
        userdata[request.body.username].repeatpassword = request.body.repeat_password;
        userdata[request.body.username].email = request.body.email;
        fs.writeFileSync(udata, JSON.stringify(userdata));
        response.send(eval('`' + invoice_contents + '`'));
    }
});

//Hosts static files in public directory. Location of port and send a message to console to indicate running server.
app.use(express.static('./public'));
app.listen(8080, () => console.log(`Listening...`));


/*Functions*/
//Used in response.send(eval(contents)) app.get(display.html). Generates display page
function display_products() {
    str = '';
    for (i = 0; i < products.length; i++) {
        str += `
    <section>
        <div>
        <img src="/images/${products[i].image}">
        </div>
     </section>
     <section>
        <div>
         ${products[i].name}:
         $${products[i].price.toFixed(2)}
         </div>
         <div>
         <input type="text" name="quantity${i}">
         </div
     </section>
        `;
    }
    return str;
}

//Used in response.send(eval(contents)) app.post(). Generates invoice.
function display_invoice_table_rows() {
    subtotal = 0;
    str = '';
    for (i = 0; i < products.length; i++) {
        POST = user_quantities; //Gets the POST requests stored from display.html
        p = POST[`quantity${i}`];
        /* Based on order_page.html of Lab 12 completed by me*/
        if (p > 0) {
            extended_price = p * products[i].price
            subtotal += extended_price;
            str += (`
                <tr>
                    <td width="43%">${products[i].name}</td>
                    <td align="center" width="11%">${p}</td>
                    <td width="13%">\$${products[i].price.toFixed(2)}</td>
                    <td width="54%">\$${extended_price.toFixed(2)}</td>
                </tr>
                `);
        }
    }

    // Compute tax
    tax_rate = 0.1;
    tax = tax_rate * subtotal;

    // Compute grand total
    grandtotal = subtotal + tax;

    return str;
}


