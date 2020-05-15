products = 
[
    {
        "name":"Plant Pot",
        "price": 5.00,
 
        "image": 'pot.jpg'
    },
    {
        "name":"Flower Vase",
        "price": 8.00,
 
        "image": 'flowervase.jpg'
    },    {
        "name":"Bonsai Tree",
        "price": 20.00,

        "image": 'bonsaitree.jpg'
    }
];

if(typeof module != 'undefined'){
    module.exports.products = products;
}