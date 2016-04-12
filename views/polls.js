
var router = require('express').Router();
// var user = require("../models/user");
var polls = require("../models/polls");


// Show poll detail page
router.get('/detail/:id', function(req, res){
	polls.findOne({_id:req.params.id}, function(err, poll){
		res.render("polls/detail", {title: poll.name + " | Poll App" , poll:poll});
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

	var new_poll = new polls({
		creator:req.session.user.id,
		name:req.body.poll_name,
		choices: [{
			name: req.body.choice1
		},
		{
			name: req.body.choice2
		}]
	});

	new_poll.save(function(err, np){
		if(err){
			res.render("polls/add_poll", {title:"Add poll | Poll App", error: err});
		}
		res.redirect(np.get_absolute_url());
	});
});

module.exports = router;