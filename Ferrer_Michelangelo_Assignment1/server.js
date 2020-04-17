/*
Based on Assignment 1 examples.
*/

var express = require('express'); //Load express for handling HTTP requests.

var bodyParser = require('body-parser');

var fs = require('fs'); //

var app = express();

var data = require('./public/product_data.js');

var products = data.products;

var queryString = require("querystring");

app.use(bodyParser());

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.post("/display.html", function (request, response, ) {
    let POST = request.body;
    if (typeof POST['purchase_flowers'] == 'undefined') {
        console.log('No purchase');
        next();
    }

    console.log(Date.now() + ': Purchase made from ip ' + request.ip + ' data: ' + JSON.stringify(POST));

    var contents = fs.readFileSync('./public/invoice.html', 'utf8');
    response.send(eval('`' + contents + '`'));

    function display_invoice_table_rows() {
        subtotal = 0;
        str = '';
        for (i = 0; i < products.length; i++) {
            a_qty = 0;
            if (typeof POST[`${products[i].name}`] != 'undefined') {
                a_qty = POST[`${products[i].name}`];
            }
            if (a_qty > 0) {
               
                extended_price = a_qty * products[i].price
                subtotal += extended_price;
                str += (`
      <tr>
        <td width="43%">${products[i].name}</td>
        <td align="center" width="11%">${a_qty}</td>
        <td width="13%">\$${products[i].price}</td>
        <td width="54%">\$${extended_price}</td>
      </tr>
      `);
            }
        }
        
        /* Based on Order Page of Lab 12*/
        
        // Compute tax
        tax_rate = 0.0575;
        tax = tax_rate * subtotal;

        // Compute shipping
        if (subtotal <= 50) {
            shipping = 2;
        }
        else if (subtotal <= 100) {
            shipping = 5;
        }
        else {
            shipping = 0.05 * subtotal; // 5% of subtotal
        }

        // Compute grand total
        total = subtotal + tax + shipping;

        return str;
    }

});

app.use(express.static('./public')); //Hosts static files in public directory.

app.listen(8080, () => console.log(`Listening...`));