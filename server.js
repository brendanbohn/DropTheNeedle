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
var Quiz = require('./models/quiz.js');
var Result = require('./models/result.js');

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
        if(user.length === 0) {
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


var existingQuiz = "507f1f77bcf86cd799439011";
app.post('/user/:spotify_id/quiz/:playlist_name/:playlist_id/:owner_id/result/:score/:possible_score', function (req, res) {
  console.log('INSIDE POST REQUEST');
  User.findOne({ spotify_id: req.params.spotify_id })
    .populate({
      path: 'quizzes'
    })
    .exec(
      function(err, user) {
         
        for(var i = 0; i < user.quizzes.length; i++) {
          if(user.quizzes[i].playlist_id == req.params.playlist_id) {
            existingQuiz = user.quizzes[i];
          }
        } 

        if (existingQuiz.playlist_id !== req.params.playlist_id) {
          console.log('About to create quiz');
          Quiz.create({ playlist_id: req.params.playlist_id, playlist_name: req.params.playlist_name, owner_id: req.params.owner_id }, function (err, quiz){
            if (err) {
              console.log('error in quiz create');
              res.status(404).send(err);
            } else if (quiz) {
              console.log('new Quiz no result!', quiz);
              Result.create({ score: req.params.score, possible_score: req.params.possible_score }, function (err, result) {
                  if (err) {
                    console.log(err);
                  } else if (result) {
                    console.log('new Result for quiz', result);
                    quiz.results.push(result);
                    console.log('quiz after save', quiz);
                  }
              user.quizzes.push(quiz);
              user.save( function (err) {
                if (err) { console.log('ERROR!', err); }
                console.log('user after save', user);
              });
              res.send(quiz);
              }); 
            }
          });

        } else if (existingQuiz.playlist_id == req.params.playlist_id) {
          console.log('req.params.score', req.params.score);
     
          Result.create({ score: req.params.score, possible_score: req.params.possible_score }, function (err, result) {
              if (err) {
                res.status(404).send(err);
              } else if (result) {
               existingQuiz.results.push(result);
                user.save(); 
                res.send(result);
              }
          }); 
        }
      }
    );
});


//if user found
  //look for quizzes inside user
  //if quiz not found
    //create quiz, push into user, save user
    //create result, push into quiz, save quiz
  //if quiz found
    //create result, push into quiz, save quiz




// ALL OTHER ROUTES (ANGULAR HANDLES)
// redirect all other paths to index
app.get('*',  routes.index);


// SERVER
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 3000;

var server = require('http').createServer(app);
server = server.listen(port);
console.log(process.env.NODE_ENV  + ' server running at port:' + port);

