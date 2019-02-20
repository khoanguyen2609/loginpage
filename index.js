var express = require('express');
var config = require('config');
var bodyParser = require('body-parser');
var userFunction = require('./apps/models/user');
var session = require('express-session');

//call express
var app = express();

//express session
app.set('trust proxy',1);
app.use(session({
  secret: config.get("skey"),
  resave: false,
  saveUninitalized: true,
  cookie: { secure: true}
}));

// call body parser
app.use(bodyParser.urlencoded({extend: true}));

//call static

//call ejs
app.set("views", __dirname + "/apps/views");
app.set("view engine" , 'ejs');

//Sign Up
app.get("/", function( req , res){
  res.render('signup.ejs',{data:{}});
});

app.post("/", function( req , res) {
  var user = req.body;
  if (user.email.trim().length == 0) {
    res.render("signup.ejs", {data : {error: "Email is required"}});
  }
  if (user.password != user.repassword && user.password.trim().length !=0 && user.email.trim().length != 0) {
    res.render("signup.ejs", {data : {error:"Password is not match"}});
  }
  if (user.email.trim().length != 0 && user.password == user.repassword && user.password.trim().length !=0) {
    a = {
      email      : user.email,
      password   : user.password,
      first_name : user.firstname,
      last_name  : user.lastname
    };
    console.log(a);
    var result = userFunction.addUser(a);

    if(!result) {
      res.render("signup", {data: {error:"Could not insert data"}});
    } else {
      res.redirect("/signin");
    }
  }
});

//Sign In
app.get("/signin", function( req , res){
  res.render('signin.ejs', {data : {}});
});

app.post('/signin', function(req,res){
  var info = req.body;

  if (info.email.trim().length == 0) {
    res.render('signin.ejs', {data : {error: "Please enter an Email"}});
  } else {
    var data = userFunction.getUserByEmail(info.email);
    console.log(data);

    data.then(function(user) {
      console.log(user);
      if (user == '' ) {
          res.render('signin.ejs', {data : {error: "This email is not in our database"}});
      }
      if (info.password ==  user[0].password) {
        console.log(info.password);
        res.render('ok.ejs');
      } else {
        res.render('signin.ejs', {data : {error: "Wrong Password"}});
      }
    });
  };
});

app.listen (process.env. PORT || 3000, function(){
  console.log('port 3000');
})
