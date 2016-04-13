
var router = require('express').Router();
// var user = require("../models/user");
var polls = require("../models/polls");


// Show poll detail page
router.get('/detail/:id', function(req, res){
	var loggeduser = req.session.logged ? req.session.user.id : null;
	var voted = req.session.user.polls.indexOf(req.params.id) != -1;
	polls.findOne({_id:req.params.id}, function(err, poll){
		res.render("polls/detail", {
				title: poll.name + " | Poll App" ,
				poll : poll,
				loggeduser : loggeduser,
				voted : voted
			});
	});
});

// New poll addition views
router.get('/add/', function(req, res) {
	// redirect anonymous user to login page
	if(!req.session.logged) res.redirect("/user/login/");
	res.render("polls/add_poll", {title:"Add poll | Poll App", loggeduser:req.session.user.id});
});

router.post('/add/', function(req, res) {
	// redirect anonymous user to login page
	if(!req.session.logged) res.redirect("/user/login/");

	// get all the choices
	var choices = [];
	for (var i in req.body) {
		if(i == "poll_name") continue;
		choices.push({
			name: req.body[i]
		});
	}
	var new_poll = new polls({
		creator:req.session.user.id,
		name:req.body.poll_name,
		choices: choices
	});

	new_poll.save(function(err, np){
		if(err){
			res.render("polls/add_poll", {title:"Add poll | Poll App", error: err});
		}
		res.redirect(np.get_absolute_url());
	});
});

router.get('/vote/:pid/:cid/',function(req, res){
	var voted_list = req.session.user.polls;
	var pid = req.params.pid;
	if(voted_list.indexOf(pid) != -1){
		// user has already voted on this poll
		req.session.msg = "You have already voted on this poll !! Have a look at other polls.";
		res.redirect("/");
		return;
	}
	polls.findOneAndUpdate(
	    { "_id": pid, "choices._id": req.params.cid }, // selects poll and its child choice with cid
	    { 
	        "$inc": {
	            "choices.$.votes": 1
	        }
	    }, // choices.$ is similar to choices[matching cid index]
	    function(err,doc) {
	    	if(err)throw err;
	    	// update session as voted
	    	req.session.user.polls.push(pid);
	    	// go back to poll
	    	polls.findOne({_id:pid}, function(err,p){
	    		if(err)throw err;
	    		res.redirect(p.get_absolute_url());
	    	});
	    }
	);
});

module.exports = router;