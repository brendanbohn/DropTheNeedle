/* 
 * SERVER.JS - setup for server, modules, middleware, database
 */

// set up base express app
var express = require('express');
var app = express();

// other modules and middleware
var request = require('request');
var path = require('path');   // built-in module for dealing with file paths
var bodyParser = require('body-parser');  // parse form data into req.body
var mongoose = require('mongoose');   // object document mapper
var User = require('./models/user.js');

// configure bodyparser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// connect to database
// var dbName = 'drop-the-needle';
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/drop-the-needle');    

// serve public folder as static assets on the root route
var publicPath = path.join(__dirname, 'public');
app.use("/", express.static(publicPath));

// alias the views folder
// var viewsPath = path.join(__dirname, 'views');
// app.set('views', viewsPath);

// set 'html' as the engine, using ejs's renderFile function
var ejs = require('ejs');
app.engine('html', ejs.renderFile); 
app.set('view engine', 'html');

//env for spotify keys
// require('dotenv').load();
// var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
// var spotify_client_secret = process.env.SPOTIFY_SECRET_KEY;
/*** ROUTES ***/
var routes = require('./routes');

// INDEX and TEMPLATE ROUTES
app.get('/api', routes.index);
// app.get('/', function(request, response){
//   response.render('index');
// });

app.get('/templates/:name', routes.templates);
// app.get('/templates/:name', function(request, response){
//   var name = request.params.name;
//   response.render('templates/' + name);
// });

// ROUTES

//upon login it returns the user, if the user does not exist it creates a new user and returns it
app.get('/set-current-account/user/:spotify_id', function (req, res) {

    User.find({ spotify_id: req.params.spotify_id }, function (err, user) {
      if (err) {
        console.log("error", err);
      } else if (user) {
        //database returns success even if user does not exist. Just returns empty array.
        //here we make sure the length of the array is 0 before creating a new user
        if(user.length === 0){
          console.log('no user found creating user!');
            User.create({spotify_id: req.params.spotify_id}, function (err, user) {
              if (err) { return res.status(404).send(err); }
                res.send(user); 
            });
        } else {
        //if the user.length === 0 did not pass in the if statement above
        // it means that the user existed. Here we send back that existing user!
          console.log("existing user!", user);
          res.send(user);
        }
      }
    });
  });


// ALL OTHER ROUTES (ANGULAR HANDLES)
// redirect all other paths to index
app.get('*',  routes.index);


// SERVER
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3000;

var server = require('http').createServer(app);
server = server.listen(port);
console.log(process.env.NODE_ENV  + ' server running at port:' + port);

