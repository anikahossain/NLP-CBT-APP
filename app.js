var express = require('express');
var app = express();
var pgp = require('pg-promise')();
var mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
var bcrypt = require('bcrypt');
var methodOverride = require('method-override');
const fetch = require('node-fetch');

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
var db = pgp('postgres://anikakazi@localhost:5432/users');


//home page
app.get("/", function(req, res){
  var logged_in;
  var email;
  var id;
  if(req.session.user){
    logged_in = true;
    email = req.session.user.email;
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
  db.one(
    "SELECT * FROM users WHERE email = $1",
    [data.email]
    ).catch(function(){
      res.send("Email/Password not found.")
    }).then(function(user){
      bcrypt.compare(data.password, user.password_digest, function(err, cmp){
        if(cmp){
          req.session.user = user;
          res.redirect("/user_profile");
        }else {
          res.send("Email/Password not found.")
        }
      });
    });
});

//sign-up page
app.get("/signup", function(req, res){
  res.render("signup/signup");
});

//posting to sign up page
app.post("/signup", function(req, res){
  var data = req.body;
  console.log(data);
  bcrypt.hash(data.password, 10, function(err, hash){
    db.one(
      "INSERT INTO users (email, password_digest) VALUES ($1, $2) returning *",
      [data.email, hash]
      )
      .then(function(user){
        console.log("user", user);
        req.session.user = user;
        res.redirect("/user_profile");
      })
      .catch(function(error){
        console.log("Error, user could not be made, error.message || error");
      })
  });
});

//about page
app.get("/about", function(req, res){
  res.render("about/about");
});


//search page
app.get("/search", function(req, res){
  var user = req.session.user;
  var user, logged_in;
  if(req.session.user){
    user = req.session.user;
    logged_in = true;
  }
  var data = {
    logged_in : logged_in,
    id : user
  };
  res.render("search/search");
});

//API implementation for search page
app.post("/search", function(req, res){
  var search = req.body.search; //user's input
  var narrow = encodeURIComponent('nlp', 'cbt', 'productivity'); //narrows down search results to vids that pertain to these subjects
  fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&q='+narrow+'%20'+search+'&key=+AIzaSyBChV0J_K9d530LpO4bMxkjIeCDzcCHSRM')
  .then(function(response){
    return response.json();
  })
  .then(function(body){
    var logged_in;
    if(req.session.user) logged_in = true;
    var data = {
      logged_in: logged_in,
      user: req.session.user,
      items : []
    };
    body.items.map(function(video){
      //getting relevant data to respond from API
      data.items.push({
        title : video.snippet.title,
        description : video.snippet.description,
        img : video.snippet.thumbnails.default.url,
        channel : video.snippet.channelTitle,
        videoid : video.id.videoId,
        playistid : video.id.playlistId
      });
    });
    res.render("search/search", data);
  });
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

//route to anxiety page
app.get("/anxiety", function(req, res){
  res.render("topics/anxiety/anxiety");
});

//subcategories of anxiety page

//fear
app.get("/fear", function(req, res){
  res.render("topics/anxiety/anxiety_subcategories/fear");
});

//ocd
app.get("/ocd", function(req,res){
  res.render("topics/anxiety/anxiety_subcategories/ocd");
});

//panic disorder
app.get("/panic_disorder", function(req, res){
  res.render("topics/anxiety/anxiety_subcategories/ocd");
});

//social anxiety
app.get("/social_anxiety", function(req, res){
  res.render("topics/anxiety/anxiety_subcategories/social_anxiety");
});

//route to depression page
app.get("/depression", function(req, res){
  res.render("topics/depression/depression");
});

//subcategories of depression page

//grief
app.get("/grief", function(req,res){
  res.render("/topics/depression/depression_subcategories/grief");
});

//mood lifting
app.get("/mood_lifting", function(req,res){
  res.render("/topics/depression/depression_subcategories/mood_lifting");
});

//moving on
app.get("/moving_on", function(req,res){
  res.render("/topics/depression/depression_subcategories/moving_on");
});


//route to stress page
app.get("/stress", function(req, res){
  res.render("topics/stress/stress");
});

//subcategories of stress page

//anger management
app.get("/moving_on", function(req,res){
  res.render("/topics/depression/depression_subcategories/moving_on");
});

//route to productivity page
app.get("/productivity", function(req, res){
  res.render("topics/productivity/productivity");
});

//route to intropersonal page
app.get("/intropersonal", function(req, res){
  res.render("topics/intropersonal/intropersonal");
});

//takes you from login to user profile
app.post("/login", function(req, res){
  res.render("user_profile/user_profile");
});

//takes you from sign up to user profile
app.post("/signup", function(req, res){
  res.render("user_profile/user_profile");
});


