var fs = require('fs');
var express = require('express');
var app = express();
var myParser = require("body-parser");
var user_info_file = './user_data.json';

if (fs.existsSync(user_info_file)) {
    var file_stats = fs.statSync(user_info_file);
    var data = fs.readFileSync(user_info_file, 'utf-8');
    var userdata = JSON.parse(data);
    username = 'newuser';
    userdata[username] = {};
    userdata[username].password = 'newpass';
    userdata[username].email = 'newuser@user.com';
    console.log(userdata["newuser"]["password"]);
    fs.writeFileSync(user_info_file, JSON.stringify(userdata))
    console.log(`${user_info_file} has ${file_stats.size} characters.`);
}
else {
    console.log("Hey!" + user_info_file + "doesn't exist.");
}

app.use(myParser.urlencoded({ extended: true }));

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="/check_login" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/check_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.query);
    var err_str = "";
    response.send(request.body);
    var login_username = request.body("username");
    // Check if username exists in data. If so, check password
    if (typeof username[login_username] != undefined) {
        var user_info = userdata[login_username];
        // Compare what is stored with what is entered
        if (user_info.password == request.body["password"]) {
            response.send(`${login_username} is logged in!`);
            return;
        } else {
            err_str = `Incorrect password`;
        }
    } else {
        response.send(
            err_str = `Username does not exist!`);

    }
    response.redirect(`./login?${username}=${login_username}&error=${err_str}`);
});

app.listen(8080, () => console.log(`listening on port 8080`));