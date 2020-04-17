products = 
[
    {
        "name":"Rose",
        "price": 1.50,
        "image": 'rose.jpg'
    },
    {
        "name":"Tulip",
        "price": 2.00,
        "image": 'tulip.jpg'
    },    {
        "name":"Lily",
        "price": 2.50,
        "image": 'lily.jpg'
    },    {
        "name":"Sunflower",
        "price": 1.00,
        "image": 'sunflower.jpg'
    },    {
        "name":"Gladiolus",
        "price": 0.50,
        "image": 'gladiolus.jpg'
    },    {
        "name":"Hydrangeas",
        "price": 3.00,
        "image": 'hydrangeas.jpg'
    }
];

if(typeof module != 'undefined'){
    module.exports.products = products;
}