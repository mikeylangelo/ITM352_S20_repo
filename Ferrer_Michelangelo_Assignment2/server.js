var express = require('express'); //Load express for handling HTTP requests.

var bodyParser = require('body-parser'); //Load bodyParser for parsing any data that passes through the server.

var fs = require('fs'); //Load file system.

var app = express();

var product_data = require('./public/product_data.js');

var products = product_data.products; //Call in data from public directory and assign it to a variable.

var data = './public/purchasequantities.json';

var purchasedata = fs.readFileSync(data, 'utf-8');

var purchase_quantity_data = JSON.parse(purchasedata);

app.use(bodyParser());

//Indicate any requests coming in from the server
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

/* 
The structure was based on the MVC Assignment 1 example from Professor Port.
We use the server to host the data and ask the public directory for the files
such as the display.html and invoice.html which contains the layout for the functions
which inputs the data the server has on to the static files.
*/

var display_contents = fs.readFileSync('./public/display.html', 'utf8');
app.get("/display.html", function (request, response) {
    response.send(eval('`' + display_contents + '`')); //Renders the display.html file and passes the GET data through
});

var invoice_contents = fs.readFileSync('./public/invoice.html', 'utf8');
app.post("/login.html", function (request, response) {
    let POST = request.body
    p = POST['purchase_submit']
    response.send(eval('`' + invoice_contents + '`')); //Renders the invoice.html file and passes the POST data through
});

app.post("/register.html", function (requqest, response) {

});

app.post("/display.html", function (request, response, ) { //Handles all POST requests
    let POST = request.body; //Request the POST data
    for (i = 0; i < products.length; i++) {
        p = POST[`${products[i].name}`]
        //Passes data through isNonNegInt() if it is false it create the invoice else it will redirect to an error page
        if (isNonNegInt(p, false)) {
            input_data = request.body[`${products[i].name}`];
            purchase_quantity_data[input_data] = {};
            purchase_quantity_data[input_data].quantity = p
            fs.writeFileSync(data, JSON.stringify(purchase_quantity_data));
            //Redirect to login before generating invoice
            response.redirect('login.html')
        }
        else {
            response.redirect('errorpage.html'); //If it does not pass redirect to an error page.
        }
    }
});

app.use(express.static('./public')); //Hosts static files in public directory.

app.listen(8080, () => console.log(`Listening...`)); //Location of port and send a message to console to indicate running server.

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
         <input type="text" name="${products[i].name}" 
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