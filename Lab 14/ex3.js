var fs = require('fs');
var filename = './user_data.json';
var data = fs.readFileSync(filename, 'utf-8');
var express = require('express');
var app = express();
var myParser = require("body-parser")

if (fs.existsSync(filename)) {
    var file_stats = fs.statSync(filename);
    data = JSON.parse(data);
    console.log(data);
    console.log(`${filename} has ${file_stats.size} characters.`);
}
else {
    console.log("Hey!" + filename + "doesn't exist.");
}

app.use(myParser.urlencoded({ extended: true }));

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/login", function (request, response) {
   // Process login form POST and redirect to logged in page if ok, back to login page if not
   console.log(request.body,data);
   // Assign variable to input data
   var input_username = request.body.username;
   var input_password = request.body.password;
   //Check if the type of data in input username is not undefined in user_data.json file
   if(typeof data[input_username] != 'undefined'){
    var user_info = data[input_username];
    // If it is defined, get the data from static file and match the input password with password from it
        if(user_info["password"] == input_password){
            response.send(`${input_username} is logged in.`)
        }
        else{
            response.send(`${input_password} is the wrong password.`)
        }
   }
   else{
       response.send(`${input_username} does not exist! Please register.`)
   }
});

app.listen(8080, () => console.log(`listening on port 8080`));