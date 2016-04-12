var express = require('express');
var router = express.Router();
// custom models
var polls = require("../models/polls");

/* GET home page. */
router.get('/', function(req, res, next) {
	var loggeduser = null;
	if(req.session.logged){
		loggeduser = req.session.user.id;
	}
	var message = req.session.msg || null;
	if(req.session.msg) req.session.msg = null;
	// get all the current polls
	polls.get_all(function(err,poll_list){
		if(err){
			console.log(err);
			res.render('index',	{ 
				title: 'Index | Poll App',
				loggeduser:loggeduser,
				error:err
			});
		} else {
			res.render('index',	{ 
				title: 'Index | Poll App',
				loggeduser:loggeduser,
				poll_list:poll_list,
				message : message
			});
		}
	});
});

module.exports = router;