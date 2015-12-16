var express = require('express');
var postRouter = express.Router();
var User = require('../models/user.js');


//remember to try without the first back slash could be doubled from server
postRouter.route('/set-current-account')
	.get( function (req, res) {
		console.log("INSIDE GET REQUEST");
		db.User.find({ spotify_id: req.body.spotify_id }, function (err, user) {
			if (err) {
				console.log(err);
				// res.redirect('/create-new-account', {spotify_id: req.body.spotify_id});
			} else if (user) {
				console.log(user);
				res.status(201).send("hello!");
			}
		});
	});


postRouter.route('/create-new-account')
	.post( function (req, res) {
		User.create({spotify_id: req.params.spotify_id}, function (err, user) {
			if (err) { return res.send(err); }
			console.log(post);
			res.status(201).send(post);
		});
	});


module.exports = postRouter;