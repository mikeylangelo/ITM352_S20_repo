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

app.post("/check_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.query);
    var err_str = "";
    response.send(request.body);
    var login_username = request.body("username");
    // Check if username exists in data. If so, check password
    if (typeof username[login_username] != undefined){
        var user_info = userdata[login_username];
    // Compare what is stored with what is entered
        if(user_info.password == request.body["password"]){
        response.send(`${login_username} is logged in!`);
        return;
        } else {
            err_str=`Incorrect password`;
        }
    }else{
        response.send(
            err_str = `Username does not exist!`);
          
    }
    response.redirect(`./login?${username}=${login_username}&error=${err_str}`);
});