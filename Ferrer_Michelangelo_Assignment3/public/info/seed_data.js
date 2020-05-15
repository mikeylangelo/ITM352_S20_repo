products = 
[
    {
        "name":"Sunflower Seeds",
        "price": 1.00,
 
        "image": 'sunflowerseeds.jpg'
    },
    {
        "name":"Dahlia Seeds",
        "price": 1.25,
 
        "image": 'dahliaseeds.jpg'
    },    {
        "name":"Petunia Seeds",
        "price": 2.00,
 
        "image": 'petuniaseeds.jpg'
    },    {
        "name":"Marigold Seeds",
        "price": 1.00,
        "image": 'marigoldseeds.jpg'
    }
];

if(typeof module != 'undefined'){
    module.exports.products = products;
}