var express = require('express'); //Load express for handling HTTP requests
var app = express();
var bodyParser = require('body-parser'); //Load bodyParser for parsing any data that passes through the server
app.use(bodyParser());
var fs = require('fs'); //Load file system

//Use module from product_data.js and assign to variable
var product_data = require('./public/info/product_data.js');
var products = product_data.products;

//Assign JSON files to a variable
var pdata = './public/info/purchasedata.json';
var udata = './public/info/userdata.json';

//Get raw data files
var unparsedpurchasedata = fs.readFileSync(pdata, 'utf-8');
var unparseduserdata = fs.readFileSync(udata, 'utf-8');

//Parse the raw data as JSON files
var userdata = JSON.parse(unparseduserdata);
var purchasedata = JSON.parse(unparsedpurchasedata);

//Read the templates and assign to variable
var invoice_contents = fs.readFileSync('./public/invoice.html', 'utf8');
var display_contents = fs.readFileSync('./public/display.html', 'utf8');

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

app.get("/display.html", function (request, response) {
    //Evaluates the display_contents variable which contains a function that creates dislpay page
    response.send(eval('`' + display_contents + '`'));
});

app.post("/display.html", function (request, response, ) { //Handles all POST requests
    let POST = request.body; //Request the POST data

    for (i = 0; i < products.length; i++) {
        p = POST["quantity${i}"]
        if (typeof POST['purchase_flowers'] != 'undefined') {
            p = POST["quantity${i}"]
            console.log(request.body.p)
            //Passes data through isNonNegInt() if it is false it create the invoice else it will redirect to an error page
            if (isNonNegInt(p, true)) {
                response.send(eval('`' + invoice_contents + '`')); //Evaluates the invoice.html file and passes the invoice which contains a function
                input_data = request.body["quantity"];
                purchasedata[input_data] = {};
                purchasedata[input_data].quantity = request.body.quantity
                fs.writeFileSync(data, JSON.stringify(purchasedata));

                /* request.body.p;
                 purchasedata[p] = {};
                 purchasedata[p].quantity = request.body
                 fs.writeFileSync(pdata, JSON.stringify(p))
                 */
                //Redirect to login before generating invoice
                //response.redirect('login.html')
            }
            else if (request.body.quantity = '') {
                console.log('Blank display') //Error if there is blank data
            }
            else {
                console.log('invalid data'); //If it does not pass redirect to an error page.
            }
        }

    }
});

/* 
Login and register were taken from Lab 14 completed by me. I also had
some help watching the lectures completed by Professor Port.
*/

app.post("/login.html", function (request, response) {
    // Assign variable to input data
    var input_username = request.body.username;
    var input_password = request.body.password;

    // Check if the type of data in input username is defined in user_data.json file
    if (typeof userdata[input_username] != 'undefined') {
        var user_info = userdata[input_username];

    // Succesful login. Match password with username and generate invoice
    if (user_info["password"] == input_password) {
            console.log('succesful login');
            response.send(eval('`' + invoice_contents + '`'));
        }

    // If the password and username do not match redirect to error
    else {
        console.log('password and username dont match');
        }
    
    // If the username does not exist
    }
    else {
        console.log('invalid login data');
    }
});

app.post("/register.html", function (request, response) {
    //Create an array for the user data
    username = request.body.username; 
    userdata[username] = {}; 

    //Assigns values to the array
    userdata[username].name = request.body.name; 
    userdata[username].password = request.body.password;
    userdata[username].repeatpassword = request.body.repeat_password;
    userdata[username].email = request.body.email;

    //Check if username exists, if so generate error
    if (typeof userdata[username] != undefined){
        console.log('username taken');
    }

    //Error if passwords don't match
    if (request.body.password != request.body.repeat_password) {
        console.log('passwords dont match');
    }

    //Error if fields are left empty
    else if ((request.body.username == '') || (request.body.name == '') || (request.body.password == '') || (request.body.repeat_password == '')
            || (request.body.email == '')) {
        console.log('empty textbox')
    }
    //Succesful register. Save data and generate invoice
    else {
        console.log('success register');
        fs.writeFileSync(udata, JSON.stringify(userdata));
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
         <input type="text" name="quantity${i}" 
         onkeyup="checkQuantityTextbox(this);">
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
        p = POST[`${products[i].name}`]; //Defines any POST requests which have been defined in display.html
        if (typeof POST[`${products[i].name}`] != 'undefined') {
            console.log('No data');
        }
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

function isNonNegInt(p, return_errors = false) {
    errors = []; //Initially assume no errors
    if (p == '') p = 0; //Blank inputs is zero
    if (Number(p) != p) errors.push(''); //Check if string is a number value
    else if (p < 0) errors.push(''); //Check if it is non-negative
    else if (parseInt(p) != p) errors.push('<'); //Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}

function checkQuantityTextbox(theTextbox) {
    errs = isNonNegInt(theTextbox.value, true);
    if (errs.length == 0) errs = ['You want:'];
    if (theTextbox.value.trim() == '') errs = ['Quantity'];
    document.getElementById(theTextbox.name + '_label').innerHTML = errs.join(", ");
}