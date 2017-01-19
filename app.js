var express = require('express');
var app = express();
var pgp = require('pg-promise')();
var mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
var bcrypt = require('bcrypt');
var methodOverride = require('method-override');

//Bcrypt stuff
app.engine("html", mustacheExpress());
app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.use("/", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'theTruthIsOutThere51',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.listen(8080, function(){
  console.log('server is alive on 8080')
});

//databse
var db = pgp('postgres://anikakazi@localhost:5432/nlp_cbt_app');


//home page
app.get("/", function(req, res){
  var logged_in;
  var email;
  var id;
  if(req.session.users){
    logged_in = true;
    email = req.session.users.email;
    id = req.session.user.id
  }

  var user = {
    "logged_in": logged_in,
    "email": email,
    "id": id
  }

  res.render("index");
});

//login page
app.get("/login", function(req, res){
  res.render("login/login");
});

//posting to login page
app.post("/login", function(req, res){
  var data = req.body;
  console.log(data);
  bcrypt.hash
});

//sign-up page
app.get("/signup", function(req, res){

  res.render("signup/signup");
});

//about page
app.get("/about", function(req, res){
  res.render("about/about");
});


//search page
app.get("/search", function(req, res){
  res.render("search/search");
});

//user profile
app.get("/user_profile", function(req, res){
  res.render("user_profile/user_profile");
});

//user's journal
app.get("/journal", function(req, res){
  res.render("journal/journal");
});

//topics
app.get("/topics", function(req, res){
  res.render("topics/topics");
});

//routes to get individual topics
app.get("/anxiety", function(req, res){
  res.render("topics/anxiety/anxiety");
});

app.get("/depression", function(req, res){
  res.render("topics/depression/depression");
});

app.get("/stress", function(req, res){
  res.render("topics/stress/stress");
});

app.get("/productivity", function(req, res){
  res.render("topics/productivity/productivity");
});

app.get("/communication", function(req, res){
  res.render("topics/communication/communication");
});

//takes you from login to user profile
app.post("/login", function(req, res){
  res.render("user_profile/user_profile");
});

//takes you from sign up to user profile
app.post("/signup", function(req, res){
  res.render("user_profile/user_profile");
});


