/*
Based on Assignment 1 examples.
*/

var express = require('express'); //Load express for handling HTTP requests.

var bodyParser = require('body-parser'); //Load bodyParser for parsing any data that passes through the server.

var fs = require('fs'); //Load file system.

var app = express();

var data = require('./public/product_data.js');

var products = data.products; //Call in data from public directory and assign it to a variable.

app.use(bodyParser());

//Indicate any requests coming in from the server
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

/* 
The structure was based on the MVC Assignment 1 example.
We use the server to host the data and ask the public directory for the files
such as the display.html and invoice.html which contains the layout for the functions
which inputs the data the server has on to the static files.
*/


app.get("/display.html", function (request, response) {
    var contents = fs.readFileSync('./public/display.html', 'utf8');
    response.send(eval('`' + contents + '`')); //Renders the display.html file and passes the GET data through

    //Used in display.html whenever there is a GET request for the page
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
});

app.post("/display.html", function (request, response, ) { //Handles all POST requests
    let POST = request.body; //Request the POST data
    for (i = 0; i < products.length; i++) {
        p = POST[`${products[i].name}`]

        //Passes data through isNonNegInt() if it is false it create the invoice else it will redirect to an error page
        if (isNonNegInt(p, false)) {
            var contents = fs.readFileSync('./public/invoice.html', 'utf8');
            response.send(eval('`' + contents + '`')); //Renders the invoice.html file and passes the POST data through

            //Used in response.send(eval(contents))
            function display_invoice_table_rows() {
                subtotal = 0;
                str = '';
                for (i = 0; i < products.length; i++) {
                    p = 0;
                    if (typeof POST[`${products[i].name}`] != 'undefined') {
                        p = POST[`${products[i].name}`]; //Defines any POST requests which have been defined in display.html
                    }
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

                /* Based on order_page.html of Lab 12*/

                // Compute tax
                tax_rate = 0.1;
                tax = tax_rate * subtotal;

                // Compute grand total
                grandtotal = subtotal + tax;

                return str;
            }
        }
        else {
            response.redirect('errorpage.html'); //If it does not pass redirect to an error page.
        }
    }
});

app.use(express.static('./public')); //Hosts static files in public directory.

app.listen(8080, () => console.log(`Listening...`)); //Location of port and send a message to console to indicate running server.

/*

*/

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