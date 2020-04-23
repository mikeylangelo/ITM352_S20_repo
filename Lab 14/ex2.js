var fs = require('fs');
var filename = './user_data.json';
var data = fs.readFileSync(filename,'utf-8');
if(fs.existsSync(filename)){
    var file_stats = fs.statSync(filename);
    data = JSON.parse(data);
    console.log(data);
    console.log(`${filename} has ${file_stats.size} characters.`);
}
else{
    console.log("Hey!" + filename + "doesn't exist.");
}
