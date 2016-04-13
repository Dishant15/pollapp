var express = require('express');
var router = express.Router();
var user = require("../models/user");
var polls = require("../models/polls");


// Register page for a new user
router.get('/signup/', function(req, res) {
	if(req.session.logged){
		// user already logged in
		loggeduser = user.findOne({username: req.session.user.id}, function(err,lu){
			res.redirect(lu.get_absolute_url());
		});
	}
  	res.render('user/signup',{title:"Sign up | Poll App"});
});

router.post('/signup/', function(req, res) {

	var new_user = new user({
			username:req.body.username,
			email:req.body.email,
			password:req.body.password
		});
	new_user.save(function(err, data){
		if(err) {
			// can not signup due to an error give error to user
			res.render('user/signup',{title:"Sign up | Poll App", error: err});

		} else {
			// set session variables
			req.session.user.id = req.body.username;
			req.session.logged = true;
			// save successfull redirect user to new page
			res.redirect(new_user.get_absolute_url());
		}
	});
});

// userlogin view
router.get('/login/', function(req, res) {
	if(req.session.logged){
		// user already logged in
		res.redirect("/user/home/" + req.session.user.id + "/");
	}
  	res.render('user/login',{title:"Login | Poll App"});
});

router.post('/login/', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	// get logged user from session
	user.findOne({username: username}, function(err,loggeduser){
		if(err){
			// DB error
			req.session.user.id = "none";
			req.session.logged = false;
		  	res.render('user/login',{title:"Login | Poll App"});
		} else {
			if(!loggeduser){
				// User not found
				res.render('user/login',{
					title:"Login | Poll App",
					message: "Invalid username or password, Sign Up if you are new to poll app"
				});
				return;
			}
			if(loggeduser.authenticate(username, password)){
				req.session.user.id = loggeduser.username;
				req.session.logged = true;
				res.redirect(loggeduser.get_absolute_url());
			} else {
				// authentication failed
				res.render('user/login',{
					title:"Login | Poll App",
					message: "Invalid username or password"
				});
			}
		}
	});
	
});

// logout a user
router.get('/logout/', function(req, res) {
	// un set session variables
	req.session.user.id = "none";
	req.session.logged = false;
  	res.redirect("/");
});

// user profile/home page
router.get('/home/:username', function(req, res) {
	if(!req.session.logged){
		// go login if not logged yet
		res.redirect("/user/login/");
	}
	var username = req.params.username;
  	res.render("user/home", {
  			title : username + " | Poll App",
  			name: username,
  			loggeduser:username
  		});
});

// MyPolls page
router.get('/mypolls/', function(req, res) {
	if(!req.session.logged){
		// go login if not logged yet
		res.redirect("/user/login/");
	}
	var username = req.session.user.id;
  	
  	polls.find({creator:username}, function(err, poll_list){
  		if(err)throw err;
  		res.render("index", {
  			name: username,
  			loggeduser:username,
  			title: "Home | Poll App",
  			poll_list: poll_list
  		});
  	});
});

module.exports = router;
